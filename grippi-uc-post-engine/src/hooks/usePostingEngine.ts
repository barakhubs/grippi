import { useState, useCallback } from "react";
import type {
  MediaData,
  GeneratedOutput,
  ApprovalStatus,
  AppConfig,
} from "../types";

export const usePostingEngine = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [language, setLanguage] = useState("English (mock)");
  const [tone, setTone] = useState("Confident (mock)");
  const [galleryMedia, setGalleryMedia] = useState<MediaData[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [generatedOutputs, setGeneratedOutputs] = useState<GeneratedOutput[]>(
    [],
  );
  const [approvalState, setApprovalState] = useState<
    Map<string, ApprovalStatus>
  >(new Map());
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">(
    "mobile",
  );
  const [currentPlatformView, setCurrentPlatformView] = useState<string | null>(
    null,
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const [appConfig, setAppConfig] = useState<AppConfig>({
    companyName: "Grippi",
    logo: null,
    brandColors: {
      primary: "#2563ff",
      secondary: "#8b5cf6",
      accent: "#e1306c",
    },
    socialAccounts: {
      facebook: null,
      instagram: null,
      tiktok: null,
      snapchat: null,
      x: null,
    },
    organizationId: null,
    locationId: null,
    userId: null,
  });

  const addImage = useCallback((image: MediaData) => {
    setGalleryMedia((prev) => [...prev, image]);
  }, []);

  const toggleImageSelection = useCallback((imageId: string) => {
    setGalleryMedia((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, selected: !img.selected } : img,
      ),
    );
  }, []);

  const updateImageSrc = useCallback((imageId: string, newSrc: string) => {
    setGalleryMedia((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, src: newSrc } : img)),
    );
  }, []);

  const toggleChannel = useCallback((channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId],
    );
  }, []);

  const setApproval = useCallback(
    (channelId: string, status: ApprovalStatus) => {
      setApprovalState((prev) => new Map(prev).set(channelId, status));
    },
    [],
  );

  const updateGeneratedText = useCallback(
    (channelId: string, newText: string) => {
      setGeneratedOutputs((prev) =>
        prev.map((output) =>
          output.platformId === channelId
            ? { ...output, platformContent: newText }
            : output,
        ),
      );
    },
    [],
  );

  const reset = useCallback(() => {
    setCurrentStep(1);
    setPostTitle("");
    setPostContent("");
    setGalleryMedia([]);
    setSelectedChannels([]);
    setGeneratedOutputs([]);
    setApprovalState(new Map());
    setCurrentPlatformView(null);
  }, []);

  return {
    // State
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
    currentPlatformView,
    appConfig,
    isPublishing,
    publishError,
    publishSuccess,

    // Setters
    setCurrentStep,
    setPostTitle,
    setPostContent,
    setLanguage,
    setTone,
    setPreviewMode,
    setCurrentPlatformView,
    setGeneratedOutputs,
    setAppConfig,
    setIsPublishing,
    setPublishError,
    setPublishSuccess,

    // Actions
    addImage,
    toggleImageSelection,
    updateImageSrc,
    toggleChannel,
    setApproval,
    updateGeneratedText,
    reset,
  };
};
