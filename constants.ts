import type { User, Campaign } from './types';

// Reward Mechanics: 1 min = R$0.10 => R$0.10 / 60s => 10 cents / 60s
export const CENTS_PER_SECOND = 10 / 60; // Approx 0.1667 cents per second

export const MOCK_USER: User = {
  id: 'user-001',
  name: 'Alex',
  balance: 0,
  totalWatchTime: 0,
};

// Example campaign from an advertiser (in JSON-like format)
export const MOCK_CAMPAIGN: Campaign = {
  id: 'camp-tech-launch-01',
  name: 'New Gadget Launch 2024',
  advertiser: 'FutureTech Inc.',
  budget: 500000, // R$5,000.00
  costPerSecond: CENTS_PER_SECOND,
  videos: [
    {
      id: 'vid-01',
      youtubeId: 'dQw4w9WgXcQ', // Placeholder: Rick Astley
      title: 'The Future of AI Assistants is Here!',
      advertiser: 'FutureTech Inc.',
    },
    {
      id: 'vid-02',
      youtubeId: '3tmd-ClpJxA', // Placeholder: Relaxing Music
      title: 'Unboxing Our Revolutionary Smart Display',
      advertiser: 'FutureTech Inc.',
    },
    {
      id: 'vid-03',
      youtubeId: 'h6fcK_fRYaI', // Placeholder: Lofi Girl
      title: 'How Our Product Integrates With Your Life',
      advertiser: 'FutureTech Inc.',
    }
  ],
  status: 'Aprovado',
};
