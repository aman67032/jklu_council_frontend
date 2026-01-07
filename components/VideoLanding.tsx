'use client';

import { useState, useEffect, useRef } from 'react';

interface VideoLandingProps {
    onComplete: () => void;
}

export default function VideoLanding({ onComplete }: VideoLandingProps) {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [playError, setPlayError] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Try to play manually if autoPlay gets blocked (common with unmuted videos)
        if (videoRef.current) {
            videoRef.current.play().catch((err) => {
                console.warn('Autoplay blocked, user interaction required:', err);
                setPlayError(true);
            });
        }

        return () => window.removeEventListener('resize', checkMobile);
    }, [isVideoLoaded]);

    const videoSrc = isMobile ? '/Loading_video_mobile.mp4' : '/Loading_vid_dekstop.mp4';

    const handleManualPlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setPlayError(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
            {!isVideoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                muted={false}
                playsInline
                preload="auto"
                onCanPlayThrough={() => setIsVideoLoaded(true)}
                onEnded={onComplete}
                className={`w-full h-full object-cover transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
            />

            {playError && isVideoLoaded && (
                <button
                    onClick={handleManualPlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20 group"
                >
                    <div className="px-8 py-4 bg-[var(--primary)] text-white rounded-full font-bold text-xl shadow-2xl transition-transform group-hover:scale-110 active:scale-95">
                        Click to Start
                    </div>
                </button>
            )}

            <button
                onClick={onComplete}
                className="absolute bottom-8 right-8 px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium transition-all hover:scale-105 active:scale-95 z-30"
            >
                Skip
            </button>
        </div>
    );
}
