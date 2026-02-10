import React, { useRef, useState } from "react";
import { Stepper } from "../Stepper/Stepper";
import type { MediaData } from "../../types";
import { dataStore } from "../../data/DataStore";
import { uploadFiles } from "../../utils/uploadApi";

interface Step2VisualsProps {
  galleryMedia: MediaData[];
  onToggleImage: (imageId: string) => void;
  onAddImage: (image: MediaData) => void;
  onUpdateImageSrc: (imageId: string, newSrc: string) => void;
  onNext: () => void;
  onPrev: () => void;
  currentStep: number;
}

export const Step2Visuals: React.FC<Step2VisualsProps> = ({
  galleryMedia,
  onToggleImage,
  onAddImage,
  onUpdateImageSrc,
  onNext,
  onPrev,
  currentStep,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [showAIEditor, setShowAIEditor] = useState(false);
  const [currentEditingImage, setCurrentEditingImage] =
    useState<MediaData | null>(null);
  const [aiAdjustment, setAiAdjustment] = useState("");
  const [aiResultSrc, setAiResultSrc] = useState<string | null>(null);
  const [selectedMediaItems, setSelectedMediaItems] = useState<Set<string>>(
    new Set(),
  );
  const [mediaTab, setMediaTab] = useState<"images" | "videos">("images");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadProgress, setUploadProgress] = useState<{
    show: boolean;
    percentage: number;
    currentFile: string;
  }>({ show: false, percentage: 0, currentFile: "" });
  let imageIdCounter = galleryMedia.length;

  const mediaDataCollection: MediaData[] =
    dataStore.get("mediaDataCollection") || [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    try {
      console.log("Starting upload...", fileArray);

      // Upload files using the uploadApi utility with progress tracking
      const uploadedFiles = await uploadFiles(fileArray, [], {
        onProgress: (progress) => {
          setUploadProgress({
            show: true,
            percentage: progress.percentage,
            currentFile: progress.currentFile,
          });
        },
        onSuccess: (files) => {
          // Update media data collection in dataStore
          const updatedMediaCollection = [
            ...mediaDataCollection,
            ...files.map((file) => ({
              id: file.id,
              name: file.name,
              type: file.fileType,
              src: file.fileUrl,
              tags: [],
              selected: false,
            })),
          ];
          dataStore.set("mediaDataCollection", updatedMediaCollection);

          setUploadProgress({ show: false, percentage: 0, currentFile: "" });
          console.log("All files uploaded successfully");
        },
        onFail: () => {
          setUploadProgress({ show: false, percentage: 0, currentFile: "" });
        },
      });

      // Add uploaded files to gallery
      uploadedFiles.forEach((file) => {
        imageIdCounter++;
        onAddImage({
          id: file.id || `upload-${imageIdCounter}`,
          name: file.name,
          type: file.fileType,
          src: file.fileUrl,
          tags: [],
          selected: false,
        });
      });
    } catch (error) {
      console.error("Upload error:", error);
      setUploadProgress({ show: false, percentage: 0, currentFile: "" });
    } finally {
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const openAIEditor = (image: MediaData) => {
    setCurrentEditingImage(image);
    setAiAdjustment("");
    setAiResultSrc(null);
    setShowAIEditor(true);
  };

  const applyAIAdjustment = () => {
    if (!aiAdjustment.trim() || !currentEditingImage) {
      alert("Please enter an AI adjustment description");
      return;
    }

    // Simulate AI processing
    setTimeout(() => {
      setAiResultSrc(currentEditingImage.src);
    }, 2000);
  };

  const saveAIEdit = () => {
    if (currentEditingImage && aiResultSrc) {
      onUpdateImageSrc(currentEditingImage.id, aiResultSrc);
    }
    setShowAIEditor(false);
  };

  const addSelectedMediaToGallery = () => {
    selectedMediaItems.forEach((src) => {
      const mediaItem = mediaDataCollection.find((m) => m.src === src);
      imageIdCounter++;
      onAddImage({
        id: mediaItem?.id || `library-${imageIdCounter}`,
        type: mediaItem?.type || "Image",
        src: mediaItem?.src || src,
        name: mediaItem?.name || "",
        tags: mediaItem?.tags || [],
        selected: true,
      });
    });
    setSelectedMediaItems(new Set());
    setShowMediaLibrary(false);
  };

  // Filter media by type (Image or Video)
  const mediaLibraryImages = mediaDataCollection.filter(
    (item) => item.type.toLowerCase() === "image",
  );

  const mediaLibraryVideos = mediaDataCollection.filter(
    (item) => item.type.toLowerCase() === "video",
  );

  const currentMediaList =
    mediaTab === "images" ? mediaLibraryImages : mediaLibraryVideos;

  // Filter by search query (name or tags)
  const filteredMedia = currentMediaList.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = item.name.toLowerCase().includes(searchLower);
    const tagsMatch = item.tags.some((tag) =>
      tag.toLowerCase().includes(searchLower),
    );
    return nameMatch || tagsMatch;
  });

  // Calculate how many items are already selected in the gallery
  const alreadySelectedCount = galleryMedia.filter(
    (item) => item.selected,
  ).length;
  const maxSelections = 4;
  const remainingSlots = maxSelections - alreadySelectedCount;
  const totalSelected = alreadySelectedCount + selectedMediaItems.size;

  return (
    <>
      <section
        className="ucpe_panel ucpe_step-content ucpe_active"
        data-step="2"
      >
        <Stepper
          currentStep={currentStep}
          totalSteps={5}
          onStepClick={() => {}}
        />

        <div className="ucpe_panel-header">
          <div>
            <p className="ucpe_eyebrow">Step 2 of 5</p>
          </div>
        </div>

        <fieldset className="ucpe_fieldset">
          <legend style={{ width: "auto", border: "none" }}>
            Visual Selection
          </legend>

          <div className="ucpe_media-actions">
            <button
              type="button"
              className="ucpe_btn-outline"
              onClick={() => setShowMediaLibrary(true)}
            >
              <i className="fa-solid fa-folder-open"></i>
              &nbsp; Select from Media Library
            </button>
            <label
              className="ucpe_btn-outline"
              style={{ cursor: "pointer", margin: 0 }}
            >
              <i className="fa-solid fa-cloud-arrow-up"></i> Upload Media
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>

          {/* Upload Progress Indicator */}
          {uploadProgress.show && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                background: "var(--surface-secondary, #f5f5f5)",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "13px",
                }}
              >
                <span>Uploading: {uploadProgress.currentFile}</span>
                <span>{uploadProgress.percentage}%</span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "6px",
                  background: "var(--border, #e0e0e0)",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${uploadProgress.percentage}%`,
                    height: "100%",
                    background: "var(--primary, #e6b71b)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          )}

          <div className="ucpe_gallery">
            {galleryMedia.length === 0 ? (
              <p
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  color: "var(--muted)",
                  padding: "40px 20px",
                }}
              >
                No media yet. Select from media library or upload images to get
                started.
              </p>
            ) : (
              galleryMedia.map((media) => (
                <div
                  key={media.id}
                  className={`ucpe_image-card ${media.selected ? "ucpe_selected" : ""}`}
                  onClick={() => onToggleImage(media.id)}
                >
                  <span className="ucpe_badge">{media.type}</span>
                  {media.type.toLowerCase() === "video" ? (
                    <video
                      src={media.src}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                  ) : (
                    <img src={media.src} alt={media.name || media.type} />
                  )}
                  <div className="ucpe_image-card-actions">
                    <button
                      className="ucpe_edit-ai-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openAIEditor(media);
                      }}
                    >
                      <i className="fa-solid fa-wand-magic-sparkles"></i> Edit
                      with AI
                    </button>
                  </div>
                </div>
              ))
            )}
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
            Next Step
          </button>
        </div>
      </section>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div
          className="ucpe_modal-overlay ucpe_show"
          onClick={() => setShowMediaLibrary(false)}
        >
          <div
            className="ucpe_modal-content ucpe_modal-large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ucpe_modal-header">
              <h3>Media Library</h3>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <span
                  style={{
                    background:
                      totalSelected >= maxSelections
                        ? "var(--danger, #dc3545)"
                        : "var(--primary, #e6b71b)",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {totalSelected}/{maxSelections} selected
                </span>
                <button
                  className="ucpe_modal-close"
                  onClick={() => setShowMediaLibrary(false)}
                >
                  &times;
                </button>
              </div>
            </div>
            <div className="ucpe_modal-body">
              {/* Tabs */}
              <div className="ucpe_tabs" style={{ marginBottom: "16px" }}>
                <button
                  className={`ucpe_tab ${mediaTab === "images" ? "ucpe_active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setMediaTab("images");
                    setSearchQuery("");
                  }}
                >
                  <i className="fa-solid fa-image"></i> Images
                </button>
                <button
                  className={`ucpe_tab ${mediaTab === "videos" ? "ucpe_active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setMediaTab("videos");
                    setSearchQuery("");
                  }}
                >
                  <i className="fa-solid fa-video"></i> Videos
                </button>
              </div>
              {/* Info message about selection limit */}
              {alreadySelectedCount > 0 && (
                <div
                  style={{
                    padding: "8px 12px",
                    marginBottom: "12px",
                    background: "var(--surface-secondary, #f5f5f5)",
                    borderRadius: "4px",
                    fontSize: "13px",
                    color: "var(--text-secondary, #666)",
                  }}
                >
                  {alreadySelectedCount} already selected in gallery.{" "}
                  {remainingSlots > 0
                    ? `You can select ${remainingSlots} more.`
                    : "Maximum reached."}
                </div>
              )}
              {/* Search Field */}
              <div style={{ marginBottom: "16px" }}>
                <input
                  type="text"
                  placeholder={`Search ${mediaTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    height: "36px",
                  }}
                  className="form-control"
                />
              </div>

              <div className="ucpe_media-library-grid">
                {filteredMedia.length === 0 ? (
                  <p
                    style={{
                      gridColumn: "1/-1",
                      textAlign: "center",
                      color: "var(--muted)",
                      padding: "20px",
                    }}
                  >
                    No {mediaTab} found matching "{searchQuery}"
                  </p>
                ) : (
                  filteredMedia.map((item, idx) => (
                    <div
                      key={idx}
                      className={`ucpe_media-library-item ${selectedMediaItems.has(item.src) ? "ucpe_selected" : ""}`}
                      onClick={() => {
                        const newSelected = new Set(selectedMediaItems);
                        if (newSelected.has(item.src)) {
                          newSelected.delete(item.src);
                        } else {
                          // Limit total selections to maxSelections (4)
                          const currentTotal =
                            alreadySelectedCount + newSelected.size;
                          if (currentTotal < maxSelections) {
                            newSelected.add(item.src);
                          }
                        }
                        setSelectedMediaItems(newSelected);
                      }}
                    >
                      {mediaTab === "images" ? (
                        <img
                          src={item.src}
                          alt={item.name.replace(/\.[^/.]+$/, "")}
                        />
                      ) : (
                        <video
                          src={item.src}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          muted={true}
                          loop={true}
                          playsInline={true}
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => {
                            e.currentTarget.pause();
                            e.currentTarget.currentTime = 0;
                          }}
                        />
                      )}
                      <div className="ucpe_media-select-overlay">
                        <span className="ucpe_select-badge">Select</span>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          bottom: "8px",
                          left: "8px",
                          background: "rgba(0,0,0,0.7)",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                        }}
                      >
                        {item.name.replace(/\.[^/.]+$/, "")}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="ucpe_modal-footer">
              <button
                className="ButtonMaterialDefault btn btn-default"
                onClick={() => setShowMediaLibrary(false)}
              >
                Cancel
              </button>
              <button
                className="ButtonMaterial btn btn-primary"
                onClick={addSelectedMediaToGallery}
                disabled={selectedMediaItems.size === 0}
              >
                Add Selected ({selectedMediaItems.size})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Editor Modal */}
      {showAIEditor && currentEditingImage && (
        <div
          className="ucpe_modal-overlay ucpe_show"
          onClick={() => setShowAIEditor(false)}
        >
          <div
            className="ucpe_modal-content ucpe_modal-fullscreen"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ucpe_modal-header">
              <button
                className="ucpe_btn-ghost"
                onClick={() => setShowAIEditor(false)}
              >
                <i className="fa-solid fa-arrow-left"></i> Back to Images
              </button>
              <h3>AI Image Editor</h3>
              <button
                className="ucpe_modal-close"
                onClick={() => setShowAIEditor(false)}
              >
                &times;
              </button>
            </div>
            <div className="ucpe_modal-body ucpe_ai-editor-body">
              <div className="ucpe_ai-editor-grid">
                <div className="ucpe_ai-editor-section">
                  <h4>Original Picture</h4>
                  <div className="ucpe_ai-editor-image-container">
                    <img src={currentEditingImage.src} alt="Original" />
                  </div>
                </div>
                <div className="ucpe_ai-editor-section">
                  <h4>AI Adjustment</h4>
                  <textarea
                    value={aiAdjustment}
                    onChange={(e) => setAiAdjustment(e.target.value)}
                    placeholder="Describe how you want to transform this image...&#10;Example: Make an autumn picture from this picture"
                    rows={6}
                  />
                  <button
                    className="ucpe_btn-primary"
                    onClick={applyAIAdjustment}
                    style={{ marginTop: "16px" }}
                  >
                    ✨ Apply AI Adjustment
                  </button>
                </div>
                <div className="ucpe_ai-editor-section">
                  <h4>Result</h4>
                  <div className="ucpe_ai-editor-image-container">
                    {aiResultSrc ? (
                      <img src={aiResultSrc} alt="AI Result" />
                    ) : (
                      <div className="ucpe_ai-placeholder">
                        <p style={{ color: "var(--muted)" }}>
                          Result will appear here after applying AI adjustment
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="ucpe_modal-footer">
              <button
                className="ButtonMaterialDefault btn btn-default"
                onClick={() => setShowAIEditor(false)}
              >
                Cancel
              </button>
              <button
                className="ButtonMaterial btn btn-primary"
                onClick={saveAIEdit}
                disabled={!aiResultSrc}
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
