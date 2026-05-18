import React, { useRef, useEffect, useState } from 'react';

interface VideoBackgroundProps {
  videoSrc: string;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  fallbackGradient?: string;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoSrc,
  className = '',
  overlay = true,
  overlayOpacity = 0.4,
  fallbackGradient = 'bg-gradient-primary'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedData = () => {
        setVideoLoaded(true);
        video.play().catch(error => {
          console.log('Video autoplay failed:', error);
          // Fallback: try to play with user interaction
          const playVideo = () => {
            video.play().catch(console.log);
          };
          document.addEventListener('click', playVideo, { once: true });
          document.addEventListener('touchstart', playVideo, { once: true });
        });
      };

      const handleError = () => {
        setVideoError(true);
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    }
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Fallback gradient background */}
      <div className={`absolute inset-0 ${fallbackGradient}`} />
      
      {/* Video background */}
      {!videoError && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      
      {/* Overlay */}
      {overlay && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  );
};
