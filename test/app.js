try {
  const UC = this;

  // Sample data for testing (will be replaced by UC.SDT_Media in production)
  const sampleData = [
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=1",
      MediaName: "Mountain Landscape.jpg",
      MediaTags: '["nature", "landscape", "mountains"]',
    },
    {
      MediaFileUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      MediaName: "Sample Video.mp4",
      MediaTags: '["video", "animation", "sample"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=2",
      MediaName: "Ocean Sunset.jpg",
      MediaTags: '["nature", "ocean", "sunset"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=3",
      MediaName: "City Skyline.jpg",
      MediaTags: '["urban", "city", "architecture"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=4",
      MediaName: "Forest Path.jpg",
      MediaTags: '["nature", "forest", "trees"]',
    },
    {
      MediaFileUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      MediaName: "Nature Documentary.mp4",
      MediaTags: '["video", "nature", "documentary"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=5",
      MediaName: "Desert Dunes.jpg",
      MediaTags: '["nature", "desert", "sand"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=6",
      MediaName: "Winter Scene.jpg",
      MediaTags: '["nature", "winter", "snow"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=7",
      MediaName: "Beach Paradise.jpg",
      MediaTags: '["nature", "beach", "tropical"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=8",
      MediaName: "Autumn Colors.jpg",
      MediaTags: '["nature", "autumn", "fall"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=9",
      MediaName: "Urban Street.jpg",
      MediaTags: '["urban", "street", "city"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=10",
      MediaName: "Garden Flowers.jpg",
      MediaTags: '["nature", "flowers", "garden"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=11",
      MediaName: "Night Sky.jpg",
      MediaTags: '["nature", "night", "stars"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=12",
      MediaName: "River Rapids.jpg",
      MediaTags: '["nature", "river", "water"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=13",
      MediaName: "Waterfall.jpg",
      MediaTags: '["nature", "waterfall", "water"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=14",
      MediaName: "Mountain Lake.jpg",
      MediaTags: '["nature", "lake", "mountains"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=15",
      MediaName: "Modern Building.jpg",
      MediaTags: '["urban", "architecture", "modern"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=16",
      MediaName: "Sunset Valley.jpg",
      MediaTags: '["nature", "sunset", "valley"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=17",
      MediaName: "Spring Meadow.jpg",
      MediaTags: '["nature", "spring", "meadow"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=18",
      MediaName: "Canyon View.jpg",
      MediaTags: '["nature", "canyon", "rocks"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=19",
      MediaName: "Coastal Cliffs.jpg",
      MediaTags: '["nature", "coast", "ocean"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=20",
      MediaName: "Urban Park.jpg",
      MediaTags: '["urban", "park", "city"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=21",
      MediaName: "Sunrise Hills.jpg",
      MediaTags: '["nature", "sunrise", "hills"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=22",
      MediaName: "City Lights.jpg",
      MediaTags: '["urban", "night", "lights"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=23",
      MediaName: "Tropical Forest.jpg",
      MediaTags: '["nature", "tropical", "forest"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=24",
      MediaName: "Alpine Peak.jpg",
      MediaTags: '["nature", "mountains", "alpine"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=25",
      MediaName: "Harbor View.jpg",
      MediaTags: '["urban", "harbor", "boats"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=26",
      MediaName: "Desert Sunset.jpg",
      MediaTags: '["nature", "desert", "sunset"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=27",
      MediaName: "Mountain Stream.jpg",
      MediaTags: '["nature", "stream", "mountains"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=28",
      MediaName: "Urban Plaza.jpg",
      MediaTags: '["urban", "plaza", "architecture"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=29",
      MediaName: "Wildflowers.jpg",
      MediaTags: '["nature", "flowers", "meadow"]',
    },
    {
      MediaFileUrl: "https://picsum.photos/400/400?random=30",
      MediaName: "City Bridge.jpg",
      MediaTags: '["urban", "bridge", "architecture"]',
    },
  ];

  const mediaList =
    typeof UC !== "undefined" && UC.SDT_Media ? UC.SDT_Media : sampleData;

  // Create a placeholder thumbnail for videos
  function createVideoPlaceholder() {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 400, 400);
    gradient.addColorStop(0, "#1a1a2e");
    gradient.addColorStop(1, "#16213e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 400);

    // Draw play icon
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 100px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("▶", 200, 200);

    // Add text
    ctx.font = "20px Arial";
    ctx.fillText("VIDEO", 200, 300);

    return canvas.toDataURL("image/png");
  }

  const videoPlaceholder = createVideoPlaceholder();

  const galleryItems = mediaList.map((media, index) => {
    // Updated regex to handle URLs with query parameters (like Dropbox links)
    const isVideo = /\.(mp4|webm|ogg|mov|avi|mkv)(\?|$)/i.test(
      media.MediaFileUrl,
    );

    return {
      src: isVideo ? videoPlaceholder : media.MediaFileUrl,
      title: media.MediaName.replace(/\.[^/.]+$/, "") || `Media ${index + 1}`,
      description: isVideo ? "Video" : "",
      tags: JSON.parse(media.MediaTags).join(" "),
      isVideo: isVideo,
      videoUrl: isVideo ? media.MediaFileUrl : null,
      originalIndex: index,
    };
  });

  // Pagination state
  let currentPage = 1;
  let itemsPerPage = 24;
  let currentFilteredItems = galleryItems;

  function updateStats() {
    const total = currentFilteredItems.length;
    const searchTerm = $("#uc_ml-searchInput").val().trim();

    if (searchTerm) {
      $("#uc_ml-statsDisplay").html(
        `Found <strong>${total}</strong> ${total === 1 ? "item" : "items"} matching "${searchTerm}" (out of <strong>${galleryItems.length}</strong> total)`,
      );
    } else {
      $("#uc_ml-statsDisplay").html(
        `Showing <strong>${galleryItems.length}</strong> ${galleryItems.length === 1 ? "item" : "items"} in media library`,
      );
    }
  }

  function getTotalPages() {
    if (itemsPerPage === "all") return 1;
    return Math.ceil(currentFilteredItems.length / itemsPerPage);
  }

  function getCurrentPageItems() {
    if (itemsPerPage === "all") {
      return currentFilteredItems;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return currentFilteredItems.slice(startIndex, endIndex);
  }

  function updatePaginationInfo() {
    const totalPages = getTotalPages();
    const totalItems = currentFilteredItems.length;

    if (itemsPerPage === "all") {
      $("#uc_ml-pageInfo").text(
        `Showing all ${totalItems} ${totalItems === 1 ? "item" : "items"}`,
      );
    } else {
      const startItem =
        totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
      const endItem = Math.min(currentPage * itemsPerPage, totalItems);
      $("#uc_ml-pageInfo").text(
        `Page ${currentPage} of ${totalPages} (${startItem}-${endItem} of ${totalItems} ${totalItems === 1 ? "item" : "items"})`,
      );
    }
  }

  function renderPagination() {
    const totalPages = getTotalPages();
    const $container = $("#uc_ml-paginationContainer");
    $container.empty();

    if (totalPages <= 1 || itemsPerPage === "all") {
      return; // No pagination needed
    }

    // Previous button
    const $prevBtn = $("<button>")
      .addClass("uc_ml-pagination-btn")
      .text("← Previous")
      .prop("disabled", currentPage === 1)
      .on("click", () => {
        if (currentPage > 1) {
          currentPage--;
          refreshGallery();
        }
      });
    $container.append($prevBtn);

    // Page numbers container
    const $pageNumbers = $("<div>").addClass("uc_ml-page-numbers");

    // Always show first page
    if (currentPage > 3) {
      $pageNumbers.append(createPageButton(1));
      if (currentPage > 4) {
        $pageNumbers.append(
          $("<span>").text("...").css({ padding: "10px", color: "#666" }),
        );
      }
    }

    // Show pages around current page
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      $pageNumbers.append(createPageButton(i));
    }

    // Always show last page
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        $pageNumbers.append(
          $("<span>").text("...").css({ padding: "10px", color: "#666" }),
        );
      }
      $pageNumbers.append(createPageButton(totalPages));
    }

    $container.append($pageNumbers);

    // Next button
    const $nextBtn = $("<button>")
      .addClass("uc_ml-pagination-btn")
      .text("Next →")
      .prop("disabled", currentPage === totalPages)
      .on("click", () => {
        if (currentPage < totalPages) {
          currentPage++;
          refreshGallery();
        }
      });
    $container.append($nextBtn);
  }

  function createPageButton(pageNum) {
    return $("<button>")
      .addClass("uc_ml-pagination-btn")
      .toggleClass("uc_ml-active", pageNum === currentPage)
      .text(pageNum)
      .on("click", () => {
        currentPage = pageNum;
        refreshGallery();
      });
  }

  function refreshGallery() {
    const pageItems = getCurrentPageItems();

    jQuery("#uc_ml-nanogallery").nanogallery2("destroy");

    if (pageItems.length === 0) {
      const searchTerm = $("#uc_ml-searchInput").val().trim();
      $("#uc_ml-nanogallery").html(
        '<div style="text-align: center; padding: 40px; font-size: 18px; color: #666;">No media found' +
          (searchTerm ? ` matching "${searchTerm}"` : "") +
          "</div>",
      );
    } else {
      initGallery(pageItems);
    }

    updatePaginationInfo();
    renderPagination();
    updateStats();

    // Scroll to top of gallery
    $("html, body").animate(
      {
        scrollTop: $("#uc_ml-nanogallery").offset().top - 100,
      },
      300,
    );
  }

  function initGallery(galleryData) {
    console.log("Initializing gallery with items:", galleryData);

    try {
      jQuery("#uc_ml-nanogallery").nanogallery2({
        /* =========================
           TAG FILTERING
        ========================== */
        galleryFilterTags: true,
        galleryFilterTagsMode: "multiple",

        /* =========================
           CALLBACK AFTER RENDER
        ========================== */
        fnGalleryRenderEnd: function () {
          console.log("Gallery render completed");
          addVideoHoverEffects();
        },

        /* =========================
         LAYOUT
      ========================== */
        thumbnailHeight: 250,
        thumbnailWidth: 250,
        thumbnailAlignment: "left",
        galleryDisplayMode: "fullContent",
        gallerySorting: "default",

        thumbnailGutterWidth: 10,
        thumbnailGutterHeight: 10,
        thumbnailBorderHorizontal: 2,
        thumbnailBorderVertical: 2,

        /* =========================
         ANIMATION
      ========================== */
        galleryDisplayTransitionDuration: 1000,
        thumbnailDisplayTransition: "slideDown",
        thumbnailDisplayTransitionDuration: 300,
        thumbnailDisplayInterval: 150,
        thumbnailDisplayOrder: "colFromLeft",

        /* =========================
         LABELS
      ========================== */
        thumbnailLabel: {
          display: true,
          position: "onBottomOverImage",
          hideIcons: true,
          titleFontSize: "1em",
          align: "left",
          titleMultiLine: true,
          displayDescription: false,
        },

        thumbnailToolbarImage: null,
        thumbnailToolbarAlbum: null,

        /* =========================
         HOVER EFFECT
      ========================== */
        thumbnailHoverEffect2:
          "label_font-size_1em_1.1em|" +
          "title_backgroundColor_rgba(255,255,255,0.34)_rgb(210 163 7,0.8)|" +
          "title_color_#000_#fff|" +
          "image_scale_1.00_1.10_5000|" +
          "image_rotateZ_0deg_4deg_5000",

        touchAnimation: true,
        touchAutoOpenDelay: 800,

        /* =========================
         THEME
      ========================== */
        galleryTheme: {
          thumbnail: {
            titleShadow: "none",
            titleColor: "#fff",
            borderColor: "#fff",
          },
          navigationBreadcrumb: {
            background: "#3C4B5B",
          },
          navigationFilter: {
            background: "#d2a307",
            backgroundSelected: "#a07100",
            color: "#fff",
          },
        },

        locationHash: false,

        /* =========================
         VIEWER CONFIGURATION
      ========================== */
        viewerTools: {
          topLeft: "pageCounter",
          topRight: "closeButton",
        },

        /* =========================
         ERROR HANDLING
      ========================== */
        fnProcessData: function () {
          console.log("Gallery data processed successfully");
        },

        /* =========================
         ITEMS WITH TAGS
      ========================== */
        items: galleryData,
      });

      console.log("Gallery initialization completed");
    } catch (error) {
      console.error("Error during gallery initialization:", error);
      $("#uc_ml-nanogallery").html(
        '<div style="text-align: center; padding: 40px; font-size: 18px; color: #ff6b6b;">Error initializing gallery: ' +
          error.message +
          "</div>",
      );
    }
  }

  // Search functionality
  function performSearch() {
    const searchTerm = $("#uc_ml-searchInput").val().trim().toLowerCase();

    if (searchTerm === "") {
      // If search is cleared, reset to all items
      currentFilteredItems = galleryItems;
      $("#uc_ml-searchInput").removeClass("uc_ml-no-results");
    } else {
      // Filter items based on search term
      currentFilteredItems = galleryItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm) ||
          item.tags.toLowerCase().includes(searchTerm),
      );

      // Toggle no-results class
      if (currentFilteredItems.length === 0) {
        $("#uc_ml-searchInput").addClass("uc_ml-no-results");
      } else {
        $("#uc_ml-searchInput").removeClass("uc_ml-no-results");
      }
    }

    // Reset to first page when searching
    currentPage = 1;
    refreshGallery();
  }

  // Initialize gallery when document is ready
  $(document).ready(function () {
    try {
      // Set a loading timeout
      const loadingTimeout = setTimeout(() => {
        console.warn("Gallery loading timeout - forcing display");
        $("#uc_ml-statsDisplay").html(
          '<span style="color: #ff6b6b;">Gallery loaded with potential issues. Check console for details.</span>',
        );
      }, 10000); // 10 second timeout

      // Initialize with first page
      currentFilteredItems = galleryItems;
      refreshGallery();

      // Clear timeout once loaded
      clearTimeout(loadingTimeout);

      // Add search event listener with debounce
      let searchTimeout;
      $("#uc_ml-searchInput").on("keyup", function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          performSearch();
        }, 300);
      });

      // Items per page change handler
      $("#uc_ml-itemsPerPage").on("change", function () {
        const value = $(this).val();
        itemsPerPage = value === "all" ? "all" : parseInt(value);
        currentPage = 1; // Reset to first page
        refreshGallery();
      });

      console.log(
        "Gallery initialized successfully with",
        galleryItems.length,
        "media items",
      );
    } catch (e) {
      console.error("Error initializing gallery:", e);
      $("#uc_ml-nanogallery").html(
        '<div style="text-align: center; padding: 40px; font-size: 18px; color: #ff6b6b;">Error loading gallery. Check console for details.</div>',
      );
    }
  });

  // Function to add video hover effects
  function addVideoHoverEffects() {
    console.log("Adding video hover effects...");
    const pageItems = getCurrentPageItems();

    // Find all thumbnails in the gallery
    const $thumbnails = $("#uc_ml-nanogallery .nGY2GThumbnail");
    console.log("Found thumbnails:", $thumbnails.length);

    $thumbnails.each(function (index) {
      const $thumbnail = $(this);

      // Check if this corresponds to a video item
      if (index < pageItems.length && pageItems[index].isVideo) {
        const item = pageItems[index];
        console.log("Processing video item:", item.title);

        const $imgContainer = $thumbnail.find(".nGY2GThumbnailImage");
        const $img = $imgContainer.find("img");

        if ($imgContainer.length && $img.length) {
          // Make container relative for absolute positioning
          $imgContainer.css("position", "relative");

          // Add play icon overlay if not exists
          if (!$imgContainer.find(".uc_ml-play-icon").length) {
            const $playIcon = $('<div class="uc_ml-play-icon">▶</div>');
            $playIcon.css({
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "60px",
              color: "white",
              textShadow: "0 4px 12px rgba(0,0,0,0.9)",
              pointerEvents: "none",
              zIndex: 100,
              opacity: 0.95,
              transition: "opacity 0.3s ease",
              fontWeight: "bold",
            });
            $imgContainer.append($playIcon);
            console.log("Added play icon to:", item.title);
          }

          let videoElement = null;
          let isHovering = false;

          // Remove any existing handlers to avoid duplicates
          $imgContainer.off("mouseenter.videohover mouseleave.videohover");

          $imgContainer.on("mouseenter.videohover", function () {
            isHovering = true;
            const $playIcon = $(this).find(".uc_ml-play-icon");
            $playIcon.css("opacity", "0");

            console.log("Hovering over video:", item.title);

            if (!videoElement) {
              videoElement = document.createElement("video");
              videoElement.src = item.videoUrl;
              videoElement.muted = true;
              videoElement.loop = true;
              videoElement.playsInline = true;
              videoElement.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: cover;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 50;
              `;

              this.appendChild(videoElement);
              console.log("Created video element for:", item.title);
            }

            videoElement
              .play()
              .then(() => {
                console.log("Video playing:", item.title);
              })
              .catch((err) => {
                console.error("Video play failed:", err);
              });
          });

          $imgContainer.on("mouseleave.videohover", function () {
            isHovering = false;
            const $playIcon = $(this).find(".uc_ml-play-icon");
            $playIcon.css("opacity", "0.95");

            console.log("Mouse left video:", item.title);

            if (videoElement) {
              videoElement.pause();
              videoElement.currentTime = 0;
            }
          });
        }
      }
    });

    console.log("Video hover effects setup complete");
  }
} catch (e) {
  console.error(e);
}
