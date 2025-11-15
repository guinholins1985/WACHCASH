import React, { useRef, useEffect, useCallback } from 'react';
import YouTube from 'react-youtube';
import type { YouTubePlayer as YouTubePlayerType } from 'react-youtube';
import type { Video } from '../types';

interface YouTubePlayerProps {
  video: Video;
  onTimeUpdate: (videoId: string, seconds: number) => void;
  onVideoStart: (videoId: string) => void;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ video, onTimeUpdate, onVideoStart }) => {
  const intervalRef = useRef<number | null>(null);
  const playerRef = useRef<YouTubePlayerType | null>(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const onPlayerStateChange = (event: { data: number }) => {
    // YT.PlayerState.PLAYING = 1
    // YT.PlayerState.PAUSED = 2
    // YT.PlayerState.ENDED = 0
    
    if (event.data === 1) { // Playing
      onVideoStart(video.id);
      if (!intervalRef.current) {
        intervalRef.current = window.setInterval(() => {
          onTimeUpdate(video.id, 1); // Update every second
        }, 1000);
      }
    } else { // Paused, ended, buffering, etc.
      cleanup();
    }
  };

  const onReady = (event: { target: YouTubePlayerType }) => {
    playerRef.current = event.target;
  };
  
  // Cleanup interval on component unmount
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);
  
  // Cleanup when video changes
  useEffect(() => {
    cleanup();
  }, [video.id, cleanup]);


  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <div className="aspect-video w-full h-full relative overflow-hidden">
      <YouTube
        videoId={video.youtubeId}
        opts={opts}
        onStateChange={onPlayerStateChange}
        onReady={onReady}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};