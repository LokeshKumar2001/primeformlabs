import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  RotateCcw, 
  AlertOctagon, 
  Volume2, 
  VolumeX, 
  Cpu, 
  Clock, 
  CheckCircle,
  Menu,
  X,
  User,
  ArrowRightLeft
} from 'lucide-react';
import { soundFx } from '../audio/soundEffects';
import { useHmiStore } from '../store/useHmiStore';

export function HeaderBar() {
  const { 
    scenario, 
    machineState, 
    audioMuted, 
    operator,
    toggleAudio, 
    setShowSpecsModal, 
    setShowAuditModal, 
    setShowProfileModal,
    resetSystem, 
    emergencyStop 
  } = useHmiStore();

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleReset = () => {
    if (window.confirm("CONFIRM RESTART: Reset all 5 startup guidance stages back to Stage 1?")) {
      soundFx.playStopAlarm();
      resetSystem();
    }
  };

  const handleEStop = () => {
    emergencyStop();
  };

  return (
    <header style={{
      minHeight: '62px',
      backgroundColor: '#00646e',
      backgroundImage: 'linear-gradient(180deg, #007682 0%, #005a63 100%)',
      borderBottom: '3px solid #00454c',
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      color: '#ffffff',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      flexWrap: 'wrap'
    }}>
      {/* Left: Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          padding: '6px 12px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <Cpu size={18} color="#00cad5" />
          <span style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '1px', color: '#ffffff' }}>
            PRIMEFORM
          </span>
          <span style={{
            fontFamily: "'Consolas', monospace",
            fontSize: '10px',
            fontWeight: 700,
            color: '#00646e',
            backgroundColor: '#ffffff',
            padding: '2px 6px',
            borderRadius: '10px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            VMC-850
          </span>
        </div>
      </div>

      {/* Center: Clean Segmented Job Info Bar */}
      <div className="header-job-bar" style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
        borderRadius: '30px',
        border: '1.5px solid rgba(255, 255, 255, 0.35)',
        padding: '3px 14px',
        gap: '12px',
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '8px', fontWeight: 800, color: '#e6f7f8', textTransform: 'uppercase' }}>
            Part
          </span>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#ffffff' }}>
            {scenario?.workOrder?.partNumber || "AERO-FLG-7042"}
          </span>
        </div>

        <div style={{ width: '1px', height: '18px', backgroundColor: 'rgba(255, 255, 255, 0.35)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '8px', fontWeight: 800, color: '#e6f7f8', textTransform: 'uppercase' }}>
            Op
          </span>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#ffffff' }}>
            {scenario?.operation?.opNumber || "OP-10"}
          </span>
        </div>

        <div style={{ width: '1px', height: '18px', backgroundColor: 'rgba(255, 255, 255, 0.35)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '8px', fontWeight: 800, color: '#e6f7f8', textTransform: 'uppercase' }}>
            Program
          </span>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#ffffff' }}>
            {scenario?.operation?.cncProgram?.programNumber || "O8842"}
          </span>
        </div>

        <div style={{ width: '1px', height: '18px', backgroundColor: 'rgba(255, 255, 255, 0.35)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '8px', fontWeight: 800, color: '#e6f7f8', textTransform: 'uppercase' }}>
            Batch
          </span>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#bbf7d0' }}>
            {scenario?.workOrder?.quantity || 50} PCS
          </span>
        </div>
      </div>

      {/* Right: Operator Profile & Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        {/* Operator Profile Pill */}
        <button
          type="button"
          onClick={() => { soundFx.playClick(); setShowProfileModal(true); }}
          title="Operator Profile, Shift Hours & Handover Sign-Off"
          style={{
            height: '34px',
            padding: '0 10px',
            borderRadius: '17px',
            backgroundColor: '#ffffff',
            border: '1.5px solid #cbd5e1',
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}
        >
          <div style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: '#00646e',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 900
          }}>
            {(operator?.name || 'JS').split(' ').map(n => n[0]).join('')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
              {operator?.name || 'Operator'}
            </span>
            <span style={{ fontSize: '8px', color: '#00646e', fontWeight: 700, marginTop: '2px', lineHeight: 1 }}>
              {(operator?.shiftName || 'Shift A').split(' ')[0]}
            </span>
          </div>
          <ArrowRightLeft size={12} color="#00646e" />
        </button>

        {/* Audio Toggle */}
        <button 
          type="button"
          onClick={toggleAudio}
          title={audioMuted ? "Unmute Audio" : "Mute Audio"}
          style={{
            height: '34px',
            width: '34px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}
        >
          {audioMuted ? <VolumeX size={14} color="#64748b" /> : <Volume2 size={14} color="#00646e" />}
        </button>

        {/* Job Specs */}
        <button 
          type="button"
          onClick={() => { soundFx.playClick(); setShowSpecsModal(true); }}
          title="Inspect Complete Drawing & Fixture Specifications"
          style={{
            height: '34px',
            padding: '0 10px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}
        >
          <FileText size={14} color="#00646e" />
          <span className="header-btn-text">Specs</span>
        </button>

        {/* Audit Log */}
        <button 
          type="button"
          onClick={() => { soundFx.playClick(); setShowAuditModal(true); }}
          title="View ISO Audit Trail & Check History"
          style={{
            height: '34px',
            padding: '0 10px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}
        >
          <CheckCircle size={14} color="#16a34a" />
          <span className="header-btn-text">Audit</span>
        </button>

        {/* Reset System */}
        <button 
          type="button"
          onClick={handleReset}
          title="Reset All Startup Guidance Stages to Stage 1"
          style={{
            height: '34px',
            padding: '0 10px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}
        >
          <RotateCcw size={14} color="#475569" />
          <span className="header-btn-text">Reset</span>
        </button>

        {/* Emergency Stop */}
        <button 
          type="button"
          onClick={handleEStop}
          title="EMERGENCY STOP: Immediate Spindle & Axis Interlock Halt"
          style={{
            height: '34px',
            padding: '0 12px',
            borderRadius: '8px',
            backgroundColor: '#dc2626',
            backgroundImage: 'linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)',
            border: '1px solid #991b1b',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.35)'
          }}
        >
          <AlertOctagon size={14} color="#ffffff" />
          <span>E-STOP</span>
        </button>

        {/* Clock */}
        <div className="header-clock-box" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontFamily: "'Consolas', monospace",
          fontSize: '12px',
          fontWeight: 800,
          color: '#00cad5',
          backgroundColor: '#00383e',
          padding: '6px 10px',
          borderRadius: '8px',
          border: '1px solid #005a63'
        }}>
          <Clock size={12} />
          <span>{currentTime}</span>
        </div>
      </div>
    </header>
  );
}
