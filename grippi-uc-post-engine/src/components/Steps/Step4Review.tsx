import React, { useState } from "react";
import { Stepper } from "../Stepper/Stepper";
import { PlatformPreview } from "../PlatformPreview/PlatformPreview";
import type {
  GeneratedOutput,
  ApprovalStatus,
  AppConfig,
  MediaData,
  Channel,
} from "../../types";
import { dataStore } from "../../data/DataStore";

interface Step4ReviewProps {
  generatedOutputs: GeneratedOutput[];
  selectedChannels: string[];
  approvalState: Map<string, ApprovalStatus>;
  previewMode: "mobile" | "desktop";
  galleryMedia: MediaData[];
  appConfig: AppConfig;
  onSetPreviewMode: (mode: "mobile" | "desktop") => void;
  onApprove: (channelId: string) => void;
  onUpdateText: (channelId: string, newText: string) => void;
  onNext: () => void;
  onPrev: () => void;
  currentStep: number;
}

export const Step4Review: React.FC<Step4ReviewProps> = ({
  generatedOutputs,
  selectedChannels,
  approvalState,
  previewMode,
  galleryMedia,
  appConfig,
  onSetPreviewMode,
  onApprove,
  onUpdateText,
  onNext,
  onPrev,
  currentStep,
}) => {
  const [currentPlatformView, setCurrentPlatformView] = useState(
    selectedChannels[0] || null,
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [editText, setEditText] = useState(() => {
    const initialPlatformId = selectedChannels[0];
    const initialOutput = generatedOutputs.find(
      (o) => o.platformId === initialPlatformId,
    );
    return initialOutput?.platformContent ?? "";
  });

  const currentOutput = generatedOutputs.find(
    (o) => o.platformId === currentPlatformView,
  );

  const channels: Channel[] = dataStore.get("socialMediaChannels") || [];

  const currentChannel = channels.find((c) => c.id === currentPlatformView);

  const selectedMedia = galleryMedia.filter((media) => media.selected);
  const selectedVideo = selectedMedia.find(
    (media) => media.type.toLowerCase() === "video",
  );
  const selectedImage =
    selectedMedia.find((media) => media.type.toLowerCase() === "image") ||
    selectedMedia[0];

  // For TikTok and Snapchat, prefer video if available, otherwise use image
  const getMediaForChannel = () => {
    if (!currentChannel) return selectedImage;

    const channelName = currentChannel.name.toLowerCase();
    if (channelName === "tiktok" || channelName === "snapchat") {
      return selectedVideo || selectedImage;
    }

    // For other platforms, use image
    return selectedImage;
  };

  const mediaForPreview = getMediaForChannel();

  const openEditModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentOutput) {
      setEditText(currentOutput.platformContent);
      setShowEditModal(true);
    }
  };

  const saveEdit = () => {
    if (currentPlatformView) {
      onUpdateText(currentPlatformView, editText);
    }
    setShowEditModal(false);
  };

  const handleImprove = () => {
    if (currentPlatformView && currentOutput) {
      onUpdateText(
        currentPlatformView,
        currentOutput.platformContent +
          "\n\nAI enhanced: Improved engagement & clarity.",
      );
    }
  };

  return (
    <>
      <section
        className="ucpe_panel ucpe_step-content ucpe_active"
        data-step="4"
      >
        <Stepper
          currentStep={currentStep}
          totalSteps={5}
          onStepClick={() => {}}
        />

        <div className="ucpe_panel-header">
          <div>
            <p className="ucpe_eyebrow">Step 4 of 5</p>
          </div>
          <div className="ucpe_view-toggles" aria-label="Preview toggles">
            <label>
              <input
                type="radio"
                name="preview-mode"
                value="mobile"
                checked={previewMode === "mobile"}
                onChange={() => onSetPreviewMode("mobile")}
              />
              Mobile
            </label>
            <label>
              <input
                type="radio"
                name="preview-mode"
                value="desktop"
                checked={previewMode === "desktop"}
                onChange={() => onSetPreviewMode("desktop")}
              />
              Desktop
            </label>
          </div>
        </div>

        <fieldset className="ucpe_fieldset">
          <legend style={{ width: "auto", border: "none" }}>
            Review & Preview
          </legend>

          <div className="ucpe_platform-selector">
            {selectedChannels.map((channelId) => {
              const channel = channels.find((c) => c.id === channelId);
              const status = approvalState.get(channelId);
              if (!channel) return null;

              return (
                <button
                  key={channelId}
                  className={`ucpe_platform-tab ${channelId === currentPlatformView ? "ucpe_active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const nextOutput = generatedOutputs.find(
                      (o) => o.platformId === channelId,
                    );
                    setEditText(nextOutput?.platformContent ?? "");
                    setCurrentPlatformView(channelId);
                  }}
                >
                  <img
                    src={channel.icon}
                    alt={channel.name}
                    className="ucpe_platform-tab-icon"
                    style={{
                      width: "20px",
                      height: "20px",
                      objectFit: "contain",
                    }}
                  />
                  <span>{channel.name}</span>
                  {status === "approved" && (
                    <span style={{ color: "var(--success)" }}>✓</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="ucpe_preview-container">
            {currentOutput && currentChannel && (
              <PlatformPreview
                channelName={currentChannel.name!}
                text={currentOutput.platformContent}
                imageSrc={mediaForPreview?.src || ""}
                mediaType={mediaForPreview?.type || ""}
                mode={previewMode}
                appConfig={appConfig}
              />
            )}
          </div>

          <div className="ucpe_preview-actions-bar">
            <button
              className="ucpe_btn-outline ucpe_success"
              onClick={() =>
                currentPlatformView && onApprove(currentPlatformView)
              }
            >
              ✓ Approve
            </button>
            <button className="ucpe_btn-ghost" onClick={openEditModal}>
              Edit
            </button>
            <button className="ucpe_btn-soft" onClick={handleImprove}>
              Request AI improvement
            </button>
          </div>
        </fieldset>

        <div className="ucpe_step-nav">
          <button
            type="button"
            className="ButtonMaterialDefault btn btn-default"
            onClick={onPrev}
          >
            Back
          </button>
          <button
            type="button"
            className="ButtonMaterial btn btn-primary"
            onClick={onNext}
          >
            Review & Publish
          </button>
        </div>
      </section>

      {/* Edit Modal */}
      {showEditModal && currentChannel && (
        <div
          className="ucpe_modal-overlay ucpe_show"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="ucpe_modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "40%" }}
          >
            <div className="ucpe_modal-header">
              <h3>Edit Post</h3>
              <button
                className="ucpe_modal-close"
                onClick={() => setShowEditModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="ucpe_modal-body">
              <label style={{ width: "100%" }}>
                <span className="ucpe_modal-label">Post Content</span>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={8}
                  className="ucpe_modal-textarea"
                />
              </label>
              <p className="ucpe_modal-hint">
                Editing {currentChannel.name} post · Max{" "}
                {currentChannel.maxChars} characters · {currentChannel.style}
              </p>
            </div>
            <div className="ucpe_modal-footer">
              <button
                className="ButtonMaterialDefault btn btn-default"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="ButtonMaterial btn btn-primary"
                onClick={saveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
