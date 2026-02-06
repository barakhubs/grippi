// Sample Data - Replace with your actual data source
const allMediaData = [
  {
    id: 1,
    name: "Mountain Landscape",
    url: "https://picsum.photos/400/300?random=1",
    tags: ["nature", "landscape", "mountain"],
    type: "image",
  },
  {
    id: 2,
    name: "City Skyline",
    url: "https://picsum.photos/400/300?random=2",
    tags: ["city", "urban", "architecture"],
    type: "image",
  },
  {
    id: 3,
    name: "Beach Sunset",
    url: "https://picsum.photos/400/300?random=3",
    tags: ["nature", "beach", "sunset"],
    type: "image",
  },
  {
    id: 4,
    name: "Forest Path",
    url: "https://picsum.photos/400/300?random=4",
    tags: ["nature", "forest", "trees"],
    type: "image",
  },
  {
    id: 5,
    name: "Modern Building",
    url: "https://picsum.photos/400/300?random=5",
    tags: ["architecture", "urban", "modern"],
    type: "image",
  },
  {
    id: 6,
    name: "Ocean Waves",
    url: "https://picsum.photos/400/300?random=6",
    tags: ["nature", "ocean", "water"],
    type: "image",
  },
  {
    id: 7,
    name: "Desert Dunes",
    url: "https://picsum.photos/400/300?random=7",
    tags: ["nature", "desert", "sand"],
    type: "image",
  },
  {
    id: 8,
    name: "Night City",
    url: "https://picsum.photos/400/300?random=8",
    tags: ["city", "night", "lights"],
    type: "image",
  },
  {
    id: 9,
    name: "Mountain Peak",
    url: "https://picsum.photos/400/300?random=9",
    tags: ["nature", "mountain", "snow"],
    type: "image",
  },
  {
    id: 10,
    name: "Urban Street",
    url: "https://picsum.photos/400/300?random=10",
    tags: ["city", "street", "urban"],
    type: "image",
  },
  {
    id: 11,
    name: "Tropical Beach",
    url: "https://picsum.photos/400/300?random=11",
    tags: ["nature", "beach", "tropical"],
    type: "image",
  },
  {
    id: 12,
    name: "Historic Building",
    url: "https://picsum.photos/400/300?random=12",
    tags: ["architecture", "historic", "building"],
    type: "image",
  },
  {
    id: 13,
    name: "Lake View",
    url: "https://picsum.photos/400/300?random=13",
    tags: ["nature", "lake", "water"],
    type: "image",
  },
  {
    id: 14,
    name: "City Bridge",
    url: "https://picsum.photos/400/300?random=14",
    tags: ["city", "bridge", "architecture"],
    type: "image",
  },
  {
    id: 15,
    name: "Autumn Forest",
    url: "https://picsum.photos/400/300?random=15",
    tags: ["nature", "forest", "autumn"],
    type: "image",
  },
  {
    id: 16,
    name: "Skyscraper",
    url: "https://picsum.photos/400/300?random=16",
    tags: ["architecture", "urban", "modern"],
    type: "image",
  },
  {
    id: 17,
    name: "River Valley",
    url: "https://picsum.photos/400/300?random=17",
    tags: ["nature", "river", "valley"],
    type: "image",
  },
  {
    id: 18,
    name: "Downtown",
    url: "https://picsum.photos/400/300?random=18",
    tags: ["city", "downtown", "urban"],
    type: "image",
  },
  {
    id: 101,
    name: "Nature Documentary",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    tags: ["nature", "documentary", "wildlife"],
    type: "video",
  },
  {
    id: 102,
    name: "City Time-lapse",
    url: "https://www.w3schools.com/html/movie.mp4",
    tags: ["city", "timelapse", "urban"],
    type: "video",
  },
  {
    id: 103,
    name: "Ocean Waves",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    tags: ["nature", "ocean", "relaxing"],
    type: "video",
  },
  {
    id: 104,
    name: "Mountain Hiking",
    url: "https://www.w3schools.com/html/movie.mp4",
    tags: ["nature", "mountain", "adventure"],
    type: "video",
  },
  {
    id: 105,
    name: "Urban Exploration",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    tags: ["city", "urban", "exploration"],
    type: "video",
  },
  {
    id: 106,
    name: "Forest Sounds",
    url: "https://www.w3schools.com/html/movie.mp4",
    tags: ["nature", "forest", "ambient"],
    type: "video",
  },
  {
    id: 107,
    name: "City Night Life",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    tags: ["city", "night", "nightlife"],
    type: "video",
  },
  {
    id: 108,
    name: "Beach Relaxation",
    url: "https://www.w3schools.com/html/movie.mp4",
    tags: ["nature", "beach", "relaxing"],
    type: "video",
  },
  {
    id: 109,
    name: "Architecture Tour",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    tags: ["architecture", "tour", "building"],
    type: "video",
  },
  {
    id: 110,
    name: "Wildlife Safari",
    url: "https://www.w3schools.com/html/movie.mp4",
    tags: ["nature", "wildlife", "safari"],
    type: "video",
  },
  {
    id: 111,
    name: "Street Photography",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    tags: ["city", "street", "photography"],
    type: "video",
  },
  {
    id: 112,
    name: "Waterfall Journey",
    url: "https://www.w3schools.com/html/movie.mp4",
    tags: ["nature", "waterfall", "water"],
    type: "video",
  },
];

