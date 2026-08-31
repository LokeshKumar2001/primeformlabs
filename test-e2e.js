/**
 * Comprehensive Automated End-to-End Test Suite for Primeform VMC Operator HMI
 */

const BASE_URL = 'http://localhost:5050';

async function runTests() {
  console.log('====================================================');
  console.log('STARTING VMC OPERATOR HMI FULL-STACK TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`[TEST] ${name} ... `);
      await fn();
      console.log('PASSED ✓');
      passed++;
    } catch (err) {
      console.log(`FAILED ✗ (${err.message})`);
      failed++;
    }
  }

  // 1. Health check
  await test('GET /api/health returns online status', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.status !== 'online') throw new Error(`Expected online, got ${json.status}`);
  });

  // 2. Scenario data
  await test('GET /api/scenario returns preloaded mock specifications', async () => {
    const res = await fetch(`${BASE_URL}/api/scenario`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const data = json.data;
    if (!data.machineChecks || data.machineChecks.length !== 6) {
      throw new Error(`Expected 6 machine checks, got ${data.machineChecks?.length}`);
    }
    if (!data.requiredTools || data.requiredTools.length !== 5) {
      throw new Error(`Expected 5 required tools, got ${data.requiredTools?.length}`);
    }
    if (!data.setupInstructions || data.setupInstructions.length !== 5) {
      throw new Error(`Expected 5 setup instructions, got ${data.setupInstructions?.length}`);
    }
    if (data.workOrder.partNumber !== 'AERO-FLG-7042') {
      throw new Error(`Expected AERO-FLG-7042, got ${data.workOrder.partNumber}`);
    }
  });

  // 3. Reset to Stage 1
  await test('POST /api/reset resets state to initial startup condition', async () => {
    const res = await fetch(`${BASE_URL}/api/reset`, { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.state.currentStageIndex !== 1) {
      throw new Error(`Expected stage 1, got ${json.state.currentStageIndex}`);
    }
  });

  // 4. Stage 1 lockout check
  await test('POST /api/stage/next is blocked when checks are incomplete', async () => {
    const res = await fetch(`${BASE_URL}/api/stage/next`, { method: 'POST' });
    if (res.ok) {
      throw new Error('Expected 400 error due to incomplete checks');
    }
  });

  // 5. Confirm Stage 1 checks
  await test('POST /api/machine-checks/confirm individual check', async () => {
    const res = await fetch(`${BASE_URL}/api/machine-checks/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkId: 'chk-power', confirmed: true })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.state.machineChecks['chk-power'] !== true) {
      throw new Error('chk-power was not marked true');
    }
  });

  await test('POST /api/machine-checks/confirm-all satisfies all 6 checks and unlocks Stage 2', async () => {
    const res = await fetch(`${BASE_URL}/api/machine-checks/confirm-all`, { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.state.stages[0].isComplete) {
      throw new Error('Stage 1 is not marked complete');
    }
  });

  // 6. Transition to Stage 2
  await test('POST /api/stage/next successfully moves from Stage 1 -> Stage 2', async () => {
    const res = await fetch(`${BASE_URL}/api/stage/next`, { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.state.currentStageIndex !== 2) {
      throw new Error(`Expected stage 2, got ${json.state.currentStageIndex}`);
    }
  });

  // 7. Confirm Stage 2 tools
  await test('POST /api/tools/confirm-all loads all 5 tools and unlocks Stage 3', async () => {
    const res = await fetch(`${BASE_URL}/api/tools/confirm-all`, { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.state.stages[1].isComplete) {
      throw new Error('Stage 2 is not marked complete');
    }
  });

  // 8. Transition to Stage 3
  await test('POST /api/stage/next moves from Stage 2 -> Stage 3', async () => {
    const res = await fetch(`${BASE_URL}/api/stage/next`, { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.state.currentStageIndex !== 3) {
      throw new Error(`Expected stage 3, got ${json.state.currentStageIndex}`);
    }
  });

  // 9. Confirm Stage 3 workpiece setup
  await test('POST /api/workpiece/confirm-all satisfies clamping/datum steps', async () => {
    const res = await fetch(`${BASE_URL}/api/workpiece/confirm-all`, { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.state.stages[2].isComplete) {
      throw new Error('Stage 3 is not marked complete');
    }
  });

  // 10. Transition to Stage 4 (Ready Review)
  await test('POST /api/stage/next moves from Stage 3 -> Stage 4 (Ready Review)', async () => {
    const res = await fetch(`${BASE_URL}/api/stage/next`, { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.state.currentStageIndex !== 4) {
      throw new Error(`Expected stage 4, got ${json.state.currentStageIndex}`);
    }
  });

  // 11. Approve Ready Review
  await test('POST /api/ready/approve validates all prerequisites and advances to Stage 5 (Operation)', async () => {
    const res = await fetch(`${BASE_URL}/api/ready/approve`, { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.state.currentStageIndex !== 5) {
      throw new Error(`Expected stage 5, got ${json.state.currentStageIndex}`);
    }
    if (json.state.operation.status !== 'READY') {
      throw new Error(`Expected operation status READY, got ${json.state.operation.status}`);
    }
  });

  // 12. Start Operation (READY -> RUNNING)
  await test('POST /api/operation/start engages machining cycle (READY -> RUNNING)', async () => {
    const res = await fetch(`${BASE_URL}/api/operation/start`, { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.state.operation.status !== 'RUNNING') {
      throw new Error(`Expected RUNNING, got ${json.state.operation.status}`);
    }
    if (!json.state.operation.coolantActive) {
      throw new Error('Expected coolant active when running');
    }
  });

  // 13. Stop Operation (RUNNING -> STOPPED)
  await test('POST /api/operation/stop halts cycle and preserves state (RUNNING -> STOPPED)', async () => {
    const res = await fetch(`${BASE_URL}/api/operation/stop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Operator Pause Test' })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.state.operation.status !== 'STOPPED') {
      throw new Error(`Expected STOPPED, got ${json.state.operation.status}`);
    }
  });

  // 14. Audit Log Verification
  await test('GET /api/state contains complete audit trail of operator actions', async () => {
    const res = await fetch(`${BASE_URL}/api/state`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const logs = json.data.auditLogs;
    if (!logs || logs.length < 5) {
      throw new Error(`Expected at least 5 audit logs, found ${logs?.length}`);
    }
    const hasCycleStart = logs.some(l => l.type === 'CYCLE_START');
    const hasCycleStop = logs.some(l => l.type === 'CYCLE_STOP');
    if (!hasCycleStart || !hasCycleStop) {
      throw new Error('Audit log missing CYCLE_START or CYCLE_STOP event');
    }
  });

  // 15. Frontend bundle check
  await test('GET / returns HTML client bundle', async () => {
    const res = await fetch(`${BASE_URL}/`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    if (!html.includes('PRIMEFORM VMC-850') && !html.includes('root')) {
      throw new Error('HTML response missing root container');
    }
  });

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test runner encountered error:", err);
  process.exit(1);
});
