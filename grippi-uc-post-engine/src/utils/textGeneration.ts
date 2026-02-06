// Text generation utilities

function hashtags(text: string, count: number): string {
  const words = text
    .split(/\s+/)
    .filter((w) => w.length > 4)
    .slice(0, count);
  return words
    .map((w) => `#${w.replace(/[^a-z0-9]/gi, "")}`.toLowerCase())
    .join(" ");
}

function hookify(title: string): string {
  const hook = title.slice(0, 40) || "Big news";
  return `🎯 ${hook}?`;
}

export function generateTextFor(
  channelId: string,
  baseTitle: string,
  baseContent: string,
): string {
  const trimmed = baseContent.trim();

  switch (channelId) {
    case "facebook":
      return `${baseTitle} — ${trimmed}\n\n${trimmed}\n#community #update`;
    case "instagram":
      return `${trimmed}\n${baseTitle}\n${hashtags(trimmed, 3)}`;
    case "x":
      return `${baseTitle}\n\n${trimmed.slice(0, 200)}\n${hashtags(trimmed, 2)}`;
    case "snapchat":
      return `${trimmed.slice(0, 70)}... ⚡`;
    case "tiktok":
      return `${hookify(baseTitle)}\n${trimmed}\n${hashtags(trimmed, 2)} #ForYou`;
    default:
      return trimmed;
  }
}
