import React from 'react';
import { 
  Wrench, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Cpu
} from 'lucide-react';
import { soundFx } from '../audio/soundEffects';
import { useHmiStore } from '../store/useHmiStore';

export function RequiredTools() {
  const { 
    scenario, 
    machineState, 
    confirmTool, 
    confirmAllTools, 
    nextStage, 
    prevStage 
  } = useHmiStore();

  const toolList = scenario?.requiredTools || [];
  const toolsStatus = machineState?.tools || {};
  const confirmedCount = toolList.filter(t => toolsStatus[t.id]).length;
  const allConfirmed = toolList.length > 0 && confirmedCount === toolList.length;

  const handleToggleTool = (toolId, currentState) => {
    soundFx.playConfirm();
    confirmTool(toolId, !currentState);
  };

  const handleConfirmAll = () => {
    soundFx.playReadyFanfare();
    confirmAllTools();
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
              STAGE 02 / 05
            </span>
            <h2 className="stage-main-title">
              Tool Magazine Loading &amp; Offset Verification
            </h2>
          </div>
          <p className="stage-instruction-sub">
            Insert required tools into the ATC carousel according to pocket allocation, verifying gauge lengths and CNC program revision.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, display: 'block' }}>
              Tooling Status
            </span>
            <div style={{
              fontFamily: "'Consolas', monospace",
              fontSize: '14px',
              fontWeight: 800,
              color: allConfirmed ? '#16a34a' : '#00646e'
            }}>
              {confirmedCount} / {toolList.length} INSERTED &amp; CHECKED
            </div>
          </div>

          <button 
            type="button"
            className="hmi-btn hmi-btn-secondary"
            onClick={handleConfirmAll}
            disabled={allConfirmed}
            title="Auto-validate all 5 tool pocket insertions"
            style={{ padding: '8px 14px', fontSize: '12px' }}
          >
            <Sparkles size={15} color="#0284c7" />
            <span>Confirm All Tools</span>
          </button>
        </div>
      </div>

      {/* Body: Tools List */}
      <div className="stage-viewport-body">
        <div className="tools-list-container">
          {toolList.map((tool) => {
            const isConfirmed = Boolean(toolsStatus[tool.id]);

            return (
              <div 
                key={tool.id} 
                className={`tool-card ${isConfirmed ? 'confirmed' : ''}`}
                onClick={() => handleToggleTool(tool.id, isConfirmed)}
                style={{ cursor: 'pointer' }}
              >
                {/* Pocket Column */}
                <div className="tool-pocket-col">
                  <span className="tool-code">
                    {tool.toolNumber}
                  </span>
                  <span className="tool-pocket-label">{tool.pocket}</span>
                  <span className={`led-indicator mt-1.5 ${isConfirmed ? 'led-green' : 'led-amber pulse'}`} />
                </div>

                {/* Main Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="tool-name-text">{tool.toolType}</span>
                    <span className="tool-rev-tag">
                      <Cpu size={12} />
                      {tool.programRevision}
                    </span>
                  </div>
                  <span className="tool-purpose-text">{tool.intendedOperation}</span>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#00646e', fontWeight: 600, fontFamily: "'Consolas', monospace" }}>
                    <span>Coating: {tool.coating}</span>
                    <span>•</span>
                    <span>Coolant: {tool.coolant}</span>
                  </div>
                </div>

                {/* Specs Matrix */}
                <div className="tool-specs-matrix">
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="spec-cell-label">Length Offset (H)</span>
                    <span className="spec-cell-val" style={{ color: '#16a34a' }}>{tool.lengthOffset}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="spec-cell-label">Diameter Offset (D)</span>
                    <span className="spec-cell-val" style={{ color: '#00646e' }}>{tool.diameterOffset}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="spec-cell-label">Spindle / Feed</span>
                    <span className="spec-cell-val">{tool.maxRpm} RPM | {tool.feedRate} mm/m</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="spec-cell-label">Diameter / Flutes</span>
                    <span className="spec-cell-val">Ø{tool.diameter} ({tool.flutes} Flutes)</span>
                  </div>
                </div>

                {/* Action Button */}
                <div>
                  <button
                    type="button"
                    className={`hmi-btn ${isConfirmed ? 'hmi-btn-success' : 'hmi-btn-secondary'}`}
                    style={{ width: '100%', padding: '10px 14px', fontSize: '12px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleTool(tool.id, isConfirmed);
                    }}
                  >
                    {isConfirmed ? (
                      <>
                        <Check size={14} strokeWidth={3} />
                        <span>Tool Inserted</span>
                      </>
                    ) : (
                      <>
                        <Wrench size={14} />
                        <span>Insert &amp; Confirm</span>
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
          <span>Back: Machine Checks</span>
        </button>

        <button 
          type="button"
          className="hmi-btn hmi-btn-primary hmi-btn-lg"
          onClick={handleNext}
          disabled={!allConfirmed}
        >
          <span>Next: Workpiece Setup</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
