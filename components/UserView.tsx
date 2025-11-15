import React from 'react';
import type { User, Video } from '../types';
import { YouTubePlayer } from './YouTubePlayer';
import { Card, CardHeader, CardContent, CardTitle } from './ui/Card';

interface UserViewProps {
  user: User;
  videos: Video[];
  onTimeUpdate: (videoId: string, seconds: number) => void;
  onVideoStart: (videoId: string) => void;
  formatCurrency: (cents: number) => string;
  formatTime: (seconds: number) => string;
}

const UserView: React.FC<UserViewProps> = ({ user, videos, onTimeUpdate, onVideoStart, formatCurrency, formatTime }) => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-indigo-400">Seu Painel</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Saldo Atual</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold text-green-400">{formatCurrency(user.balance)}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Tempo Total Assistido</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold text-blue-400">{formatTime(user.totalWatchTime)}</p>
                </CardContent>
            </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-indigo-400 text-center">Assista e Ganhe</h2>
        <div className="max-w-2xl mx-auto space-y-8">
            {videos.length > 0 ? (
                videos.map(video => (
                    <Card key={video.id} className="overflow-hidden">
                        <CardContent className="p-0">
                            <YouTubePlayer
                                video={video}
                                onTimeUpdate={onTimeUpdate}
                                onVideoStart={onVideoStart}
                            />
                        </CardContent>
                        <div className="p-4">
                            <h3 className="text-xl font-bold">{video.title}</h3>
                            <p className="text-sm text-gray-400">Anunciante: {video.advertiser}</p>
                        </div>
                    </Card>
                ))
            ) : (
                <Card>
                    <CardContent>
                        <p className="text-center text-gray-400 py-8">
                            Nenhum vídeo disponível no momento. Volte mais tarde!
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
      </section>
    </div>
  );
};

export default UserView;