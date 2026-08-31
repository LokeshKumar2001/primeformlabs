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
  ArrowRightLeft
} from 'lucide-react';
import { soundFx } from '../audio/soundEffects';
import { useHmiStore } from '../store/useHmiStore';

export function HeaderBar() {
  const { 
    scenario, 
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
      height: '64px',
      minHeight: '64px',
      backgroundColor: '#00646e',
      backgroundImage: 'linear-gradient(180deg, #007682 0%, #00565f 100%)',
      borderBottom: '3px solid #00454c',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      color: '#ffffff',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.12)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxSizing: 'border-box'
    }}>
      {/* 1. Left: Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(0, 45, 50, 0.45)',
          padding: '6px 14px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          whiteSpace: 'nowrap'
        }}>
          <Cpu size={18} color="#00cad5" />
          <span style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '1px', color: '#ffffff' }}>
            PRIMEFORM
          </span>
          <span style={{
            fontFamily: "'Consolas', monospace",
            fontSize: '11px',
            fontWeight: 800,
            color: '#00646e',
            backgroundColor: '#ffffff',
            padding: '2px 8px',
            borderRadius: '6px',
            whiteSpace: 'nowrap'
          }}>
            VMC-850 PRO
          </span>
        </div>
      </div>

      {/* 2. Center: Low-Profile Horizontal Job Status Capsule */}
      <div className="header-job-bar" style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 45, 50, 0.45)',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        padding: '6px 16px',
        gap: '16px',
        whiteSpace: 'nowrap',
        flexShrink: 1
      }}>
        {/* Part */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#a5f3fc', textTransform: 'uppercase' }}>
            PART:
          </span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff', fontFamily: "'Consolas', monospace" }}>
            {scenario?.workOrder?.partNumber || "AERO-FLG-7042"}
          </span>
        </div>

        <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />

        {/* Operation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#a5f3fc', textTransform: 'uppercase' }}>
            OP:
          </span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff' }}>
            {scenario?.operation?.opNumber || "OP-10"}
          </span>
        </div>

        <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />

        {/* CNC Program */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#a5f3fc', textTransform: 'uppercase' }}>
            PROG:
          </span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff', fontFamily: "'Consolas', monospace" }}>
            {scenario?.operation?.cncProgram?.programNumber || "O8842"}
          </span>
        </div>

        <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />

        {/* Batch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#a5f3fc', textTransform: 'uppercase' }}>
            BATCH:
          </span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#86efac', fontFamily: "'Consolas', monospace" }}>
            {scenario?.workOrder?.quantity || 50} PCS
          </span>
        </div>
      </div>

      {/* 3. Right: Operator Profile, Actions & Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Operator Profile Pill */}
        <button
          type="button"
          onClick={() => { soundFx.playClick(); setShowProfileModal(true); }}
          title="Operator Profile, Shift Hours & Handover Sign-Off"
          style={{
            height: '38px',
            padding: '0 12px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: '1.5px solid #cbd5e1',
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            whiteSpace: 'nowrap'
          }}
        >
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            backgroundColor: '#00646e',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 900,
            flexShrink: 0
          }}>
            {(operator?.name || 'JS').split(' ').map(n => n[0]).join('')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', lineHeight: 1.15 }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>
              {operator?.name || 'J. Sharma'}
            </span>
            <span style={{ fontSize: '10px', color: '#00646e', fontWeight: 700 }}>
              {(operator?.shiftName || 'Shift A').split(' ')[0]} ({operator?.shiftHoursElapsed || '06h 48m'})
            </span>
          </div>
          <ArrowRightLeft size={13} color="#00646e" style={{ marginLeft: '4px' }} />
        </button>

        {/* Audio Toggle */}
        <button 
          type="button"
          onClick={toggleAudio}
          title={audioMuted ? "Unmute Audio" : "Mute Audio"}
          style={{
            height: '38px',
            width: '38px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: '1.5px solid #cbd5e1',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}
        >
          {audioMuted ? <VolumeX size={16} color="#64748b" /> : <Volume2 size={16} color="#00646e" />}
        </button>

        {/* Specs Sheet */}
        <button 
          type="button"
          onClick={() => { soundFx.playClick(); setShowSpecsModal(true); }}
          title="Inspect Complete Drawing & Fixture Specifications"
          style={{
            height: '38px',
            padding: '0 12px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: '1.5px solid #cbd5e1',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            whiteSpace: 'nowrap'
          }}
        >
          <FileText size={15} color="#00646e" />
          <span className="header-btn-text">Specs</span>
        </button>

        {/* Audit Log */}
        <button 
          type="button"
          onClick={() => { soundFx.playClick(); setShowAuditModal(true); }}
          title="View ISO Audit Trail & Check History"
          style={{
            height: '38px',
            padding: '0 12px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: '1.5px solid #cbd5e1',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            whiteSpace: 'nowrap'
          }}
        >
          <CheckCircle size={15} color="#16a34a" />
          <span className="header-btn-text">Audit</span>
        </button>

        {/* Reset System */}
        <button 
          type="button"
          onClick={handleReset}
          title="Reset All Startup Guidance Stages to Stage 1"
          style={{
            height: '38px',
            padding: '0 12px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: '1.5px solid #cbd5e1',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            whiteSpace: 'nowrap'
          }}
        >
          <RotateCcw size={15} color="#475569" />
          <span className="header-btn-text">Reset</span>
        </button>

        {/* Emergency Stop */}
        <button 
          type="button"
          onClick={handleEStop}
          title="EMERGENCY STOP: Immediate Spindle & Axis Interlock Halt"
          style={{
            height: '38px',
            padding: '0 14px',
            borderRadius: '10px',
            backgroundColor: '#dc2626',
            backgroundImage: 'linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)',
            border: '1.5px solid #991b1b',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.35)',
            whiteSpace: 'nowrap'
          }}
        >
          <AlertOctagon size={16} color="#ffffff" />
          <span>E-STOP</span>
        </button>

        {/* Clock */}
        <div className="header-clock-box" style={{
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: "'Consolas', monospace",
          fontSize: '13px',
          fontWeight: 800,
          color: '#00cad5',
          backgroundColor: '#002f35',
          padding: '0 12px',
          borderRadius: '10px',
          border: '1px solid #005a63',
          boxSizing: 'border-box',
          whiteSpace: 'nowrap'
        }}>
          <Clock size={13} />
          <span>{currentTime}</span>
        </div>
      </div>
    </header>
  );
}
