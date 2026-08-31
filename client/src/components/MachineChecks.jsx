import React from 'react';
import { 
  Zap, 
  ShieldAlert, 
  DoorClosed, 
  CheckCircle2, 
  Droplets, 
  Crosshair, 
  Check, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { soundFx } from '../audio/soundEffects';
import { useHmiStore } from '../store/useHmiStore';

const ICON_MAP = {
  'zap': Zap,
  'shield-alert': ShieldAlert,
  'door-closed': DoorClosed,
  'check-circle': CheckCircle2,
  'droplets': Droplets,
  'crosshair': Crosshair
};

export function MachineChecks() {
  const { 
    scenario, 
    machineState, 
    confirmMachineCheck, 
    confirmAllMachineChecks, 
    nextStage 
  } = useHmiStore();

  const checkList = scenario?.machineChecks || [];
  const checksStatus = machineState?.machineChecks || {};
  const confirmedCount = checkList.filter(c => checksStatus[c.id]).length;
  const allConfirmed = checkList.length > 0 && confirmedCount === checkList.length;

  const handleToggleCheck = (checkId, currentState) => {
    soundFx.playConfirm();
    confirmMachineCheck(checkId, !currentState);
  };

  const handleConfirmAll = () => {
    soundFx.playReadyFanfare();
    confirmAllMachineChecks();
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
              STAGE 01 / 05
            </span>
            <h2 className="stage-main-title">
              Machine Pre-Startup &amp; Safety Checks
            </h2>
          </div>
          <p className="stage-instruction-sub">
            Verify all electrical, interlock, coolant, and axis reference conditions before inserting tooling.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, display: 'block' }}>
              Verification Status
            </span>
            <div style={{
              fontFamily: "'Consolas', monospace",
              fontSize: '14px',
              fontWeight: 800,
              color: allConfirmed ? '#16a34a' : '#00646e'
            }}>
              {confirmedCount} / {checkList.length} CONFIRMED
            </div>
          </div>

          <button 
            type="button"
            className="hmi-btn hmi-btn-secondary"
            onClick={handleConfirmAll}
            disabled={allConfirmed}
            title="Auto-validate all 6 telemetry checks"
            style={{ padding: '8px 14px', fontSize: '12px' }}
          >
            <Sparkles size={15} color="#0284c7" />
            <span>Verify All Checks</span>
          </button>
        </div>
      </div>

      {/* Body: Checks Grid */}
      <div className="stage-viewport-body">
        <div className="checks-grid">
          {checkList.map((check) => {
            const isConfirmed = Boolean(checksStatus[check.id]);
            const IconComp = ICON_MAP[check.icon] || Zap;

            return (
              <div 
                key={check.id} 
                className={`check-item-card ${isConfirmed ? 'confirmed' : ''}`}
                onClick={() => handleToggleCheck(check.id, isConfirmed)}
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="check-icon-box">
                        <IconComp size={20} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="check-category">
                            {check.category}
                          </span>
                          <span className={`led-indicator ${isConfirmed ? 'led-green' : 'led-amber pulse'}`} />
                        </div>
                        <h3 className="check-title" style={{ marginTop: '3px' }}>{check.title}</h3>
                      </div>
                    </div>
                  </div>

                  <p className="check-desc" style={{ marginTop: '10px' }}>
                    {check.description}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className="check-telemetry-badge">
                    <span style={{ color: '#00646e', fontWeight: 800, fontSize: '10px', marginRight: '6px' }}>SENSOR:</span>
                    <span>{check.statusText}</span>
                  </div>

                  <button
                    type="button"
                    className={`hmi-btn ${isConfirmed ? 'hmi-btn-success' : 'hmi-btn-secondary'}`}
                    style={{ width: '100%', padding: '9px 14px', fontSize: '12px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleCheck(check.id, isConfirmed);
                    }}
                  >
                    {isConfirmed ? (
                      <>
                        <Check size={15} strokeWidth={3} />
                        <span>Verified &amp; Confirmed</span>
                      </>
                    ) : (
                      <span>Confirm Check</span>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className={`led-indicator ${allConfirmed ? 'led-green' : 'led-amber pulse'}`} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: allConfirmed ? '#16a34a' : '#475569' }}>
            {allConfirmed 
              ? 'All 6 machine conditions verified. Ready for Tooling stage.' 
              : 'Action Required: Operator must confirm all 6 machine checks to proceed.'}
          </span>
        </div>

        <button 
          type="button"
          className="hmi-btn hmi-btn-primary hmi-btn-lg"
          onClick={handleNext}
          disabled={!allConfirmed}
        >
          <span>Next: Required Tools</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
