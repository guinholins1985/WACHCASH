import React, { useState, useEffect, useRef } from 'react';
import type { Video } from '../types';
import VideoPost from './VideoPost';

interface UserViewProps {
  videos: Video[];
  onTimeUpdate: (videoId: string, seconds: number) => void;
  onVideoStart: (videoId: string) => void;
}

const UserView: React.FC<UserViewProps> = ({ videos, onTimeUpdate, onVideoStart }) => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    // Auto-select the first video when the component loads or videos change
    if (videos.length > 0 && !activeVideoId) {
      setActiveVideoId(videos[0].id);
    }
  }, [videos, activeVideoId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const videoId = entry.target.getAttribute('data-video-id');
            if (videoId) {
              setActiveVideoId(videoId);
            }
          }
        }
      },
      {
        root: containerRef.current,
        threshold: 0.8, // At least 80% of the video must be visible
      }
    );

    const currentRefs = videoRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [videos]);

  const handleVideoEnd = (endedVideoId: string) => {
    const currentIndex = videos.findIndex(v => v.id === endedVideoId);
    if (currentIndex > -1 && currentIndex < videos.length - 1) {
      const nextVideo = videos[currentIndex + 1];
      const nextVideoElement = videoRefs.current.get(nextVideo.id);
      nextVideoElement?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (videos.length === 0) {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
                <h2 className="text-2xl font-bold mb-2">Nenhum vídeo disponível</h2>
                <p>Volte mais tarde para assistir e ganhar!</p>
            </div>
        </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth relative">
      {videos.map((video, index) => (
        <div
          key={video.id}
          ref={(el) => {
            if (el) videoRefs.current.set(video.id, el);
            else videoRefs.current.delete(video.id);
          }}
          data-video-id={video.id}
          className="h-full w-full snap-start flex items-center justify-center relative"
        >
          <VideoPost
            video={video}
            isActive={activeVideoId === video.id}
            onTimeUpdate={onTimeUpdate}
            onVideoStart={onVideoStart}
            onEnd={handleVideoEnd}
          />
        </div>
      ))}
    </div>
  );
};

export default UserView;
