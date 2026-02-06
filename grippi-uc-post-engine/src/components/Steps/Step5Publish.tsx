import React from "react";
import { Stepper } from "../Stepper/Stepper";

interface Step5PublishProps {
  onPrev: () => void;
  onPublish: () => void;
  currentStep: number;
  isPublishing: boolean;
  publishError: string | null;
  publishSuccess: boolean;
}

export const Step5Publish: React.FC<Step5PublishProps> = ({
  onPrev,
  onPublish,
  currentStep,
  isPublishing,
  publishError,
  publishSuccess,
}) => {
  return (
    <section className="ucpe_panel ucpe_step-content ucpe_active" data-step="5">
      <Stepper
        currentStep={currentStep}
        totalSteps={5}
        onStepClick={() => {}}
      />

      <div className="ucpe_panel-header">
        <div>
          <p className="ucpe_eyebrow">Step 5 of 5</p>
          <h2>Review & Publish</h2>
        </div>
      </div>

      <fieldset className="ucpe_fieldset">
        <legend>Review & Publish</legend>

        <div className="ucpe_publish-container">
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            {isPublishing && (
              <>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
                <h3 style={{ color: "var(--text)", margin: "0 0 8px 0" }}>
                  Publishing Posts...
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "14px" }}>
                  Please wait while we publish your content to the selected
                  channels
                </p>
                <div
                  style={{
                    marginTop: "20px",
                    display: "inline-block",
                    width: "40px",
                    height: "40px",
                    border: "4px solid var(--border)",
                    borderTop: "4px solid var(--primary)",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
              </>
            )}

            {!isPublishing && !publishSuccess && !publishError && (
              <>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚀</div>
                <h3 style={{ color: "var(--text)", margin: "0 0 8px 0" }}>
                  Ready to Publish
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "14px" }}>
                  Click the button below to publish your posts to all selected
                  channels
                </p>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: "12px",
                    marginTop: "16px",
                    fontStyle: "italic",
                  }}
                >
                  Note: Currently in simulation mode. Check console for detailed
                  logs.
                </p>
              </>
            )}

            {publishSuccess && !isPublishing && (
              <>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
                <h3
                  style={{
                    color: "var(--success, #10b981)",
                    margin: "0 0 8px 0",
                  }}
                >
                  Published Successfully!
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "14px" }}>
                  Your posts have been published to all selected channels
                </p>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: "12px",
                    marginTop: "16px",
                  }}
                >
                  Check the browser console for detailed response information
                </p>
              </>
            )}

            {publishError && !isPublishing && (
              <>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>❌</div>
                <h3
                  style={{
                    color: "var(--error, #ef4444)",
                    margin: "0 0 8px 0",
                  }}
                >
                  Publishing Failed
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "14px" }}>
                  {publishError}
                </p>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: "12px",
                    marginTop: "16px",
                  }}
                >
                  Please try again or check the console for more details
                </p>
              </>
            )}
          </div>
        </div>
      </fieldset>

      <div className="ucpe_step-nav">
        <button
          type="button"
          className="ButtonMaterialDefault btn btn-default"
          onClick={onPrev}
          disabled={isPublishing}
        >
          Back
        </button>
        <button
          className="ButtonMaterial btn btn-primary"
          onClick={onPublish}
          disabled={isPublishing || publishSuccess}
        >
          {isPublishing
            ? "Publishing..."
            : publishSuccess
              ? "Published"
              : "Publish Posts"}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};
