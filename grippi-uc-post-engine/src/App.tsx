import { usePostingEngine } from "./hooks/usePostingEngine";
import { Step1Base } from "./components/Steps/Step1Base";
import { Step2Visuals } from "./components/Steps/Step2Visuals";
import { Step3Channels } from "./components/Steps/Step3Channels";
import { Step4Review } from "./components/Steps/Step4Review";
import { Step5Publish } from "./components/Steps/Step5Publish";
import type { GeneratedOutput } from "./types";
import { publishPosts, type PublishPayload } from "./utils/publishApi";
import "./styles/posting-engine.css";

function App() {
  const {
    currentStep,
    postTitle,
    postContent,
    language,
    tone,
    galleryMedia,
    selectedChannels,
    generatedOutputs,
    approvalState,
    previewMode,
    appConfig,
    isPublishing,
    publishError,
    publishSuccess,
    publishResponse,
    setCurrentStep,
    setPostTitle,
    setPostContent,
    setLanguage,
    setTone,
    setPreviewMode,
    setGeneratedOutputs,
    setIsPublishing,
    setPublishError,
    setPublishSuccess,
    setPublishResponse,
    addImage,
    toggleImageSelection,
    updateImageSrc,
    toggleChannel,
    setApproval,
    updateGeneratedText,
  } = usePostingEngine();

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleGenerate = (outputs: GeneratedOutput[]) => {
    setGeneratedOutputs(outputs);
    outputs.forEach((output) => {
      setApproval(output.platformId, "pending");
    });
  };

  const handleApprove = (channelId: string) => {
    setApproval(channelId, "approved");
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishError(null);
    setPublishSuccess(false);
    setPublishResponse(null);

    try {
      const payload: PublishPayload = {
        postTitle,
        postContent,
        language,
        tone,
        images: galleryMedia.filter((img) => img.selected),
        channels: selectedChannels,
        generatedOutputs,
      };

      const response = await publishPosts(payload);

      if (response.success) {
        setPublishSuccess(true);
        setPublishResponse(response);
        console.log("🎉 Publishing completed successfully!", response);
      } else {
        throw new Error(response.message || "Publishing failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setPublishError(errorMessage);
      console.error("❌ Publishing failed:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <main className="ucpe_layout">
      {currentStep === 1 && (
        <Step1Base
          postTitle={postTitle}
          postContent={postContent}
          language={language}
          tone={tone}
          onTitleChange={setPostTitle}
          onContentChange={setPostContent}
          onLanguageChange={setLanguage}
          onToneChange={setTone}
          onNext={handleNext}
          onPrev={handlePrev}
          currentStep={currentStep}
        />
      )}

      {currentStep === 2 && (
        <Step2Visuals
          galleryMedia={galleryMedia}
          onToggleImage={toggleImageSelection}
          onAddImage={addImage}
          onUpdateImageSrc={updateImageSrc}
          onNext={handleNext}
          onPrev={handlePrev}
          currentStep={currentStep}
        />
      )}

      {currentStep === 3 && (
        <Step3Channels
          selectedChannels={selectedChannels}
          onToggleChannel={toggleChannel}
          postTitle={postTitle}
          postContent={postContent}
          onGenerate={handleGenerate}
          onNext={handleNext}
          onPrev={handlePrev}
          currentStep={currentStep}
        />
      )}

      {currentStep === 4 && (
        <Step4Review
          generatedOutputs={generatedOutputs}
          selectedChannels={selectedChannels}
          approvalState={approvalState}
          previewMode={previewMode}
          galleryMedia={galleryMedia}
          appConfig={appConfig}
          onSetPreviewMode={setPreviewMode}
          onApprove={handleApprove}
          onUpdateText={updateGeneratedText}
          onNext={handleNext}
          onPrev={handlePrev}
          currentStep={currentStep}
        />
      )}

      {currentStep === 5 && (
        <Step5Publish
          onPrev={handlePrev}
          onPublish={handlePublish}
          currentStep={currentStep}
          isPublishing={isPublishing}
          publishError={publishError}
          publishSuccess={publishSuccess}
          publishResponse={publishResponse}
        />
      )}
    </main>
  );
}

export default App;
