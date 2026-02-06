const appConfig = {
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
  },
  organizationId: null,
  locationId: null,
  userId: null,
};

// Public API for external integration
window.SocialMediaPostingEngine = {
  setConfig: function (config) {
    if (config.companyName) appConfig.companyName = config.companyName;
    if (config.logo) appConfig.logo = config.logo;
    if (config.brandColors) {
      Object.assign(appConfig.brandColors, config.brandColors);
    }
    if (config.socialAccounts) {
      Object.assign(appConfig.socialAccounts, config.socialAccounts);
    }
    if (config.organizationId) appConfig.organizationId = config.organizationId;
    if (config.locationId) appConfig.locationId = config.locationId;
    if (config.userId) appConfig.userId = config.userId;

    // Update UI with new config
    updateBrandingInUI();
  },
  getConfig: function () {
    return { ...appConfig };
  },
  reset: function () {
    // Clear all form data and reset to initial state
    document.getElementById("ucpe_post-title").value = "";
    document.getElementById("ucpe_post-content").value = "";
    generatedOutputs = [];
    approvalState.clear();
    showStep(1);
  },
};

// Apply branding from config to UI
function updateBrandingInUI() {
  // Update CSS variables if brand colors are provided
  if (appConfig.brandColors.primary) {
    document.documentElement.style.setProperty(
      "--accent",
      appConfig.brandColors.primary,
    );
  }
  if (appConfig.brandColors.secondary) {
    document.documentElement.style.setProperty(
      "--accent-2",
      appConfig.brandColors.secondary,
    );
  }
}

// Font Awesome Icon Library
const icons = {
  like: '<i class="fa-regular fa-thumbs-up"></i>',
  comment: '<i class="fa-regular fa-comment"></i>',
  share: '<i class="fa-solid fa-share"></i>',
  heart: '<i class="fa-regular fa-heart"></i>',
  heartFilled: '<i class="fa-solid fa-heart"></i>',
  send: '<i class="fa-regular fa-paper-plane"></i>',
  bookmark: '<i class="fa-regular fa-bookmark"></i>',
  globe: '<i class="fa-solid fa-globe"></i>',
  ellipsis: '<i class="fa-solid fa-ellipsis"></i>',
};

const channels = [
  {
    id: "facebook",
    name: "Facebook",
    maxChars: 2200,
    style: "Conversational",
    color: "#1877f2",
    icon: "Resources/post-engine/images/icons/facebook.jpg",
    fee: 5,
  },
  {
    id: "instagram",
    name: "Instagram",
    maxChars: 2200,
    style: "Snappy captions",
    color: "#e1306c",
    icon: "Resources/post-engine/images/icons/instagram.jpg",
    fee: 5,
  },
  {
    id: "snapchat",
    name: "Snapchat",
    maxChars: 80,
    style: "Punchy, to-the-point",
    color: "#fffc00",
    icon: "Resources/post-engine/images/icons/snapchat.png",
    fee: 7,
  },
  {
    id: "tiktok",
    name: "TikTok",
    maxChars: 150,
    style: "Hook first, hashtag later",
    color: "#111",
    icon: "Resources/post-engine/images/icons/tiktok.png",
    fee: 8,
  },
  {
    id: "x",
    name: "X",
    maxChars: 150,
    style: "Hook first, hashtag later",
    color: "#111",
    icon: "Resources/post-engine/images/icons/x.png",
    fee: 8,
  },
];

const galleryState = [];
const approvalState = new Map();
let previewMode = "mobile";
let generatedOutputs = [];
let currentStep = 1;
const totalSteps = 5;
let currentPlatformView = null;
let imageIdCounter = 0;

const galleryEl = document.getElementById("ucpe_gallery");
const channelListEl = document.getElementById("ucpe_channel-list");
const generateBtn = document.getElementById("ucpe_generate-btn");
const publishBtn = document.getElementById("ucpe_publish-btn");
const publishSummary = document.getElementById("ucpe_publish-summary");

// Load gallery - starts empty
function renderGallery() {
  renderGalleryCards();
}

// Add a single image to the gallery
function addImageToGallery(MediaData) {
  galleryState.push({
    ...MediaData,
    selected: MediaData.selected || false,
  });
  renderGalleryCards();
}

// Render all gallery cards
function renderGalleryCards() {
  galleryEl.innerHTML = "";

  if (galleryState.length === 0) {
    galleryEl.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 40px 20px;">No images yet. Select from media library or upload images to get started.</p>';
    return;
  }

  galleryState.forEach((MediaData) => {
    const card = document.createElement("div");
    card.className = "ucpe_image-card";
    if (MediaData.selected) {
      card.classList.add("ucpe_selected");
    }
    card.dataset.id = MediaData.id;
    card.innerHTML = `
			<span class="ucpe_badge">${MediaData.type || "Uploaded"}</span>
			<img src="${MediaData.src}" alt="${MediaData.type || "Image"}" onerror="this.parentElement.style.display='none'">
			<div class="ucpe_image-card-actions">
				<button class="ucpe_edit-ai-btn" data-image-id="${MediaData.id}">
					<i class="fa-solid fa-wand-magic-sparkles"></i> Edit with AI
				</button>
			</div>
		`;
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const editBtn = e.target.closest(".ucpe_edit-ai-btn");
      if (editBtn) {
        e.stopPropagation();
        openAIEditor(editBtn.dataset.imageId);
        return;
      }
      toggleImage(MediaData.id);
    });
    galleryEl.appendChild(card);
  });
}

