import React, { useState } from 'react';
import type { Video } from '../types';
import { YouTubePlayer } from './YouTubePlayer';

interface VideoPostProps {
  video: Video;
  isActive: boolean;
  onTimeUpdate: (videoId: string, seconds: number) => void;
  onVideoStart: (videoId: string) => void;
  onEnd: (videoId: string) => void;
}

// SVG Icons for the UI
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill={filled ? "red" : "white"}>
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);

const CommentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg>
);

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
);


const VideoPost: React.FC<VideoPostProps> = ({ video, isActive, onTimeUpdate, onVideoStart, onEnd }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);

  // Use a ref to track the last click time to detect double clicks
  const lastClickTime = React.useRef(0);

  const handleLike = () => {
      setIsLiked(prev => !prev);
  }

  const handleInteraction = () => {
    const now = new Date().getTime();
    if (now - lastClickTime.current < 300) { // 300ms threshold for double click
      handleLike();
      if (!isLiked) {
        setShowLikeAnimation(true);
        setTimeout(() => setShowLikeAnimation(false), 800);
      }
    }
    lastClickTime.current = now;
  };
  
  return (
    <div 
        className="w-full h-full bg-black relative"
        onClick={handleInteraction}
    >
      <YouTubePlayer 
        video={video} 
        isActive={isActive}
        onTimeUpdate={onTimeUpdate}
        onVideoStart={onVideoStart}
        onEnd={onEnd}
      />

      {/* Like Animation */}
      {showLikeAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white/80 animate-ping" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </div>
      )}


      {/* Floating UI Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 text-white bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex justify-between items-end">
          {/* Video Info */}
          <div className="flex-1 pr-4">
            <h3 className="font-bold text-lg drop-shadow-md">{video.title}</h3>
            <p className="text-sm drop-shadow-md">{video.advertiser}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center space-y-4">
            <button onClick={handleLike} className="flex flex-col items-center">
                <HeartIcon filled={isLiked} />
                <span className="text-xs">Like</span>
            </button>
            <button className="flex flex-col items-center">
                <CommentIcon />
                <span className="text-xs">Comment</span>
            </button>
            <button className="flex flex-col items-center">
                <ShareIcon />
                <span className="text-xs">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPost;
