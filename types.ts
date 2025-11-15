export interface User {
  id: string;
  name: string;
  balance: number; // in cents
  totalWatchTime: number; // in seconds
}

export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  advertiser: string;
  duration?: string; // Optional duration string e.g., "5:32"
  thumbnail?: string; // Optional thumbnail URL
  isEmbeddable?: boolean;
}

export type CampaignStatus = 'Aprovado' | 'Rejeitado' | 'Pendente';

export interface Campaign {
  id: string;
  name: string;
  advertiser: string;
  videos: Video[];
  budget: number; // in cents
  costPerSecond: number; // in cents
  status: CampaignStatus;
}

export interface Metrics {
  totalViews: number;
  totalWatchTime: number; // in seconds
  totalCost: number; // in cents
}