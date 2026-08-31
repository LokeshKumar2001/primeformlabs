import React from 'react';
import { X, History } from 'lucide-react';
import { soundFx } from '../audio/soundEffects';
import { useHmiStore } from '../store/useHmiStore';

export function AuditLogModal({ isOpen, onClose }) {
  const { machineState } = useHmiStore();
  if (!isOpen) return null;

  const logs = machineState?.auditLogs || [];

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'CYCLE_START':
        return { color: '#16a34a', bg: '#dcfce7', border: '#86efac' };
      case 'CYCLE_STOP':
        return { color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' };
      case 'CYCLE_COMPLETE':
        return { color: '#00646e', bg: '#e6f7f8', border: '#a5e9ec' };
      case 'READY_APPROVAL':
        return { color: '#00828a', bg: '#e6f7f8', border: '#a5e9ec' };
      case 'MACHINE_CHECK':
        return { color: '#0284c7', bg: '#e0f2fe', border: '#bae6fd' };
      case 'TOOL_VERIFICATION':
        return { color: '#7c3aed', bg: '#f3e8ff', border: '#ddd6fe' };
      case 'WORKPIECE_SETUP':
        return { color: '#d97706', bg: '#fef3c7', border: '#fde68a' };
      default:
        return { color: '#475569', bg: '#f1f5f9', border: '#cbd5e1' };
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          maxWidth: '820px',
          width: '100%',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1.5px solid #cbd5e1'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          backgroundColor: '#ffffff',
          borderBottom: '2.5px solid #00646e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#0f172a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: 800 }}>
            <History size={20} color="#00646e" />
            <span>OPERATOR AUDIT TRAIL & SYSTEM LOGS</span>
          </div>
          <button 
            type="button"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            onClick={() => { soundFx.playClick(); onClose(); }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{
          padding: '20px 24px',
          overflowY: 'auto',
          flex: 1,
          backgroundColor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#64748b', fontFamily: 'monospace' }}>
              No audit records logged in this session yet.
            </div>
          ) : (
            logs.map((log) => {
              const badge = getBadgeStyle(log.type);
              const logTime = new Date(log.timestamp).toLocaleTimeString();

              return (
                <div 
                  key={log.id} 
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '14px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontFamily: 'monospace',
                        fontSize: '9px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        color: badge.color,
                        backgroundColor: badge.bg,
                        border: `1px solid ${badge.border}`
                      }}>
                        {log.type}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                        {log.action}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#475569' }}>
                      {log.details}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 800, color: '#00646e' }}>
                      {logTime}
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#94a3b8' }}>
                      {log.operator}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button 
            type="button"
            className="hmi-btn hmi-btn-primary"
            style={{ padding: '8px 24px', borderRadius: '10px', fontWeight: 800 }}
            onClick={() => { soundFx.playClick(); onClose(); }}
          >
            Close Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
}
