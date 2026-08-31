import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  FileText, 
  History, 
  AlertOctagon, 
  RotateCcw,
  Cpu,
  Clock,
  User,
  ArrowRightLeft
} from 'lucide-react';
import { soundFx } from '../audio/soundEffects';
import { useHmiStore } from '../store/useHmiStore';

export function HeaderBar() {
  const { 
    scenario, 
    operator,
    audioMuted, 
    toggleAudio, 
    setShowSpecsModal, 
    setShowAuditModal, 
    setShowProfileModal,
    resetSystem, 
    emergencyStop 
  } = useHmiStore();

  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleReset = () => {
    soundFx.playClick();
    if (window.confirm("CONFIRM RESTART: Reset all startup guidance and return to Stage 1 (Machine Checks)?")) {
      resetSystem();
    }
  };

  return (
    <header style={{
      height: '62px',
      backgroundColor: '#00646e',
      backgroundImage: 'linear-gradient(180deg, #007682 0%, #005a63 100%)',
      borderBottom: '2.5px solid #00454c',
      boxShadow: '0 2px 10px rgba(0, 100, 110, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      color: '#ffffff',
      fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
      boxSizing: 'border-box'
    }}>
      {/* Left: Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          padding: '6px 14px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <Cpu size={20} color="#00cad5" />
          <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '1px', color: '#ffffff' }}>
            PRIMEFORM
          </span>
          <span style={{
            fontFamily: "'Consolas', monospace",
            fontSize: '11px',
            fontWeight: 700,
            color: '#00646e',
            backgroundColor: '#ffffff',
            padding: '2px 8px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            VMC-850 PRO
          </span>
        </div>
      </div>

      {/* Center: Clean White Segmented Job Info Bar */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.18)',
          borderRadius: '30px',
          border: '1.5px solid rgba(255, 255, 255, 0.35)',
          padding: '4px 18px',
          gap: '14px',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '9px', fontWeight: 800, color: '#e6f7f8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Active Part
            </span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff' }}>
              {scenario?.workOrder?.partNumber || "AERO-FLG-7042"}
            </span>
          </div>

          <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255, 255, 255, 0.35)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '9px', fontWeight: 800, color: '#e6f7f8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Operation
            </span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff' }}>
              {scenario?.operation?.opNumber || "OP-10"}
            </span>
          </div>

          <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255, 255, 255, 0.35)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '9px', fontWeight: 800, color: '#e6f7f8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              CNC Program
            </span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff' }}>
              {scenario?.operation?.cncProgram?.programNumber || "O8842"}
            </span>
          </div>

          <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255, 255, 255, 0.35)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '9px', fontWeight: 800, color: '#e6f7f8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Batch
            </span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#bbf7d0' }}>
              {scenario?.workOrder?.quantity || 50} PCS
            </span>
          </div>
        </div>
      </div>

      {/* Right: Operator Profile & Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Operator Profile Pill */}
        <button
          type="button"
          onClick={() => { soundFx.playClick(); setShowProfileModal(true); }}
          title="Operator Profile, Shift Hours & Handover Sign-Off"
          style={{
            height: '36px',
            padding: '0 12px',
            borderRadius: '18px',
            backgroundColor: '#ffffff',
            border: '1.5px solid #cbd5e1',
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}
        >
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#00646e',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 900
          }}>
            {(operator?.name || 'JS').split(' ').map(n => n[0]).join('')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
              {operator?.name || 'Operator'}
            </span>
            <span style={{ fontSize: '9px', color: '#00646e', fontWeight: 700, marginTop: '2px', lineHeight: 1 }}>
              {(operator?.shiftName || 'Shift A').split(' ')[0]} ({operator?.shiftHoursElapsed || '00h 00m'})
            </span>
          </div>
          <ArrowRightLeft size={13} color="#00646e" style={{ marginLeft: '2px' }} />
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
          {audioMuted ? <VolumeX size={15} color="#64748b" /> : <Volume2 size={15} color="#00646e" />}
        </button>

        {/* Job Specs */}
        <button 
          type="button"
          onClick={() => { soundFx.playClick(); setShowSpecsModal(true); }}
          title="View Job Sheet & CNC Specifications"
          style={{
            height: '34px',
            padding: '0 10px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}
        >
          <FileText size={14} color="#0284c7" />
          <span>Specs</span>
        </button>

        {/* Audit Log */}
        <button 
          type="button"
          onClick={() => { soundFx.playClick(); setShowAuditModal(true); }}
          title="View Operator Action Audit Trail"
          style={{
            height: '34px',
            padding: '0 10px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}
        >
          <History size={14} color="#7c3aed" />
          <span>Audit</span>
        </button>

        {/* Reset */}
        <button 
          type="button"
          onClick={handleReset}
          title="Reset Machine Guidance Workflow"
          style={{
            height: '34px',
            padding: '0 10px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}
        >
          <RotateCcw size={14} color="#d97706" />
          <span>Reset</span>
        </button>

        {/* E-STOP Button */}
        <button 
          type="button"
          onClick={emergencyStop}
          title="Emergency Stop / Interlock Brake"
          style={{
            height: '34px',
            padding: '0 12px',
            borderRadius: '8px',
            backgroundColor: '#dc2626',
            backgroundImage: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)',
            border: '1px solid #991b1b',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(220, 38, 38, 0.35)'
          }}
        >
          <AlertOctagon size={15} />
          <span>E-STOP</span>
        </button>

        {/* Digital Time Badge */}
        <div style={{
          height: '34px',
          padding: '0 10px',
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.18)',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          color: '#ffffff',
          fontFamily: "'Consolas', monospace",
          fontSize: '11px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <Clock size={13} color="#00cad5" />
          <span>{time}</span>
        </div>
      </div>
    </header>
  );
}
