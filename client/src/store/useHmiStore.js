/**
 * Centralized Zustand Store for Primeform VMC Operator HMI
 */

import { create } from 'zustand';
import * as api from '../services/api';
import { soundFx } from '../audio/soundEffects';

export const useHmiStore = create((set, get) => ({
  scenario: null,
  machineState: null,
  loading: true,
  errorMessage: null,
  showSpecsModal: false,
  showAuditModal: false,
  showProfileModal: false,
  audioMuted: soundFx.isMuted(),

  // Operator & Shift Data
  operator: {
    name: "J. Sharma",
    id: "OP-904",
    role: "Lead CNC Precision Machinist",
    qualification: "Level 4 VMC Specialist (Fanuc/Siemens Certified)",
    shiftName: "Shift A (Morning)",
    shiftStart: "06:00",
    shiftEnd: "14:00",
    shiftHoursTotal: 8,
    shiftHoursElapsed: "06h 48m",
    partsProducedThisShift: 14,
    shiftEfficiency: "94.2%",
    handoverHistory: [
      {
        id: "ho-1",
        time: "06:00 AM",
        from: "OP-602 (A. Kumar)",
        to: "OP-904 (J. Sharma)",
        notes: "Shift A handover: Kurt vise parallels inspected, tool T02 pocket checked. Ready for OP-10."
      }
    ]
  },

  // Initialization
  fetchInitialData: async () => {
    try {
      set({ loading: true, errorMessage: null });
      const [scenario, machineState] = await Promise.all([
        api.fetchScenario(),
        api.fetchMachineState()
      ]);
      set({ scenario, machineState, loading: false });
    } catch (err) {
      console.error("Failed to load initial HMI state:", err);
      set({ 
        errorMessage: err.message || "Failed to connect to VMC CNC backend.",
        loading: false 
      });
    }
  },

  // Modal actions
  setShowSpecsModal: (show) => set({ showSpecsModal: show }),
  setShowAuditModal: (show) => set({ showAuditModal: show }),
  setShowProfileModal: (show) => set({ showProfileModal: show }),
  setErrorMessage: (msg) => set({ errorMessage: msg }),

  // Audio Toggle
  toggleAudio: () => {
    const isMuted = soundFx.toggleMute();
    set({ audioMuted: isMuted });
    if (!isMuted) {
      soundFx.playConfirm();
    }
  },

  // Shift Handover Action
  submitShiftHandover: (handoverData) => {
    soundFx.playReadyFanfare();
    const newHandoverEntry = {
      id: `ho-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      from: get().operator.name + ` (${get().operator.id})`,
      to: handoverData.nextOperatorName + ` (${handoverData.nextOperatorId})`,
      notes: handoverData.notes || "Shift handover completed successfully."
    };

    const updatedOperator = {
      ...get().operator,
      name: handoverData.nextOperatorName || "R. Patel",
      id: handoverData.nextOperatorId || "OP-712",
      shiftName: handoverData.nextShiftName || "Shift B (Afternoon)",
      shiftStart: "14:00",
      shiftEnd: "22:00",
      shiftHoursElapsed: "00h 05m",
      handoverHistory: [newHandoverEntry, ...get().operator.handoverHistory]
    };

    set({ 
      operator: updatedOperator,
      showProfileModal: false 
    });

    // Add to audit log
    if (get().machineState) {
      const auditEntry = {
        id: `log-ho-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: "SHIFT_HANDOVER",
        action: `Shift Handover: ${newHandoverEntry.from} ➔ ${newHandoverEntry.to}`,
        details: newHandoverEntry.notes,
        operator: updatedOperator.id
      };
      set({
        machineState: {
          ...get().machineState,
          auditLogs: [auditEntry, ...get().machineState.auditLogs]
        }
      });
    }
  },

  // Machine Checks (Stage 1)
  confirmMachineCheck: async (checkId, confirmed = true) => {
    try {
      const updatedState = await api.confirmMachineCheck(checkId, confirmed);
      set({ machineState: updatedState });
    } catch (err) {
      set({ errorMessage: err.message });
    }
  },

  confirmAllMachineChecks: async () => {
    try {
      const updatedState = await api.confirmAllMachineChecks();
      set({ machineState: updatedState });
    } catch (err) {
      set({ errorMessage: err.message });
    }
  },

  // Tool Verification (Stage 2)
  confirmTool: async (toolId, confirmed = true) => {
    try {
      const updatedState = await api.confirmTool(toolId, confirmed);
      set({ machineState: updatedState });
    } catch (err) {
      set({ errorMessage: err.message });
    }
  },

  confirmAllTools: async () => {
    try {
      const updatedState = await api.confirmAllTools();
      set({ machineState: updatedState });
    } catch (err) {
      set({ errorMessage: err.message });
    }
  },

  // Workpiece Setup (Stage 3)
  confirmWorkpieceStep: async (stepId, confirmed = true) => {
    try {
      const updatedState = await api.confirmWorkpieceStep(stepId, confirmed);
      set({ machineState: updatedState });
    } catch (err) {
      set({ errorMessage: err.message });
    }
  },

  confirmAllWorkpieceSteps: async () => {
    try {
      const updatedState = await api.confirmAllWorkpieceSteps();
      set({ machineState: updatedState });
    } catch (err) {
      set({ errorMessage: err.message });
    }
  },

  // Stage Navigation
  setStage: async (stageIndex) => {
    try {
      const updatedState = await api.setStage(stageIndex);
      set({ machineState: updatedState });
    } catch (err) {
      set({ errorMessage: err.message });
    }
  },

  nextStage: async () => {
    try {
      const updatedState = await api.nextStage();
      set({ machineState: updatedState });
    } catch (err) {
      set({ errorMessage: err.message });
    }
  },

  prevStage: () => {
    const current = get().machineState?.currentStageIndex || 1;
    if (current > 1) {
      get().setStage(current - 1);
    }
  },

  // Ready Review Approval (Stage 4)
  approveReadyReview: async () => {
    try {
      const updatedState = await api.approveReadyReview();
      set({ machineState: updatedState });
    } catch (err) {
      set({ errorMessage: err.message });
    }
  },

  // Operation Control (Stage 5)
  startOperation: async () => {
    try {
      const updatedState = await api.startOperation();
      set({ machineState: updatedState });
    } catch (err) {
      set({ errorMessage: err.message });
    }
  },

  stopOperation: async (reason) => {
    try {
      const updatedState = await api.stopOperation(reason || "Operator Feed Hold");
      set({ machineState: updatedState });
    } catch (err) {
      set({ errorMessage: err.message });
    }
  },

  updateTelemetry: async (telemetry) => {
    try {
      const updatedState = await api.updateTelemetry(telemetry);
      if (updatedState) {
        set({ machineState: updatedState });
      }
    } catch (err) {
      // Ignored for high-frequency updates
    }
  },

  // System Reset & Emergency
  resetSystem: async () => {
    try {
      const updatedState = await api.resetSystem();
      set({ machineState: updatedState });
    } catch (err) {
      set({ errorMessage: err.message });
    }
  },

  emergencyStop: async () => {
    soundFx.playStopAlarm();
    const op = get().machineState?.operation;
    if (op && op.status === 'RUNNING') {
      await get().stopOperation("EMERGENCY E-STOP PRESSED");
    }
    alert("EMERGENCY STOP ENGAGED: Spindle and axis servos de-energized.");
  }
}));