// Application State
let currentPage = 1;
let itemsPerPage = 12;
let searchQuery = "";
let activeTagFilters = [];
let filteredData = [];
let lightboxOpen = false;
let currentLightboxIndex = 0;
let lightboxData = [];

// DOM Elements
const searchInput = document.getElementById("uc_ml-searchInput");
const mediaGrid = document.getElementById("uc_ml-mediaGrid");
const prevBtn = document.getElementById("uc_ml-prevBtn");
const nextBtn = document.getElementById("uc_ml-nextBtn");
const pageInfo = document.getElementById("uc_ml-pageInfo");
const itemsPerPageSelect = document.getElementById("uc_ml-itemsPerPage");
const tagFiltersContainer = document.getElementById("uc_ml-tagFilters");

// Lightbox Elements
const lightbox = document.getElementById("uc_ml-lightbox");
const lightboxMedia = document.getElementById("uc_ml-lightbox-media");
const lightboxTitle = document.getElementById("uc_ml-lightbox-title");
const lightboxTags = document.getElementById("uc_ml-lightbox-tags");
const lightboxCounter = document.getElementById("uc_ml-lightbox-counter");
const lightboxClose = document.querySelector(".uc_ml-lightbox-close");
const lightboxPrev = document.querySelector(".uc_ml-lightbox-prev");
const lightboxNext = document.querySelector(".uc_ml-lightbox-next");
const lightboxOverlay = document.querySelector(".uc_ml-lightbox-overlay");

// Initialize App
function init() {
  setupEventListeners();
  updateTagFilters();
  renderMedia();
}

// Setup Event Listeners
function setupEventListeners() {
  // Auto-search on input
  searchInput.addEventListener("input", handleSearch);

  // Pagination
  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    changePage(-1);
  });
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    changePage(1);
  });
  itemsPerPageSelect.addEventListener("change", handleItemsPerPageChange);

  // Lightbox
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxOverlay.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", (e) => {
    e.preventDefault();
    navigateLightbox(-1);
  });
  lightboxNext.addEventListener("click", (e) => {
    e.preventDefault();
    navigateLightbox(1);
  });

  // Keyboard navigation
  document.addEventListener("keydown", handleKeyPress);
}

// Update Tag Filters
function updateTagFilters() {
  const allTags = new Set();

  allMediaData.forEach((item) => {
    item.tags.forEach((tag) => allTags.add(tag));
  });

  tagFiltersContainer.innerHTML = "";

  const sortedTags = Array.from(allTags).sort();
  sortedTags.forEach((tag) => {
    const tagBtn = document.createElement("button");
    tagBtn.className = "uc_ml-tag-filter";
    tagBtn.textContent = tag;
    tagBtn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleTagFilter(tag, tagBtn);
    });
    tagFiltersContainer.appendChild(tagBtn);
  });

  // Add clear button as the last item
  const clearButton = document.createElement("button");
  clearButton.id = "uc_ml-clearBtn";
  clearButton.className = "uc_ml-clear-btn";
  clearButton.textContent = "Clear All";
  clearButton.addEventListener("click", handleClear);
  tagFiltersContainer.appendChild(clearButton);
}

// Toggle Tag Filter
function toggleTagFilter(tag, element) {
  const index = activeTagFilters.indexOf(tag);

  if (index > -1) {
    activeTagFilters.splice(index, 1);
    element.classList.remove("uc_ml-active");
  } else {
    activeTagFilters.push(tag);
    element.classList.add("uc_ml-active");
  }

  currentPage = 1;
  renderMedia();
}

// Handle Search
function handleSearch(e) {
  if (e) e.preventDefault();
  searchQuery = searchInput.value.trim().toLowerCase();
  currentPage = 1;
  renderMedia();
}

// Handle Clear
function handleClear(e) {
  if (e) e.preventDefault();
  searchInput.value = "";
  searchQuery = "";
  activeTagFilters = [];
  currentPage = 1;

  // Clear active tag filters
  document.querySelectorAll(".uc_ml-tag-filter").forEach((btn) => {
    btn.classList.remove("uc_ml-active");
  });

  renderMedia();
}

// Filter Data
function filterData() {
  let data = [...allMediaData];

  // Filter by search query
  if (searchQuery) {
    data = data.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(searchQuery);
      const tagMatch = item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery),
      );
      return nameMatch || tagMatch;
    });
  }

  // Filter by active tags (OR logic - at least one tag match)
  if (activeTagFilters.length > 0) {
    data = data.filter((item) => {
      return activeTagFilters.some((filterTag) =>
        item.tags.some(
          (itemTag) => itemTag.toLowerCase() === filterTag.toLowerCase(),
        ),
      );
    });
  }

  filteredData = data;
  return data;
}

