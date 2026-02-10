import { env } from "../config/env";
import { dataStore } from "../data/DataStore";

export interface UploadedFile {
  id: string;
  name: string;
  path: string;
  shareUrl: string;
  fileUrl: string;
  fileType: string;
}

export interface UploadApiPayload {
  files: Array<{
    FileId: string;
    FileName: string;
    FileUrl: string;
    FileShareUrl: string;
    FileType: string;
  }>;
  tags: string[];
}

export interface UploadApiResponse {
  IsInserted: boolean;
  message?: string;
}

export interface UploadProgress {
  completedFiles: number;
  totalFiles: number;
  percentage: number;
  currentFile: string;
}

export interface UploadCallbacks {
  onProgress?: (progress: UploadProgress) => void;
  onSuccess?: (uploadedFiles: UploadedFile[]) => void;
  onFail?: (message: string) => void;
}

/**
 * Upload a file to Dropbox
 */
export const uploadToDropbox = async (
  file: File,
): Promise<{ uploadResult: any; fileType: string }> => {
  const accessToken = dataStore.get("dropboxAccessToken") || "";
  const fileContent = await file.arrayBuffer();

  let fileType = "other";
  if (file.type.startsWith("image/")) {
    fileType = "Image";
  } else if (file.type.startsWith("video/")) {
    fileType = "Video";
  }

  const uploadResponse = await fetch(
    "https://content.dropboxapi.com/2/files/upload",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
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

  if (env.enableLogging) {
    console.log("Upload successful:", uploadResult);
  }

  return { uploadResult, fileType };
};

/**
 * Create or get shareable link for a Dropbox file
 */
export const getDropboxShareableLink = async (
  pathDisplay: string,
): Promise<{ shareUrl: string; fileUrl: string }> => {
  const accessToken = dataStore.get("dropboxAccessToken") || "";

  // Try to create shareable link
  const linkResponse = await fetch(
    "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: pathDisplay,
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
    const shareUrl = linkResult.url;
    const fileUrl = linkResult.url + "&raw=1";

    if (env.enableLogging) {
      console.log("New shared link created");
    }

    return { shareUrl, fileUrl };
  } else {
    // Check if error is because link already exists
    const errorData = await linkResponse.json();

    if (
      errorData.error &&
      errorData.error[".tag"] === "shared_link_already_exists"
    ) {
      if (env.enableLogging) {
        console.log("Shared link already exists, fetching existing link...");
      }

      // Get existing shared links for this file
      const existingLinksResponse = await fetch(
        "https://api.dropboxapi.com/2/sharing/list_shared_links",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: pathDisplay,
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
        const shareUrl = existingLinksData.links[0].url;
        const fileUrl = existingLinksData.links[0].url + "&raw=1";

        if (env.enableLogging) {
          console.log("Using existing shared link");
        }

        return { shareUrl, fileUrl };
      } else {
        throw new Error("No existing links found for file");
      }
    } else {
      throw new Error(
        `Failed to create shared link: ${JSON.stringify(errorData)}`,
      );
    }
  }
};

/**
 * Upload files and save metadata to backend API
 */
export const uploadFiles = async (
  files: File[],
  tags: string[] = [],
  callbacks?: UploadCallbacks,
): Promise<UploadedFile[]> => {
  if (env.enableLogging) {
    console.group("📤 Uploading Files");
    console.log("Files count:", files.length);
    console.log("Tags:", tags);
    console.groupEnd();
  }

  const uploadedFiles: UploadedFile[] = [];
  let completedFiles = 0;
  let dropboxFailed = false;

  // Upload each file
  for (const file of files) {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      console.warn("Skipping unsupported file type:", file.name);
      continue;
    }

    try {
      // Report progress - starting upload
      if (callbacks?.onProgress) {
        const percentage = Math.round((completedFiles / files.length) * 100);
        callbacks.onProgress({
          completedFiles,
          totalFiles: files.length,
          percentage,
          currentFile: file.name,
        });
      }

      // Upload to Dropbox
      const { uploadResult, fileType } = await uploadToDropbox(file);

      // Get shareable link
      const { shareUrl, fileUrl } = await getDropboxShareableLink(
        uploadResult.path_display,
      );

      uploadedFiles.push({
        id: uploadResult.id,
        name: uploadResult.name,
        path: uploadResult.path_display,
        shareUrl: shareUrl,
        fileUrl: fileUrl,
        fileType: fileType,
      });

      completedFiles += 1;
    } catch (error) {
      console.error(
        "Dropbox upload failed for",
        file.name,
        error instanceof Error ? error.message : error,
      );
      dropboxFailed = true;
      break;
    }
  }

  if (dropboxFailed || uploadedFiles.length === 0) {
    const errorMessage = "Upload to Dropbox failed. Nothing was saved.";
    console.error("Aborting: one or more files failed to upload to Dropbox.");
    if (callbacks?.onFail) {
      callbacks.onFail(errorMessage);
    }
    throw new Error(errorMessage);
  }

  if (env.enableLogging) {
    console.log("All uploaded files:", uploadedFiles);
  }

  const baseUrl = dataStore.get("baseUrl");
  // Save to backend API
  const apiResponse = await fetch(`${baseUrl}api/media/media-upload`, {
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
    const errorMessage = `API request failed: ${apiResponse.status} ${apiResponse.statusText}`;
    if (callbacks?.onFail) {
      callbacks.onFail(errorMessage);
    }
    throw new Error(errorMessage);
  }

  const apiResult = await apiResponse.json();

  if (env.enableLogging) {
    console.log("API response:", apiResult);
  }

  if (apiResult.IsInserted === true) {
    if (callbacks?.onSuccess) {
      callbacks.onSuccess(uploadedFiles);
    }
  }

  return uploadedFiles;
};
