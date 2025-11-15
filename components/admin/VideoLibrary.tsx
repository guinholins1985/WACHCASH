import React from 'react';
import type { Video } from '../../types';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';

interface VideoLibraryProps {
  videoLibrary: Video[];
}

export const VideoLibrary: React.FC<VideoLibraryProps> = ({ videoLibrary }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Biblioteca de Vídeos ({videoLibrary.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {videoLibrary.length > 0 ? (
          videoLibrary.map(video => (
            <div key={video.id} className="flex items-center space-x-4 p-2 bg-gray-900/50 rounded-md border border-gray-700">
              {video.thumbnail && (
                <img src={video.thumbnail} alt={video.title} className="w-20 h-14 object-cover rounded flex-shrink-0" />
              )}
              <div className="overflow-hidden">
                <p className="font-bold text-sm truncate">{video.title}</p>
                <p className="text-xs text-gray-400">ID do YouTube: {video.youtubeId}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-4">
            Nenhum vídeo na biblioteca. Adicione um vídeo acima para começar.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
