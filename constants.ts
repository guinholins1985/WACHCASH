import type { User, Campaign } from './types';

// WARNING: Exposing API keys on the client-side is a security risk.
// In a real production application, all API calls to YouTube should be made
// from a backend server where the key can be kept secret.
export const YOUTUBE_API_KEY = 'AIzaSyDTRVIDdm6Jfl7NoZAOjtMPuzlwSINMTxw';


// Reward Mechanics: 1 min = R$0.10 => R$0.10 / 60s => 10 cents / 60s
export const CENTS_PER_SECOND = 10 / 60; // Approx 0.1667 cents per second

export const MOCK_USER: User = {
  id: 'user-001',
  name: 'Alex',
  balance: 0,
  totalWatchTime: 0,
};

// Example campaign from an advertiser (in JSON-like format)
// Videos updated to ones that allow embedding to prevent player errors.
export const MOCK_CAMPAIGN: Campaign = {
  id: 'camp-tech-launch-01',
  name: 'New Gadget Launch 2024',
  advertiser: 'FutureTech Inc.',
  budget: 500000, // R$5,000.00
  costPerSecond: CENTS_PER_SECOND,
  videos: [
    {
      id: 'vid-01',
      youtubeId: 'LXb3EKWsInQ', // Placeholder: Nature video that allows embedding
      title: 'The Future of AI Assistants is Here!',
      advertiser: 'FutureTech Inc.',
      thumbnail: 'https://img.youtube.com/vi/LXb3EKWsInQ/mqdefault.jpg',
      duration: "2:15"
    },
    {
      id: 'vid-02',
      youtubeId: 'M7FIvfx5J10', // Placeholder: Tech video that allows embedding
      title: 'Unboxing Our Revolutionary Smart Display',
      advertiser: 'FutureTech Inc.',
      thumbnail: 'https://img.youtube.com/vi/M7FIvfx5J10/mqdefault.jpg',
      duration: "4:33"
    },
    {
      id: 'vid-03',
      youtubeId: 'X_p_1o-hQ2I', // Placeholder: Google I/O video that allows embedding
      title: 'How Our Product Integrates With Your Life',
      advertiser: 'FutureTech Inc.',
      thumbnail: 'https://img.youtube.com/vi/X_p_1o-hQ2I/mqdefault.jpg',
      duration: "5:22"
    }
  ],
  status: 'Aprovado',
};