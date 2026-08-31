/**
 * Modern Axios API Client for Primeform VMC Operator HMI
 * Features centralized interceptors, timeout handling, and RPC-style procedures
 */

import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-System': 'Primeform-HMI-v2026'
  }
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    config.headers['X-Request-Timestamp'] = new Date().toISOString();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMsg = 
      error.response?.data?.error || 
      error.response?.data?.message || 
      error.message || 
      'Network request failed';
    return Promise.reject(new Error(errorMsg));
  }
);

/* ==========================================================================
   RPC Procedure Methods
   ========================================================================== */

/** Fetch full preloaded mock scenario */
export async function fetchScenario() {
  const data = await apiClient.get('/scenario');
  return data.data;
}

/** Fetch current machine & operator state */
export async function fetchMachineState() {
  const data = await apiClient.get('/state');
  return data.data;
}

/** Confirm single machine check */
export async function confirmMachineCheck(checkId, confirmed = true) {
  const data = await apiClient.post('/machine-checks/confirm', { checkId, confirmed });
  return data.state;
}

/** Confirm all machine checks */
export async function confirmAllMachineChecks() {
  const data = await apiClient.post('/machine-checks/confirm-all');
  return data.state;
}

/** Confirm single tool insertion */
export async function confirmTool(toolId, confirmed = true) {
  const data = await apiClient.post('/tools/confirm', { toolId, confirmed });
  return data.state;
}

/** Confirm all required tools */
export async function confirmAllTools() {
  const data = await apiClient.post('/tools/confirm-all');
  return data.state;
}

/** Confirm single workpiece setup step */
export async function confirmWorkpieceStep(stepId, confirmed = true) {
  const data = await apiClient.post('/workpiece/confirm', { stepId, confirmed });
  return data.state;
}

/** Confirm all workpiece setup steps */
export async function confirmAllWorkpieceSteps() {
  const data = await apiClient.post('/workpiece/confirm-all');
  return data.state;
}

/** Approve ready review and transition to Operation */
export async function approveReadyReview() {
  const data = await apiClient.post('/ready/approve');
  return data.state;
}

/** Navigate to specific stage */
export async function setStage(stageIndex) {
  const data = await apiClient.post('/stage/set', { stageIndex });
  return data.state;
}

/** Navigate to next stage */
export async function nextStage() {
  const data = await apiClient.post('/stage/next');
  return data.state;
}

/** Engage machining cycle */
export async function startOperation() {
  const data = await apiClient.post('/operation/start');
  return data.state;
}

/** Stop machining cycle (Feed hold) */
export async function stopOperation(reason) {
  const data = await apiClient.post('/operation/stop', { reason });
  return data.state;
}

/** Update simulation telemetry stream */
export async function updateTelemetry(telemetry) {
  try {
    const data = await apiClient.post('/operation/telemetry', { telemetry });
    return data.state;
  } catch (e) {
    return null;
  }
}

/** Reset system state */
export async function resetSystem() {
  const data = await apiClient.post('/reset');
  return data.state;
}

export default apiClient;
