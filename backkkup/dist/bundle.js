(() => {
  "use strict";
  class e {
    constructor() {
      ((this.companyName = "Business Central"),
        (this.logo = null),
        (this.brandColors = {
          primary: "#2563ff",
          secondary: "#8b5cf6",
          accent: "#e1306c",
        }),
        (this.socialAccounts = {
          facebook: null,
          instagram: null,
          tiktok: null,
          snapchat: null,
          x: null,
        }),
        (this.organizationId = null),
        (this.locationId = null),
        (this.userId = null));
    }
    update(e) {
      (e.companyName && (this.companyName = e.companyName),
        e.logo && (this.logo = e.logo),
        e.brandColors && Object.assign(this.brandColors, e.brandColors),
        e.socialAccounts &&
          Object.assign(this.socialAccounts, e.socialAccounts),
        e.organizationId && (this.organizationId = e.organizationId),
        e.locationId && (this.locationId = e.locationId),
        e.userId && (this.userId = e.userId));
    }
    getConfig() {
      return {
        companyName: this.companyName,
        logo: this.logo,
        brandColors: Object.assign({}, this.brandColors),
        socialAccounts: Object.assign({}, this.socialAccounts),
        organizationId: this.organizationId,
        locationId: this.locationId,
        userId: this.userId,
      };
    }
  }
  class t {
    constructor(e) {
      ((this.id = e.id),
        (this.type = e.type),
        (this.src = e.src),
        (this.selected = e.selected));
    }
    toggle() {
      this.selected = !this.selected;
    }
  }
  class n {
    constructor() {
      ((this.images = []),
        (this.imageIdCounter = 0),
        (this.defaultImages = ["image.jpeg", "photo.jpeg", "banner.jpeg"]),
        this.loadDefaultImages());
    }
    loadDefaultImages() {
      this.defaultImages.length > 0 &&
        this.defaultImages.forEach((e, t) => {
          this.addImage({
            id: `default-${t + 1}`,
            type: "Default",
            src: `images/${e}`,
            selected: 0 === t,
          });
        });
    }
    addImage(e) {
      this.images.push(new t(e));
    }
    addUploadedImage(e) {
      (this.imageIdCounter++,
        this.addImage({
          id: `upload-${this.imageIdCounter}`,
          type: "Uploaded",
          src: e,
          selected: !1,
        }));
    }
    toggleImage(e) {
      const t = this.images.find((t) => t.id === e);
      t && t.toggle();
    }
    getImages() {
      return this.images;
    }
    getSelectedImages() {
      const e = this.images.filter((e) => e.selected);
      return e.length ? e : this.images.slice(0, 1);
    }
    clear() {
      ((this.images = []), (this.imageIdCounter = 0), this.loadDefaultImages());
    }
  }
  class s {
    generateTextFor(e, t, n) {
      const s = n.trim();
      switch (e) {
        case "facebook":
          return `${t} — ${s}\n\n${s}\n#community #update`;
        case "instagram":
          return `${s}\n✨ ${t}\n${this.hashtags(s, 3)}`;
        case "twitter":
        case "x":
          return `${t}\n\n${s.slice(0, 200)}\n${this.hashtags(s, 2)}`;
        case "snapchat":
          return `${s.slice(0, 70)}... ⚡`;
        case "tiktok":
          return `${this.hookify(t)}\n${s}\n${this.hashtags(s, 2)} #ForYou`;
        default:
          return s;
      }
    }
    hashtags(e, t) {
      return e
        .split(/\s+/)
        .filter((e) => e.length > 4)
        .slice(0, t)
        .map((e) => `#${e.replace(/[^a-z0-9]/gi, "")}`.toLowerCase())
        .join(" ");
    }
    hookify(e) {
      return `🎯 ${e.slice(0, 40) || "Big news"}?`;
    }
  }
  class a {
    constructor() {
      this.approvalState = new Map();
    }
    setApproval(e, t) {
      this.approvalState.set(e, t);
    }
    getApproval(e) {
      return this.approvalState.get(e) || "pending";
    }
    isApproved(e) {
      return "approved" === this.approvalState.get(e);
    }
    areAllApproved(e) {
      return e.every((e) => this.isApproved(e));
    }
    clear() {
      this.approvalState.clear();
    }
    initializeChannels(e) {
      e.forEach((e) => {
        this.approvalState.has(e) || this.approvalState.set(e, "pending");
      });
    }
  }
  class i {
    constructor() {
      this.baseFee = 15;
    }
    calculatePlatformFee(e) {
      return e.reduce((e, t) => e + t.fee, 0);
    }
    calculateTotalFee(e) {
      return this.baseFee + this.calculatePlatformFee(e);
    }
    getBaseFee() {
      return this.baseFee;
    }
  }
  class o {
    constructor() {
      ((this.currentStep = 1),
        (this.totalSteps = 6),
        this.setupEventListeners());
    }
    setupEventListeners() {
      document.addEventListener("click", (e) => {
        const t = e.target,
          n = t.closest("[data-nav]");
        if (n) return void this.navigate(n.dataset.nav);
        const s = t.closest(".ucpe_stepper-item");
        if (s) {
          const e = Number(s.dataset.step);
          (e <= this.currentStep || this.isStepValid(this.currentStep)) &&
            this.showStep(e);
        }
      });
    }
    navigate(e) {
      let t = this.currentStep;
      if ("next" === e) {
        if (!this.validateCurrentStep()) return;
        t = Math.min(this.currentStep + 1, this.totalSteps);
      } else
        "prev" === e &&
          ((t = Math.max(this.currentStep - 1, 1)),
          this.clearError(this.currentStep));
      this.showStep(t);
    }
    validateCurrentStep() {
      var e, t;
      if (1 === this.currentStep) {
        const n =
            null === (e = document.getElementById("ucpe_post-title")) ||
            void 0 === e
              ? void 0
              : e.value.trim(),
          s =
            null === (t = document.getElementById("ucpe_post-content")) ||
            void 0 === t
              ? void 0
              : t.value.trim();
        if (!n || !s)
          return (
            this.showError(
              1,
              "⚠️ Please fill in both title and content before proceeding.",
            ),
            !1
          );
        this.clearError(1);
      }
      if (3 === this.currentStep) {
        if (
          0 ===
          Array.from(
            document.querySelectorAll(
              '#ucpe_channel-list input[type="checkbox"]:checked',
            ),
          ).length
        )
          return (
            this.showError(
              3,
              "⚠️ Please select at least one social media channel.",
            ),
            !1
          );
        this.clearError(3);
      }
      return !0;
    }
    isStepValid(e) {
      return !0;
    }
    showStep(e) {
      document.querySelectorAll(".ucpe_step-content").forEach((e) => {
        e.classList.remove("ucpe_active");
      });
      const t = document.querySelector(`.ucpe_step-content[data-step="${e}"]`);
      t &&
        (t.classList.add("ucpe_active"),
        (this.currentStep = e),
        this.setProgressActive(e),
        window.scrollTo({ top: 0, behavior: "smooth" }),
        this.onStepChangeCallback && this.onStepChangeCallback(e));
    }
    setProgressActive(e) {
      document.querySelectorAll(".ucpe_stepper-item").forEach((t) => {
        const n = Number(t.dataset.step);
        (t.classList.toggle("ucpe_active", n === e),
          t.classList.toggle("ucpe_completed", n < e));
      });
    }
    showError(e, t) {
      this.clearAllErrors();
      const n = document.getElementById(`ucpe_error-step-${e}`);
      n &&
        t &&
        ((n.textContent = t),
        n.classList.add("ucpe_show"),
        n.scrollIntoView({ behavior: "smooth", block: "nearest" }));
    }
    clearError(e) {
      const t = document.getElementById(`ucpe_error-step-${e}`);
      t && (t.classList.remove("ucpe_show"), (t.textContent = ""));
    }
    clearAllErrors() {
      document.querySelectorAll(".ucpe_error-message").forEach((e) => {
        (e.classList.remove("ucpe_show"), (e.textContent = ""));
      });
    }
    getCurrentStep() {
      return this.currentStep;
    }
    onStepChange(e) {
      this.onStepChangeCallback = e;
    }
  }
  class r {
    constructor(e) {
      ((this.galleryService = e),
        (this.galleryEl = document.getElementById("ucpe_gallery")),
        this.setupEventListeners());
    }
    setupEventListeners() {
      const e = document.getElementById("ucpe_image-upload");
      e && e.addEventListener("change", (e) => this.handleImageUpload(e));
    }
    handleImageUpload(e) {
      const t = e.target,
        n = t.files;
      n &&
        0 !== n.length &&
        (Array.from(n).forEach((e) => {
          if (!e.type.startsWith("image/"))
            return void console.warn("Skipping non-image file:", e.name);
          const t = new FileReader();
          ((t.onload = (e) => {
            var t;
            (null === (t = e.target) || void 0 === t ? void 0 : t.result) &&
              (this.galleryService.addUploadedImage(e.target.result),
              this.render());
          }),
            t.readAsDataURL(e));
        }),
        (t.value = ""));
    }
    render() {
      this.galleryEl.innerHTML = "";
      const e = this.galleryService.getImages();
      0 !== e.length
        ? e.forEach((e) => {
            const t = document.createElement("div");
            ((t.className = "ucpe_image-card"),
              e.selected && t.classList.add("ucpe_selected"),
              (t.dataset.id = e.id),
              (t.innerHTML = `\n        <span class="ucpe_badge">${e.type}</span>\n        <img src="${e.src}" alt="${e.type}" onerror="this.parentElement.style.display='none'">\n      `),
              t.addEventListener("click", () => {
                (this.galleryService.toggleImage(e.id), this.render());
              }),
              this.galleryEl.appendChild(t));
          })
        : (this.galleryEl.innerHTML =
            '<p style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 20px;">Upload images using the button above, or add image filenames to the defaultImages array</p>');
    }
  }
  const l = [
    {
      id: "facebook",
      name: "Facebook",
      maxChars: 2200,
      style: "Conversational",
      color: "#1877f2",
      icon: "images/icons/facebook.jpg",
      fee: 5,
    },
    {
      id: "instagram",
      name: "Instagram",
      maxChars: 2200,
      style: "Snappy captions",
      color: "#e1306c",
      icon: "images/icons/instagram.jpg",
      fee: 5,
    },
    {
      id: "snapchat",
      name: "Snapchat",
      maxChars: 80,
      style: "Punchy, to-the-point",
      color: "#fffc00",
      icon: "images/icons/snapchat.png",
      fee: 7,
    },
    {
      id: "tiktok",
      name: "TikTok",
      maxChars: 150,
      style: "Hook first, hashtag later",
      color: "#111",
      icon: "images/icons/tiktok.png",
      fee: 8,
    },
    {
      id: "x",
      name: "X",
      maxChars: 150,
      style: "Hook first, hashtag later",
      color: "#111",
      icon: "images/icons/x.png",
      fee: 8,
    },
  ];
  class c {
    constructor() {
      ((this.channels = l),
        (this.channelListEl = document.getElementById("ucpe_channel-list")),
        this.setupEventListeners());
    }
    setupEventListeners() {
      this.channelListEl.addEventListener("change", () => {
        this.onChangeCallback && this.onChangeCallback();
      });
    }
    render() {
      ((this.channelListEl.innerHTML = ""),
        this.channels.forEach((e) => {
          const t = document.createElement("label");
          ((t.className = "ucpe_channel-card"),
            (t.innerHTML = `\n        <div class="ucpe_channel-head">\n          <div style="display: flex; align-items: center; gap: 10px;">\n            <img src="${e.icon}" alt="${e.name}" style="width: 24px; height: 24px; object-fit: contain;">\n            <div>\n              <strong>${e.name}</strong>\n              <div class="ucpe_channel-meta">Max ${e.maxChars} chars · ${e.style}</div>\n            </div>\n          </div>\n          <input type="checkbox" value="${e.id}">\n        </div>\n      `),
            this.channelListEl.appendChild(t));
        }));
    }
    getSelectedChannels() {
      return Array.from(
        this.channelListEl.querySelectorAll('input[type="checkbox"]:checked'),
      ).map((e) => e.value);
    }
    onChange(e) {
      this.onChangeCallback = e;
    }
  }
  class d {
    static getIcon(e) {
      return this.icons.get(e) || "";
    }
  }
  d.icons = new Map([
    [
      "like",
      '<svg class="ucpe_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>',
    ],
    [
      "comment",
      '<svg class="ucpe_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>',
    ],
    [
      "share",
      '<svg class="ucpe_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>',
    ],
    [
      "heart",
      '<svg class="ucpe_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>',
    ],
    [
      "heartFilled",
      '<svg class="ucpe_icon" fill="currentColor" viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"></path></svg>',
    ],
    [
      "send",
      '<svg class="ucpe_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>',
    ],
    [
      "bookmark",
      '<svg class="ucpe_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>',
    ],
    [
      "globe",
      '<svg class="ucpe_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
    ],
    [
      "ellipsis",
      '<svg class="ucpe_icon" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>',
    ],
  ]);
  class p {
    constructor(e, t) {
      ((this.previewMode = "mobile"),
        (this.currentPlatformView = null),
        (this.generatedOutputs = []),
        (this.config = e),
        (this.approvalService = t),
        this.setupEventListeners());
    }
    setupEventListeners() {
      var e, t, n;
      const s = document.querySelector(".ucpe_view-toggles");
      (s && s.addEventListener("change", (e) => this.handlePreviewToggle(e)),
        document.addEventListener("click", (e) => {
          const t = e.target.closest(".ucpe_platform-tab");
          t && this.handlePlatformSwitch(t.dataset.platform);
        }),
        null === (e = document.getElementById("ucpe_approve-current")) ||
          void 0 === e ||
          e.addEventListener("click", () =>
            this.handlePreviewActions("approve"),
          ),
        null === (t = document.getElementById("ucpe_edit-current")) ||
          void 0 === t ||
          t.addEventListener("click", () => this.handlePreviewActions("edit")),
        null === (n = document.getElementById("ucpe_improve-current")) ||
          void 0 === n ||
          n.addEventListener("click", () =>
            this.handlePreviewActions("improve"),
          ));
    }
    handlePreviewToggle(e) {
      const t = e.target;
      "preview-mode" === t.name &&
        ((this.previewMode = t.value), this.renderPlatformPreview());
    }
    handlePlatformSwitch(e) {
      ((this.currentPlatformView = e),
        document.querySelectorAll(".ucpe_platform-tab").forEach((t) => {
          t.classList.toggle("ucpe_active", t.dataset.platform === e);
        }),
        this.renderPlatformPreview());
    }
    handlePreviewActions(e) {
      if (this.currentPlatformView)
        if ("approve" === e)
          (this.approvalService.setApproval(
            this.currentPlatformView,
            "approved",
          ),
            this.renderReviewCards());
        else if ("edit" === e) this.openEditModal();
        else if ("improve" === e) {
          const e = this.generatedOutputs.findIndex(
            (e) => e.id === this.currentPlatformView,
          );
          e >= 0 &&
            ((this.generatedOutputs[e].text +=
              "\n\n✨ AI enhanced: Improved engagement & clarity."),
            this.renderPlatformPreview());
        }
    }
    setGeneratedOutputs(e, t) {
      ((this.generatedOutputs = e),
        (this.currentPlatformView = t[0] || null),
        this.renderReviewCards());
    }
    renderReviewCards() {
      const e = this.getSelectedChannelIds();
      if (0 === e.length) return;
      const t = document.getElementById("ucpe_platform-tabs");
      (t &&
        (t.innerHTML = e
          .map((e) => {
            const t = l.find((t) => t.id === e),
              n = this.approvalService.getApproval(e);
            return `\n          <button class="ucpe_platform-tab ${e === this.currentPlatformView ? "active" : ""}" data-platform="${e}">\n            <img src="${null == t ? void 0 : t.icon}" alt="${null == t ? void 0 : t.name}" class="ucpe_platform-tab-icon" style="width: 20px; height: 20px; object-fit: contain;">\n            <span>${null == t ? void 0 : t.name}</span>\n            ${"approved" === n ? '<span style="color: var(--success)">✓</span>' : ""}\n          </button>\n        `;
          })
          .join("")),
        this.renderPlatformPreview());
    }
    getSelectedChannelIds() {
      return this.generatedOutputs.map((e) => e.id);
    }
    renderPlatformPreview() {
      const e = document.getElementById("ucpe_preview-container");
      if (!e || !this.currentPlatformView) return;
      const t = this.generatedOutputs.find(
        (e) => e.id === this.currentPlatformView,
      );
      if (!t) return;
      const n = l.find((e) => e.id === this.currentPlatformView);
      if (!n) return;
      const s = { src: "images/image.jpeg" };
      "mobile" === this.previewMode
        ? (e.innerHTML = this.renderMobilePreview(n, t.text, s))
        : (e.innerHTML = this.renderDesktopPreview(n, t.text, s));
    }
    renderMobilePreview(e, t, n) {
      return `\n      <div class="ucpe_phone-frame">\n        <div class="ucpe_phone-notch"></div>\n        <div class="ucpe_phone-screen">\n          <div class="ucpe_phone-statusbar">\n            <span>9:41</span>\n            <span style="display:flex;gap:4px;align-items:center;">\n              <svg width="16" height="12" viewBox="0 0 16 12"><rect width="14" height="10" x="1" y="1" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M15 4v4" stroke="currentColor" stroke-width="1.5"/></svg>\n              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>\n            </span>\n          </div>\n          <div class="ucpe_phone-content">\n            ${this.getPlatformHTML(e, t, n, "mobile")}\n          </div>\n        </div>\n      </div>\n    `;
    }
    renderDesktopPreview(e, t, n) {
      return `\n      <div class="ucpe_desktop-frame">\n        <div class="ucpe_browser-chrome">\n          <div class="ucpe_browser-dots">\n            <div class="ucpe_browser-dot ucpe_dot-red"></div>\n            <div class="ucpe_browser-dot ucpe_dot-yellow"></div>\n            <div class="ucpe_browser-dot ucpe_dot-green"></div>\n          </div>\n          <div class="ucpe_browser-addressbar">\n            ${e.id}.com\n          </div>\n        </div>\n        <div class="ucpe_browser-content">\n          ${this.getPlatformHTML(e, t, n, "desktop")}\n        </div>\n      </div>\n    `;
    }
    getPlatformHTML(e, t, n, s) {
      const a = this.config.getConfig(),
        i = t.replace(/\n/g, "<br>");
      switch (e.id) {
        case "facebook":
          return this.renderFacebookPost(i, n, a, s);
        case "instagram":
          return this.renderInstagramPost(i, n, a, s);
        case "x":
          return this.renderTwitterPost(i, n, a, s);
        case "tiktok":
          return this.renderTikTokPost(i, n, a, s);
        case "snapchat":
          return this.renderSnapchatPost(i, n, a, s);
        default:
          return `<div style="padding: 20px;">${i}</div>`;
      }
    }
    renderFacebookPost(e, t, n, s) {
      return `\n      <div class="ucpe_platform-post ucpe_fb-post">\n        <div class="ucpe_fb-post-header">\n          <div class="ucpe_fb-avatar">${n.logo ? `<img src="${n.logo}" alt="Logo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : n.companyName.substring(0, 2).toUpperCase()}</div>\n          <div class="ucpe_fb-user-info">\n            <h4>${n.socialAccounts.facebook || n.companyName}</h4>\n            <p class="ucpe_fb-timestamp">Just now · ${d.getIcon("globe")}</p>\n          </div>\n          <button style="border:none;background:none;cursor:pointer;margin-left:auto;">${d.getIcon("ellipsis")}</button>\n        </div>\n        <div class="ucpe_fb-post-text">${e}</div>\n        <img src="${t.src}" alt="Post visual" class="ucpe_fb-post-image">\n        <div class="ucpe_fb-post-actions">\n          <div class="ucpe_fb-action">${d.getIcon("like")} Like</div>\n          <div class="ucpe_fb-action">${d.getIcon("comment")} Comment</div>\n          <div class="ucpe_fb-action">${d.getIcon("share")} Share</div>\n        </div>\n      </div>\n    `;
    }
    renderInstagramPost(e, t, n, s) {
      const a = n.logo
          ? `<img src="${n.logo}" alt="Logo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
          : n.companyName.substring(0, 2).toUpperCase(),
        i =
          n.socialAccounts.instagram ||
          n.companyName.toLowerCase().replace(/\s+/g, "");
      return `\n      <div class="ucpe_platform-post ucpe_ig-post">\n        <div class="ucpe_ig-post-header">\n          <div class="ucpe_ig-avatar">${a}</div>\n          <div class="ucpe_ig-username">${i}</div>\n          <button style="border:none;background:none;cursor:pointer;margin-left:auto;">${d.getIcon("ellipsis")}</button>\n        </div>\n        <img src="${t.src}" alt="Post visual" class="ucpe_ig-post-image">\n        <div class="ucpe_ig-post-actions">\n          ${d.getIcon("heart")}\n          ${d.getIcon("comment")}\n          ${d.getIcon("send")}\n          <span style="margin-left:auto;">${d.getIcon("bookmark")}</span>\n        </div>\n        <div class="ucpe_ig-post-caption">\n          <span class="ucpe_ig-username-caption">${i}</span> ${e}\n        </div>\n      </div>\n    `;
    }
    renderTwitterPost(e, t, n, s) {
      return `\n      <div class="ucpe_platform-post ucpe_twitter-post">\n        <div class="ucpe_twitter-post-header">\n          <div class="ucpe_twitter-avatar">${n.logo ? `<img src="${n.logo}" alt="Logo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : n.companyName.substring(0, 2).toUpperCase()}</div>\n          <div class="ucpe_twitter-user-info">\n            <h4>${n.socialAccounts.x || n.companyName}</h4>\n            <p>@${n.socialAccounts.x || n.companyName.toLowerCase().replace(/\s+/g, "")} · Just now</p>\n          </div>\n        </div>\n        <div class="ucpe_twitter-post-text">${e}</div>\n        <img src="${t.src}" alt="Post visual" class="ucpe_twitter-post-image">\n      </div>\n    `;
    }
    renderTikTokPost(e, t, n, s) {
      return `\n      <div class="ucpe_platform-post ucpe_tiktok-post">\n        <img src="${t.src}" alt="Background" class="ucpe_tiktok-bg">\n        <div class="ucpe_tiktok-content">\n          <div class="ucpe_tiktok-user">@${n.socialAccounts.tiktok || n.companyName.toLowerCase().replace(/\s+/g, "")}</div>\n          <div class="ucpe_tiktok-text">${e}</div>\n        </div>\n      </div>\n    `;
    }
    renderSnapchatPost(e, t, n, s) {
      return `\n      <div class="ucpe_platform-post ucpe_snap-post">\n        <img src="${t.src}" alt="Snap background" class="ucpe_snap-image">\n        <div class="ucpe_snap-text-overlay">${e.split("<br>")[0]}</div>\n      </div>\n    `;
    }
    openEditModal() {
      const e = this.generatedOutputs.find(
          (e) => e.id === this.currentPlatformView,
        ),
        t = l.find((e) => e.id === this.currentPlatformView);
      if (!e || !t) return;
      const n = document.getElementById("ucpe_edit-modal"),
        s = document.getElementById("ucpe_modal-text"),
        a = document.getElementById("ucpe_modal-platform-info");
      s &&
        a &&
        n &&
        ((s.value = e.text),
        (a.textContent = `Editing ${t.name} post · Max ${t.maxChars} characters · ${t.style}`),
        n.classList.add("ucpe_show"),
        s.focus());
    }
  }
  class h {
    constructor(e, t) {
      ((this.approvalService = e),
        (this.feeCalculatorService = t),
        (this.publishBtn = document.getElementById("ucpe_publish-btn")),
        (this.publishSummary = document.getElementById("ucpe_publish-summary")),
        this.setupEventListeners());
    }
    setupEventListeners() {
      var e;
      null === (e = this.publishBtn) ||
        void 0 === e ||
        e.addEventListener("click", () => this.handlePublish());
    }
    updatePublishState(e) {
      if (0 === e.length)
        return (
          (this.publishBtn.disabled = !0),
          void (this.publishSummary.innerHTML =
            "Select channels and approve to enable publish.")
        );
      const t = this.approvalService.areAllApproved(e);
      this.publishBtn.disabled = !t;
      const n = e
        .map((e) => {
          const t = l.find((t) => t.id === e),
            n = this.approvalService.getApproval(e);
          return `<div style="margin: 8px 0;"><strong>${null == t ? void 0 : t.name}</strong>: ${"approved" === n ? "✓ Approved" : "⏳ Pending"}</div>`;
        })
        .join("");
      ((this.publishSummary.innerHTML = `\n      <div>${n}</div>\n      <div style="margin-top: 12px; color: var(--muted);">\n        ${t ? "All selected platforms approved. Ready to publish." : "Approve all selected platforms to enable publishing."}\n      </div>\n    `),
        this.updateFees(e));
    }
    updateFees(e) {
      const t = l.filter((t) => e.includes(t.id)),
        n =
          (this.feeCalculatorService.calculatePlatformFee(t),
          this.feeCalculatorService.calculateTotalFee(t)),
        s = document.getElementById("ucpe_platform-fees");
      s &&
        (s.innerHTML = t
          .map(
            (e) =>
              `\n        <div class="ucpe_platform-fee-item">\n          <span>${e.name}</span>\n          <span>$${e.fee}.00</span>\n        </div>\n      `,
          )
          .join(""));
      const a = document.getElementById("ucpe_total-fee");
      a && (a.textContent = `$${n}.00`);
    }
    handlePublish() {
      var e;
      const t =
          (null === (e = document.getElementById("ucpe_total-fee")) ||
          void 0 === e
            ? void 0
            : e.textContent) || "$0.00",
        n = l.length;
      ((this.publishSummary.innerHTML = `\n      <div style="color: var(--success); font-weight: 600;">✓ Mock publish complete!</div>\n      <div style="margin-top: 8px; color: var(--muted); font-size: 14px;">\n        Campaign published to ${n} platform(s)<br>\n        Mock charge: ${t}<br>\n        (Nothing actually left the browser)\n      </div>\n    `),
        (this.publishBtn.disabled = !0),
        (this.publishBtn.textContent = "Published ✓"));
    }
  }
  class u {
    constructor() {
      ((this.modal = document.getElementById("ucpe_edit-modal")),
        (this.textarea = document.getElementById("ucpe_modal-text")),
        this.setupEventListeners());
    }
    setupEventListeners() {
      var e, t, n, s;
      (null === (e = document.querySelector(".ucpe_modal-close")) ||
        void 0 === e ||
        e.addEventListener("click", () => this.close()),
        null === (t = document.getElementById("ucpe_modal-cancel")) ||
          void 0 === t ||
          t.addEventListener("click", () => this.close()),
        null === (n = document.getElementById("ucpe_modal-save")) ||
          void 0 === n ||
          n.addEventListener("click", () => this.save()),
        null === (s = this.modal) ||
          void 0 === s ||
          s.addEventListener("click", (e) => {
            e.target === this.modal && this.close();
          }),
        document.addEventListener("keydown", (e) => {
          "Escape" === e.key && this.close();
        }));
    }
    close() {
      var e;
      null === (e = this.modal) ||
        void 0 === e ||
        e.classList.remove("ucpe_show");
    }
    save() {
      (this.onSaveCallback &&
        this.textarea &&
        this.onSaveCallback(this.textarea.value),
        this.close());
    }
    onSave(e) {
      this.onSaveCallback = e;
    }
  }
  class m {
    constructor() {
      ((this.generatedOutputs = []),
        (this.config = new e()),
        (this.galleryService = new n()),
        (this.contentGenerator = new s()),
        (this.approvalService = new a()),
        (this.feeCalculator = new i()),
        (this.navigationComponent = new o()),
        (this.galleryComponent = new r(this.galleryService)),
        (this.channelSelector = new c()),
        (this.previewComponent = new p(this.config, this.approvalService)),
        (this.publishComponent = new h(
          this.approvalService,
          this.feeCalculator,
        )),
        (this.modalComponent = new u()),
        this.setupComponents(),
        this.setupEventListeners(),
        this.exposePublicAPI());
    }
    setupComponents() {
      (this.galleryComponent.render(),
        this.channelSelector.render(),
        this.navigationComponent.showStep(1),
        this.channelSelector.onChange(() => this.handleChannelChange()),
        this.modalComponent.onSave((e) => this.handleModalSave(e)));
    }
    setupEventListeners() {
      const e = document.getElementById("ucpe_generate-btn");
      (null == e || e.addEventListener("click", () => this.handleGenerate()),
        document.addEventListener("click", (e) => {
          const t = e.target;
          if (t.matches(".ucpe_example-chip[data-example]")) {
            const e = document.getElementById("ucpe_post-title");
            e && (e.value = t.dataset.example || "");
          }
          if (t.matches(".ucpe_example-chip[data-content]")) {
            const e = document.getElementById("ucpe_post-content");
            e && (e.value = t.dataset.content || "");
          }
        }));
    }
    handleChannelChange() {
      const e = this.channelSelector.getSelectedChannels();
      this.publishComponent.updatePublishState(e);
    }
    handleGenerate() {
      const e = document.getElementById("ucpe_post-title"),
        t = document.getElementById("ucpe_post-content"),
        n = (null == e ? void 0 : e.value.trim()) || "",
        s = (null == t ? void 0 : t.value.trim()) || "",
        a = this.channelSelector.getSelectedChannels();
      if (!n || !s)
        return void this.navigationComponent.showError(
          4,
          "⚠️ Please provide a title and base content.",
        );
      if (0 === a.length)
        return void this.navigationComponent.showError(
          4,
          "⚠️ Select at least one channel.",
        );
      ((this.generatedOutputs = a.map((e) => ({
        id: e,
        text: this.contentGenerator.generateTextFor(e, n, s),
      }))),
        this.approvalService.initializeChannels(a),
        this.previewComponent.setGeneratedOutputs(this.generatedOutputs, a),
        this.publishComponent.updatePublishState(a));
      const i = document.getElementById("ucpe_next-after-generate");
      (i && (i.disabled = !1),
        setTimeout(() => this.navigationComponent.showStep(5), 300));
    }
    handleModalSave(e) {
      const t = this.previewComponent.currentPlatformView;
      if (t) {
        const n = this.generatedOutputs.findIndex((e) => e.id === t);
        n >= 0 &&
          ((this.generatedOutputs[n].text = e),
          this.previewComponent.renderPlatformPreview());
      }
    }
    updateBrandingInUI() {
      const e = this.config.getConfig();
      (e.brandColors.primary &&
        document.documentElement.style.setProperty(
          "--accent",
          e.brandColors.primary,
        ),
        e.brandColors.secondary &&
          document.documentElement.style.setProperty(
            "--accent-2",
            e.brandColors.secondary,
          ));
    }
    exposePublicAPI() {
      window.SocialMediaPostingEngine = {
        setConfig: (e) => {
          (this.config.update(e), this.updateBrandingInUI());
        },
        getConfig: () => this.config.getConfig(),
        reset: () => {
          const e = document.getElementById("ucpe_post-title"),
            t = document.getElementById("ucpe_post-content");
          (e && (e.value = ""),
            t && (t.value = ""),
            (this.generatedOutputs = []),
            this.approvalService.clear(),
            this.navigationComponent.showStep(1));
        },
      };
    }
    init() {
      console.log("Social Media Posting Engine initialized");
    }
  }
  document.addEventListener("DOMContentLoaded", () => {
    new m().init();
  });
})();
