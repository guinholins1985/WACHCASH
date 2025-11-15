import React from 'react';
import type { Campaign, Video, CampaignStatus } from '../types';
import { YouTubeImporter } from './admin/YouTubeImporter';
import { CampaignManager } from './admin/CampaignManager';
import { VideoLibrary } from './admin/VideoLibrary';

interface AdminViewProps {
  campaigns: Campaign[];
  videoLibrary: Video[];
  onAddVideo: (video: Video) => void;
  onCreateCampaign: (campaign: Omit<Campaign, 'id' | 'status'>) => void;
  onUpdateStatus: (campaignId: string, status: CampaignStatus) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ campaigns, videoLibrary, onAddVideo, onCreateCampaign, onUpdateStatus }) => {
  return (
    <div className="space-y-8">
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-400">Painel Administrativo</h2>
            <p className="text-gray-400">Gerencie vídeos, campanhas e aprove aprovações.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
                <YouTubeImporter onAddVideo={onAddVideo} />
                <VideoLibrary videoLibrary={videoLibrary} />
            </div>
            <div className="space-y-6">
                <CampaignManager 
                    campaigns={campaigns}
                    videoLibrary={videoLibrary}
                    onCreateCampaign={onCreateCampaign}
                    onUpdateStatus={onUpdateStatus}
                />
            </div>
        </div>
    </div>
  );
};

export default AdminView;