import React from 'react';
import { Check, Lock, ShieldCheck, Wrench, Box, Eye, Play } from 'lucide-react';
import { soundFx } from '../audio/soundEffects';
import { useHmiStore } from '../store/useHmiStore';

const STAGE_ICONS = {
  1: ShieldCheck,
  2: Wrench,
  3: Box,
  4: Eye,
  5: Play
};

export function StageStepper() {
  const { machineState, setStage } = useHmiStore();
  const stages = machineState?.stages || [];
  const currentStageIndex = machineState?.currentStageIndex || 1;

  return (
    <div className="stepper-container">
      <div className="stepper-steps-wrapper">
        {stages.map((stage) => {
          const isActive = stage.index === currentStageIndex;
          const isCompleted = stage.isComplete;
          
          let isLocked = false;
          for (let i = 1; i < stage.index; i++) {
            if (!stages[i - 1]?.isComplete) {
              isLocked = true;
              break;
            }
          }

          const IconComponent = STAGE_ICONS[stage.index] || ShieldCheck;

          const handleClick = () => {
            if (!isLocked || stage.index <= currentStageIndex) {
              soundFx.playClick();
              setStage(stage.index);
            } else {
              soundFx.playStopAlarm();
            }
          };

          return (
            <div
              key={stage.key}
              className={`step-item-card ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
              onClick={handleClick}
            >
              <div className="step-num-badge">
                {isCompleted ? <Check size={14} strokeWidth={3} /> : (isLocked ? <Lock size={12} /> : stage.index)}
              </div>

              <div className="step-text-column">
                <span className="step-title">
                  {stage.index}. {stage.name}
                </span>
                <span className="step-status-sub">
                  {isActive 
                    ? 'Current Step' 
                    : isCompleted 
                      ? 'Verified & Ready' 
                      : isLocked 
                        ? 'Locked' 
                        : 'Pending Action'}
                </span>
              </div>

              <div style={{ marginLeft: 'auto' }}>
                <IconComponent 
                  size={16} 
                  color={isActive ? '#00646e' : (isCompleted ? '#16a34a' : (isLocked ? '#94a3b8' : '#64748b'))} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