// Handle file uploads
function handleImageUpload(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  Array.from(files).forEach((file) => {
    if (!file.type.startsWith("image/")) {
      console.warn("Skipping non-image file:", file.name);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      imageIdCounter++;
      addImageToGallery({
        id: `upload-${imageIdCounter}`,
        type: "Uploaded",
        src: e.target.result,
        selected: false,
      });
    };
    reader.readAsDataURL(file);
  });

  // Clear the input so the same file can be uploaded again if needed
  event.target.value = "";
}

function toggleImage(id) {
  const item = galleryState.find((g) => g.id === id);
  if (!item) return;
  item.selected = !item.selected;
  renderGalleryCards();
}

// Media Library Functions
let selectedMediaItems = new Set();

function openMediaLibrary() {
  const modal = document.getElementById("ucpe_media-library-modal");
  modal.classList.add("ucpe_show");
  selectedMediaItems.clear();

  // Reset selection visual
  document.querySelectorAll(".ucpe_media-library-item").forEach((item) => {
    item.classList.remove("ucpe_selected");
  });
}

function closeMediaLibrary() {
  const modal = document.getElementById("ucpe_media-library-modal");
  modal.classList.remove("ucpe_show");
  selectedMediaItems.clear();
}

function addSelectedMediaToGallery() {
  selectedMediaItems.forEach((src) => {
    imageIdCounter++;
    addImageToGallery({
      id: `library-${imageIdCounter}`,
      type: "Library",
      src: src,
      selected: false,
    });
  });
  closeMediaLibrary();
}

// AI Editor Functions
let currentEditingImageId = null;
let aiResultImageSrc = null;

function openAIEditor(imageId) {
  const image = galleryState.find((img) => img.id === imageId);
  if (!image) return;

  currentEditingImageId = imageId;
  aiResultImageSrc = null;

  const modal = document.getElementById("ucpe_ai-editor-modal");
  const originalImage = document.getElementById("ucpe_ai-original-image");
  const adjustmentInput = document.getElementById("ucpe_ai-adjustment-input");
  const resultContainer = document.getElementById("ucpe_ai-result-container");
  const saveBtn = document.getElementById("ucpe_save-ai-edit");

  originalImage.src = image.src;
  adjustmentInput.value = "";
  resultContainer.innerHTML =
    '<div class="ucpe_ai-placeholder"><p style="color: var(--muted);">Result will appear here after applying AI adjustment</p></div>';
  saveBtn.disabled = true;

  modal.classList.add("ucpe_show");
}

function closeAIEditor() {
  const modal = document.getElementById("ucpe_ai-editor-modal");
  modal.classList.remove("ucpe_show");
  currentEditingImageId = null;
  aiResultImageSrc = null;
}

function applyAIAdjustment() {
  const adjustmentInput = document.getElementById("ucpe_ai-adjustment-input");
  const resultContainer = document.getElementById("ucpe_ai-result-container");
  const applyBtn = document.getElementById("ucpe_apply-ai-adjustment");
  const saveBtn = document.getElementById("ucpe_save-ai-edit");
  const adjustment = adjustmentInput.value.trim();

  if (!adjustment) {
    alert("Please enter an AI adjustment description");
    return;
  }

  // Show loading state
  applyBtn.disabled = true;
  applyBtn.innerHTML =
    '<span style="display: inline-flex; align-items: center; gap: 8px;"><i class="fa-solid fa-spinner fa-spin"></i> Processing...</span>';

  resultContainer.innerHTML =
    '<div class="ucpe_ai-placeholder"><p style="color: var(--muted);"><i class="fa-solid fa-spinner fa-spin"></i> AI is processing your image...</p></div>';

  // Simulate AI processing
  setTimeout(() => {
    const originalImage = galleryState.find(
      (img) => img.id === currentEditingImageId,
    );

    // For demo, we'll just show the original image as "processed"
    // In real implementation, this would call an AI API
    aiResultImageSrc = originalImage.src;

    resultContainer.innerHTML = `<img src="${aiResultImageSrc}" alt="AI Result" />`;

    // Restore button
    applyBtn.disabled = false;
    applyBtn.innerHTML =
      '<i class="fa-solid fa-wand-magic-sparkles"></i> Apply AI Adjustment';

    // Enable save button
    saveBtn.disabled = false;
  }, 2000);
}

function saveAIEdit() {
  if (!currentEditingImageId || !aiResultImageSrc) return;

  const imageIndex = galleryState.findIndex(
    (img) => img.id === currentEditingImageId,
  );
  if (imageIndex >= 0) {
    galleryState[imageIndex].src = aiResultImageSrc;
    renderGalleryCards();
  }

  closeAIEditor();
}

// Render channel cards with constraints
function renderChannels() {
  channels.forEach((ch) => {
    const card = document.createElement("label");
    card.className = "ucpe_channel-card";
    card.innerHTML = `
		   <div class="ucpe_channel-head">
			<div style="display: flex; align-items: center; gap: 10px;">
				<img src="${ch.icon}" alt="${ch.name}" style="width: 24px; height: 24px; object-fit: contain;">
				<div>
				<strong>${ch.name}</strong>
				<div class="ucpe_channel-meta">Max ${ch.maxChars} chars · ${ch.style}</div>
			</div>
			</div>
			<input type="checkbox" value="${ch.id}" class="ucpe_channel-checkbox">
		   </div>
		`;
    channelListEl.appendChild(card);
  });
}

