import React, { useState } from 'react';
import type { Video } from '../../types';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { YouTubePlayer } from '../YouTubePlayer';

interface VideoLibraryProps {
  videoLibrary: Video[];
  onDeleteVideo: (videoId: string) => void;
}

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);

const WarningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);


export const VideoLibrary: React.FC<VideoLibraryProps> = ({ videoLibrary, onDeleteVideo }) => {
  const [previewVideo, setPreviewVideo] = useState<Video | null>(null);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Biblioteca de Vídeos ({videoLibrary.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-96 overflow-y-auto">
          {videoLibrary.length > 0 ? (
            videoLibrary.map(video => (
              <div key={video.id} className="flex items-center space-x-2 p-2 bg-gray-900/50 rounded-md border border-gray-700">
                {video.thumbnail && (
                  <img src={video.thumbnail} alt={video.title} className="w-20 h-14 object-cover rounded flex-shrink-0" />
                )}
                <div className="overflow-hidden flex-grow">
                  <p className="font-bold text-sm truncate">{video.title}</p>
                  <div className="flex items-center space-x-2">
                    {video.isEmbeddable === false && <WarningIcon title="Este vídeo não pode ser incorporado"/>}
                    <p className="text-xs text-gray-400 truncate">ID: {video.youtubeId}</p>
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center">
                   <button 
                      onClick={() => setPreviewVideo(video)}
                      className="p-2 rounded-full text-gray-400 hover:bg-blue-500/20 hover:text-blue-400 transition-colors"
                      aria-label={`Preview video ${video.title}`}
                    >
                        <PlayIcon />
                    </button>
                    <button 
                      onClick={() => onDeleteVideo(video.id)}
                      className="p-2 rounded-full text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                      aria-label={`Excluir vídeo ${video.title}`}
                    >
                        <TrashIcon />
                    </button>
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
      
      <Modal isOpen={!!previewVideo} onClose={() => setPreviewVideo(null)}>
        {previewVideo && (
            <div className="w-full">
                <h3 className="text-xl font-bold mb-4 text-white">{previewVideo.title}</h3>
                <div className="aspect-video">
                  {previewVideo.isEmbeddable === false ? (
                      <div className="w-full h-full bg-black rounded-lg flex flex-col items-center justify-center text-center">
                          <WarningIcon className="h-10 w-10 text-red-400 mb-4" />
                          <h4 className="text-lg font-bold text-white">Erro de Reprodução</h4>
                          <p className="text-gray-300">Este vídeo não permite incorporação e não pode ser pré-visualizado.</p>
                      </div>
                  ) : (
                      <YouTubePlayer video={previewVideo} isActive={true} autoplay={true} />
                  )}
                </div>
            </div>
        )}
      </Modal>
    </>
  );
};