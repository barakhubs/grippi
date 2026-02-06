import React from "react";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

const stepLabels = ["Base", "Visuals", "Channels", "Review", "Publish"];

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  totalSteps,
  onStepClick,
}) => {
  return (
    <div className="ucpe_nav-panel">
      <nav className="ucpe_stepper-nav" aria-label="Navigation">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <div
              key={step}
              className={`ucpe_stepper-item ${isActive ? "ucpe_active" : ""} ${isCompleted ? "ucpe_completed" : ""}`}
              data-step={step}
              onClick={() => onStepClick(step)}
            >
              <div className="ucpe_stepper-circle">{step}</div>
              <div className="ucpe_stepper-label">{stepLabels[step - 1]}</div>
            </div>
          );
        })}
      </nav>  
    </div>
  );
};
 
