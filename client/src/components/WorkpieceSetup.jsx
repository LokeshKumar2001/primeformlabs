import React from 'react';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Sliders
} from 'lucide-react';
import { soundFx } from '../audio/soundEffects';
import { useHmiStore } from '../store/useHmiStore';

export function WorkpieceSetup() {
  const { 
    scenario, 
    machineState, 
    confirmWorkpieceStep, 
    confirmAllWorkpieceSteps, 
    nextStage, 
    prevStage 
  } = useHmiStore();

  const steps = scenario?.setupInstructions || [];
  const workpieceStatus = machineState?.workpieceSteps || {};
  const confirmedCount = steps.filter(s => workpieceStatus[s.id]).length;
  const allConfirmed = steps.length > 0 && confirmedCount === steps.length;

  const handleToggleStep = (stepId, currentState) => {
    soundFx.playConfirm();
    confirmWorkpieceStep(stepId, !currentState);
  };

  const handleConfirmAll = () => {
    soundFx.playReadyFanfare();
    confirmAllWorkpieceSteps();
  };

  const handleNext = () => {
    if (allConfirmed) {
      soundFx.playClick();
      nextStage();
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
              STAGE 03 / 05
            </span>
            <h2 className="stage-main-title">
              Workpiece Clamping, Fixture &amp; Offset Setup
            </h2>
          </div>
          <p className="stage-instruction-sub">
            Arrange stock in Kurt DX6 vise, verify clamping torque (45 N·m), inspect parallel seating, and probe G54 work coordinate datum.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, display: 'block' }}>
              Workpiece Setup
            </span>
            <div style={{
              fontFamily: "'Consolas', monospace",
              fontSize: '14px',
              fontWeight: 800,
              color: allConfirmed ? '#16a34a' : '#00646e'
            }}>
              {confirmedCount} / {steps.length} STEPS VERIFIED
            </div>
          </div>

          <button 
            type="button"
            className="hmi-btn hmi-btn-secondary"
            onClick={handleConfirmAll}
            disabled={allConfirmed}
            title="Auto-validate all 5 workpiece setup steps"
            style={{ padding: '8px 14px', fontSize: '12px' }}
          >
            <Sparkles size={15} color="#0284c7" />
            <span>Confirm All Setup Steps</span>
          </button>
        </div>
      </div>

      {/* Body: Specs Bar + Setup Steps */}
      <div className="stage-viewport-body">
        {/* Quick Reference Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '18px',
          backgroundColor: '#ffffff',
          padding: '14px',
          borderRadius: '12px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div>
            <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Material Spec</span>
            <div style={{ fontFamily: "'Consolas', monospace", fontSize: '12px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
              {scenario?.operation?.material?.specification} ({scenario?.operation?.material?.drawingRevision})
            </div>
          </div>
          <div>
            <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Billet Dimensions</span>
            <div style={{ fontFamily: "'Consolas', monospace", fontSize: '12px', fontWeight: 800, color: '#00646e', marginTop: '2px' }}>
              {scenario?.operation?.material?.dimensions}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Fixture &amp; Vise</span>
            <div style={{ fontFamily: "'Consolas', monospace", fontSize: '12px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
              {scenario?.operation?.fixture?.type} (45 N·m)
            </div>
          </div>
          <div>
            <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Work Coordinate System</span>
            <div style={{ fontFamily: "'Consolas', monospace", fontSize: '12px', fontWeight: 800, color: '#16a34a', marginTop: '2px' }}>
              {scenario?.operation?.workOffset?.coordinateSystem} ({scenario?.operation?.workOffset?.datumDescription?.split('|')[0]})
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {steps.map((step) => {
            const isConfirmed = Boolean(workpieceStatus[step.id]);

            return (
              <div 
                key={step.id} 
                className={`setup-step-card ${isConfirmed ? 'confirmed' : ''}`}
                onClick={() => handleToggleStep(step.id, isConfirmed)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
                  <div className="step-circle-number">
                    {isConfirmed ? <Check size={18} strokeWidth={3} /> : step.stepNumber}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div className="setup-step-title">
                      <span>{step.title}</span>
                      <span className="setup-step-badge">
                        {step.badge}
                      </span>
                      <span className={`led-indicator ${isConfirmed ? 'led-green' : 'led-amber pulse'}`} />
                    </div>

                    <p className="setup-step-desc">
                      {step.description}
                    </p>

                    <div className="setup-step-criterion">
                      <CheckCircle2 size={14} color="#16a34a" />
                      <span>{step.verificationCriterion}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    className={`hmi-btn ${isConfirmed ? 'hmi-btn-success' : 'hmi-btn-secondary'}`}
                    style={{ minWidth: '160px', padding: '10px 14px', fontSize: '12px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStep(step.id, isConfirmed);
                    }}
                  >
                    {isConfirmed ? (
                      <>
                        <Check size={14} strokeWidth={3} />
                        <span>Step Verified</span>
                      </>
                    ) : (
                      <>
                        <Sliders size={14} />
                        <span>Arrange &amp; Confirm</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
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
          <span>Back: Required Tools</span>
        </button>

        <button 
          type="button"
          className="hmi-btn hmi-btn-primary hmi-btn-lg"
          onClick={handleNext}
          disabled={!allConfirmed}
        >
          <span>Next: Ready Review</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
