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

  const handleAddVideosToLibrary = (videos: Video[]) => {
    setVideoLibrary(prev => {
      const videoMap = new Map(prev.map(v => [v.id, v]));
      videos.forEach(v => videoMap.set(v.id, v));
      return Array.from(videoMap.values());
    });
  };

  const handleDeleteVideoFromLibrary = (videoId: string) => {
    setVideoLibrary(prev => prev.filter(v => v.id !== videoId));
    // Also remove from any campaign that might contain it
    setCampaigns(prev => prev.map(c => ({
        ...c, 
        videos: c.videos.filter(v => v.id !== videoId) 
    })).filter(c => c.videos.length > 0)); // Optional: remove empty campaigns
  };

  const handleUpdateCampaignStatus = (campaignId: string, status: CampaignStatus) => {
    setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, status } : c));
  };

  const handleDeleteCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    // Note: This doesn't remove videos from the videoLibrary, allowing them to be reused.
  };

  const handleQuickAddAndApprove = (videos: Video[]) => {
    // 1. Add videos to the library
    handleAddVideosToLibrary(videos);

    // 2. Create and approve a new campaign for these videos
    const quickCampaign: Campaign = {
        id: `camp-quick-${Date.now()}`,
        name: `Campanha Rápida (${videos.length} vídeo${videos.length > 1 ? 's' : ''})`,
        advertiser: 'Admin Quick-Add',
        budget: 100000, // Default budget
        costPerSecond: MOCK_CAMPAIGN.costPerSecond,
        // Ensure videos in campaign have advertiser info
        videos: videos.map(v => ({ ...v, advertiser: 'Admin Quick-Add' })),
        status: 'Aprovado'
    };
    setCampaigns(prev => [...prev, quickCampaign]);
  };

  // The source of truth for the UserView.
  // Collect all videos from all approved campaigns and ensure the list is unique.
  const approvedVideos = Array.from(
      campaigns
          .filter(c => c.status === 'Aprovado')
          .flatMap(c => c.videos)
          .reduce((map, video) => map.set(video.youtubeId, video), new Map<string, Video>()) // Use youtubeId for uniqueness
          .values()
  );


  const renderContent = () => {
    switch (activeView) {
        case View.User:
            return (
                <UserView
                    videos={approvedVideos}
                    onTimeUpdate={handleTimeUpdate}
                    onVideoStart={handleVideoStart}
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
                    onAddVideos={handleAddVideosToLibrary}
                    onUpdateStatus={handleUpdateCampaignStatus}
                    onDeleteVideo={handleDeleteVideoFromLibrary}
                    onDeleteCampaign={handleDeleteCampaign}
                    onQuickAddAndApprove={handleQuickAddAndApprove}
                />
            );
        default:
            return null;
    }
  };

  return (
    <div className="min-h-screen h-screen bg-gray-900 text-white font-sans flex flex-col overflow-hidden">
      <Header 
        activeView={activeView} 
        setActiveView={setActiveView}
        userName={currentUser.name}
        balance={formatCurrency(currentUser.balance)}
      />

      <main className={`flex-grow ${activeView === View.User ? "" : "p-4 md:p-8 overflow-y-auto"}`}>
        {renderContent()}
      </main>
      
      {activeView !== View.User && (
        <footer className="text-center p-4 text-gray-500 text-sm">
            <p>&copy; 2024 WatchCash. Todos os direitos reservados.</p>
            <p className="mt-1">Esta é uma aplicação de demonstração. As recompensas são simuladas.</p>
        </footer>
      )}
    </div>
  );
};

export default App;