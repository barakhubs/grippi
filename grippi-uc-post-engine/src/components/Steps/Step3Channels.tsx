import React, { useState } from "react";
import { Stepper } from "../Stepper/Stepper";
import { generateTextFor } from "../../utils/textGeneration";
import type { Channel, GeneratedOutput } from "../../types";
import { dataStore } from "../../data/DataStore";

interface Step3ChannelsProps {
  selectedChannels: string[];
  onToggleChannel: (channelId: string) => void;
  postTitle: string;
  postContent: string;
  onGenerate: (outputs: GeneratedOutput[]) => void;
  onNext: () => void;
  onPrev: () => void;
  currentStep: number;
}

export const Step3Channels: React.FC<Step3ChannelsProps> = ({
  selectedChannels,
  onToggleChannel,
  postTitle,
  postContent,
  onGenerate,
  onNext,
  onPrev,
  currentStep,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const channels: Channel[] = dataStore.get("socialMediaChannels") || [];

  const handleGenerate = () => {
    if (!postTitle.trim() || !postContent.trim()) {
      setError("⚠️ Please provide a title and base content.");
      return;
    }
    if (selectedChannels.length === 0) {
      setError("⚠️ Select at least one channel.");
      return;
    }

    setError("");
    setIsGenerating(true);

    // Simulate async generation
    setTimeout(() => {
      const outputs: GeneratedOutput[] = selectedChannels.map((platformId) => ({
        platformId,
        platformContent: generateTextFor(platformId, postTitle, postContent),
      }));

      onGenerate(outputs);
      setIsGenerating(false);

      // Auto-advance to review step
      setTimeout(() => onNext(), 300);
    }, 1000);
  };

  return (
    <section className="ucpe_panel ucpe_step-content ucpe_active" data-step="3">
      <Stepper
        currentStep={currentStep}
        totalSteps={5}
        onStepClick={() => {}}
      />

      <div className="ucpe_panel-header">
        <div>
          <p className="ucpe_eyebrow">Step 3 of 5</p>
          <h2>Social Media Channel Selection</h2>
        </div>
      </div>

      <fieldset className="ucpe_fieldset">
        <legend>Social Media Channel Selection</legend>

        <div className="ucpe_channels-body" style={{ minHeight: "250px" }}>
          <div className="ucpe_channels">
            {channels.map((channel) => (
              <label key={channel.id} className="ucpe_channel-card">
                <div className="ucpe_channel-head">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <img
                      src={channel.icon}
                      alt={channel.name}
                      style={{
                        width: "24px",
                        height: "24px",
                        objectFit: "contain",
                      }}
                    />
                    <div>
                      <strong>{channel.name}</strong>
                      <div className="ucpe_channel-meta">
                        Max {channel.maxChars} chars · {channel.style}
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    value={channel.id}
                    checked={selectedChannels.includes(channel.id)}
                    onChange={() => onToggleChannel(channel.id)}
                    className="ucpe_channel-checkbox"
                  />
                </div>
              </label>
            ))}
          </div>
        </div>

        {error && <div className="ucpe_error-message ucpe_show">{error}</div>}
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
          onClick={handleGenerate}
          disabled={selectedChannels.length === 0 || isGenerating}
        >
          {isGenerating ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i> Generating...
            </>
          ) : (
            <>
              <i className="fa-solid fa-wand-magic-sparkles"></i> Generate
            </>
          )}
        </button>
      </div>
    </section>
  );
};