// Utility to get selected channel ids
function getSelectedChannels() {
  return Array.from(
    channelListEl.querySelectorAll("input[type='checkbox']:checked"),
  ).map((c) => c.value);
}

function getSelectedImages() {
  const selected = galleryState.filter((g) => g.selected);
  return selected.length ? selected : galleryState.slice(0, 1);
}

// Simple mock generation per platform
function generateTextFor(channelId, baseTitle, baseContent) {
  const trimmed = baseContent.trim();
  switch (channelId) {
    case "facebook":
      return `${baseTitle} — ${trimmed}\n\n${trimmed}\n#community #update`;
    case "instagram":
      return `${trimmed}\n${baseTitle}\n${hashtags(trimmed, 3)}`;
    case "twitter":
      return `${baseTitle}\n\n${trimmed.slice(0, 200)}\n${hashtags(trimmed, 2)}`;
    case "snapchat":
      return `${trimmed.slice(0, 70)}... ⚡`;
    case "tiktok":
      return `${hookify(baseTitle)}\n${trimmed}\n${hashtags(trimmed, 2)} #ForYou`;
    default:
      return trimmed;
  }
}

function hashtags(text, count) {
  const words = text
    .split(/\s+/)
    .filter((w) => w.length > 4)
    .slice(0, count);
  return words
    .map((w) => `#${w.replace(/[^a-z0-9]/gi, "")}`.toLowerCase())
    .join(" ");
}

function hookify(title) {
  const hook = title.slice(0, 40) || "Big news";
  return `🎯 ${hook}?`; // quick hook for TikTok
}

// Build preview cards per channel
function renderReviewCards() {
  const selected = getSelectedChannels();
  if (!selected.length) return;

  // Set first platform as default view
  currentPlatformView = selected[0];

  // Render platform tabs
  const tabsEl = document.getElementById("ucpe_platform-tabs");
  tabsEl.innerHTML = selected
    .map((id) => {
      const ch = channels.find((c) => c.id === id);
      const status = approvalState.get(id) || "pending";
      return `
      <button class="ucpe_platform-tab ${id === currentPlatformView ? "ucpe_active" : ""}" data-platform="${id}">
        <img src="${ch.icon}" alt="${ch.name}" class="ucpe_platform-tab-icon" style="width: 20px; height: 20px; object-fit: contain;">
        <span>${ch.name}</span>
        ${status === "approved" ? '<span style="color: var(--success)">✓</span>' : ""}
      </button>
    `;
    })
    .join("");

  // Render current platform preview
  renderPlatformPreview();
}

function renderPlatformPreview() {
  const container = document.getElementById("ucpe_preview-container");
  const output = generatedOutputs.find((o) => o.id === currentPlatformView);
  if (!output) return;

  const ch = channels.find((c) => c.id === currentPlatformView);
  const images = getSelectedImages();
  const image = images && images.length > 0 ? images[0] : null;

  if (previewMode === "mobile") {
    container.innerHTML = renderMobilePreview(ch, output.text, image);
  } else {
    container.innerHTML = renderDesktopPreview(ch, output.text, image);
  }
}

// Helper to get image src or placeholder
function getImageSrc(image) {
  return image && image.src
    ? image.src
    : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18"%3ENo Image%3C/text%3E%3C/svg%3E';
}

function renderMobilePreview(channel, text, image) {
  return `
    <div class="ucpe_phone-frame">
      <div class="ucpe_phone-notch"></div>
      <div class="ucpe_phone-screen">
        <div class="ucpe_phone-statusbar">
          <span>9:41</span>
          <span style="display:flex;gap:4px;align-items:center;">
            <i class="fa-solid fa-battery-full"></i>
            <i class="fa-solid fa-wifi"></i>
          </span>
        </div>
        <div class="ucpe_phone-content">
          ${getPlatformMobileHTML(channel, text, image)}
        </div>
      </div>
    </div>
  `;
}

function renderDesktopPreview(channel, text, image) {
  return `
    <div class="ucpe_desktop-frame">
      <div class="ucpe_browser-chrome">
        <div class="ucpe_browser-dots">
          <div class="ucpe_browser-dot ucpe_dot-red"></div>
          <div class="ucpe_browser-dot ucpe_dot-yellow"></div>
          <div class="ucpe_browser-dot ucpe_dot-green"></div>
        </div>
        <div class="ucpe_browser-addressbar">
          ${channel.id === "facebook" ? "facebook.com" : channel.id === "instagram" ? "instagram.com" : channel.id === "x" ? "x.com" : channel.id === "tiktok" ? "tiktok.com" : "snapchat.com"}
        </div>
      </div>
      <div class="ucpe_browser-content">
        ${getPlatformDesktopHTML(channel, text, image)}
      </div>
    </div>
  `;
}

