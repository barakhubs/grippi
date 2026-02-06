import type { Channel } from "../types";

export const channels: Channel[] = [
  {
    id: "facebook",
    name: "Facebook",
    maxChars: 2200,
    style: "Conversational",
    color: "#1877f2",
    icon: "/icons/facebook.jpg",
    fee: 5,
  },
  {
    id: "instagram",
    name: "Instagram",
    maxChars: 2200,
    style: "Snappy captions",
    color: "#e1306c",
    icon: "/icons/instagram.jpg",
    fee: 5,
  },
  {
    id: "snapchat",
    name: "Snapchat",
    maxChars: 80,
    style: "Punchy, to-the-point",
    color: "#fffc00",
    icon: "/icons/snapchat.png",
    fee: 7,
  },
  {
    id: "tiktok",
    name: "TikTok",
    maxChars: 150,
    style: "Hook first, hashtag later",
    color: "#111",
    icon: "/icons/tiktok.png",
    fee: 8,
  },
  {
    id: "x",
    name: "X",
    maxChars: 150,
    style: "Hook first, hashtag later",
    color: "#111",
    icon: "/icons/x.png",
    fee: 8,
  },
];
