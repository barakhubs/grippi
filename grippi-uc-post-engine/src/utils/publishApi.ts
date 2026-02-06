import type { GeneratedOutput, MediaData } from "../types";
import { env } from "../config/env";

export interface PublishPayload {
  postTitle: string;
  postContent: string;
  language: string;
  tone: string;
  images: MediaData[];
  channels: string[];
  generatedOutputs: GeneratedOutput[];
}

export interface PublishResponse {
  success: boolean;
  message: string;
  publishedPosts: Array<{
    channelId: string;
    postId: string;
    url: string;
    status: "published" | "scheduled" | "failed";
  }>;
  timestamp: string;
}

/**
 * Real API implementation
 */
export const publishPosts = async (
  payload: PublishPayload,
): Promise<PublishResponse> => {
  if (env.enableLogging) {
    console.group("📤 Publishing Posts to API");
    console.log("API URL:", env.apiUrl);
    console.log("Timestamp:", new Date().toISOString());
    console.log("Payload:", payload);
    console.groupEnd();
  }

  const response = await fetch(env.apiUrl + "/api/posts/publish", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ PostPublishRequestBody: payload }),
  });

  if (env.enableLogging) {
    console.log("📡 Response Status:", response.status, response.statusText);
  }

  if (!response.ok) {
    throw new Error(`Failed to publish: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("data", data);
  console.log("data.PublishResponse", data.data);

  if (env.enableLogging) {
    console.group("✅ Publish Response (REAL API)");
    console.log("Response:", data);
    console.groupEnd();
  }

  return data;
};
