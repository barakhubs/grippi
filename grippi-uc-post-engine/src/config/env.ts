/**
 * Environment configuration
 * All environment variables must be prefixed with VITE_ to be exposed to the client
 */

export const env = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",

  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || "Grippi Post Engine",
  enableLogging: import.meta.env.VITE_ENABLE_LOGGING === "true",

  // Feature Flags
  useMockApi: import.meta.env.VITE_USE_MOCK_API === "true",

  // Dropbox Configuration
  dropboxAccessToken: import.meta.env.VITE_DROPBOX_ACCESS_TOKEN || "",

  // Computed values
  get apiUrl() {
    return `${this.apiBaseUrl}`;
  },

  // Runtime environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const;

// Type-safe environment variable access
export type Env = typeof env;
