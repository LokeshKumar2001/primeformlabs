import React, { useEffect } from 'react';
import { useHmiStore } from './store/useHmiStore';
import { HeaderBar } from './components/HeaderBar';
import { SidebarNav } from './components/SidebarNav';
import { StageStepper } from './components/StageStepper';
import { MachineChecks } from './components/MachineChecks';
import { RequiredTools } from './components/RequiredTools';
import { WorkpieceSetup } from './components/WorkpieceSetup';
import { ReadyReview } from './components/ReadyReview';
import { OperationView } from './components/OperationView';
import { ScenarioInfoModal } from './components/ScenarioInfoModal';
import { AuditLogModal } from './components/AuditLogModal';
import { OperatorProfileModal } from './components/OperatorProfileModal';
import { OperatorLoginScreen } from './components/OperatorLoginScreen';

export function App() {
  const {
    machineState,
    loading,
    errorMessage,
    showSpecsModal,
    showAuditModal,
    showProfileModal,
    isLoggedIn,
    fetchInitialData,
    setErrorMessage,
    setShowSpecsModal,
    setShowAuditModal,
    setShowProfileModal
  } = useHmiStore();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center text-[#00646e] font-sans">
        <div className="led-indicator led-cyan pulse w-8 h-8 mb-4" />
        <h2 className="text-lg tracking-wider uppercase font-bold text-slate-800">Initializing Primeform VMC-850 HMI System...</h2>
        <p className="text-slate-500 text-sm mt-1">Establishing link with CNC controller and telemetry sensors...</p>
      </div>
    );
  }

  // If not logged in, render the Operator Power-On Login Lock Screen
  if (!isLoggedIn) {
    return <OperatorLoginScreen />;
  }

  const currentStage = machineState?.currentStageIndex || 1;

  return (
    <div className="hmi-app-root">
      {/* Top Siemens Sinumerik Header */}
      <HeaderBar />

      {/* Error / Alert banner */}
      {errorMessage && (
        <div style={{
          background: '#dc2626',
          color: '#ffffff',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 'bold',
          fontSize: '14px',
          zIndex: 150
        }}>
          <span>{errorMessage}</span>
          <button 
            onClick={() => setErrorMessage(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: 900,
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Console Layout with Left Sidebar & Main Viewport */}
      <div className="hmi-main-body-container">
        {/* Left CNC Sidebar */}
        <SidebarNav />

        {/* Main Center Content Area */}
        <main className="hmi-main-content">
          {/* 5-Stage Stepper Navigation */}
          <StageStepper />

          {/* Stage 1: Machine Checks */}
          {currentStage === 1 && <MachineChecks />}

          {/* Stage 2: Required Tools */}
          {currentStage === 2 && <RequiredTools />}

          {/* Stage 3: Workpiece Setup */}
          {currentStage === 3 && <WorkpieceSetup />}

          {/* Stage 4: Ready Review */}
          {currentStage === 4 && <ReadyReview />}

          {/* Stage 5: Operation Simulation */}
          {currentStage === 5 && <OperationView />}
        </main>
      </div>

      {/* Modals */}
      <ScenarioInfoModal 
        isOpen={showSpecsModal}
        onClose={() => setShowSpecsModal(false)}
      />

      <AuditLogModal 
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
      />

      <OperatorProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
}
