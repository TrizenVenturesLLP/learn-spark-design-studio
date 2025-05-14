
import { useState, useEffect, useRef } from 'react';
import { Video, Play, Pause } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  onVideoComplete?: () => void;
  isEnabled?: boolean;
  title?: string;
}

const VideoPlayer = ({ 
  videoUrl, 
  onVideoComplete,
  isEnabled = true,
  title = 'Course Video'
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      if (videoElement) {
        setCurrentTime(videoElement.currentTime);
        
        // Check if video is 95% complete
        const completionThreshold = videoElement.duration * 0.95;
        if (videoElement.currentTime >= completionThreshold && !isVideoCompleted) {
          setIsVideoCompleted(true);
          if (onVideoComplete) {
            onVideoComplete();
          }
        }
      }
    };

    const handleLoadedMetadata = () => {
      if (videoElement) {
        setDuration(videoElement.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (!isVideoCompleted && onVideoComplete) {
        setIsVideoCompleted(true);
        onVideoComplete();
      }
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('ended', handleEnded);
    
    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, [onVideoComplete, isVideoCompleted]);

  const togglePlayPause = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle non-enabled state
  if (!isEnabled) {
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/90 flex items-center justify-center text-white">
        <div className="text-center space-y-2">
          <Video className="h-8 w-8 mx-auto" />
          <p>Complete the previous day's content to unlock this video</p>
        </div>
      </div>
    );
  }

  // Show loading state if URL is not accessible
  if (!videoUrl) {
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black flex items-center justify-center text-white">
        <div className="text-center space-y-2">
          <Video className="h-8 w-8 mx-auto animate-pulse" />
          <p>Loading video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden bg-black relative group">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        playsInline
        preload="metadata"
        title={title}
      />
      
      {/* Custom controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transform transition-opacity duration-300 opacity-0 group-hover:opacity-100">
        <div className="flex items-center space-x-4">
          <button 
            onClick={togglePlayPause}
            className="text-white hover:text-primary-foreground"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </button>
          
          <div className="flex-1 space-y-1">
            <div className="h-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/80">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Company logo overlay */}
      <div className="absolute top-2 md:top-4 z-5 flex items-center" style={{ right: '-3px' }}>
        <div className="absolute inset-0 bg-black/0 rounded-lg -z-5" />
        <div className="px-2 py-1 md:px-3 md:py-2">
          <img 
            src="/logo_footer.png"
            alt="Company Logo"
            className="h-5 w-auto md:h-7"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
