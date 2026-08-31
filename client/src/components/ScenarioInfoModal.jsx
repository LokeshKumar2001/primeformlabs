import React from 'react';
import { X, FileText, CheckCircle2, Cpu } from 'lucide-react';
import { soundFx } from '../audio/soundEffects';
import { useHmiStore } from '../store/useHmiStore';

export function ScenarioInfoModal({ isOpen, onClose }) {
  const { scenario } = useHmiStore();
  if (!isOpen) return null;

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
          maxWidth: '740px',
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
            <FileText size={20} color="#00646e" />
            <span>JOB SPECIFICATION & CNC WORK ORDER</span>
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
              cursor: 'pointer',
              transition: 'background 0.2s'
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
          gap: '16px'
        }}>
          {/* Top 4 KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px'
          }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>WORK ORDER</span>
              <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 800, color: '#00646e', marginTop: '2px' }}>
                {scenario?.workOrder?.orderNumber}
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>PART NUMBER</span>
              <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginTop: '2px' }}>
                {scenario?.workOrder?.partNumber}
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>TARGET BATCH</span>
              <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 800, color: '#16a34a', marginTop: '2px' }}>
                {scenario?.workOrder?.quantity} Units ({scenario?.workOrder?.batchNumber})
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>OPERATOR</span>
              <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 800, color: '#d97706', marginTop: '2px' }}>
                {scenario?.workOrder?.operatorId}
              </div>
            </div>
          </div>

          {/* 2 Middle Spec Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '14px'
          }}>
            {/* Material Card */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#00646e', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                Material & Drawing Spec
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Specification:</span>
                  <strong>{scenario?.operation?.material?.specification}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Billet Dimensions:</span>
                  <strong>{scenario?.operation?.material?.dimensions}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Hardness:</span>
                  <strong>{scenario?.operation?.material?.hardness}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Drawing Revision:</span>
                  <strong style={{ color: '#d97706' }}>{scenario?.operation?.material?.drawingRevision}</strong>
                </div>
              </div>
            </div>

            {/* Program Card */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#00646e', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                CNC Program Details
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Program Number:</span>
                  <strong>{scenario?.operation?.cncProgram?.programNumber}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>NC File:</span>
                  <strong>{scenario?.operation?.cncProgram?.fileName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Program Rev:</span>
                  <strong style={{ color: '#00646e' }}>{scenario?.operation?.cncProgram?.revision}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Checksum:</span>
                  <strong style={{ color: '#16a34a', fontFamily: 'monospace' }}>{scenario?.operation?.cncProgram?.checksum}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Work Coordinate Datum G54 */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#00646e', textTransform: 'uppercase', marginBottom: '4px' }}>
              Work Coordinate System ({scenario?.operation?.workOffset?.coordinateSystem})
            </h4>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
              {scenario?.operation?.workOffset?.datumDescription}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
              <div style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', fontWeight: 700 }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>X</span>
                {scenario?.operation?.workOffset?.values?.x?.toFixed(3)} mm
              </div>
              <div style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', fontWeight: 700 }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Y</span>
                {scenario?.operation?.workOffset?.values?.y?.toFixed(3)} mm
              </div>
              <div style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', fontWeight: 700 }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Z</span>
                {scenario?.operation?.workOffset?.values?.z?.toFixed(3)} mm
              </div>
              <div style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', fontWeight: 700 }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>B</span>
                {scenario?.operation?.workOffset?.values?.b?.toFixed(3)}°
              </div>
            </div>
          </div>
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
            Close Sheet
          </button>
        </div>
      </div>
    </div>
  );
}
