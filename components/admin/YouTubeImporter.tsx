import React, { useState } from 'react';
import type { Video } from '../../types';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import { CENTS_PER_SECOND } from '../../constants';

interface YouTubeImporterProps {
  onAddVideo: (video: Video) => void;
}

// --- Mock YouTube Data API ---
const fetchYouTubeVideoDetails = async (url: string): Promise<Omit<Video, 'id' | 'advertiser'>> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const videoIdMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
            if (!videoIdMatch || !videoIdMatch[1]) {
                reject(new Error('URL do YouTube inválida.'));
                return;
            }
            const youtubeId = videoIdMatch[1];
            
            // Mock data based on ID for demonstration
            const mockData: { [key: string]: Omit<Video, 'id' | 'advertiser' | 'youtubeId'> } = {
                'dQw4w9WgXcQ': { title: "Rick Astley - Never Gonna Give You Up", duration: "3:32", thumbnail: `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg` },
                '3tmd-ClpJxA': { title: "4K Relaxing River", duration: "1:00:00", thumbnail: `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg` },
                'h6fcK_fRYaI': { title: "lofi hip hop radio", duration: "24/7", thumbnail: `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg` },
            };
            
            const videoDetails = mockData[youtubeId] || {
                title: `Vídeo de Exemplo (ID: ${youtubeId})`,
                duration: "10:00",
                thumbnail: `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
            };

            resolve({ youtubeId, ...videoDetails });
        }, 800);
    });
};
// ------------------------------

export const YouTubeImporter: React.FC<YouTubeImporterProps> = ({ onAddVideo }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Omit<Video, 'id' | 'advertiser'> | null>(null);
  const [rewardPerMinute, setRewardPerMinute] = useState((CENTS_PER_SECOND * 60).toFixed(2));

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPreview(null);
    try {
      const videoDetails = await fetchYouTubeVideoDetails(url);
      setPreview(videoDetails);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVideo = () => {
    if (!preview) return;
    const newVideo: Video = {
        ...preview,
        id: `vid-${Date.now()}`,
        advertiser: 'Definido na Campanha', // Placeholder
    };
    onAddVideo(newVideo);
    setPreview(null);
    setUrl('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importar Vídeo do YouTube</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleValidate} className="space-y-2">
          <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-300">
            Link do Vídeo ou Canal
          </label>
          <div className="flex space-x-2">
            <input
              id="youtube-url"
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500">
              {isLoading ? 'Validando...' : 'Validar'}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </form>

        {preview && (
          <div className="border-t border-gray-700 pt-4 space-y-4">
            <h4 className="font-semibold">Preview do Vídeo:</h4>
            <div className="flex items-center space-x-4 p-2 bg-gray-700/50 rounded-md">
              <img src={preview.thumbnail} alt={preview.title} className="w-24 h-16 object-cover rounded" />
              <div>
                <p className="font-bold">{preview.title}</p>
                <p className="text-sm text-gray-400">Duração: {preview.duration}</p>
              </div>
            </div>
            
            <div>
                 <button onClick={handleAddVideo} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md">
                    Adicionar à Biblioteca de Vídeos
                </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
