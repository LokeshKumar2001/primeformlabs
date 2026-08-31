const fs = require('fs');
const path = require('path');
const SCENARIO_DATA = require('./scenarioData');

const DATA_DIR = path.join(__dirname, 'data');
const STATE_FILE = path.join(DATA_DIR, 'sessionState.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class StateManager {
  constructor() {
    this.state = this.getInitialState();
    this.loadState();
  }

  getInitialState() {
    const machineChecksMap = {};
    SCENARIO_DATA.machineChecks.forEach(chk => {
      machineChecksMap[chk.id] = false;
    });

    const toolsMap = {};
    SCENARIO_DATA.requiredTools.forEach(tool => {
      toolsMap[tool.id] = false;
    });

    const workpieceMap = {};
    SCENARIO_DATA.setupInstructions.forEach(step => {
      workpieceMap[step.id] = false;
    });

    return {
      currentStageIndex: 1, // 1: Machine Checks, 2: Tools, 3: Workpiece, 4: Ready Review, 5: Operation
      stages: [
        { index: 1, key: "machine_checks", name: "Machine Checks", isComplete: false },
        { index: 2, key: "tools", name: "Required Tools", isComplete: false },
        { index: 3, key: "workpiece", name: "Workpiece Setup", isComplete: false },
        { index: 4, key: "ready_review", name: "Ready Review", isComplete: false },
        { index: 5, key: "operation", name: "Operation", isComplete: false }
      ],
      machineChecks: machineChecksMap,
      tools: toolsMap,
      workpieceSteps: workpieceMap,
      readyApproved: false,
      operation: {
        status: "READY", // "READY" | "RUNNING" | "STOPPED" | "COMPLETED"
        opName: SCENARIO_DATA.operation.opName,
        programNumber: SCENARIO_DATA.operation.cncProgram.programNumber,
        programRevision: SCENARIO_DATA.operation.cncProgram.revision,
        partsCompleted: 0,
        targetQuantity: SCENARIO_DATA.workOrder.quantity,
        currentToolIndex: 0,
        cycleTimeSeconds: 0,
        totalEstimatedSeconds: SCENARIO_DATA.operation.cncProgram.estimatedRunTimeSeconds,
        spindleRpm: 0,
        feedRate: 0,
        spindleLoadPercent: 0,
        activeGCodeLine: SCENARIO_DATA.sampleGCodeBlocks[0] || "",
        activeGCodeIndex: 0,
        coolantActive: false,
        lastStopTime: null,
        stopReason: null
      },
      auditLogs: [
        {
          id: "log-init",
          timestamp: new Date().toISOString(),
          type: "SYSTEM_POWER_ON",
          action: "VMC System Initialized",
          details: "Controller booted. Startup Guidance sequence initiated.",
          operator: SCENARIO_DATA.workOrder.operatorId
        }
      ],
      lastUpdated: new Date().toISOString()
    };
  }

  loadState() {
    try {
      if (fs.existsSync(STATE_FILE)) {
        const fileContent = fs.readFileSync(STATE_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (parsed && parsed.currentStageIndex) {
          this.state = parsed;
          return;
        }
      }
    } catch (err) {
      console.warn("Could not load previous state from disk, starting fresh.", err.message);
    }
    this.saveState();
  }

  saveState() {
    try {
      this.state.lastUpdated = new Date().toISOString();
      fs.writeFileSync(STATE_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (err) {
      console.error("Failed to persist state:", err.message);
    }
  }

  logEvent(type, action, details) {
    const entry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      type,
      action,
      details,
      operator: SCENARIO_DATA.workOrder.operatorId
    };
    this.state.auditLogs.unshift(entry);
    // Keep last 100 entries
    if (this.state.auditLogs.length > 100) {
      this.state.auditLogs = this.state.auditLogs.slice(0, 100);
    }
  }

  getState() {
    this.evaluateStageCompletions();
    return this.state;
  }

  evaluateStageCompletions() {
    // Stage 1: Machine checks
    const allChecks = Object.values(this.state.machineChecks);
    const stage1Complete = allChecks.length > 0 && allChecks.every(v => v === true);
    this.state.stages[0].isComplete = stage1Complete;

    // Stage 2: Tools
    const allTools = Object.values(this.state.tools);
    const stage2Complete = allTools.length > 0 && allTools.every(v => v === true);
    this.state.stages[1].isComplete = stage2Complete;

    // Stage 3: Workpiece
    const allWorkpiece = Object.values(this.state.workpieceSteps);
    const stage3Complete = allWorkpiece.length > 0 && allWorkpiece.every(v => v === true);
    this.state.stages[2].isComplete = stage3Complete;

    // Stage 4: Ready Review
    this.state.stages[3].isComplete = Boolean(this.state.readyApproved);

    // Stage 5: Operation
    this.state.stages[4].isComplete = this.state.operation.status === "COMPLETED";
  }

  confirmMachineCheck(checkId, confirmed = true) {
    if (this.state.machineChecks[checkId] !== undefined) {
      this.state.machineChecks[checkId] = Boolean(confirmed);
      const chk = SCENARIO_DATA.machineChecks.find(c => c.id === checkId);
      this.logEvent(
        "MACHINE_CHECK",
        `Check Confirmed: ${chk ? chk.title : checkId}`,
        `Operator validated condition: ${confirmed ? 'PASSED' : 'UNCHECKED'}`
      );
      this.evaluateStageCompletions();
      this.saveState();
      return { success: true, state: this.state };
    }
    return { success: false, error: `Invalid machine check id: ${checkId}` };
  }

  confirmAllMachineChecks() {
    SCENARIO_DATA.machineChecks.forEach(chk => {
      this.state.machineChecks[chk.id] = true;
    });
    this.logEvent(
      "MACHINE_CHECK",
      "All Machine Pre-Checks Confirmed",
      "Operator performed rapid batch verification of all 6 safety and system checks."
    );
    this.evaluateStageCompletions();
    this.saveState();
    return { success: true, state: this.state };
  }

  confirmTool(toolId, confirmed = true) {
    if (this.state.tools[toolId] !== undefined) {
      this.state.tools[toolId] = Boolean(confirmed);
      const tool = SCENARIO_DATA.requiredTools.find(t => t.id === toolId);
      this.logEvent(
        "TOOL_VERIFICATION",
        `Tool Confirmed: ${tool ? `${tool.toolNumber} (${tool.toolType})` : toolId}`,
        `Operator mounted and validated gauge length and offset in ${tool ? tool.pocket : 'magazine'}`
      );
      this.evaluateStageCompletions();
      this.saveState();
      return { success: true, state: this.state };
    }
    return { success: false, error: `Invalid tool id: ${toolId}` };
  }

  confirmAllTools() {
    SCENARIO_DATA.requiredTools.forEach(t => {
      this.state.tools[t.id] = true;
    });
    this.logEvent(
      "TOOL_VERIFICATION",
      "All Required Tools Confirmed",
      "All 5 required tools inserted into ATC carousel and offsets confirmed."
    );
    this.evaluateStageCompletions();
    this.saveState();
    return { success: true, state: this.state };
  }

  confirmWorkpieceStep(stepId, confirmed = true) {
    if (this.state.workpieceSteps[stepId] !== undefined) {
      this.state.workpieceSteps[stepId] = Boolean(confirmed);
      const step = SCENARIO_DATA.setupInstructions.find(s => s.id === stepId);
      this.logEvent(
        "WORKPIECE_SETUP",
        `Workpiece Step Confirmed: Step ${step ? step.stepNumber : ''} - ${step ? step.title : stepId}`,
        `Operator verified: ${step ? step.verificationCriterion : 'OK'}`
      );
      this.evaluateStageCompletions();
      this.saveState();
      return { success: true, state: this.state };
    }
    return { success: false, error: `Invalid workpiece step id: ${stepId}` };
  }

  confirmAllWorkpieceSteps() {
    SCENARIO_DATA.setupInstructions.forEach(s => {
      this.state.workpieceSteps[s.id] = true;
    });
    this.logEvent(
      "WORKPIECE_SETUP",
      "All Workpiece Setup Instructions Confirmed",
      "Fixture cleaned, parallels seated, billet torqued to 45Nm, feeler checked, G54 offset verified."
    );
    this.evaluateStageCompletions();
    this.saveState();
    return { success: true, state: this.state };
  }

  approveReadyReview() {
    this.evaluateStageCompletions();
    if (!this.state.stages[0].isComplete || !this.state.stages[1].isComplete || !this.state.stages[2].isComplete) {
      return {
        success: false,
        error: "Cannot approve Ready Review: Incomplete checks in previous stages."
      };
    }
    this.state.readyApproved = true;
    this.state.currentStageIndex = 5; // Move to Operation
    this.state.operation.status = "READY";
    this.logEvent(
      "READY_APPROVAL",
      "Master Readiness Approved",
      "Operator approved all machine, tooling, and workpiece setup checks. VMC ready for Cycle Start."
    );
    this.evaluateStageCompletions();
    this.saveState();
    return { success: true, state: this.state };
  }

  setStage(stageIndex) {
    const target = parseInt(stageIndex, 10);
    if (target < 1 || target > 5) {
      return { success: false, error: "Invalid stage index (must be 1-5)" };
    }

    this.evaluateStageCompletions();

    // Allow going backwards freely, but going forward requires prior stage completion
    if (target > this.state.currentStageIndex) {
      for (let i = 1; i < target; i++) {
        const stageObj = this.state.stages[i - 1];
        if (!stageObj.isComplete) {
          return {
            success: false,
            error: `Cannot proceed to Stage ${target}: Stage ${i} (${stageObj.name}) is incomplete.`
          };
        }
      }
    }

    const prevStage = this.state.currentStageIndex;
    this.state.currentStageIndex = target;
    this.logEvent(
      "STAGE_NAVIGATION",
      `Navigated to Stage ${target}: ${this.state.stages[target - 1].name}`,
      `Operator moved from Stage ${prevStage} to Stage ${target}`
    );
    this.saveState();
    return { success: true, state: this.state };
  }

  nextStage() {
    const current = this.state.currentStageIndex;
    if (current >= 5) {
      return { success: false, error: "Already at final stage (Operation)" };
    }
    return this.setStage(current + 1);
  }

  startOperation() {
    this.evaluateStageCompletions();
    if (!this.state.stages[0].isComplete || !this.state.stages[1].isComplete || !this.state.stages[2].isComplete) {
      return {
        success: false,
        error: "Interlock Error: Cannot start operation until all machine, tooling and workpiece checks are confirmed."
      };
    }

    this.state.operation.status = "RUNNING";
    this.state.operation.stopReason = null;
    this.state.operation.coolantActive = true;
    this.logEvent(
      "CYCLE_START",
      "Machining Cycle Started (RUNNING)",
      `CNC Program ${SCENARIO_DATA.operation.cncProgram.programNumber} execution started for Part #${this.state.operation.partsCompleted + 1}`
    );
    this.saveState();
    return { success: true, state: this.state };
  }

  stopOperation(reason = "Operator Feed Hold / Pause") {
    if (this.state.operation.status === "RUNNING") {
      this.state.operation.status = "STOPPED";
      this.state.operation.lastStopTime = new Date().toISOString();
      this.state.operation.stopReason = reason;
      this.state.operation.spindleRpm = 0;
      this.state.operation.feedRate = 0;
      this.state.operation.spindleLoadPercent = 0;
      this.state.operation.coolantActive = false;
      this.logEvent(
        "CYCLE_STOP",
        "Machining Cycle Paused (STOPPED)",
        `Execution halted by operator: ${reason}. Machine state preserved.`
      );
      this.saveState();
      return { success: true, state: this.state };
    }
    return { success: false, error: "Operation is not currently running" };
  }

  updateOperationTelemetry(telemetry) {
    if (telemetry) {
      Object.assign(this.state.operation, telemetry);
      if (telemetry.status === "COMPLETED") {
        this.state.operation.partsCompleted += 1;
        this.logEvent(
          "CYCLE_COMPLETE",
          `Part #${this.state.operation.partsCompleted} Completed`,
          `Machining finished successfully in ${this.state.operation.cycleTimeSeconds} seconds.`
        );
        this.evaluateStageCompletions();
      }
      this.saveState();
    }
    return { success: true, state: this.state };
  }

  resetAllState() {
    this.state = this.getInitialState();
    this.logEvent(
      "SYSTEM_RESET",
      "HMI Guidance Reset",
      "Operator reset all checks and workflow back to initial startup stage."
    );
    this.saveState();
    return { success: true, state: this.state };
  }
}

module.exports = new StateManager();
