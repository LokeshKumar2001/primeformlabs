import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Wrench, 
  Box, 
  Eye, 
  Play, 
  FileText, 
  History, 
  ChevronLeft, 
  ChevronRight, 
  Cpu, 
  Check 
} from 'lucide-react';
import { useHmiStore } from '../store/useHmiStore';
import { soundFx } from '../audio/soundEffects';

export function SidebarNav() {
  const { 
    machineState, 
    setStage, 
    setShowSpecsModal, 
    setShowAuditModal 
  } = useHmiStore();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentStageIndex = machineState?.currentStageIndex || 1;
  const stages = machineState?.stages || [];

  const navItems = [
    { stage: 1, label: 'Machine Checks', shortLabel: 'Checks', icon: ShieldCheck, title: 'Stage 1: Machine Safety Checks' },
    { stage: 2, label: 'Required Tools', shortLabel: 'Tools', icon: Wrench, title: 'Stage 2: Required Tools & Magazine' },
    { stage: 3, label: 'Workpiece Setup', shortLabel: 'Workpiece', icon: Box, title: 'Stage 3: Workpiece Clamping & G54' },
    { stage: 4, label: 'Ready Review', shortLabel: 'Ready', icon: Eye, title: 'Stage 4: Master Readiness Review' },
    { stage: 5, label: 'Live Operation', shortLabel: 'Operate', icon: Play, title: 'Stage 5: Live CNC Machining Operation' }
  ];

  const handleStageClick = (targetStage) => {
    let isLocked = false;
    for (let i = 1; i < targetStage; i++) {
      if (!stages[i - 1]?.isComplete) {
        isLocked = true;
        break;
      }
    }

    if (!isLocked || targetStage <= currentStageIndex) {
      soundFx.playClick();
      setStage(targetStage);
    } else {
      soundFx.playStopAlarm();
    }
  };

  const toggleCollapse = () => {
    soundFx.playClick();
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside 
      className={`sidebar-nav-dock ${isCollapsed ? 'collapsed' : 'expanded'}`}
      style={{
        backgroundColor: '#ffffff',
        borderRight: '1.5px solid #cbd5e1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '14px 8px',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.04)',
        zIndex: 50,
        boxSizing: 'border-box'
      }}
    >
      {/* Top Section: Header with Toggle Button */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: '0 4px'
        }}>
          {!isCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '7px',
                backgroundColor: '#e6f7f8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #bcecef'
              }}>
                <Cpu size={16} color="#00646e" />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.5px' }}>
                CNC STAGES
              </span>
            </div>
          )}

          {/* Toggle Close / Open Icon Button */}
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand Sidebar" : "Close / Collapse Sidebar"}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {isCollapsed ? <ChevronRight size={16} color="#00646e" /> : <ChevronLeft size={16} color="#475569" />}
          </button>
        </div>

        <div style={{ height: '1px', backgroundColor: '#e2e8f0', width: '100%' }} />

        {/* Navigation Stage Items */}
        <div className="sidebar-nav-items-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
          {navItems.map((item) => {
            const isActive = item.stage === currentStageIndex;
            const isComplete = stages[item.stage - 1]?.isComplete;
            const Icon = item.icon;

            return (
              <button
                key={item.stage}
                type="button"
                onClick={() => handleStageClick(item.stage)}
                title={item.title}
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: isActive ? '#00646e' : (isComplete ? '#f0fdf4' : '#ffffff'),
                  border: isActive ? '1.5px solid #004d55' : (isComplete ? '1px solid #86efac' : '1px solid #cbd5e1'),
                  color: isActive ? '#ffffff' : (isComplete ? '#15803d' : '#475569'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  padding: isCollapsed ? '0' : '0 10px',
                  gap: '8px',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  boxShadow: isActive ? '0 3px 8px rgba(0, 100, 110, 0.3)' : '0 1px 2px rgba(0,0,0,0.03)'
                }}
              >
                {/* Active Bar Indicator */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '20%',
                    bottom: '20%',
                    width: '3px',
                    backgroundColor: '#00cad5',
                    borderRadius: '0 3px 3px 0'
                  }} />
                )}

                <Icon 
                  size={17} 
                  color={isActive ? '#ffffff' : (isComplete ? '#16a34a' : '#64748b')} 
                  style={{ flexShrink: 0 }}
                />

                {!isCollapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', flex: 1, overflow: 'hidden' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: isActive ? '#ffffff' : (isComplete ? '#15803d' : '#1e293b'),
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden'
                    }}>
                      {item.label}
                    </span>
                    <span style={{
                      fontSize: '8px',
                      color: isActive ? '#a8e5ea' : (isComplete ? '#16a34a' : '#64748b'),
                      fontWeight: 600
                    }}>
                      Stage 0{item.stage}
                    </span>
                  </div>
                )}

                {isComplete && (
                  <div style={{
                    width: isCollapsed ? '5px' : '15px',
                    height: isCollapsed ? '5px' : '15px',
                    borderRadius: '50%',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '8px',
                    flexShrink: 0,
                    marginLeft: 'auto'
                  }}>
                    {!isCollapsed && <Check size={9} strokeWidth={3} />}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Modals */}
      <div className="sidebar-bottom-actions" style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
        <div style={{ height: '1px', backgroundColor: '#e2e8f0', width: '100%', marginBottom: '2px' }} />

        {/* Specs Sheet Button */}
        <button
          type="button"
          onClick={() => { soundFx.playClick(); setShowSpecsModal(true); }}
          title="Job Sheet & CNC Program Specs"
          style={{
            width: '100%',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            padding: isCollapsed ? '0' : '0 10px',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
          }}
        >
          <FileText size={15} color="#0284c7" style={{ flexShrink: 0 }} />
          {!isCollapsed && <span style={{ fontSize: '11px', fontWeight: 700 }}>Job Specs</span>}
        </button>

        {/* Audit Log Button */}
        <button
          type="button"
          onClick={() => { soundFx.playClick(); setShowAuditModal(true); }}
          title="Operator Audit Trail"
          style={{
            width: '100%',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            padding: isCollapsed ? '0' : '0 10px',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
          }}
        >
          <History size={15} color="#7c3aed" style={{ flexShrink: 0 }} />
          {!isCollapsed && <span style={{ fontSize: '11px', fontWeight: 700 }}>Audit Trail</span>}
        </button>
      </div>
    </aside>
  );
}
