import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { dataStore } from "./data/DataStore.ts";
// import { param1, param2, param3 } from "./data/data.ts";
import type { Channel, MediaData } from "./types/index.ts";

export function createWidget(socialMediaChannels: Channel[], mediaDataCollection: MediaData[], param3: any) {
  dataStore.set("socialMediaChannels", socialMediaChannels);
  dataStore.set("mediaDataCollection", mediaDataCollection);
  dataStore.set("param3", param3);
  return createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  ); 
}

export function updateParam(key: string, value: any) {
  dataStore.set(key, value);
}

// if (import.meta.env.DEV) {
//   createWidget(socialMediaChannels, mediaDataCollection, param3);
// }
