import React, { useState } from 'react';
import { 
  X, 
  User, 
  Clock, 
  Award, 
  ArrowRightLeft, 
  CheckCircle2, 
  FileText, 
  History, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { useHmiStore } from '../store/useHmiStore';
import { soundFx } from '../audio/soundEffects';

export function OperatorProfileModal({ isOpen, onClose }) {
  const { operator, submitShiftHandover } = useHmiStore();
  
  const [nextOperatorName, setNextOperatorName] = useState("R. Patel");
  const [nextOperatorId, setNextOperatorId] = useState("OP-712");
  const [nextShiftName, setNextShiftName] = useState("Shift B (Afternoon 14:00 - 22:00)");
  const [handoverNotes, setHandoverNotes] = useState(
    "All machine pre-checks verified. Tool T01 facing inserts OK, G54 datum probed. 36 pcs remaining for Batch LOT-PF-2026-088."
  );

  const [checklist, setChecklist] = useState({
    toolsInspected: true,
    coolantChecked: true,
    fixtureClean: true,
    chipsCleared: true
  });

  if (!isOpen) return null;

  const handleToggleCheck = (key) => {
    soundFx.playConfirm();
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleHandoverSubmit = (e) => {
    e.preventDefault();
    if (!nextOperatorName || !nextOperatorId) {
      alert("Please specify the incoming operator.");
      return;
    }
    submitShiftHandover({
      nextOperatorName,
      nextOperatorId,
      nextShiftName,
      notes: handoverNotes
    });
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
          maxWidth: '840px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1.5px solid #cbd5e1',
          fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
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
            <User size={20} color="#00646e" />
            <span>OPERATOR PROFILE & SHIFT HANDOVER</span>
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

        {/* Modal Body */}
        <div style={{
          padding: '20px 24px',
          overflowY: 'auto',
          flex: 1,
          backgroundColor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          {/* Active Operator Card */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: '12px',
            padding: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: '#00646e',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 900,
                border: '2px solid #00a2ac',
                boxShadow: '0 2px 8px rgba(0, 100, 110, 0.3)'
              }}>
                {operator.name.split(' ').map(n => n[0]).join('')}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {operator.name}
                  </h3>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: '#e6f7f8',
                    color: '#00646e',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    border: '1px solid #bcecef'
                  }}>
                    {operator.id}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: '#dcfce7',
                    color: '#16a34a',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    border: '1px solid #86efac'
                  }}>
                    LOGGED IN
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                  {operator.role} • {operator.qualification}
                </span>
              </div>
            </div>

            {/* Shift Metrics */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ backgroundColor: '#f1f5f9', padding: '8px 14px', borderRadius: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>ACTIVE SHIFT</span>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#00646e', marginTop: '2px' }}>{operator.shiftName}</div>
              </div>

              <div style={{ backgroundColor: '#f1f5f9', padding: '8px 14px', borderRadius: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>SHIFT TIME</span>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{operator.shiftHoursElapsed} / {operator.shiftHoursTotal}h</div>
              </div>

              <div style={{ backgroundColor: '#f1f5f9', padding: '8px 14px', borderRadius: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>OEE EFFICIENCY</span>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#16a34a', marginTop: '2px' }}>{operator.shiftEfficiency}</div>
              </div>
            </div>
          </div>

          {/* Shift Handover Form Card */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: '12px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1.5px solid #e2e8f0', pb: '10px', paddingBottom: '8px' }}>
              <ArrowRightLeft size={18} color="#00646e" />
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#00646e', textTransform: 'uppercase', margin: 0 }}>
                Initiate Shift Handover & Log Sign-Off
              </h4>
            </div>

            <form onSubmit={handleHandoverSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Incoming Operator Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Relieving Operator Name
                  </label>
                  <input 
                    type="text"
                    value={nextOperatorName}
                    onChange={(e) => setNextOperatorName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0f172a',
                      backgroundColor: '#f8fafc',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Relieving Operator Badge ID
                  </label>
                  <input 
                    type="text"
                    value={nextOperatorId}
                    onChange={(e) => setNextOperatorId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0f172a',
                      backgroundColor: '#f8fafc',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Upcoming Shift Designation
                  </label>
                  <input 
                    type="text"
                    value={nextShiftName}
                    onChange={(e) => setNextShiftName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0f172a',
                      backgroundColor: '#f8fafc',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>
              </div>

              {/* Handover Safety Checklist */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Mandatory Shop-Floor Handover Inspection Checklist
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
                  <div 
                    onClick={() => handleToggleCheck('toolsInspected')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: checklist.toolsInspected ? '#f0fdf4' : '#f8fafc',
                      border: `1px solid ${checklist.toolsInspected ? '#86efac' : '#cbd5e1'}`,
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: checklist.toolsInspected ? '#15803d' : '#475569'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      backgroundColor: checklist.toolsInspected ? '#16a34a' : '#cbd5e1',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {checklist.toolsInspected && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span>Tool wear & insert integrity checked</span>
                  </div>

                  <div 
                    onClick={() => handleToggleCheck('coolantChecked')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: checklist.coolantChecked ? '#f0fdf4' : '#f8fafc',
                      border: `1px solid ${checklist.coolantChecked ? '#86efac' : '#cbd5e1'}`,
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: checklist.coolantChecked ? '#15803d' : '#475569'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      backgroundColor: checklist.coolantChecked ? '#16a34a' : '#cbd5e1',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {checklist.coolantChecked && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span>Coolant (8.5%) &amp; lube (&gt;80%) ready</span>
                  </div>

                  <div 
                    onClick={() => handleToggleCheck('fixtureClean')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: checklist.fixtureClean ? '#f0fdf4' : '#f8fafc',
                      border: `1px solid ${checklist.fixtureClean ? '#86efac' : '#cbd5e1'}`,
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: checklist.fixtureClean ? '#15803d' : '#475569'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      backgroundColor: checklist.fixtureClean ? '#16a34a' : '#cbd5e1',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {checklist.fixtureClean && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span>Kurt vise torque (45 Nm) & G54 datum OK</span>
                  </div>

                  <div 
                    onClick={() => handleToggleCheck('chipsCleared')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: checklist.chipsCleared ? '#f0fdf4' : '#f8fafc',
                      border: `1px solid ${checklist.chipsCleared ? '#86efac' : '#cbd5e1'}`,
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: checklist.chipsCleared ? '#15803d' : '#475569'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      backgroundColor: checklist.chipsCleared ? '#16a34a' : '#cbd5e1',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {checklist.chipsCleared && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span>Enclosure chips scraped & bin emptied</span>
                  </div>
                </div>
              </div>

              {/* Handover Notes Textarea */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Handover Remarks & Machine Condition Notes
                </label>
                <textarea 
                  rows={3}
                  value={handoverNotes}
                  onChange={(e) => setHandoverNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                    color: '#1e293b',
                    backgroundColor: '#f8fafc',
                    fontFamily: "Arial, sans-serif",
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                  required
                />
              </div>

              {/* Sign & Complete Handover Action */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button 
                  type="submit"
                  className="hmi-btn hmi-btn-primary"
                  style={{ padding: '10px 24px', borderRadius: '10px', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <ArrowRightLeft size={16} />
                  <span>Sign & Complete Shift Handover</span>
                </button>
              </div>
            </form>
          </div>

          {/* Previous Handover History */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <History size={15} color="#00646e" />
              <span>Shift Handover Log History</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {operator.handoverHistory.map((h) => (
                <div 
                  key={h.id}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#00646e' }}>
                      {h.from} ➔ {h.to}
                    </span>
                    <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#64748b' }}>
                      {h.time}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#334155' }}>
                    {h.notes}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '12px 24px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button 
            type="button"
            className="hmi-btn hmi-btn-secondary"
            style={{ padding: '8px 20px', borderRadius: '10px', fontWeight: 700 }}
            onClick={() => { soundFx.playClick(); onClose(); }}
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
