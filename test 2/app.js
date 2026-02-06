// Mock UC object for standalone testing
const UC = {
  Url: "https://api.example.com/",
  SDT_access_token: {
    access_token: "YOUR_DROPBOX_ACCESS_TOKEN_HERE",
  },
};

// Component 1: Basic with Progress Bar
class DragDropComponent1 {
  constructor() {
    this.dropZone = document.getElementById("drop-zone-1");
    this.fileInput = document.getElementById("file-input-1");
    this.fileList = document.getElementById("file-list-1");
    this.uploadedFiles = [];
    this.init();
  }

  init() {
    this.dropZone.addEventListener("dragover", (e) => this.handleDragOver(e));
    this.dropZone.addEventListener("dragleave", () => this.handleDragLeave());
    this.dropZone.addEventListener("drop", (e) => this.handleDrop(e));
    this.dropZone.addEventListener("click", () => this.fileInput.click());
    this.fileInput.addEventListener("change", (e) => this.handleFileSelect(e));
  }

  handleDragOver(e) {
    e.preventDefault();
    this.dropZone.classList.add("dragover");
  }

  handleDragLeave() {
    this.dropZone.classList.remove("dragover");
  }

  handleDrop(e) {
    e.preventDefault();
    this.dropZone.classList.remove("dragover");
    const files = Array.from(e.dataTransfer.files);
    this.handleFiles(files);
  }

  handleFileSelect(e) {
    const files = Array.from(e.target.files);
    this.handleFiles(files);
  }

  handleFiles(files) {
    files.forEach((file) => {
      if (
        !this.uploadedFiles.some(
          (f) => f.name === file.name && f.size === file.size,
        )
      ) {
        this.uploadedFiles.push(file);
        this.displayFile(file);
      }
    });
  }

  displayFile(file) {
    const fileItem = document.createElement("div");
    fileItem.className = "file-item-1";
    fileItem.innerHTML = `
            <div class="file-info">
                <i class="bi bi-file-earmark file-icon"></i>
                <div>
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${this.formatFileSize(file.size)}</div>
                </div>
            </div>
            <div class="progress">
                <div class="progress" role="progressbar" style="width: "></div>
            </div>
            <button type="button" class="remove-btn" >&times;</button>
        `;

    fileItem.querySelector(".remove-btn").addEventListener("click", () => {
      this.removeFile(file.name, file.size);
    });

    this.fileList.appendChild(fileItem);
    this.simulateUpload(fileItem.querySelector(".progress-bar"));
  }

  simulateUpload(progressBar) {
    let width = 0;
    const interval = setInterval(() => {
      if (width >= 100) {
        clearInterval(interval);
      } else {
        width += Math.random() * 15;
      }
    }, 200);
  }

  removeFile(name, size, event) {
    this.uploadedFiles = this.uploadedFiles.filter(
      (file) => !(file.name === name && file.size === size),
    );
    const fileItems = this.fileList.querySelectorAll(".file-item-1");
    fileItems.forEach((item) => {
      if (item.querySelector(".file-name").textContent === name) {
        item.remove();
      }
    });
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

const component1 = new DragDropComponent1();

//tags

let tags = [];

const tagInput = document.getElementById("tagInput");
const addBtn = document.getElementById("addBtn");
const tagsList = document.getElementById("tagsList");

function addTag() {
  const value = tagInput.value.trim();

  if (value === "") return;

  if (tags.includes(value)) {
    alert("Tag already exists!");
    tagInput.value = "";
    return;
  }

  tags.push(value);
  renderTags();
  tagInput.value = "";
  tagInput.focus();
}

function removeTag(tagToRemove) {
  tags = tags.filter((tag) => tag !== tagToRemove);
  renderTags();
}

function renderTags() {
  tagsList.innerHTML = tags
    .map(
      (tag) => `
        <div class="tag">
            <span>${tag}</span>
            <span class="tag-remove" data-tag="${tag}">×</span>
        </div>
    `,
    )
    .join("");

  // Add event listeners to all remove buttons
  const removeButtons = tagsList.querySelectorAll(".tag-remove");
  removeButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const tagToRemove = this.getAttribute("data-tag");
      removeTag(tagToRemove);
    });
  });
}

addBtn.addEventListener("click", function () {
  addTag();
});

tagInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTag();
  }
});

function getTags() {
  return tags;
}

