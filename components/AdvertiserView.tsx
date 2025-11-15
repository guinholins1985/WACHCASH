
import React from 'react';
import type { Campaign, Metrics } from '../types';
import { Card, CardHeader, CardContent, CardTitle } from './ui/Card';

interface AdvertiserViewProps {
  campaign: Campaign;
  metrics: Metrics;
  formatCurrency: (cents: number) => string;
  formatTime: (seconds: number) => string;
}

const AdvertiserView: React.FC<AdvertiserViewProps> = ({ campaign, metrics, formatCurrency, formatTime }) => {
  const budgetSpentPercentage = (metrics.totalCost / campaign.budget) * 100;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-indigo-400">Painel do Anunciante</h2>
        <p className="text-gray-400">Analisando a campanha: <span className="font-semibold text-white">{campaign.name}</span> por <span className="font-semibold text-white">{campaign.advertiser}</span></p>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">Métricas de Desempenho</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
                <CardHeader><CardTitle>Custo Total</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-bold text-red-400">{formatCurrency(metrics.totalCost)}</p></CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>Orçamento Total</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-bold text-gray-300">{formatCurrency(campaign.budget)}</p></CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Visualizações Únicas</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-bold text-blue-400">{metrics.totalViews}</p></CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Tempo Total Assistido</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-bold text-purple-400">{formatTime(metrics.totalWatchTime)}</p></CardContent>
            </Card>
        </div>
      </section>
      
      <section>
        <h3 className="text-xl font-bold mb-4">Uso do Orçamento</h3>
        <Card>
            <CardContent>
                <div className="w-full bg-gray-700 rounded-full h-8">
                    <div 
                        className="bg-green-500 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white" 
                        style={{ width: `${Math.min(budgetSpentPercentage, 100)}%` }}
                    >
                        {budgetSpentPercentage.toFixed(2)}%
                    </div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-400">
                    <span>{formatCurrency(metrics.totalCost)} gastos</span>
                    <span>{formatCurrency(campaign.budget)} total</span>
                </div>
            </CardContent>
        </Card>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">Detalhes da Campanha</h3>
        <Card>
            <CardContent>
                <ul className="divide-y divide-gray-700">
                    <li className="py-3 flex justify-between"><span>Nome da Campanha:</span> <strong>{campaign.name}</strong></li>
                    <li className="py-3 flex justify-between"><span>Anunciante:</span> <strong>{campaign.advertiser}</strong></li>
                    <li className="py-3 flex justify-between"><span>Custo por Segundo:</span> <strong>{formatCurrency(campaign.costPerSecond)}</strong></li>
                    <li className="py-3 flex justify-between"><span>Número de Vídeos:</span> <strong>{campaign.videos.length}</strong></li>
                </ul>
            </CardContent>
        </Card>
      </section>
       <section>
          <h3 className="text-xl font-bold mb-4">Riscos e Mitigação (Documento Técnico)</h3>
           <Card>
            <CardContent className="prose prose-invert max-w-none">
                <h4>Prevenção de Fraudes</h4>
                <ul>
                    <li><strong>Detecção de Bots:</strong> A API de Iframe do YouTube possui mecanismos integrados para detectar visualizações não humanas.</li>
                    <li><strong>Limites de Visualização:</strong> Implementar limites diários de ganhos por usuário para desencorajar o uso de farms de visualização.</li>
                    <li><strong>Análise de Comportamento:</strong> No backend real, analisar padrões de visualização (ex: múltiplos vídeos assistidos simultaneamente do mesmo IP) para identificar atividades suspeitas.</li>
                </ul>
                <h4>Conformidade com as Políticas do YouTube</h4>
                <ul>
                    <li><strong>Não Incentivar Cliques:</strong> As políticas do YouTube proíbem pagar usuários diretamente por clicar em anúncios ou visualizar conteúdo. Nosso modelo recompensa o tempo de exibição do vídeo promocional, não a interação com anúncios do YouTube, o que é uma distinção crucial.</li>
                    <li><strong>API de Player Incorporado:</strong> Utilizar exclusivamente a API de Player Iframe oficial do YouTube para garantir a conformidade e a contagem correta de visualizações.</li>
                    <li><strong>Transparência:</strong> Deixar claro para os usuários que eles estão sendo recompensados pela plataforma WatchCash, e não pelo YouTube.</li>
                </ul>
            </CardContent>
        </Card>
       </section>
    </div>
  );
};

export default AdvertiserView;
