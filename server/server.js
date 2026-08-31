const express = require('express');
const cors = require('cors');
const path = require('path');
const SCENARIO_DATA = require('./scenarioData');
const stateManager = require('./stateManager');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// API Routes

// Get full preloaded mock scenario
app.get('/api/scenario', (req, res) => {
  res.json({ success: true, data: SCENARIO_DATA });
});

// Get current machine & operator state
app.get('/api/state', (req, res) => {
  res.json({ success: true, data: stateManager.getState() });
});

// Machine checks endpoints
app.post('/api/machine-checks/confirm', (req, res) => {
  const { checkId, confirmed } = req.body;
  if (!checkId) {
    return res.status(400).json({ success: false, error: "Missing checkId" });
  }
  const result = stateManager.confirmMachineCheck(checkId, confirmed !== undefined ? confirmed : true);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

app.post('/api/machine-checks/confirm-all', (req, res) => {
  const result = stateManager.confirmAllMachineChecks();
  res.json(result);
});

// Tools endpoints
app.post('/api/tools/confirm', (req, res) => {
  const { toolId, confirmed } = req.body;
  if (!toolId) {
    return res.status(400).json({ success: false, error: "Missing toolId" });
  }
  const result = stateManager.confirmTool(toolId, confirmed !== undefined ? confirmed : true);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

app.post('/api/tools/confirm-all', (req, res) => {
  const result = stateManager.confirmAllTools();
  res.json(result);
});

// Workpiece setup endpoints
app.post('/api/workpiece/confirm', (req, res) => {
  const { stepId, confirmed } = req.body;
  if (!stepId) {
    return res.status(400).json({ success: false, error: "Missing stepId" });
  }
  const result = stateManager.confirmWorkpieceStep(stepId, confirmed !== undefined ? confirmed : true);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

app.post('/api/workpiece/confirm-all', (req, res) => {
  const result = stateManager.confirmAllWorkpieceSteps();
  res.json(result);
});

// Ready review approval
app.post('/api/ready/approve', (req, res) => {
  const result = stateManager.approveReadyReview();
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

// Stage navigation
app.post('/api/stage/set', (req, res) => {
  const { stageIndex } = req.body;
  const result = stateManager.setStage(stageIndex);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

app.post('/api/stage/next', (req, res) => {
  const result = stateManager.nextStage();
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

// Operation controls
app.post('/api/operation/start', (req, res) => {
  const result = stateManager.startOperation();
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

app.post('/api/operation/stop', (req, res) => {
  const { reason } = req.body || {};
  const result = stateManager.stopOperation(reason);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

app.post('/api/operation/telemetry', (req, res) => {
  const { telemetry } = req.body;
  const result = stateManager.updateOperationTelemetry(telemetry);
  res.json(result);
});

// Reset system
app.post('/api/reset', (req, res) => {
  const result = stateManager.resetAllState();
  res.json(result);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Primeform VMC-850 HMI Server',
    time: new Date().toISOString()
  });
});

// Serve frontend static build in production
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Primeform VMC HMI Server</title></head>
          <body style="font-family: sans-serif; background: #0c1017; color: #00f0ff; padding: 40px; text-align: center;">
            <h2>VMC Operator HMI Backend Online</h2>
            <p>API Server running on port ${PORT}. Run <code>npm run client</code> for frontend dev server or <code>npm run build</code> for production bundle.</p>
            <p><a href="/api/scenario" style="color: #10b981;">View /api/scenario</a> | <a href="/api/state" style="color: #10b981;">View /api/state</a></p>
          </body>
        </html>
      `);
    }
  });
});

app.listen(PORT, () => {
  console.log(`[Primeform HMI] Server running on http://localhost:${PORT}`);
});
