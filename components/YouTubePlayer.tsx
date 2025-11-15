import React, { useRef, useEffect, useCallback } from 'react';
import YouTube from 'react-youtube';
import type { YouTubePlayer as YouTubePlayerType } from 'react-youtube';
import type { Video } from '../types';

interface YouTubePlayerProps {
  video: Video;
  isActive: boolean; // Prop to control playback
  onTimeUpdate?: (videoId: string, seconds: number) => void;
  onVideoStart?: (videoId: string) => void;
  onEnd?: (videoId: string) => void;
  autoplay?: boolean; // Add optional autoplay for admin preview
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ video, isActive, onTimeUpdate, onVideoStart, onEnd, autoplay = false }) => {
  const intervalRef = useRef<number | null>(null);
  const playerRef = useRef<YouTubePlayerType | null>(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Programmatically play or pause the video based on the isActive prop
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    if (isActive) {
      player.playVideo();
    } else {
      // Pause only if it's currently playing to avoid unnecessary state changes
      if (player.getPlayerState && player.getPlayerState() === 1) {
        player.pauseVideo();
      }
    }
  }, [isActive]);

  const onPlayerStateChange = (event: { data: number }) => {
    // YT.PlayerState.PLAYING = 1
    // YT.PlayerState.ENDED = 0
    if (event.data === 1) { // Playing
      onVideoStart?.(video.id);
      if (!intervalRef.current) {
        intervalRef.current = window.setInterval(() => {
          onTimeUpdate?.(video.id, 1);
        }, 1000);
      }
    } else { // Paused, ended, buffering, etc.
      cleanup();
      if (event.data === 0) { // Ended
        onEnd?.(video.id);
      }
    }
  };

  const onReady = (event: { target: YouTubePlayerType }) => {
    playerRef.current = event.target;
    // If it should be active on ready, play it
    if (isActive) {
      event.target.playVideo();
    }
  };
  
  // Cleanup interval on component unmount
  useEffect(() => cleanup, [cleanup]);
  
  // Cleanup when video changes
  useEffect(() => {
    cleanup();
  }, [video.id, cleanup]);


  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: autoplay ? 1 : 0, // Autoplay is controlled by the `isActive` prop now
      controls: 0, // Hide controls for a cleaner, TikTok-like UI
      modestbranding: 1,
      rel: 0,
      iv_load_policy: 3, // Hide video annotations
      disablekb: 1, // Disable keyboard controls
      origin: window.location.origin, // Crucial for preventing embedding errors
    },
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black">
      <YouTube
        videoId={video.youtubeId}
        opts={opts}
        onStateChange={onPlayerStateChange}
        onReady={onReady}
        className="w-full h-full"
      />
    </div>
  );
};