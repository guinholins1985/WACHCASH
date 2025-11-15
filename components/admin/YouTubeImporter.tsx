import React, { useState } from 'react';
import type { Video } from '../../types';
import { YOUTUBE_API_KEY } from '../../constants';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';

interface YouTubeImporterProps {
  onAddVideos: (videos: Video[]) => void;
  onQuickAddAndApprove: (videos: Video[]) => void;
}

// --- Real YouTube Data API ---

const parseYouTubeDuration = (duration: string): string => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return "0:00";
  
    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);
  
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
  
    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${m}:${String(s).padStart(2, '0')}`;
};

const fetchYouTubeDetails = async (url: string): Promise<Video[]> => {
    const API_URL = 'https://www.googleapis.com/youtube/v3';
    
    const videoIdMatch = url.match(/(?:v=|\/|vi=|\.be\/)([0-9A-Za-z_-]{11}).*/);
    const playlistIdMatch = url.match(/[?&]list=([0-9A-Za-z_-]+)/);

    let videoIds: string[] = [];

    if (playlistIdMatch) {
        const playlistId = playlistIdMatch[1];
        const playlistResponse = await fetch(`${API_URL}/playlistItems?part=contentDetails&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}&maxResults=50`);
        const playlistData = await playlistResponse.json();
        if (playlistData.error) throw new Error(`API Error: ${playlistData.error.message}`);
        if (!playlistData.items || playlistData.items.length === 0) throw new Error("Playlist vazia ou não encontrada.");
        videoIds = playlistData.items.map((item: any) => item.contentDetails.videoId);

    } else if (videoIdMatch) {
        videoIds = [videoIdMatch[1]];
    } else {
        throw new Error('URL do YouTube inválida. Forneça um link de vídeo ou playlist.');
    }

    if (videoIds.length === 0) {
        throw new Error("Nenhum ID de vídeo encontrado na URL.");
    }
    
    const videosResponse = await fetch(`${API_URL}/videos?part=snippet,contentDetails,status&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`);
    const videosData = await videosResponse.json();
    if (videosData.error) throw new Error(`API Error: ${videosData.error.message}`);

    return videosData.items.map((item: any): Video => ({
        id: `vid-${item.id}-${Date.now()}`,
        youtubeId: item.id,
        title: item.snippet.title,
        duration: parseYouTubeDuration(item.contentDetails.duration),
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        advertiser: 'Definido na Campanha',
        isEmbeddable: item.status.embeddable,
    }));
};
// ------------------------------

const WarningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);


export const YouTubeImporter: React.FC<YouTubeImporterProps> = ({ onAddVideos, onQuickAddAndApprove }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Video[]>([]);

  const resetState = () => {
    setPreviews([]);
    setUrl('');
    setError(null);
  }

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPreviews([]);
    try {
      const videoDetails = await fetchYouTubeDetails(url);
      setPreviews(videoDetails);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVideosToLibrary = () => {
    if (previews.length === 0) return;
    onAddVideos(previews);
    resetState();
  };
  
  const handleQuickAdd = () => {
    if (previews.length === 0) return;
    onQuickAddAndApprove(previews);
    resetState();
  };
  
  const hasUnembeddableVideos = previews.some(p => p.isEmbeddable === false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importar Vídeo do YouTube</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleValidate} className="space-y-2">
          <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-300">
            Link do Vídeo ou Playlist
          </label>
          <div className="flex space-x-2">
            <input
              id="youtube-url"
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=...&list=..."
              className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500">
              {isLoading ? 'Buscando...' : 'Validar'}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </form>

        {previews.length > 0 && (
          <div className="border-t border-gray-700 pt-4 space-y-4">
            <h4 className="font-semibold">Preview ({previews.length} vídeo{previews.length > 1 ? 's' : ''} encontrado{previews.length > 1 ? 's' : ''}):</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {previews.map(preview => (
                 <div key={preview.id} className={`p-2 bg-gray-700/50 rounded-md ${preview.isEmbeddable === false ? 'border border-red-500/50' : ''}`}>
                    <div className="flex items-center space-x-4">
                        <img src={preview.thumbnail} alt={preview.title} className="w-24 h-16 object-cover rounded" />
                        <div>
                        <p className="font-bold text-sm">{preview.title}</p>
                        <p className="text-xs text-gray-400">Duração: {preview.duration}</p>
                        </div>
                    </div>
                    {preview.isEmbeddable === false && (
                        <div className="flex items-center text-red-400 text-xs mt-2 p-2 bg-red-500/10 rounded">
                            <WarningIcon />
                            <span>Este vídeo não permite incorporação e não funcionará no app.</span>
                        </div>
                    )}
                  </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                 <button 
                    onClick={handleAddVideosToLibrary} 
                    disabled={hasUnembeddableVideos}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {hasUnembeddableVideos ? 'Remova vídeos com erro' : 'Adicionar à Biblioteca'}
                </button>
                 <button 
                    onClick={handleQuickAdd}
                    disabled={hasUnembeddableVideos}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {hasUnembeddableVideos ? 'Remova vídeos com erro' : 'Adicionar e Visualizar no App'}
                </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};