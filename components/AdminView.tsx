import React from 'react';
import type { Campaign, Video, CampaignStatus } from '../types';
import { YouTubeImporter } from './admin/YouTubeImporter';
import { CampaignManager } from './admin/CampaignManager';
import { VideoLibrary } from './admin/VideoLibrary';

interface AdminViewProps {
  campaigns: Campaign[];
  videoLibrary: Video[];
  onAddVideos: (videos: Video[]) => void;
  onUpdateStatus: (campaignId: string, status: CampaignStatus) => void;
  onDeleteVideo: (videoId: string) => void;
  onDeleteCampaign: (campaignId: string) => void;
  onQuickAddAndApprove: (videos: Video[]) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ 
    campaigns, 
    videoLibrary, 
    onAddVideos, 
    onUpdateStatus,
    onDeleteVideo,
    onDeleteCampaign,
    onQuickAddAndApprove
}) => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-400">Painel Administrativo</h2>
            <p className="text-gray-400">Adicione vídeos do YouTube para disponibilizá-los no app.</p>
        </div>

        <div className="space-y-8">
            <YouTubeImporter 
                onAddVideos={onAddVideos} 
                onQuickAddAndApprove={onQuickAddAndApprove}
            />
            <VideoLibrary 
                videoLibrary={videoLibrary} 
                onDeleteVideo={onDeleteVideo} 
            />
            <CampaignManager 
                campaigns={campaigns}
                onUpdateStatus={onUpdateStatus}
                onDeleteCampaign={onDeleteCampaign}
            />
        </div>
    </div>
  );
};

export default AdminView;