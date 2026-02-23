// Type definitions for the Social Media Posting Engine

export interface Channel {
  id: string;
  name: string;
  maxChars: number;
  style: string;
  color: string;
  icon: string;
  fee: number;
}

export interface MediaData {
  id: string;
  name: string;
  type: string;
  src: string;
  tags: string[];
  createdAt?: string | number | Date;
  selected: boolean;
}

export interface GeneratedOutput {
  platformId: string;
  platformContent: string;
}

export interface AppConfig {
  companyName: string;
  logo: string | null;
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  socialAccounts: {
    facebook: string | null;
    instagram: string | null;
    tiktok: string | null;
    snapchat: string | null;
    x?: string | null;
  };
  organizationId: string | null;
  locationId: string | null;
  userId: string | null;
}

export type ApprovalStatus = "pending" | "approved";
export type PreviewMode = "mobile" | "desktop";
