import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const PAGE_SIZE = 16;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaGridRef = useRef<HTMLDivElement>(null);
  const tagDropdownButtonRef = useRef<HTMLButtonElement>(null);
  const tagDropdownPanelRef = useRef<HTMLDivElement>(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [showAIEditor, setShowAIEditor] = useState(false);
  const [currentEditingImage, setCurrentEditingImage] =
    useState<MediaData | null>(null);
  const [aiAdjustment, setAiAdjustment] = useState("");
  const [aiResultSrc, setAiResultSrc] = useState<string | null>(null);
  const [selectedMediaItems, setSelectedMediaItems] = useState<Set<string>>(
    new Set(),
  );
  const [mediaTypeFilter, setMediaTypeFilter] = useState("all");
  const [nameQuery, setNameQuery] = useState("");
  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([]);
  const [pendingTagFilters, setPendingTagFilters] = useState<string[]>([]);
  const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [createdSort, setCreatedSort] = useState<"newest" | "oldest">("newest");
  const [loadedImageSources, setLoadedImageSources] = useState<Set<string>>(
    new Set(),
  );
  const [hoveredMediaSrc, setHoveredMediaSrc] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [uploadProgress, setUploadProgress] = useState<{
    show: boolean;
    percentage: number;
    currentFile: string;
  }>({ show: false, percentage: 0, currentFile: "" });
  let imageIdCounter = galleryMedia.length;

  const mediaDataCollection: MediaData[] = useMemo(
    () => dataStore.get("mediaDataCollection") || [],
    [],
  );

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
              createdAt: new Date().toISOString(),
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
          createdAt: new Date().toISOString(),
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
        createdAt: mediaItem?.createdAt,
        selected: true,
      });
    });
    setSelectedMediaItems(new Set());
    setShowMediaLibrary(false);
  };

  const nonPdfMediaCollection = useMemo(
    () =>
      mediaDataCollection.filter((item) => {
        const type = (item.type || "").toLowerCase();
        const name = (item.name || "").toLowerCase();
        return type !== "pdf" && !name.endsWith(".pdf");
      }),
    [mediaDataCollection],
  );

  const currentMediaList = useMemo(() => {
    return nonPdfMediaCollection;
  }, [nonPdfMediaCollection]);

  const availableMediaTypes = useMemo(() => {
    const types = new Set<string>();
    nonPdfMediaCollection.forEach((item) => {
      const cleanType = (item.type || "").trim();
      if (cleanType) types.add(cleanType);
    });
    return Array.from(types).sort((a, b) => a.localeCompare(b));
  }, [nonPdfMediaCollection]);

  const mediaTypeFilteredList = useMemo(() => {
    if (mediaTypeFilter === "all") return currentMediaList;

    return currentMediaList.filter(
      (item) => item.type.toLowerCase() === mediaTypeFilter.toLowerCase(),
    );
  }, [currentMediaList, mediaTypeFilter]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    mediaTypeFilteredList.forEach((item) => {
      (item.tags || []).forEach((tag) => {
        const cleanTag = tag.trim();
        if (cleanTag) tags.add(cleanTag);
      });
    });
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }, [mediaTypeFilteredList]);

  const visibleTagOptions = useMemo(() => {
    const query = tagSearchQuery.trim().toLowerCase();
    if (!query) return availableTags;

    return availableTags.filter((tag) => tag.toLowerCase().includes(query));
  }, [availableTags, tagSearchQuery]);

  const filteredMedia = useMemo(() => {
    const normalizedNameQuery = nameQuery.trim().toLowerCase();

    return mediaTypeFilteredList.filter((item) => {
      const matchesName =
        normalizedNameQuery.length === 0 ||
        item.name.toLowerCase().includes(normalizedNameQuery) ||
        (item.tags || []).some((tag) =>
          tag.toLowerCase().includes(normalizedNameQuery),
        );

      const matchesTag =
        selectedTagFilters.length === 0 ||
        selectedTagFilters.some((tagFilter) =>
          (item.tags || []).includes(tagFilter),
        );

      return matchesName && matchesTag;
    });
  }, [mediaTypeFilteredList, nameQuery, selectedTagFilters]);

  const getCreatedTimestamp = (item: MediaData): number => {
    const dynamicItem = item as MediaData & {
      createdAt?: string | number | Date;
      CreatedAt?: string | number | Date;
      createdDate?: string | number | Date;
      CreatedDate?: string | number | Date;
      dateCreated?: string | number | Date;
      DateCreated?: string | number | Date;
      fileCreated?: string | number | Date;
      FileCreated?: string | number | Date;
    };

    const candidates = [
      dynamicItem.createdAt,
      dynamicItem.CreatedAt,
      dynamicItem.createdDate,
      dynamicItem.CreatedDate,
      dynamicItem.dateCreated,
      dynamicItem.DateCreated,
      dynamicItem.fileCreated,
      dynamicItem.FileCreated,
    ];

    for (const value of candidates) {
      if (!value) continue;
      if (value instanceof Date) return value.getTime();
      if (typeof value === "number") return value;
      const parsed = Date.parse(value);
      if (!Number.isNaN(parsed)) return parsed;
    }

    return 0;
  };

  const sortedMedia = useMemo(() => {
    const withIndex = filteredMedia.map((item, index) => ({
      item,
      index,
      createdTs: getCreatedTimestamp(item),
    }));

    withIndex.sort((a, b) => {
      const diff =
        createdSort === "newest"
          ? b.createdTs - a.createdTs
          : a.createdTs - b.createdTs;

      if (diff !== 0) return diff;
      return a.index - b.index;
    });

    return withIndex.map((entry) => entry.item);
  }, [filteredMedia, createdSort]);

  const paginatedMedia = useMemo(
    () => sortedMedia.slice(0, visibleCount),
    [sortedMedia, visibleCount],
  );

  const hasMoreMedia = visibleCount < sortedMedia.length;

  const MASONRY_COLS = 4;
  const masonryColumns = useMemo(() => {
    const cols: (typeof paginatedMedia)[] = Array.from(
      { length: MASONRY_COLS },
      () => [],
    );
    paginatedMedia.forEach((item, i) => {
      cols[i % MASONRY_COLS].push(item);
    });
    return cols;
  }, [paginatedMedia]);

  useEffect(() => {
    if (!showMediaLibrary) return;
    setVisibleCount(PAGE_SIZE);
    if (mediaGridRef.current) {
      mediaGridRef.current.scrollTop = 0;
    }
  }, [
    showMediaLibrary,
    mediaTypeFilter,
    nameQuery,
    selectedTagFilters,
    createdSort,
  ]);

  const handleMediaGridScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!hasMoreMedia) return;

    const target = e.currentTarget;
    const nearBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 100;

    if (nearBottom) {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, sortedMedia.length));
    }
  };

  const handleToggleTagFilter = (tag: string) => {
    setPendingTagFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const applyTagFilters = () => {
    setSelectedTagFilters(pendingTagFilters);
    setIsTagsDropdownOpen(false);
  };

  const clearTagFilters = () => {
    setPendingTagFilters([]);
    setSelectedTagFilters([]);
  };

  const markImageAsLoaded = (src: string) => {
    setLoadedImageSources((prev) => {
      if (prev.has(src)) return prev;
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  };

  useEffect(() => {
    if (!isTagsDropdownOpen) return;

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsidePanel = tagDropdownPanelRef.current?.contains(target);
      const clickedToggleButton =
        tagDropdownButtonRef.current?.contains(target);

      if (!clickedInsidePanel && !clickedToggleButton) {
        setIsTagsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocumentClick);

    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
    };
  }, [isTagsDropdownOpen]);

  useEffect(() => {
    if (isTagsDropdownOpen) {
      setPendingTagFilters(selectedTagFilters);
      setTagSearchQuery("");
    }
  }, [isTagsDropdownOpen, selectedTagFilters]);

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
                    <div className="ucpe_gallery-image-wrapper">
                      {!loadedImageSources.has(media.src) && (
                        <div className="ucpe_shimmer-loader" />
                      )}
                      <img
                        src={media.src}
                        alt={media.name || media.type}
                        loading="lazy"
                        onLoad={() => markImageAsLoaded(media.src)}
                        onError={() => markImageAsLoaded(media.src)}
                        style={{
                          opacity: loadedImageSources.has(media.src) ? 1 : 0,
                        }}
                      />
                    </div>
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
              <div
                style={{
                  marginBottom: "16px",
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr",
                  gap: "12px",
                  alignItems: "start",
                }}
              >
                <input
                  type="text"
                  placeholder="Search by name or tags"
                  value={nameQuery}
                  onChange={(e) => setNameQuery(e.target.value)}
                  style={{
                    width: "100%",
                    height: "36px",
                  }}
                  className="form-control"
                />

                <select
                  value={mediaTypeFilter}
                  onChange={(e) => setMediaTypeFilter(e.target.value)}
                  className="form-control"
                  style={{ width: "100%", height: "36px" }}
                >
                  <option value="all">All Types</option>
                  {availableMediaTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <div style={{ position: "relative" }}>
                  <button
                    ref={tagDropdownButtonRef}
                    type="button"
                    className="form-control"
                    onClick={() => setIsTagsDropdownOpen((prev) => !prev)}
                    style={{
                      width: "100%",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      textAlign: "left",
                      background: "#fff",
                    }}
                  >
                    <span>
                      {selectedTagFilters.length > 0
                        ? `${selectedTagFilters.length} tag${selectedTagFilters.length > 1 ? "s" : ""} selected`
                        : "All Tags"}
                    </span>
                    <i className="fa-solid fa-chevron-down" />
                  </button>

                  {isTagsDropdownOpen && (
                    <div
                      ref={tagDropdownPanelRef}
                      style={{
                        position: "absolute",
                        top: "42px",
                        left: 0,
                        right: 0,
                        zIndex: 50,
                        background: "#fff",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                        padding: "10px",
                      }}
                    >
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search tags"
                        value={tagSearchQuery}
                        onChange={(e) => setTagSearchQuery(e.target.value)}
                        style={{ marginBottom: "8px", height: "34px" }}
                      />

                      <div
                        style={{
                          maxHeight: "260px",
                          overflowY: "auto",
                          border: "1px solid var(--border)",
                          borderRadius: "4px",
                          padding: "8px 10px",
                          scrollbarWidth: "thin",
                        }}
                      >
                        {visibleTagOptions.length === 0 ? (
                          <div
                            style={{ fontSize: "12px", color: "var(--muted)" }}
                          >
                            No tags found.
                          </div>
                        ) : (
                          visibleTagOptions.map((tag) => (
                            <label
                              key={tag}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0px",
                                padding: "6px 8px",
                                borderRadius: "4px",
                                fontSize: "0.92rem",
                                fontWeight: "normal",
                                textTransform: "capitalize",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={pendingTagFilters.includes(tag)}
                                onChange={() => handleToggleTagFilter(tag)}
                                style={{
                                  width: "0",
                                  margin: "0 10px 0 0",
                                  borderWidth: "2px !important",
                                  borderColor: "black !important",
                                }}
                              />
                              <span>{tag}</span>
                            </label>
                          ))
                        )}
                      </div>

                      <div
                        style={{
                          marginTop: "10px",
                          display: "flex",
                          gap: "8px",
                        }}
                      >
                        <button
                          type="button"
                          className="ButtonMaterial btn btn-primary"
                          onClick={clearTagFilters}
                          style={{ minWidth: "44px", padding: "6px 10px" }}
                          title="Reset tag filters"
                        >
                          <i className="fa-solid fa-rotate-left" />
                        </button>
                        <button
                          type="button"
                          className="ButtonMaterial btn btn-primary"
                          onClick={applyTagFilters}
                          style={{ flex: 1, padding: "6px 10px" }}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <select
                  value={createdSort}
                  onChange={(e) =>
                    setCreatedSort(e.target.value as "newest" | "oldest")
                  }
                  className="form-control"
                  style={{ width: "100%", height: "36px" }}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              <div
                ref={mediaGridRef}
                className="ucpe_media-library-scroll"
                onScroll={handleMediaGridScroll}
              >
                <div className="ucpe_media-library-grid">
                  {sortedMedia.length === 0 ? (
                    <p
                      style={{
                        textAlign: "center",
                        color: "var(--muted)",
                        padding: "20px",
                      }}
                    >
                      No media found for the current filters.
                    </p>
                  ) : (
                    masonryColumns.map((col, colIdx) => (
                      <div key={colIdx} className="ucpe_masonry-col">
                        {col.map((item, idx) => (
                          <div
                            key={item.id || `${item.src}-${idx}`}
                            className={`ucpe_media-library-item ${selectedMediaItems.has(item.src) ? "ucpe_selected" : ""}`}
                            onMouseEnter={() => setHoveredMediaSrc(item.src)}
                            onMouseLeave={() => setHoveredMediaSrc(null)}
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
                            {item.type.toLowerCase() === "image" ? (
                              <div className="ucpe_media-library-image-wrapper">
                                {!loadedImageSources.has(item.src) && (
                                  <div className="ucpe_shimmer-loader" />
                                )}
                                <img
                                  src={item.src}
                                  alt={item.name.replace(/\.[^/.]+$/, "")}
                                  loading="lazy"
                                  onLoad={() => markImageAsLoaded(item.src)}
                                  onError={() => markImageAsLoaded(item.src)}
                                  style={{
                                    opacity: loadedImageSources.has(item.src)
                                      ? 1
                                      : 0,
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="ucpe_media-library-image-wrapper">
                                <video
                                  src={item.src}
                                  style={{
                                    width: "100%",
                                    height: "auto",
                                    maxHeight: "360px",
                                    objectFit: "contain",
                                    display: "block",
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
                              </div>
                            )}
                            {hoveredMediaSrc === item.src && (
                              <div className="ucpe_media-hover-overlay">
                                <div className="ucpe_media-hover-info">
                                  <span className="ucpe_media-hover-name">
                                    {item.name.replace(/\.[^/.]+$/, "")}
                                  </span>
                                  {(item.tags || []).length > 0 && (
                                    <div className="ucpe_media-hover-tags">
                                      {item.tags.map((tag) => (
                                        <span
                                          key={tag}
                                          className="ucpe_media-hover-tag"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            <div className="ucpe_media-select-overlay">
                              <span className="ucpe_select-badge">Select</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>
              {sortedMedia.length > 0 && (
                <div
                  style={{
                    textAlign: "center",
                    color: "var(--muted)",
                    fontSize: "13px",
                    padding: "8px 0 4px",
                  }}
                >
                  Showing {paginatedMedia.length} of {sortedMedia.length}
                  {hasMoreMedia ? " • Scroll to load more" : ""}
                </div>
              )}
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
