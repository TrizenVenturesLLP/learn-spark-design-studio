
import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, className = "" }) => {
  // Handle different video sources
  const isMP4 = videoUrl?.endsWith('.mp4') || videoUrl?.includes('/api/videos/');
  const isYouTube = videoUrl?.includes('youtube.com') || videoUrl?.includes('youtu.be');
  const isGoogleDrive = videoUrl?.includes('drive.google.com');
  
  // Transform YouTube URL to embed format
  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };
  
  // Transform Google Drive URL to embed format
  const getGoogleDriveEmbedUrl = (url: string) => {
    if (url.includes('/file/d/')) {
      const fileId = url.split('/file/d/')[1].split('/')[0];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    } else if (url.includes('id=')) {
      const fileId = url.split('id=')[1].split('&')[0];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return url;
  };
  
  if (isMP4) {
    return (
      <video 
        src={videoUrl} 
        controls 
        className={`w-full rounded-lg ${className}`}
        preload="metadata"
      />
    );
  } else if (isYouTube) {
    return (
      <iframe
        src={getYouTubeEmbedUrl(videoUrl)}
        className={`w-full aspect-video rounded-lg ${className}`}
        allowFullScreen
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    );
  } else if (isGoogleDrive) {
    return (
      <iframe 
        src={getGoogleDriveEmbedUrl(videoUrl)}
        className={`w-full aspect-video rounded-lg ${className}`}
        allowFullScreen
        title="Google Drive video player"
      ></iframe>
    );
  } else {
    // Fallback for other video sources
    return (
      <div className={`bg-muted flex items-center justify-center rounded-lg ${className} aspect-video`}>
        <p className="text-center p-4">Video format not supported or URL invalid</p>
      </div>
    );
  }
};
