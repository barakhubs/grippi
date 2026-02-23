import React from "react";
import { Stepper } from "../Stepper/Stepper";

interface PlatformStatus {
  Id: string;
  Name: string;
  Status: boolean;
  Message: string;
  Response: string;
}

interface PublishResponseData {
  postId: string;
  postTitle: string;
  postBaseContent: string;
  postStatus: string;
  postWorkflowStage: string;
  SocialPlatformPostStatus: PlatformStatus[];
}

interface Step5PublishProps {
  onPrev: () => void;
  onPublish: () => void;
  currentStep: number;
  isPublishing: boolean;
  publishError: string | null;
  publishSuccess: boolean;
  publishResponse?: {
    success: boolean;
    message: string;
    data: string;
  };
}

export const Step5Publish: React.FC<Step5PublishProps> = ({
  onPrev,
  onPublish,
  currentStep,
  isPublishing,
  publishError,
  publishSuccess,
  publishResponse,
}) => {
  // Parse the response data
  let platformStatuses: PlatformStatus[] = [];
  let hasFailures = false;
  let hasSuccesses = false;

  if (publishResponse?.data) {
    try {
      const parsedData: PublishResponseData = JSON.parse(publishResponse.data);
      platformStatuses = parsedData.SocialPlatformPostStatus || [];
      hasFailures = platformStatuses.some((p) => !p.Status);
      hasSuccesses = platformStatuses.some((p) => p.Status);
    } catch (e) {
      console.error("Failed to parse publish response:", e);
    }
  }

  // // Platform icon mapping
  // const getPlatformIcon = (platformName: string): string => {
  //   const name = platformName.toLowerCase();
  //   if (name.includes("facebook")) return "📘";
  //   if (name.includes("instagram")) return "📷";
  //   if (name.includes("x") || name.includes("twitter")) return "🐦";
  //   if (name.includes("linkedin")) return "💼";
  //   if (name.includes("tiktok")) return "🎵";
  //   if (name.includes("youtube")) return "📹";
  //   if (name.includes("snapchat")) return "👻";
  //   return "📱";
  // };

  return (
    <section className="ucpe_panel ucpe_step-content ucpe_active" data-step="5">
      <Stepper
        currentStep={currentStep}
        totalSteps={5}
        onStepClick={() => {}}
      />
      <fieldset className="ucpe_fieldset">
        <legend style={{ width: "auto", border: "none" }}>
          Review & Publish
        </legend>

        <div className="ucpe_publish-container">
          {isPublishing && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 20px",
              }}
            >
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
            </div>
          )}

          {!isPublishing && !publishSuccess && !publishError && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 20px",
              }}
            >
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
                Note: Currently in simulation mode.
              </p>
            </div>
          )}

          {publishSuccess && !isPublishing && platformStatuses.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 20px",
              }}
            >
              <div style={{ textAlign: "center", width: "40%" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                  {hasFailures ? "⚠️" : "✅"}
                </div>
                <h3
                  style={{
                    color: hasFailures
                      ? "var(--warning, #f59e0b)"
                      : "var(--success, #10b981)",
                    margin: "0 0 8px 0",
                  }}
                >
                  {hasFailures && hasSuccesses
                    ? "Partially Published"
                    : hasFailures
                      ? "Publishing Failed"
                      : "Published Successfully!"}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "14px" }}>
                  {hasFailures && hasSuccesses
                    ? "Some platforms published successfully, others failed"
                    : hasFailures
                      ? "All platforms failed to publish"
                      : "Your posts have been published to all selected channels"}
                </p>
              </div>

              {/* Platform Status List */}
              <div
                style={{
                  marginTop: "24px",
                  textAlign: "left",
                  width: "60%",
                  margin: "24px",
                  overflowY: "auto",
                  maxHeight: "400px",
                  scrollbarWidth: "thin",
                }}
              >
                {platformStatuses.map((platform) => (
                  <div
                    key={platform.Id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      padding: "12px 16px",
                      marginBottom: "8px",
                      backgroundColor: platform.Status
                        ? "var(--success-bg, #ecfdf5)"
                        : "var(--error-bg, #fef2f2)",
                      border: `1px solid ${platform.Status ? "var(--success, #10b981)" : "var(--error, #ef4444)"}`,
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: "600",
                          color: "var(--text)",
                          marginBottom: "4px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {platform.Name}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: platform.Status
                            ? "var(--success, #10b981)"
                            : "var(--error, #ef4444)",
                        }}
                      >
                        {platform.Message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {publishSuccess && !isPublishing && platformStatuses.length === 0 && (
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 20px",
              }}
            >
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
            </div>
          )}
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
          disabled={
            isPublishing || (publishSuccess && !hasFailures) || hasFailures
          }
        >
          {isPublishing
            ? "Publishing..."
            : publishSuccess && !hasFailures
              ? "Published"
              : hasFailures
                ? "Publish Failed"
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
