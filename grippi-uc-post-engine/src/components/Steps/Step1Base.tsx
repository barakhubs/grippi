import React, { useState } from "react";
import { Stepper } from "../Stepper/Stepper";
import { ExampleChips } from "../ExampleChips/ExampleChips";

interface Step1BaseProps {
  postTitle: string;
  postContent: string;
  language: string;
  tone: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onToneChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
  currentStep: number;
}

const titleExamples = [
  { label: "New Product Launch", value: "New Product Launch This Week" },
  { label: "Company Milestone", value: "Exciting Company Milestone Achieved" },
  { label: "Limited Offer", value: "Limited Time Offer - Save 30%" },
];

const contentExamples = [
  {
    label: "Product Announcement",
    value:
      "We're thrilled to announce our latest innovation that will transform how you work. Our team has been working tirelessly to bring you something truly special. Stay tuned for the big reveal!",
  },
  {
    label: "Milestone",
    value:
      "Thank you to our amazing community for helping us reach 100,000 customers! This milestone wouldn't be possible without your trust and support. Here's to the next chapter together.",
  },
  {
    label: "Promotion",
    value:
      "For a limited time only, get 30% off our entire collection. Whether you're treating yourself or shopping for loved ones, now is the perfect time to save big. Offer ends soon!",
  },
];

export const Step1Base: React.FC<Step1BaseProps> = ({
  postTitle,
  postContent,
  language,
  tone,
  onTitleChange,
  onContentChange,
  onLanguageChange,
  onToneChange,
  onNext,
  onPrev,
  currentStep,
}) => {
  const [errors, setErrors] = useState({
    title: "",
    content: "",
  });

  const handleNext = () => {
    const newErrors = {
      title: "",
      content: "",
    };

    if (!postTitle.trim()) {
      newErrors.title = "Post Title is required.";
    }
    if (!postContent.trim()) {
      newErrors.content = "Base Post Content is required.";
    }

    setErrors(newErrors);

    if (newErrors.title || newErrors.content) {
      return;
    }

    onNext();
  };

  const handleTitleChange = (value: string) => {
    onTitleChange(value);
    if (errors.title && value.trim()) {
      setErrors({ ...errors, title: "" });
    }
  };

  const handleContentChange = (value: string) => {
    onContentChange(value);
    if (errors.content && value.trim()) {
      setErrors({ ...errors, content: "" });
    }
  };

  return (
    <section className="ucpe_panel ucpe_step-content ucpe_active" data-step="1">
      <Stepper
        currentStep={currentStep}
        totalSteps={5}
        onStepClick={() => {}}
      />

      <div className="ucpe_panel-header">
        <div>
          <p className="ucpe_eyebrow">Step 1 of 5</p>
        </div>
      </div>

      <form
        className="ucpe_form-horizontal"
        onSubmit={(e) => e.preventDefault()}
      >
        <fieldset className="ucpe_fieldset">
          <legend style={{ width: "auto", border: "none" }}>
            General Information
          </legend>

          <div className="ucpe_field-horizontal ucpe_field-full">
            <label
              style={{ width: "100%" }}
              className="gx-label col-sm-3 AttributeDateTimeLabel control-label"
            >
              <span>
                Post Title <span className="ucpe_required">*</span>
              </span>
            </label>
            <div className="ucpe_field-input">
              <input
                type="text"
                value={postTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Teaser headline for all channels"
                className="Attribute form-control"
                required
              />
              {errors.title && (
                <span className="ucpe_error-text">{errors.title}</span>
              )}
              <ExampleChips
                examples={titleExamples}
                onSelect={handleTitleChange}
              />
            </div>
          </div>

          <div className="ucpe_field-horizontal ucpe_field-full">
            <label
              style={{ width: "100%" }}
              className="gx-label col-sm-3 AttributeDateTimeLabel control-label"
            >
              <span>
                Base Post Content <span className="ucpe_required">*</span>
              </span>
            </label>
            <div className="ucpe_field-input">
              <textarea
                value={postContent}
                onChange={(e) => handleContentChange(e.target.value)}
                rows={4}
                placeholder="Write the core message that will be adapted per channel"
                className="Attribute form-control"
                required
              />
              {errors.content && (
                <span className="ucpe_error-text">{errors.content}</span>
              )}
              <ExampleChips
                examples={contentExamples}
                onSelect={handleContentChange}
              />
            </div>
          </div>

          <div className="ucpe_field-horizontal">
            <label
              style={{ width: "100%" }}
              className="gx-label col-sm-3 AttributeDateTimeLabel control-label"
            >
              <span>Language</span>
            </label>
            <div className="ucpe_field-input">
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value)}
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>

          <div className="ucpe_field-horizontal">
            <label
              style={{ width: "100%" }}
              className="gx-label col-sm-3 AttributeDateTimeLabel control-label"
            >
              <span>Tone of Voice</span>
            </label>
            <div className="ucpe_field-input">
              <select
                value={tone}
                onChange={(e) => onToneChange(e.target.value)}
              >
                <option>Confident</option>
                <option>Friendly</option>
                <option>Playful</option>
                <option>Analytical</option>
              </select>
            </div>
          </div>
        </fieldset>
      </form>

      <div className="ucpe_step-nav">
        <button
          type="button"
          className="ButtonMaterialDefault btn btn-default"
          onClick={onPrev}
          disabled
        >
          Back
        </button>
        <button
          type="button"
          className="ButtonMaterial btn btn-primary"
          onClick={handleNext}
        >
          Next Step
        </button>
      </div>
    </section>
  );
};
