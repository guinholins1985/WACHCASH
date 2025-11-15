import React, { useState } from 'react';
import type { Campaign, Video, CampaignStatus } from '../../types';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import { CENTS_PER_SECOND } from '../../constants';

interface CampaignManagerProps {
  campaigns: Campaign[];
  videoLibrary: Video[];
  onCreateCampaign: (campaign: Omit<Campaign, 'id' | 'status'>) => void;
  onUpdateStatus: (campaignId: string, status: CampaignStatus) => void;
}

const StatusBadge: React.FC<{ status: CampaignStatus }> = ({ status }) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    const statusClasses = {
        Pendente: "bg-yellow-500/20 text-yellow-300",
        Aprovado: "bg-green-500/20 text-green-300",
        Rejeitado: "bg-red-500/20 text-red-300",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
}

export const CampaignManager: React.FC<CampaignManagerProps> = ({ campaigns, videoLibrary, onCreateCampaign, onUpdateStatus }) => {
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignAdvertiser, setNewCampaignAdvertiser] = useState('');
  const [newCampaignBudget, setNewCampaignBudget] = useState(1000);
  const [selectedVideoIds, setSelectedVideoIds] = useState<Set<string>>(new Set());
  
  const handleVideoSelection = (videoId: string) => {
      setSelectedVideoIds(prev => {
          const newSet = new Set(prev);
          if (newSet.has(videoId)) {
              newSet.delete(videoId);
          } else {
              newSet.add(videoId);
          }
          return newSet;
      });
  };

  const handleCreate = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newCampaignName || !newCampaignAdvertiser || selectedVideoIds.size === 0) {
          alert("Por favor, preencha todos os campos e selecione ao menos um vídeo.");
          return;
      }

      // Clona os vídeos da biblioteca e atribui o anunciante correto da campanha.
      // Isso garante a integridade dos dados e evita a mutação dos objetos originais da biblioteca.
      const campaignVideos = videoLibrary
        .filter(v => selectedVideoIds.has(v.id))
        .map(v => ({ ...v, advertiser: newCampaignAdvertiser }));
      
      onCreateCampaign({
          name: newCampaignName,
          advertiser: newCampaignAdvertiser,
          budget: newCampaignBudget * 100, // Convert to cents
          costPerSecond: CENTS_PER_SECOND,
          videos: campaignVideos,
      });

      // Reset form
      setNewCampaignName('');
      setNewCampaignAdvertiser('');
      setNewCampaignBudget(1000);
      setSelectedVideoIds(new Set());
  };


  return (
    <>
    <Card>
        <CardHeader>
            <CardTitle>Criar Nova Campanha</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
                <input type="text" placeholder="Nome da Campanha" value={newCampaignName} onChange={e => setNewCampaignName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" required />
                <input type="text" placeholder="Nome do Anunciante" value={newCampaignAdvertiser} onChange={e => setNewCampaignAdvertiser(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" required />
                <div>
                    <label className="block text-sm mb-1">Orçamento (R$)</label>
                    <input type="number" placeholder="Orçamento (R$)" value={newCampaignBudget} onChange={e => setNewCampaignBudget(Number(e.target.value))} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" min="1" required />
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Selecionar Vídeos</h4>
                    <div className="max-h-40 overflow-y-auto space-y-2 p-2 bg-gray-900/50 rounded-md border border-gray-700">
                        {videoLibrary.length > 0 ? videoLibrary.map(video => (
                            <div key={video.id} className="flex items-center">
                                <input type="checkbox" id={`vid-${video.id}`} checked={selectedVideoIds.has(video.id)} onChange={() => handleVideoSelection(video.id)} className="mr-3 h-4 w-4 rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500" />
                                <label htmlFor={`vid-${video.id}`} className="text-sm truncate">{video.title}</label>
                            </div>
                        )) : <p className="text-sm text-gray-400">Nenhum vídeo na biblioteca.</p>}
                    </div>
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-md">Criar Campanha</button>
            </form>
        </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Campanhas ({campaigns.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {campaigns.map(campaign => (
          <div key={campaign.id} className="bg-gray-900/50 p-3 rounded-md border border-gray-700 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">{campaign.name}</p>
                <p className="text-sm text-gray-400">{campaign.advertiser}</p>
              </div>
              <StatusBadge status={campaign.status} />
            </div>
            {campaign.status === 'Pendente' && (
              <div className="flex space-x-2 justify-end">
                <button onClick={() => onUpdateStatus(campaign.id, 'Aprovado')} className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-3 rounded-md">Aprovar</button>
                <button onClick={() => onUpdateStatus(campaign.id, 'Rejeitado')} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded-md">Rejeitar</button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
    </>
  );
};