// Render Media
function renderMedia() {
  const data = filterData();

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = data.slice(startIndex, endIndex);

  // Clear grid
  mediaGrid.innerHTML = "";

  // Render items
  if (pageData.length === 0) {
    mediaGrid.innerHTML = `
            <div class="uc_ml-empty-state">
                <h3>No media found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
  } else {
    // Store current page data for lightbox
    lightboxData = pageData;

    pageData.forEach((item, index) => {
      const mediaItem = createMediaItem(item, index);
      mediaGrid.appendChild(mediaItem);
    });
  }

  // Update pagination controls
  updatePaginationControls(totalPages);
}

// Create Media Item
function createMediaItem(item, index) {
  const div = document.createElement("div");
  div.className = "uc_ml-media-item";

  let mediaElement;
  if (item.type === "image") {
    mediaElement = `<img src="${item.url}" alt="${item.name}" loading="lazy">`;
  } else {
    mediaElement = `
            <video preload="metadata">
                <source src="${item.url}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
  }

  const tags = item.tags
    .map((tag) => `<span class="uc_ml-tag">${tag}</span>`)
    .join("");

  div.innerHTML = `
        ${mediaElement}
        <div class="uc_ml-media-info">
            <div class="uc_ml-media-name">${item.name}</div>
            <div class="uc_ml-media-tags">${tags}</div>
        </div>
    `;

  // Add hover autoplay for videos
  if (item.type === "video") {
    const video = div.querySelector("video");
    if (video) {
      video.muted = true; // Mute for autoplay

      div.addEventListener("mouseenter", () => {
        video.play().catch((err) => {
          console.log("Video play failed:", err);
        });
      });

      div.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0; // Reset to beginning
      });
    }
  }

  // Add click handler to open lightbox
  div.addEventListener("click", (e) => {
    e.preventDefault();
    openLightbox(index);
  });

  return div;
}

// Update Pagination Controls
function updatePaginationControls(totalPages) {
  pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage >= totalPages || totalPages === 0;

  // Generate page number buttons
  const pageNumbers = document.getElementById("uc_ml-pageNumbers");
  pageNumbers.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = "uc_ml-page-number-btn";
    if (i === currentPage) {
      pageBtn.classList.add("uc_ml-active");
    }
    pageBtn.textContent = i;
    pageBtn.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      renderMedia();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    pageNumbers.appendChild(pageBtn);
  }
}

// Change Page
function changePage(delta) {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const newPage = currentPage + delta;

  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    renderMedia();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// Handle Items Per Page Change
function handleItemsPerPageChange(e) {
  e.preventDefault();
  itemsPerPage = parseInt(e.target.value);
  currentPage = 1;
  renderMedia();
}

// Lightbox Functions
function openLightbox(index) {
  currentLightboxIndex = index;
  lightboxOpen = true;
  lightbox.classList.add("uc_ml-active");
  document.body.style.overflow = "hidden";
  updateLightboxContent();
}

function closeLightbox(e) {
  if (e) e.preventDefault();
  lightboxOpen = false;
  lightbox.classList.remove("uc_ml-active");
  document.body.style.overflow = "";

  // Stop any playing videos
  const video = lightboxMedia.querySelector("video");
  if (video) {
    video.pause();
  }
}

function navigateLightbox(delta) {
  currentLightboxIndex += delta;

  // Wrap around
  if (currentLightboxIndex < 0) {
    currentLightboxIndex = lightboxData.length - 1;
  } else if (currentLightboxIndex >= lightboxData.length) {
    currentLightboxIndex = 0;
  }

  updateLightboxContent();
}

function updateLightboxContent() {
  const item = lightboxData[currentLightboxIndex];

  // Update media
  let mediaElement;
  if (item.type === "image") {
    mediaElement = `<img src="${item.url}" alt="${item.name}">`;
  } else {
    mediaElement = `
      <video controls autoplay>
        <source src="${item.url}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `;
  }

  lightboxMedia.innerHTML = mediaElement;

  // Update info
  lightboxTitle.textContent = item.name;

  const tags = item.tags
    .map((tag) => `<span class="uc_ml-tag">${tag}</span>`)
    .join("");
  lightboxTags.innerHTML = tags;

  lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${lightboxData.length}`;

  // Update navigation buttons
  lightboxPrev.disabled = lightboxData.length <= 1;
  lightboxNext.disabled = lightboxData.length <= 1;
}

function handleKeyPress(e) {
  if (!lightboxOpen) return;

  switch (e.key) {
    case "Escape":
      e.preventDefault();
      closeLightbox();
      break;
    case "ArrowLeft":
      e.preventDefault();
      if (lightboxData.length > 1) navigateLightbox(-1);
      break;
    case "ArrowRight":
      e.preventDefault();
      if (lightboxData.length > 1) navigateLightbox(1);
      break;
  }
}

// Initialize on DOM load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
