import React, { useState } from 'react';
import { Cpu, User, KeyRound, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useHmiStore, DEMO_OPERATORS } from '../store/useHmiStore';
import { soundFx } from '../audio/soundEffects';

export function OperatorLoginScreen() {
  const { login } = useHmiStore();
  const [selectedBadgeId, setSelectedBadgeId] = useState(DEMO_OPERATORS[0].id);
  const [pin, setPin] = useState("1234");
  const [errorMsg, setErrorMsg] = useState("");

  const activeOp = DEMO_OPERATORS.find(o => o.id === selectedBadgeId) || DEMO_OPERATORS[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    const res = login(selectedBadgeId, pin);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const handleQuickLogin = (op) => {
    setSelectedBadgeId(op.id);
    setPin(op.pin);
    soundFx.playClick();
    login(op.id, op.pin);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif"
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid #cbd5e1',
        borderRadius: '20px',
        maxWidth: '520px',
        width: '100%',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.12)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#00646e',
          backgroundImage: 'linear-gradient(180deg, #007682 0%, #005a63 100%)',
          borderBottom: '3px solid #00454c',
          padding: '24px',
          color: '#ffffff',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '1.5px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            <Cpu size={28} color="#00cad5" />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '1px', margin: 0 }}>
            PRIMEFORM VMC-850 PRO
          </h1>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#00646e',
            backgroundColor: '#ffffff',
            padding: '3px 12px',
            borderRadius: '12px'
          }}>
            OPERATOR HMI STARTUP ACCESS
          </span>
        </div>

        {/* Body Form */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {errorMsg && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#dc2626',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Operator Selection */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Select Authorized Operator
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedBadgeId}
                  onChange={(e) => { setSelectedBadgeId(e.target.value); setErrorMsg(""); }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#0f172a',
                    backgroundColor: '#f8fafc',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  {DEMO_OPERATORS.map((op) => (
                    <option key={op.id} value={op.id}>
                      {op.id} — {op.name} ({op.role.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Operator Badge Info Box */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#00646e',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 900
                }}>
                  {activeOp.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{activeOp.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{activeOp.shiftName}</div>
                </div>
              </div>
              <span style={{
                fontFamily: "'Consolas', monospace",
                fontSize: '11px',
                fontWeight: 700,
                color: '#16a34a',
                backgroundColor: '#dcfce7',
                padding: '2px 8px',
                borderRadius: '6px',
                border: '1px solid #86efac'
              }}>
                AUTHORIZED
              </span>
            </div>

            {/* PIN Input */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Security PIN Code (Demo PIN: 1234)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  maxLength={6}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '15px',
                    fontWeight: 800,
                    letterSpacing: '4px',
                    color: '#0f172a',
                    backgroundColor: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>
            </div>

            {/* Login Submit Button */}
            <button
              type="submit"
              className="hmi-btn hmi-btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '6px'
              }}
            >
              <span>Power On &amp; Launch HMI</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Reviewer Demo Credentials Bar */}
          <div style={{
            borderTop: '1px solid #e2e8f0',
            paddingTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              1-Click Demo Login for Reviewers:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {DEMO_OPERATORS.map((op) => (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => handleQuickLogin(op)}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#f8fafc',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#00646e',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  <span>{op.name}</span>
                  <span style={{ fontSize: '9px', color: '#64748b' }}>({op.id})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