async function UploadData() {
  console.log("Starting upload...");
  console.log(tags);
  console.log(component1.uploadedFiles);

  try {
    // Show loading state
    UploadButton.disabled = true;
    UploadButton.textContent = "Uploading...";

    const uploadedFiles = []; // Store uploaded file info

    // Upload each file
    for (const file of component1.uploadedFiles) {
      const fileContent = await file.arrayBuffer();

      let fileType = "other";
      if (file.type.startsWith("image/")) {
        fileType = "Image";
      } else if (file.type.startsWith("video/")) {
        fileType = "Video";
      } else if (file.type === "application/pdf") {
        fileType = "PDF";
      }

      const uploadResponse = await fetch(
        "https://content.dropboxapi.com/2/files/upload",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + UC.SDT_access_token.access_token,
            "Dropbox-API-Arg": JSON.stringify({
              autorename: true,
              mode: "add",
              mute: false,
              path: "/" + file.name,
              strict_conflict: false,
            }),
            "Content-Type": "application/octet-stream",
          },
          body: fileContent,
        },
      );

      if (!uploadResponse.ok) {
        throw new Error(
          `Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`,
        );
      }

      const uploadResult = await uploadResponse.json();
      console.log("Upload successful:", uploadResult);

      let fileUrl = "";
      let shareUrl = "";

      // Try to create shareable link
      const linkResponse = await fetch(
        "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + UC.SDT_access_token.access_token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: uploadResult.path_display,
            settings: {
              access: "viewer",
              audience: "public",
              requested_visibility: "public",
            },
          }),
        },
      );

      if (linkResponse.ok) {
        // New link created successfully
        const linkResult = await linkResponse.json();
        shareUrl = linkResult.url;
        fileUrl = linkResult.url + "&raw=1";
        console.log("New shared link created");
      } else {
        // Check if error is because link already exists
        const errorData = await linkResponse.json();

        if (
          errorData.error &&
          errorData.error[".tag"] === "shared_link_already_exists"
        ) {
          console.log("Shared link already exists, fetching existing link...");

          // Get existing shared links for this file
          const existingLinksResponse = await fetch(
            "https://api.dropboxapi.com/2/sharing/list_shared_links",
            {
              method: "POST",
              headers: {
                Authorization: "Bearer " + UC.SDT_access_token.access_token,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                path: uploadResult.path_display,
                direct_only: false,
              }),
            },
          );

          if (!existingLinksResponse.ok) {
            throw new Error(
              `Failed to get existing links: ${existingLinksResponse.status}`,
            );
          }

          const existingLinksData = await existingLinksResponse.json();

          if (existingLinksData.links && existingLinksData.links.length > 0) {
            shareUrl = existingLinksData.links[0].url;
            fileUrl = existingLinksData.links[0].url + "&raw=1";
            console.log("Using existing shared link");
          } else {
            throw new Error("No existing links found for file");
          }
        } else {
          throw new Error(
            `Failed to create shared link: ${JSON.stringify(errorData)}`,
          );
        }
      }

      uploadedFiles.push({
        id: uploadResult.id,
        name: uploadResult.name,
        path: uploadResult.path_display,
        shareUrl: shareUrl,
        fileUrl: fileUrl,
        fileType: fileType,
      });
    }

    console.log("All uploaded files:", uploadedFiles);

    const apiResponse = await fetch(`${UC.Url}api/media/media-upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        files: uploadedFiles.map((file) => ({
          FileId: file.id,
          FileName: file.name,
          FileUrl: file.fileUrl,
          FileShareUrl: file.shareUrl,
          FileType: file.fileType,
        })),
        tags: tags,
      }),
    });

    if (!apiResponse.ok) {
      throw new Error(
        `API request failed: ${apiResponse.status} ${apiResponse.statusText}`,
      );
    }

    const apiResult = await apiResponse.json();
    console.log("API response:", apiResult);

    if (apiResult.IsInserted === true) {
      tags = [];
      renderTags();

      // Clear the uploaded files array
      component1.uploadedFiles = [];

      // Clear the file list display
      component1.fileList.innerHTML = "";

      // Reset the file input
      component1.fileInput.value = "";

      alert("Files uploaded successfully!");
    }

    // Clear tags after successful upload
  } catch (error) {
    console.error("Upload error:", error);
    alert(`Upload failed: ${error.message}`);
  } finally {
    // Reset button state
    UploadButton.disabled = false;
    UploadButton.textContent = "Upload";
  }
}

const UploadButton = document.getElementById("UploadButton");

UploadButton.addEventListener("click", function () {
  if (component1.uploadedFiles.length === 0) {
    alert("Please select files to upload");
    return;
  }

  if (tags.length === 0) {
    const confirmUpload = confirm(
      "No tags added. Do you want to continue uploading without tags?",
    );
    if (!confirmUpload) return;
  }

  UploadData();
});

// Initialize on DOM load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    console.log("File uploader initialized");
  });
} else {
  console.log("File uploader initialized");
}
