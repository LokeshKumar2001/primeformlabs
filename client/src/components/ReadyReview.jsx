import React from 'react';
import { 
  CheckCircle, 
  ShieldCheck, 
  Wrench, 
  Box, 
  ArrowLeft, 
  Play, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { soundFx } from '../audio/soundEffects';
import { useHmiStore } from '../store/useHmiStore';

export function ReadyReview() {
  const { 
    scenario, 
    machineState, 
    approveReadyReview, 
    prevStage 
  } = useHmiStore();

  const machineChecks = scenario?.machineChecks || [];
  const tools = scenario?.requiredTools || [];
  const setupSteps = scenario?.setupInstructions || [];

  const checksStatus = machineState?.machineChecks || {};
  const toolsStatus = machineState?.tools || {};
  const workpieceStatus = machineState?.workpieceSteps || {};

  const machineChecksPassed = machineChecks.every(c => checksStatus[c.id]);
  const toolsPassed = tools.every(t => toolsStatus[t.id]);
  const workpiecePassed = setupSteps.every(s => workpieceStatus[s.id]);

  const isFullyReady = machineChecksPassed && toolsPassed && workpiecePassed;

  const handleProceed = () => {
    if (isFullyReady) {
      soundFx.playStartCycle();
      approveReadyReview();
    } else {
      soundFx.playStopAlarm();
    }
  };

  return (
    <div className="stage-viewport-card">
      {/* Header */}
      <div className="stage-viewport-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="stage-tag-badge">
              STAGE 04 / 05
            </span>
            <h2 className="stage-main-title">
              Final Readiness Review &amp; Interlock Audit
            </h2>
          </div>
          <p className="stage-instruction-sub">
            Review completed machine pre-checks, loaded tooling magazine, and clamped workpiece datum alignment before unlocking CNC operation.
          </p>
        </div>

        <div>
          <span className={`led-indicator w-4 h-4 ${isFullyReady ? 'led-green pulse' : 'led-red pulse'}`} />
        </div>
      </div>

      {/* Body: Master Banner & 3 Columns */}
      <div className="stage-viewport-body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Master Readiness Banner */}
          <div 
            style={{
              padding: '22px 28px',
              borderRadius: '16px',
              border: `2px solid ${isFullyReady ? '#16a34a' : '#dc2626'}`,
              backgroundColor: isFullyReady ? '#f0fdf4' : '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: isFullyReady ? '#16a34a' : '#dc2626',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isFullyReady ? '0 4px 12px rgba(22, 163, 74, 0.3)' : '0 4px 12px rgba(220, 38, 38, 0.3)'
              }}>
                {isFullyReady ? <CheckCircle size={30} /> : <AlertTriangle size={30} />}
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: isFullyReady ? '#15803d' : '#991b1b', margin: 0 }}>
                  {isFullyReady ? 'SYSTEM STATUS: READY FOR MACHINING' : 'SYSTEM STATUS: CHECKS INCOMPLETE'}
                </h3>
                <p style={{ fontSize: '13px', color: isFullyReady ? '#166534' : '#b91c1c', marginTop: '3px', fontWeight: 600 }}>
                  {isFullyReady 
                    ? 'All 16 physical checks and parameters verified. Operator safety interlocks satisfied.'
                    : 'Critical safety checks or tooling incomplete in previous stages. Resolve to proceed.'}
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Consolas', monospace", fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                APPROVED OPERATOR
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                {scenario?.workOrder?.operatorId}
              </div>
            </div>
          </div>

          {/* 3 Verification Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* 1. Machine Checks */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} color="#00646e" />
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#00646e' }}>1. Machine Checks (6/6)</span>
                </div>
                <span className={`led-indicator ${machineChecksPassed ? 'led-green' : 'led-red'}`} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {machineChecks.map((chk) => (
                  <div key={chk.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Check size={14} color={checksStatus[chk.id] ? "#16a34a" : "#cbd5e1"} strokeWidth={3} />
                      <span style={{ color: checksStatus[chk.id] ? "#1e293b" : "#94a3b8", fontWeight: checksStatus[chk.id] ? 600 : 400 }}>
                        {chk.title}
                      </span>
                    </div>
                    <span style={{ fontFamily: "'Consolas', monospace", fontSize: '10px', fontWeight: 800, color: checksStatus[chk.id] ? "#16a34a" : "#dc2626" }}>
                      {checksStatus[chk.id] ? "OK" : "PENDING"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Tooling Magazine */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wrench size={16} color="#00646e" />
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#00646e' }}>2. Tool Magazine (5/5)</span>
                </div>
                <span className={`led-indicator ${toolsPassed ? 'led-green' : 'led-red'}`} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {tools.map((tool) => (
                  <div key={tool.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Check size={14} color={toolsStatus[tool.id] ? "#16a34a" : "#cbd5e1"} strokeWidth={3} />
                      <span style={{ color: toolsStatus[tool.id] ? "#1e293b" : "#94a3b8", fontWeight: toolsStatus[tool.id] ? 600 : 400 }}>
                        {tool.toolNumber}: {tool.toolType.split('(')[0]}
                      </span>
                    </div>
                    <span style={{ fontFamily: "'Consolas', monospace", fontSize: '10px', fontWeight: 800, color: toolsStatus[tool.id] ? "#16a34a" : "#dc2626" }}>
                      {toolsStatus[tool.id] ? "LOADED" : "MISSING"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Workpiece Setup */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Box size={16} color="#00646e" />
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#00646e' }}>3. Workpiece Setup (5/5)</span>
                </div>
                <span className={`led-indicator ${workpiecePassed ? 'led-green' : 'led-red'}`} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {setupSteps.map((step) => (
                  <div key={step.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Check size={14} color={workpieceStatus[step.id] ? "#16a34a" : "#cbd5e1"} strokeWidth={3} />
                      <span style={{ color: workpieceStatus[step.id] ? "#1e293b" : "#94a3b8", fontWeight: workpieceStatus[step.id] ? 600 : 400 }}>
                        Step {step.stepNumber}: {step.badge}
                      </span>
                    </div>
                    <span style={{ fontFamily: "'Consolas', monospace", fontSize: '10px', fontWeight: 800, color: workpieceStatus[step.id] ? "#16a34a" : "#dc2626" }}>
                      {workpieceStatus[step.id] ? "CLAMPED" : "PENDING"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="stage-viewport-footer">
        <button 
          type="button"
          className="hmi-btn hmi-btn-secondary"
          onClick={() => { soundFx.playClick(); prevStage(); }}
        >
          <ArrowLeft size={16} />
          <span>Back: Workpiece Setup</span>
        </button>

        <button 
          type="button"
          className="hmi-btn hmi-btn-success hmi-btn-lg"
          style={{ padding: '12px 32px' }}
          onClick={handleProceed}
          disabled={!isFullyReady}
        >
          <Play size={18} fill="#ffffff" />
          <span>PROCEED TO OPERATION</span>
        </button>
      </div>
    </div>
  );
}
