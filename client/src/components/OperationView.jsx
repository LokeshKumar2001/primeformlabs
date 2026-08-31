import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw
} from 'lucide-react';
import { soundFx } from '../audio/soundEffects';
import { MillingCanvas } from './MillingCanvas';
import { useHmiStore } from '../store/useHmiStore';

export function OperationView() {
  const { 
    scenario, 
    machineState, 
    startOperation, 
    stopOperation, 
    updateTelemetry, 
    setStage 
  } = useHmiStore();

  const opState = machineState?.operation || {};
  const status = opState.status || "READY";
  const isRunning = status === "RUNNING";

  const totalEstimatedSeconds = scenario?.operation?.cncProgram?.estimatedRunTimeSeconds || 60;
  const [elapsedSeconds, setElapsedSeconds] = useState(opState.cycleTimeSeconds || 0);
  const [activeLineIdx, setActiveLineIdx] = useState(opState.activeGCodeIndex || 0);
  const [currentToolIdx, setCurrentToolIdx] = useState(opState.currentToolIndex || 0);

  const gcodeList = scenario?.sampleGCodeBlocks || [];
  const gcodeBoxRef = useRef(null);

  // Dynamic Telemetry Metrics
  const [rpm, setRpm] = useState(0);
  const [feedRate, setFeedRate] = useState(0);
  const [spindleLoad, setSpindleLoad] = useState(0);

  const cycleProgress = Math.min(1, elapsedSeconds / totalEstimatedSeconds);

  // Spindle Audio Hum
  useEffect(() => {
    soundFx.setSpindleHum(isRunning);
  }, [isRunning]);

  // Real-time Machining Timer
  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;

          const progress = next / totalEstimatedSeconds;
          let toolIdx = 0;
          if (progress > 0.90) toolIdx = 4;
          else if (progress > 0.80) toolIdx = 3;
          else if (progress > 0.60) toolIdx = 2;
          else if (progress > 0.25) toolIdx = 1;
          else toolIdx = 0;
          setCurrentToolIdx(toolIdx);

          const gLine = Math.min(gcodeList.length - 1, Math.floor(progress * gcodeList.length));
          setActiveLineIdx(gLine);

          const tool = scenario?.requiredTools?.[toolIdx];
          const targetRpm = tool?.maxRpm || 5000;
          const targetFeed = tool?.feedRate || 1400;
          
          setRpm(Math.floor(targetRpm + (Math.random() * 40 - 20)));
          setFeedRate(Math.floor(targetFeed + (Math.random() * 30 - 15)));
          setSpindleLoad(Math.floor(42 + Math.sin(next) * 12 + Math.random() * 5));

          if (next >= totalEstimatedSeconds) {
            soundFx.playReadyFanfare();
            updateTelemetry({
              status: "COMPLETED",
              cycleTimeSeconds: next,
              spindleRpm: 0,
              feedRate: 0,
              spindleLoadPercent: 0,
              coolantActive: false
            });
            return totalEstimatedSeconds;
          }

          if (next % 4 === 0) {
            updateTelemetry({
              cycleTimeSeconds: next,
              activeGCodeIndex: gLine,
              currentToolIndex: toolIdx,
              spindleRpm: targetRpm,
              feedRate: targetFeed,
              spindleLoadPercent: 48
            });
          }

          return next;
        });
      }, 1000);
    } else {
      setRpm(0);
      setFeedRate(0);
      setSpindleLoad(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, totalEstimatedSeconds, gcodeList.length, scenario, updateTelemetry]);

  // Scroll G-code list automatically
  useEffect(() => {
    if (gcodeBoxRef.current) {
      const activeEl = gcodeBoxRef.current.querySelector('.gcode-line-row.active');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeLineIdx]);

  const handleStart = () => {
    soundFx.playStartCycle();
    startOperation();
  };

  const handleStop = () => {
    soundFx.playStopAlarm();
    stopOperation("Operator Feed Hold Pressed");
  };

  const handleRestartPart = () => {
    soundFx.playClick();
    setElapsedSeconds(0);
    setActiveLineIdx(0);
    setCurrentToolIdx(0);
    updateTelemetry({
      status: "READY",
      cycleTimeSeconds: 0,
      activeGCodeIndex: 0,
      currentToolIndex: 0,
      spindleRpm: 0,
      feedRate: 0,
      spindleLoadPercent: 0,
      coolantActive: false
    });
  };

  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const currentTool = scenario?.requiredTools?.[currentToolIdx] || scenario?.requiredTools?.[0];

  return (
    <div className="stage-viewport-card">
      {/* Top Header */}
      <div className="stage-viewport-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="stage-tag-badge">
              STAGE 05 / 05
            </span>
            <h2 className="stage-main-title">
              Live CNC Machining Operation
            </h2>
          </div>
          <p className="stage-instruction-sub">
            {scenario?.operation?.opNumber}: {scenario?.operation?.opName} • Program {scenario?.operation?.cncProgram?.programNumber} ({scenario?.operation?.cncProgram?.revision})
          </p>
        </div>

        {/* Status Badge */}
        <div className="status-callout-capsule">
          <span className={`led-indicator w-3.5 h-3.5 ${
            status === 'RUNNING' ? 'led-green pulse' : 
            status === 'READY' ? 'led-cyan' : 
            status === 'COMPLETED' ? 'led-amber' : 'led-red'
          }`} />
          <span className={`status-callout-text status-${status}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Main Simulation Viewport */}
      <div className="stage-viewport-body">
        <div className="operation-dashboard-grid">
          {/* Left: 2D Interactive Milling Canvas */}
          <MillingCanvas 
            isRunning={isRunning}
            currentToolIndex={currentToolIdx}
            cycleProgress={cycleProgress}
            activeGCodeLine={gcodeList[activeLineIdx] || ""}
            coolantActive={isRunning}
          />

          {/* Right: Gauges & G-code Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Gauges Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div className="gauge-card">
                <span className="gauge-label">Spindle Speed</span>
                <div className="gauge-value-display" style={{ color: isRunning ? '#00646e' : '#64748b' }}>
                  {isRunning ? rpm.toLocaleString() : '0'}
                </div>
                <span className="gauge-unit">RPM (S-CODE)</span>
              </div>

              <div className="gauge-card">
                <span className="gauge-label">Feed Rate</span>
                <div className="gauge-value-display" style={{ color: isRunning ? '#16a34a' : '#64748b' }}>
                  {isRunning ? feedRate.toLocaleString() : '0'}
                </div>
                <span className="gauge-unit">MM / MIN (F-CODE)</span>
              </div>

              <div className="gauge-card">
                <span className="gauge-label">Spindle Load</span>
                <div className="gauge-value-display" style={{ color: spindleLoad > 75 ? '#dc2626' : (isRunning ? '#d97706' : '#64748b') }}>
                  {isRunning ? `${spindleLoad}%` : '0%'}
                </div>
                <span className="gauge-unit">TORQUE %</span>
              </div>
            </div>

            {/* Active Tool Info Bar */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, display: 'block' }}>
                  Active Spindle Tool
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 900, color: '#00646e' }}>
                    {currentTool?.toolNumber}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    {currentTool?.toolType}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontFamily: "'Consolas', monospace" }}>
                  {currentTool?.lengthOffset} • {currentTool?.diameterOffset}
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, display: 'block' }}>
                  Cycle ({(cycleProgress * 100).toFixed(0)}%)
                </span>
                <div style={{ fontFamily: "'Consolas', monospace", fontSize: '15px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                  {formatTime(elapsedSeconds)} / {formatTime(totalEstimatedSeconds)}
                </div>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, fontFamily: "'Consolas', monospace" }}>
                  Part {opState.partsCompleted + (status === 'COMPLETED' ? 0 : 1)} of {opState.targetQuantity || 50}
                </span>
              </div>
            </div>

            {/* G-code Stream */}
            <div className="gcode-stream-panel">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                <span style={{ fontFamily: "'Consolas', monospace", fontSize: '11px', fontWeight: 800, color: '#00646e' }}>
                  G-CODE EXECUTION STREAM
                </span>
                <span style={{ fontFamily: "'Consolas', monospace", fontSize: '10px', color: '#64748b' }}>
                  LINE {activeLineIdx + 1} / {gcodeList.length}
                </span>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', fontFamily: "'Consolas', monospace", fontSize: '11px', color: '#475569', lineHeight: 1.6 }} ref={gcodeBoxRef}>
                {gcodeList.map((line, idx) => (
                  <div 
                    key={idx} 
                    className={`gcode-line-row ${idx === activeLineIdx ? 'active' : ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: idx === activeLineIdx ? '#e6f7f8' : 'transparent',
                      color: idx === activeLineIdx ? '#00646e' : '#475569',
                      fontWeight: idx === activeLineIdx ? 800 : 400
                    }}
                  >
                    <span style={{ color: '#94a3b8', fontSize: '10px', minWidth: '28px' }}>N{String((idx + 1) * 10).padStart(4, '0')}</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="stage-viewport-footer">
        <div style={{ fontFamily: "'Consolas', monospace", fontSize: '12px', color: '#64748b' }}>
          INTERLOCKS: <span style={{ color: '#16a34a', fontWeight: 800 }}>DOOR LOCKED • AIR 6.2 BAR • LUBE OK</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {status === 'COMPLETED' ? (
            <button 
              type="button"
              className="hmi-btn hmi-btn-primary hmi-btn-lg"
              style={{ minWidth: '200px' }}
              onClick={handleRestartPart}
            >
              <RotateCcw size={16} />
              <span>Next Workpiece / Restart</span>
            </button>
          ) : isRunning ? (
            <button 
              type="button"
              className="hmi-btn hmi-btn-danger hmi-btn-lg"
              style={{ minWidth: '200px' }}
              onClick={handleStop}
            >
              <Pause size={18} />
              <span>FEED HOLD / STOP</span>
            </button>
          ) : (
            <button 
              type="button"
              className="hmi-btn hmi-btn-success hmi-btn-lg"
              style={{ minWidth: '220px' }}
              onClick={handleStart}
            >
              <Play size={18} fill="#ffffff" />
              <span>{status === 'STOPPED' ? 'RESUME CYCLE START' : 'CYCLE START (START OP)'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
