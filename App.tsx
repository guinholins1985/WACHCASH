import React, { useState, useCallback } from 'react';
import type { User, Metrics, Campaign, Video, CampaignStatus } from './types';
import { MOCK_USER, MOCK_CAMPAIGN } from './constants';
import UserView from './components/UserView';
import AdvertiserView from './components/AdvertiserView';
import AdminView from './components/AdminView';
import { Header } from './components/Header';

export enum View {
  User = 'USER',
  Advertiser = 'ADVERTISER',
  Admin = 'ADMIN'
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USER);
  const [metrics, setMetrics] = useState<Metrics>({
    totalViews: 0,
    totalWatchTime: 0,
    totalCost: 0,
  });
  const [activeView, setActiveView] = useState<View>(View.User);
  const [viewedVideos, setViewedVideos] = useState<Set<string>>(new Set());
  
  // State for all campaigns and the video library
  const [campaigns, setCampaigns] = useState<Campaign[]>([MOCK_CAMPAIGN]);
  const [videoLibrary, setVideoLibrary] = useState<Video[]>(MOCK_CAMPAIGN.videos);

  const handleTimeUpdate = useCallback((videoId: string, newSeconds: number) => {
    // This function simulates the backend API call for rewards.
    // It correctly finds the campaign the video belongs to, regardless of how many campaigns are active.
    const activeCampaign = campaigns.find(c => c.videos.some(v => v.id === videoId) && c.status === 'Aprovado');
    if (!activeCampaign) return;

    const reward = newSeconds * activeCampaign.costPerSecond;

    setCurrentUser(prevUser => ({
      ...prevUser,
      balance: prevUser.balance + reward,
      totalWatchTime: prevUser.totalWatchTime + newSeconds,
    }));

    setMetrics(prevMetrics => ({
      ...prevMetrics,
      totalWatchTime: prevMetrics.totalWatchTime + newSeconds,
      totalCost: prevMetrics.totalCost + reward,
    }));
  }, [campaigns]);

  const handleVideoStart = useCallback((videoId: string) => {
    if (!viewedVideos.has(videoId)) {
      setMetrics(prev => ({ ...prev, totalViews: prev.totalViews + 1 }));
      setViewedVideos(prev => new Set(prev).add(videoId));
    }
  }, [viewedVideos]);
  
  const formatCurrency = (cents: number) => {
    return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}m ${seconds}s`;
  };

  const handleAddVideoToLibrary = (video: Video) => {
    setVideoLibrary(prev => [...prev, video]);
  };
  
  const handleCreateCampaign = (campaign: Omit<Campaign, 'id' | 'status'>) => {
     const newCampaign: Campaign = {
        ...campaign,
        id: `camp-${Date.now()}`,
        status: 'Pendente'
     };
     setCampaigns(prev => [...prev, newCampaign]);
  };

  const handleUpdateCampaignStatus = (campaignId: string, status: CampaignStatus) => {
    setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, status } : c));
  };

  // Collect all videos from all approved campaigns and ensure the list is unique.
  const approvedVideos = Array.from(
      campaigns
          .filter(c => c.status === 'Aprovado')
          .flatMap(c => c.videos)
          .reduce((map, video) => map.set(video.id, video), new Map<string, Video>())
          .values()
  );


  const renderContent = () => {
    switch (activeView) {
        case View.User:
            return (
                <UserView
                    user={currentUser}
                    videos={approvedVideos}
                    onTimeUpdate={handleTimeUpdate}
                    onVideoStart={handleVideoStart}
                    formatCurrency={formatCurrency}
                    formatTime={formatTime}
                />
            );
        case View.Advertiser:
            return (
                <AdvertiserView
                    campaign={MOCK_CAMPAIGN} // Advertiser view still looks at one campaign
                    metrics={metrics}
                    formatCurrency={formatCurrency}
                    formatTime={formatTime}
                />
            );
        case View.Admin:
            return (
                <AdminView 
                    campaigns={campaigns}
                    videoLibrary={videoLibrary}
                    onAddVideo={handleAddVideoToLibrary}
                    onCreateCampaign={handleCreateCampaign}
                    onUpdateStatus={handleUpdateCampaignStatus}
                />
            );
        default:
            return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header 
        activeView={activeView} 
        setActiveView={setActiveView}
        userName={currentUser.name}
        balance={formatCurrency(currentUser.balance)}
      />

      <main className="p-4 md:p-8">
        {renderContent()}
      </main>
      
      <footer className="text-center p-4 text-gray-500 text-sm">
          <p>&copy; 2024 WatchCash. Todos os direitos reservados.</p>
          <p className="mt-1">Esta é uma aplicação de demonstração. As recompensas são simuladas.</p>
      </footer>
    </div>
  );
};

export default App;