function getPlatformMobileHTML(channel, text, image) {
  switch (channel.id) {
    case "facebook":
      return `
        <div class="ucpe_platform-post ucpe_fb-post">
          <div class="ucpe_fb-post-header">
            <div class="ucpe_fb-avatar">${appConfig.logo ? `<img src="${appConfig.logo}" alt="Logo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : appConfig.companyName.substring(0, 2).toUpperCase()}</div>
            <div class="ucpe_fb-user-info">
              <h4>${appConfig.socialAccounts.facebook || appConfig.companyName}</h4>
              <p class="ucpe_fb-timestamp">Just now · ${icons.globe}</p>
            </div>
            <button style="border:none;background:none;cursor:pointer;margin-left:auto;">${icons.ellipsis}</button>
          </div>
          <div class="ucpe_fb-post-text">${text.replace(/\n/g, "<br>")}</div>
          <img src="${getImageSrc(image)}" alt="Post visual" class="ucpe_fb-post-image">
          <div class="ucpe_fb-post-actions">
            <div class="ucpe_fb-action" style="display:flex;align-items:center;gap:6px;">${icons.like} Like</div>
            <div class="ucpe_fb-action" style="display:flex;align-items:center;gap:6px;">${icons.comment} Comment</div>
            <div class="ucpe_fb-action" style="display:flex;align-items:center;gap:6px;">${icons.share} Share</div>
          </div>
        </div>
      `;

    case "instagram":
      return `
        <div class="ucpe_platform-post ucpe_ig-post">
          <div class="ucpe_ig-post-header">
            <div class="ucpe_ig-avatar">${appConfig.logo ? `<img src="${appConfig.logo}" alt="Logo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : appConfig.companyName.substring(0, 2).toUpperCase()}</div>
            <div class="ucpe_ig-username">${appConfig.socialAccounts.instagram || appConfig.companyName.toLowerCase().replace(/\s+/g, "")}</div>
            <button style="border:none;background:none;cursor:pointer;margin-left:auto;">${icons.ellipsis}</button>
          </div>
          <img src="${getImageSrc(image)}" alt="Post visual" class="ucpe_ig-post-image">
          <div class="ucpe_ig-post-actions">
            ${icons.heart}
            ${icons.comment}
            ${icons.send}
            <span style="margin-left:auto; margin-top: -10px">${icons.bookmark}</span>
          </div>
          <div class="ucpe_ig-post-caption">
            <span class="ucpe_ig-username-caption">${appConfig.socialAccounts.instagram || appConfig.companyName.toLowerCase().replace(/\s+/g, "")}</span>${text.replace(/\n/g, "<br>")}
          </div>
        </div>
      `;

    case "x":
      return `
        <div class="ucpe_platform-post twitter-post">
          <div class="ucpe_twitter-post-header">
            <div class="ucpe_twitter-avatar">${appConfig.logo ? `<img src="${appConfig.logo}" alt="Logo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : appConfig.companyName.substring(0, 2).toUpperCase()}</div>
            <div class="ucpe_twitter-user-info">
              <div style="display: flex; align-items: center; gap: 4px;">
                <h4 style="margin: 0; font-size: 15px; font-weight: 700;">${appConfig.socialAccounts.x || appConfig.companyName}</h4>
                <i class="fa-solid fa-circle-check" style="color: #1d9bf0;"></i>
              </div>
              <p style="margin: 0; font-size: 14px; color: #536471;">@${appConfig.socialAccounts.x || appConfig.companyName.toLowerCase().replace(/\s+/g, "")} · Just now</p>
            </div>
          </div>
          <div class="ucpe_twitter-post-text">${text.replace(/\n/g, "<br>")}</div>
          <img src="${getImageSrc(image)}" alt="Post visual" class="ucpe_twitter-post-image">
          <div class="ucpe_twitter-post-actions">
            <div class="ucpe_twitter-action">
              <i class="fa-regular fa-comment" style="font-size: 18px; color: #536471;"></i>
              <span>Reply</span>
            </div>
            <div class="ucpe_twitter-action">
              <i class="fa-solid fa-retweet" style="font-size: 18px; color: #536471;"></i>
              <span>Repost</span>
            </div>
            <div class="ucpe_twitter-action">
              <i class="fa-regular fa-heart" style="font-size: 18px; color: #536471;"></i>
              <span>Like</span>
            </div>
            <div class="ucpe_twitter-action">
              <i class="fa-solid fa-arrow-up-from-bracket" style="font-size: 18px; color: #536471;"></i>
              <span>Share</span>
            </div>
          </div>
        </div>
      `;

    case "tiktok":
      return `
        <div class="ucpe_platform-post ucpe_tiktok-post">
          <img src="${getImageSrc(image)}" alt="Background" class="ucpe_tiktok-bg">
          <div class="ucpe_tiktok-content">
            <div class="ucpe_tiktok-user">@${appConfig.socialAccounts.tiktok || appConfig.companyName.toLowerCase().replace(/\s+/g, "")}</div>
            <div class="ucpe_tiktok-text">${text.replace(/\n/g, "<br>")}</div>
          </div>
        </div>
      `;

    case "snapchat":
      return `
        <div class="ucpe_platform-post snap-post">
          <img src="${getImageSrc(image)}" alt="Snap background" class="ucpe_snap-image">
          <div class="ucpe_snap-text-overlay">${text.split("\n")[0]}</div>
        </div>
      `;

    default:
      return `<div style="padding: 20px;">${text}</div>`;
  }
}

function getPlatformDesktopHTML(channel, text, image) {
  // Desktop versions - similar structure but wider layouts
  switch (channel.id) {
    case "facebook":
      return `
        <div class="ucpe_platform-post ucpe_fb-post" style="padding: 20px 0;">
          <div class="ucpe_fb-post-header">
            <div class="ucpe_fb-avatar" style="width: 40px; height: 40px;">${appConfig.logo ? `<img src="${appConfig.logo}" alt="Logo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : appConfig.companyName.substring(0, 2).toUpperCase()}</div>
            <div class="ucpe_fb-user-info">
              <h4>${appConfig.socialAccounts.facebook || appConfig.companyName}</h4>
              <p class="fb-timestamp">Just now · ${icons.globe}</p>
            </div>
            <button style="border:none;background:none;cursor:pointer;margin-left:auto;">${icons.ellipsis}</button>
          </div>
          <div class="ucpe_fb-post-text">${text.replace(/\n/g, "<br>")}</div>
          <img src="${getImageSrc(image)}" alt="Post visual" class="ucpe_fb-post-image" style="max-height: 600px;">
          <div class="ucpe_fb-post-actions">
            <div class="ucpe_fb-action" style="display:flex;align-items:center;gap:6px;">${icons.like} Like</div>
            <div class="ucpe_fb-action" style="display:flex;align-items:center;gap:6px;">${icons.comment} Comment</div>
            <div class="ucpe_fb-action" style="display:flex;align-items:center;gap:6px;">${icons.share} Share</div>
          </div>
        </div>
      `;

    case "instagram":
      return `
        <div style="display: flex; justify-content: center; padding: 40px 0; background: #fafafa;">
          <div class="ucpe_platform-post ucpe_ig-post" style="max-width: 614px;">
            <div class="ucpe_ig-post-header">
              <div class="ucpe_ig-avatar">${appConfig.logo ? `<img src="${appConfig.logo}" alt="Logo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : appConfig.companyName.substring(0, 2).toUpperCase()}</div>
              <div class="ucpe_ig-username">${appConfig.socialAccounts.instagram || appConfig.companyName.toLowerCase().replace(/\s+/g, "")}</div>
              <button style="border:none;background:none;cursor:pointer;margin-left:auto;">${icons.ellipsis}</button>
            </div>
            <img src="${getImageSrc(image)}" alt="Post visual" class="ucpe_ig-post-image">
            <div class="ucpe_ig-post-actions">
              ${icons.heart}
              ${icons.comment}
              ${icons.send}
              <span style="margin-left:auto;">${icons.bookmark}</span>
            </div>
            <div class="ucpe_ig-post-caption">
              <span class="ucpe_ig-username-caption">${appConfig.socialAccounts.instagram || appConfig.companyName.toLowerCase().replace(/\s+/g, "")}</span>${text.replace(/\n/g, "<br>")}
            </div>
          </div>
        </div>
      `;

    case "x":
      return `
        <div style="display: flex; justify-content: center; padding: 20px 0; background: #fff;">
          <div class="ucpe_platform-post ucpe_twitter-post" style="max-width: 600px; width: 100%;">
            <div class="ucpe_twitter-post-header">
              <div class="ucpe_twitter-avatar" style="width: 48px; height: 48px;">${appConfig.logo ? `<img src="${appConfig.logo}" alt="Logo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : appConfig.companyName.substring(0, 2).toUpperCase()}</div>
              <div class="ucpe_twitter-user-info">
                <div style="display: flex; align-items: center; gap: 4px;">
                  <h4 style="margin: 0; font-size: 15px; font-weight: 700;">${appConfig.socialAccounts.x || appConfig.companyName}</h4>
                  <i class="fa-solid fa-circle-check" style="color: #1d9bf0;"></i>
                </div>
                <p style="margin: 0; font-size: 14px; color: #536471;">@${appConfig.socialAccounts.x || appConfig.companyName.toLowerCase().replace(/\s+/g, "")} · Just now</p>
              </div>
            </div>
            <div class="ucpe_twitter-post-text">${text.replace(/\n/g, "<br>")}</div>
            <img src="${getImageSrc(image)}" alt="Post visual" class="ucpe_twitter-post-image">
            <div class="ucpe_twitter-post-actions">
              <div class="ucpe_twitter-action">
                <i class="fa-regular fa-comment" style="font-size: 18px; color: #536471;"></i>
                <span>Reply</span>
              </div>
              <div class="ucpe_twitter-action">
                <i class="fa-solid fa-retweet" style="font-size: 18px; color: #536471;"></i>
                <span>Repost</span>
              </div>
              <div class="ucpe_twitter-action">
                <i class="fa-regular fa-heart" style="font-size: 18px; color: #536471;"></i>
                <span>Like</span>
              </div>
              <div class="ucpe_twitter-action">
                <i class="fa-solid fa-arrow-up-from-bracket" style="font-size: 18px; color: #536471;"></i>
                <span>Share</span>
              </div>
            </div>
          </div>
        </div>
      `;

    case "tiktok":
      return `
        <div style="display: flex; justify-content: center; padding: 20px 0; background: #000;">
          <div class="ucpe_platform-post ucpe_tiktok-post" style="max-width: 500px;">
            <img src="${getImageSrc(image)}" alt="Background" class="ucpe_tiktok-bg">
            <div class="ucpe_tiktok-content">
              <div class="ucpe_tiktok-user">@${appConfig.socialAccounts.tiktok || appConfig.companyName.toLowerCase().replace(/\s+/g, "")}</div>
              <div class="ucpe_tiktok-text">${text.replace(/\n/g, "<br>")}</div>
            </div>
          </div>
        </div>
      `;

    case "snapchat":
      return `
        <div style="display: flex; justify-content: center; padding: 20px 0; background: #000;">
          <div class="ucpe_platform-post ucpe_snap-post" style="max-width: 400px;">
            <img src="${getImageSrc(image)}" alt="Snap background" class="ucpe_snap-image">
            <div class="ucpe_snap-text-overlay">${text.split("\n")[0]}</div>
          </div>
        </div>
      `;

    default:
      return `<div style="padding: 40px; text-align: center;">${text}</div>`;
  }
}

// Handle approvals and publish state
function updatePublishState() {
  const selected = getSelectedChannels();
  if (!selected.length) {
    publishBtn.disabled = true;
    if (publishSummary) {
      publishSummary.innerHTML =
        "Select channels and approve to enable publish.";
    }
    return;
  }

  const allApproved = selected.every(
    (id) => approvalState.get(id) === "approved",
  );
  publishBtn.disabled = false;

  // Update summary
  if (publishSummary) {
    const channelNames = selected
      .map((id) => {
        const ch = channels.find((c) => c.id === id);
        const status = approvalState.get(id);
        return `<div style="margin: 8px 0;"><strong>${ch.name}</strong>: ${status === "approved" ? "✓ Approved" : "⏳ Pending"}</div>`;
      })
      .join("");

    publishSummary.innerHTML = `
      <div>${channelNames}</div>
      <div style="margin-top: 12px; color: var(--muted);">
        ${allApproved ? "All selected platforms approved. Ready to publish." : "Approve all selected platforms to enable publishing."}
      </div>
    `;
  }

  // Update fee breakdown
  updateFees();
}

function updateFees() {
  const selected = getSelectedChannels();
  const baseFee = 15;
  let platformFee = 0;

  const platformFeesEl = document.getElementById("ucpe_platform-fees");
  if (platformFeesEl) {
    platformFeesEl.innerHTML = selected
      .map((id) => {
        const ch = channels.find((c) => c.id === id);
        platformFee += ch.fee;
        return `
        <div class="ucpe_platform-fee-item">
          <span>${ch.name}</span>
          <span>$${ch.fee}.00</span>
        </div>
      `;
      })
      .join("");
  }

  const totalFeeEl = document.getElementById("ucpe_total-fee");
  if (totalFeeEl) {
    totalFeeEl.textContent = `$${baseFee + platformFee}.00`;
  }
}

// Step navigation
function showError(stepNumber, message) {
  // Clear all errors first
  document.querySelectorAll(".ucpe_error-message").forEach((el) => {
    el.classList.remove("ucpe_show");
    el.textContent = "";
  });

  // Show specific error
  const errorEl = document.getElementById(`ucpe_error-step-${stepNumber}`);
  if (errorEl && message) {
    errorEl.textContent = message;
    errorEl.classList.add("ucpe_show");
    errorEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function clearError(stepNumber) {
  const errorEl = document.getElementById(`ucpe_error-step-${stepNumber}`);
  if (errorEl) {
    errorEl.classList.remove("show");
    errorEl.textContent = "";
  }
}

function showStep(stepNumber) {
  document.querySelectorAll(".ucpe_step-content").forEach((el) => {
    el.classList.remove("ucpe_active");
  });
  const targetStep = document.querySelector(
    `.ucpe_step-content[data-step="${stepNumber}"]`,
  );
  if (targetStep) {
    targetStep.classList.add("ucpe_active");
    currentStep = stepNumber;
    setProgressActive(stepNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function navigateStep(direction) {
  let nextStep = currentStep;

  if (direction === "next") {
    // Validate current step before proceeding
    if (currentStep === 1) {
      const title = document.getElementById("ucpe_post-title").value.trim();
      const content = document.getElementById("ucpe_post-content").value.trim();
      if (!title || !content) {
        showError(
          1,
          "⚠️ Please fill in both title and content before proceeding.",
        );
        return;
      }
      clearError(1);
    }
    if (currentStep === 3) {
      const selected = getSelectedChannels();
      if (!selected.length) {
        showError(3, "⚠️ Please select at least one social media channel.");
        return;
      }
      clearError(3);
    }
    nextStep = Math.min(currentStep + 1, totalSteps);
  } else if (direction === "prev") {
    nextStep = Math.max(currentStep - 1, 1);
    // Clear errors when going back
    clearError(currentStep);
  }

  showStep(nextStep);
}

// Main generation handler
function handleGenerate() {
  const baseTitle = document.getElementById("ucpe_post-title").value.trim();
  const baseContent = document.getElementById("ucpe_post-content").value.trim();
  const selected = getSelectedChannels();
  const generateBtn = document.getElementById("ucpe_generate-btn-step3");

  if (!baseTitle || !baseContent) {
    showError(3, "⚠️ Please provide a title and base content.");
    return;
  }
  if (!selected.length) {
    showError(3, "⚠️ Select at least one channel.");
    return;
  }

  clearError(3);

  // Show loading state
  if (generateBtn) {
    generateBtn.disabled = true;
    generateBtn.innerHTML =
      '<span style="display: inline-flex; align-items: center; gap: 8px;"><i class="fa-solid fa-spinner fa-spin"></i> Generating...</span>';
  }

  // Simulate async generation with timeout
  setTimeout(() => {
    try {
      generatedOutputs = selected.map((id) => ({
        id,
        text: generateTextFor(id, baseTitle, baseContent),
      }));
      selected.forEach((id) => approvalState.set(id, "pending"));

      renderReviewCards();
      updatePublishState();

      // Restore button and navigate to review step
      if (generateBtn) {
        generateBtn.disabled = false;
        generateBtn.innerHTML =
          '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate';
      }

      // Auto-advance to review step (now step 4 instead of 5)
      setTimeout(() => showStep(4), 300);
    } catch (error) {
      // On error, show error message and restore button
      if (generateBtn) {
        generateBtn.disabled = false;
        generateBtn.innerHTML =
          '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate';
      }
      showError(3, "⚠️ Failed to generate posts. Please try again.");
    }
  }, 1000); // Simulate 1 second loading time
}

// Progress indicator helper
function setProgressActive(stepNumber) {
  document.querySelectorAll(".ucpe_stepper-item").forEach((el) => {
    const step = Number(el.dataset.step);
    el.classList.toggle("ucpe_active", step === stepNumber);
    el.classList.toggle("ucpe_completed", step < stepNumber);
  });
}

// Handle card actions (approve/edit/improve)
function handleCardAction(e) {
  const actionBtn = e.target.closest("button[data-action]");
  if (!actionBtn) return;
  const card = e.target.closest(".preview-card");
  const id = card?.dataset.id;
  const textarea = card.querySelector(".ucpe_preview-textarea");
  if (!id || !textarea) return;

  if (actionBtn.dataset.action === "approve") {
    approvalState.set(id, "approved");
    card.querySelector(".ucpe_status-pill").textContent = "Approved";
    card.querySelector(".ucpe_status-pill").className =
      "ucpe_status-pill ucpe_status-approved";
    updatePublishState();
  }

  if (actionBtn.dataset.action === "edit") {
    textarea.focus();
    textarea.classList.add("ucpe_highlight-edit");
    setTimeout(() => textarea.classList.remove("ucpe_highlight-edit"), 700);
  }

  if (actionBtn.dataset.action === "improve") {
    textarea.value = `${textarea.value}\n\nAI tweak: Sharpened CTA and clarity.`;
    const idx = generatedOutputs.findIndex((o) => o.id === id);
    if (idx >= 0) generatedOutputs[idx].text = textarea.value;
    renderReviewCards();
    updatePublishState();
  }
}

function handlePreviewActions(action) {
  if (!currentPlatformView) return;

  if (action === "approve") {
    approvalState.set(currentPlatformView, "approved");
    renderReviewCards();
    updatePublishState();
  }

  if (action === "edit") {
    openEditModal();
  }

  if (action === "improve") {
    const idx = generatedOutputs.findIndex((o) => o.id === currentPlatformView);
    if (idx >= 0) {
      generatedOutputs[idx].text +=
        "\n\nAI enhanced: Improved engagement & clarity.";
      renderPlatformPreview();
    }
  }
}

function openEditModal() {
  const output = generatedOutputs.find((o) => o.id === currentPlatformView);
  const channel = channels.find((c) => c.id === currentPlatformView);
  if (!output || !channel) return;

  const modal = document.getElementById("ucpe_edit-modal");
  const textarea = document.getElementById("ucpe_modal-text");
  const info = document.getElementById("ucpe_modal-platform-info");

  textarea.value = output.text;
  info.textContent = `Editing ${channel.name} post · Max ${channel.maxChars} characters · ${channel.style}`;

  modal.classList.add("ucpe_show");
  textarea.focus();
}

function closeEditModal() {
  const modal = document.getElementById("ucpe_edit-modal");
  modal.classList.remove("ucpe_show");
}

function saveEditModal() {
  const textarea = document.getElementById("ucpe_modal-text");
  const newText = textarea.value;

  const idx = generatedOutputs.findIndex((o) => o.id === currentPlatformView);
  if (idx >= 0) {
    generatedOutputs[idx].text = newText;
    renderPlatformPreview();
  }

  closeEditModal();
}

function handlePlatformSwitch(platformId) {
  currentPlatformView = platformId;

  // Update tab states
  document.querySelectorAll(".ucpe_platform-tab").forEach((tab) => {
    tab.classList.toggle("ucpe_active", tab.dataset.platform === platformId);
  });

  renderPlatformPreview();
}

function handlePreviewToggle(e) {
  if (!e.target.matches("input[name='preview-mode']")) return;
  previewMode = e.target.value;
  renderPlatformPreview();
}

function handlePublish() {
  const selected = getSelectedChannels();
  const totalFee = document.getElementById("ucpe_total-fee").textContent;
  publishSummary.innerHTML = `
    <div style="color: var(--success); font-weight: 600;">✓ Mock publish complete!</div>
    <div style="margin-top: 8px; color: var(--muted); font-size: 14px;">
      Campaign published to ${selected.length} platform(s)<br>
      Mock charge: ${totalFee}<br>
      (Nothing actually left the browser)
    </div>
  `;
  publishBtn.disabled = true;
  publishBtn.textContent = "Published ✓";
}

// Wiring
renderGallery();
renderChannels();
showStep(1);

// Handle image upload
document
  .getElementById("ucpe_image-upload")
  ?.addEventListener("change", handleImageUpload);

// Example chip handlers
document.addEventListener("click", (e) => {
  if (e.target.matches(".ucpe_example-chip[data-example]")) {
    e.preventDefault();
    document.getElementById("ucpe_post-title").value = e.target.dataset.example;
    clearError(1);
  }
  if (e.target.matches(".ucpe_example-chip[data-content]")) {
    e.preventDefault();
    document.getElementById("ucpe_post-content").value =
      e.target.dataset.content;
    clearError(1);
  }
});

// Step navigation
document.addEventListener("click", (e) => {
  const navBtn = e.target.closest("[data-nav]");
  if (navBtn) {
    e.preventDefault();
    navigateStep(navBtn.dataset.nav);
  }

  // Handle top nav tab clicks
  const navTab = e.target.closest(".ucpe_stepper-item");
  if (navTab) {
    e.preventDefault();
    const targetStep = Number(navTab.dataset.step);
    // Prevent jumping ahead to unvalidated steps
    if (targetStep > currentStep) {
      if (!isStepValid(currentStep)) {
        return; // Stop navigation if current step is invalid
      }
    }
    showStep(targetStep);
  }
});

channelListEl.addEventListener("change", (e) => {
  updatePublishState();
});

const generateBtnStep3 = document.getElementById("ucpe_generate-btn-step3");
if (generateBtnStep3) {
  generateBtnStep3.addEventListener("click", (e) => {
    e.preventDefault();
    handleGenerate();
  });
}

document
  .querySelector(".ucpe_view-toggles")
  .addEventListener("change", handlePreviewToggle);
publishBtn.addEventListener("click", (e) => {
  e.preventDefault();
  handlePublish();
});

// Preview action buttons
document
  .getElementById("ucpe_approve-current")
  ?.addEventListener("click", (e) => {
    e.preventDefault();
    handlePreviewActions("approve");
  });
document.getElementById("ucpe_edit-current")?.addEventListener("click", (e) => {
  e.preventDefault();
  handlePreviewActions("edit");
});
document
  .getElementById("ucpe_improve-current")
  ?.addEventListener("click", (e) => {
    e.preventDefault();
    handlePreviewActions("improve");
  });

// Platform tab switching
document.addEventListener("click", (e) => {
  const platformTab = e.target.closest(".ucpe_platform-tab");
  if (platformTab) {
    e.preventDefault();
    handlePlatformSwitch(platformTab.dataset.platform);
  }
});

// Media Library Controls
document
  .getElementById("ucpe_open-media-library")
  ?.addEventListener("click", (e) => {
    e.preventDefault();
    openMediaLibrary();
  });
document
  .getElementById("ucpe_close-media-library")
  ?.addEventListener("click", (e) => {
    e.preventDefault();
    closeMediaLibrary();
  });
document
  .getElementById("ucpe_cancel-media-library")
  ?.addEventListener("click", (e) => {
    e.preventDefault();
    closeMediaLibrary();
  });
document
  .getElementById("ucpe_add-selected-media")
  ?.addEventListener("click", (e) => {
    e.preventDefault();
    addSelectedMediaToGallery();
  });

// Handle media library item selection
document.addEventListener("click", (e) => {
  const mediaItem = e.target.closest(".ucpe_media-library-item");
  if (
    mediaItem &&
    document
      .getElementById("ucpe_media-library-modal")
      .classList.contains("ucpe_show")
  ) {
    e.preventDefault();
    const src = mediaItem.dataset.src;
    if (selectedMediaItems.has(src)) {
      selectedMediaItems.delete(src);
      mediaItem.classList.remove("ucpe_selected");
    } else {
      selectedMediaItems.add(src);
      mediaItem.classList.add("ucpe_selected");
    }
  }
});

// Close media library on overlay click
document
  .getElementById("ucpe_media-library-modal")
  ?.addEventListener("click", (e) => {
    if (e.target.id === "ucpe_media-library-modal") {
      closeMediaLibrary();
    }
  });

// AI Editor Controls
document
  .getElementById("ucpe_close-ai-editor")
  ?.addEventListener("click", (e) => {
    e.preventDefault();
    closeAIEditor();
  });
document
  .getElementById("ucpe_ai-editor-back")
  ?.addEventListener("click", (e) => {
    e.preventDefault();
    closeAIEditor();
  });
document
  .getElementById("ucpe_cancel-ai-edit")
  ?.addEventListener("click", (e) => {
    e.preventDefault();
    closeAIEditor();
  });
document
  .getElementById("ucpe_apply-ai-adjustment")
  ?.addEventListener("click", (e) => {
    e.preventDefault();
    applyAIAdjustment();
  });
document.getElementById("ucpe_save-ai-edit")?.addEventListener("click", (e) => {
  e.preventDefault();
  saveAIEdit();
});

// Close AI editor on overlay click
document
  .getElementById("ucpe_ai-editor-modal")
  ?.addEventListener("click", (e) => {
    if (e.target.id === "ucpe_ai-editor-modal") {
      closeAIEditor();
    }
  });

// Modal controls
document.querySelector(".ucpe_modal-close")?.addEventListener("click", (e) => {
  e.preventDefault();
  closeEditModal();
});
document.getElementById("ucpe_modal-cancel")?.addEventListener("click", (e) => {
  e.preventDefault();
  closeEditModal();
});
document.getElementById("ucpe_modal-save")?.addEventListener("click", (e) => {
  e.preventDefault();
  saveEditModal();
});

// Close modal on overlay click
document.getElementById("ucpe_edit-modal")?.addEventListener("click", (e) => {
  if (e.target.id === "ucpe_edit-modal") {
    closeEditModal();
  }
});

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const aiModal = document.getElementById("ucpe_ai-editor-modal");
    const mediaModal = document.getElementById("ucpe_media-library-modal");
    const editModal = document.getElementById("ucpe_edit-modal");

    if (aiModal?.classList.contains("ucpe_show")) {
      closeAIEditor();
    } else if (mediaModal?.classList.contains("ucpe_show")) {
      closeMediaLibrary();
    } else if (editModal?.classList.contains("ucpe_show")) {
      closeEditModal();
    }
  }
});
// Subtle focus style for edits
const style = document.createElement("style");
style.textContent = `.ucpe_highlight-edit { outline: 2px solid var(--accent); }`;
document.head.appendChild(style);
