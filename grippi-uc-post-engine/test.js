const UC = this;
const dropzone = document.getElementById("uc_fl-dropzone");
const fileInput = document.getElementById("uc_fl-fileInput");
const fileList = document.getElementById("uc_fl-fileList");
const tagsInput = document.getElementById("uc_fl-tagsInput");
const tagInputField = document.getElementById("uc_fl-tagInput");
const saveButton = document.getElementById("uc_fl-saveButton");
const UploadButton = saveButton;
const progressContainer = document.getElementById("uc_fl-progress");
const progressBar = document.getElementById("uc_fl-progressBar");
const progressLabel = document.getElementById("uc_fl-progressLabel");

/** @type {File[]} */
let files = [];
/** @type {string[]} */
let tags = [];

function updateButtonState() {
  if (files.length === 0) {
    saveButton.style.cursor = "not-allowed";
    saveButton.disabled = true;
  } else {
    saveButton.style.cursor = "pointer";
    saveButton.disabled = false;
  }
}

function formatSize(bytes) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(1)} ${units[i]}`;
}

function isImage(file) {
  return file.type.startsWith("image/");
}

function isVideo(file) {
  return file.type.startsWith("video/");
}

function renderFiles() {
  fileList.innerHTML = "";

  files.forEach((file, index) => {
    const card = document.createElement("div");
    card.className = "uc_fl-file-card";

    const preview = document.createElement("div");
    preview.className = "uc_fl-file-preview";

    if (isImage(file)) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.alt = file.name;
      img.onload = () => URL.revokeObjectURL(img.src);
      preview.appendChild(img);
    } else if (isVideo(file)) {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      video.controls = true;
      video.onloadeddata = () => URL.revokeObjectURL(video.src);
      preview.appendChild(video);
    } else {
      const icon = document.createElement("div");
      icon.className = "uc_fl-file-generic-icon";
      preview.appendChild(icon);
    }

    const meta = document.createElement("div");
    meta.className = "uc_fl-file-meta";

    const name = document.createElement("span");
    name.className = "uc_fl-file-name";
    name.title = file.name;
    name.textContent = file.name;

    const size = document.createElement("span");
    size.className = "uc_fl-file-size";
    size.textContent = formatSize(file.size);

    const removeBtn = document.createElement("button");
    removeBtn.className = "uc_fl-remove-file";
    removeBtn.type = "button";
    removeBtn.innerHTML = "&times;";
    removeBtn.addEventListener("click", () => {
      files.splice(index, 1);
      renderFiles();
      updateButtonState();
    });

    meta.appendChild(name);
    meta.appendChild(size);
    meta.appendChild(removeBtn);

    card.appendChild(preview);
    card.appendChild(meta);
    fileList.appendChild(card);
  });
}

function addFiles(newFiles) {
  const array = Array.from(newFiles || []);
  if (!array.length) return;

  files = files.concat(array);
  renderFiles();
  updateButtonState();
}

// Click to open file dialog
dropzone.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  addFiles(event.target.files);
  // Allow re-selecting the same file
  event.target.value = "";
});

// Drag and drop handlers
["dragenter", "dragover"].forEach((type) => {
  dropzone.addEventListener(type, (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropzone.classList.add("uc_fl-drag-over");
  });
});

["dragleave", "dragend", "drop"].forEach((type) => {
  dropzone.addEventListener(type, (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropzone.classList.remove("uc_fl-drag-over");
  });
});

dropzone.addEventListener("drop", (event) => {
  if (event.dataTransfer && event.dataTransfer.files) {
    addFiles(event.dataTransfer.files);
  }
});

function renderTags() {
  // Keep the input, rebuild chips before it
  const existingChips = tagsInput.querySelectorAll(".uc_fl-tag-chip");
  existingChips.forEach((chip) => chip.remove());

  tags.forEach((tag, index) => {
    const chip = document.createElement("span");
    chip.className = "uc_fl-tag-chip";
    chip.textContent = tag;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.innerHTML = "&times;";
    remove.addEventListener("click", () => {
      tags.splice(index, 1);
      renderTags();
    });

    chip.appendChild(remove);
    tagsInput.insertBefore(chip, tagInputField);
  });
}

function tryAddTag(raw) {
  const value = (raw || "").trim();
  if (!value) return;
  if (tags.includes(value)) return;
  tags.push(value);
  renderTags();
}

tagInputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === ",") {
    event.preventDefault();
    tryAddTag(tagInputField.value.replace(",", ""));
    tagInputField.value = "";
  } else if (event.key === "Backspace" && !tagInputField.value && tags.length) {
    // backspace removes last tag when input is empty
    tags.pop();
    renderTags();
  }
});

tagInputField.addEventListener("blur", () => {
  // On blur, commit any typed text as a tag
  if (tagInputField.value.trim()) {
    tryAddTag(tagInputField.value);
    tagInputField.value = "";
  }
});

// Initialise button state
updateButtonState();

async function UploadData() {
  try {
    UploadButton.disabled = true;
    UploadButton.textContent = "Uploading...";

    if (progressContainer && progressBar && progressLabel) {
      progressContainer.style.display = "block";
      progressBar.style.width = "0%";
      progressLabel.textContent = "0%";
    }

    const uploadedFiles = [];
    let dropboxFailed = false;
    let completedFiles = 0;

    for (const file of files) {
      const fileContent = await file.arrayBuffer();

      let fileType = "other";
      if (file.type.startsWith("image/")) {
        fileType = "Image";
      } else if (file.type.startsWith("video/")) {
        fileType = "Video";
      } else if (file.type === "application/pdf") {
        fileType = "PDF";
      }

      const accessToken =
        UC.SDT_access_token && UC.SDT_access_token.access_token
          ? UC.SDT_access_token.access_token
          : "";

      const uploadResponse = await fetch(
        "https://content.dropboxapi.com/2/files/upload",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + accessToken,
            "Dropbox-API-Arg": JSON.stringify({
              autorename: true,
              mode: "overwrite",
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
        console.error(
          "Dropbox upload failed for",
          file.name,
          uploadResponse.status,
          uploadResponse.statusText,
        );
        dropboxFailed = true;
        break;
      }

      const uploadResult = await uploadResponse.json();

      const safeJson = async (res) => {
        try {
          return await res.json();
        } catch {
          return null;
        }
      };

      const toRawUrl = (url) => {
        // Dropbox shared links are usually ...?dl=0
        if (!url) return "";
        if (url.includes("?dl=0")) return url.replace("?dl=0", "?raw=1");
        if (url.includes("?raw=1")) return url;
        return url + (url.includes("?") ? "&raw=1" : "?raw=1");
      };

      let fileUrl = "";
      let shareUrl = "";

      // 1) Try create shared link
      const linkResponse = await fetch(
        "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: uploadResult.path_lower || uploadResult.path_display, // prefer path_lower
            settings: {
              access: "viewer",
              audience: "public",
              requested_visibility: "public",
            },
          }),
        },
      );

      const linkData = await safeJson(linkResponse);

      if (linkResponse.ok && linkData?.url) {
        shareUrl = linkData.url;
        fileUrl = toRawUrl(shareUrl);
      } else {
        // Detect "already exists" in BOTH places (tag or error_summary)
        const alreadyExists =
          linkData?.error?.[".tag"] === "shared_link_already_exists" ||
          (linkData?.error_summary || "").startsWith(
            "shared_link_already_exists",
          );

        if (alreadyExists) {
          // 2) Reuse existing link
          const existingLinksResponse = await fetch(
            "https://api.dropboxapi.com/2/sharing/list_shared_links",
            {
              method: "POST",
              headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                path: uploadResult.path_lower || uploadResult.path_display,
                direct_only: true, // IMPORTANT
              }),
            },
          );

          const existingLinksData = await safeJson(existingLinksResponse);

          if (
            existingLinksResponse.ok &&
            existingLinksData?.links &&
            existingLinksData.links.length > 0
          ) {
            shareUrl = existingLinksData.links[0].url;
            fileUrl = toRawUrl(shareUrl);
          } else {
            console.error(
              "No existing links found (or list_shared_links failed)",
              {
                status: existingLinksResponse.status,
                body: existingLinksData,
              },
            );
            dropboxFailed = true;
            break;
          }
        } else {
          console.error("Failed to create shared link", {
            status: linkResponse.status,
            body: linkData,
          });
          dropboxFailed = true;
          break;
        }
      }

      uploadedFiles.push({
        id: uploadResult.id,
        name: uploadResult.name,
        path: uploadResult.path_display,
        shareUrl,
        fileUrl,
        fileType,
      });

      completedFiles += 1;
      if (progressContainer && progressBar && progressLabel) {
        const percent = Math.round((completedFiles / files.length) * 100);
        progressBar.style.width = `${percent}%`;
        progressLabel.textContent = `${percent}%`;
      }
    }

    if (dropboxFailed || uploadedFiles.length === 0) {
      console.error("Aborting: one or more files failed to upload to Dropbox.");
      if (UC.OnFail) {
        UC.Message = "Upload to Dropbox failed. Nothing was saved.";
        UC.OnFail();
      }
      return;
    }

    const apiUrl = (UC.Url || "").replace(/\/$/, "");

    const apiResponse = await fetch(`${apiUrl}/api/media/media-upload`, {
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
        tags,
      }),
    });

    if (!apiResponse.ok) {
      throw new Error(
        `API request failed: ${apiResponse.status} ${apiResponse.statusText}`,
      );
    }

    const apiResult = await apiResponse.json();

    if (apiResult.IsInserted === true) {
      tags = [];
      renderTags();

      files = [];
      fileList.innerHTML = "";
      fileInput.value = "";

      updateButtonState();

      if (UC.OnUpload) {
        UC.Message = "Uploaded successfully";
        UC.OnUpload();
      }
    }
  } catch (error) {
    console.error("Upload error:", error);
  } finally {
    UploadButton.disabled = false;
    UploadButton.textContent = "Save Files";
    if (progressContainer && progressBar && progressLabel) {
      progressContainer.style.display = "none";
      progressBar.style.width = "0%";
      progressLabel.textContent = "";
    }
  }
}

saveButton.addEventListener("click", () => {
  UploadData();
});
