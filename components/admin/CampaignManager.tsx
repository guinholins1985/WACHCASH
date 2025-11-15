import React from 'react';
import type { Campaign, CampaignStatus } from '../../types';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';

interface CampaignManagerProps {
  campaigns: Campaign[];
  onUpdateStatus: (campaignId: string, status: CampaignStatus) => void;
  onDeleteCampaign: (campaignId: string) => void;
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

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

export const CampaignManager: React.FC<CampaignManagerProps> = ({ campaigns, onUpdateStatus, onDeleteCampaign }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Campanhas ({campaigns.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {campaigns.length > 0 ? campaigns.map(campaign => (
          <div key={campaign.id} className="bg-gray-900/50 p-3 rounded-md border border-gray-700 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">{campaign.name}</p>
                <p className="text-sm text-gray-400">{campaign.advertiser} ({campaign.videos.length} vídeo(s))</p>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <StatusBadge status={campaign.status} />
                 <button 
                    onClick={() => onDeleteCampaign(campaign.id)}
                    className="p-2 rounded-full text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    aria-label={`Excluir campanha ${campaign.name}`}
                >
                    <TrashIcon />
                </button>
              </div>
            </div>
            <div className="flex space-x-2 justify-end pt-1 border-t border-gray-700/50">
                {campaign.status !== 'Aprovado' && (
                    <button onClick={() => onUpdateStatus(campaign.id, 'Aprovado')} className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-3 rounded-md">Aprovar</button>
                )}
                {campaign.status !== 'Rejeitado' && (
                    <button onClick={() => onUpdateStatus(campaign.id, 'Rejeitado')} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded-md">Rejeitar</button>
                )}
                 {campaign.status === 'Rejeitado' && campaign.status === 'Aprovado' && (
                    <p className="text-xs text-gray-500 text-right pr-2">Nenhuma ação de status disponível.</p>
                )}
            </div>
          </div>
        )) : (
            <p className="text-center text-gray-400 py-4">
                Nenhuma campanha criada. Adicione vídeos para criar campanhas automaticamente.
            </p>
        )}
      </CardContent>
    </Card>
  );
};