import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [audioSrc, setAudioSrc] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioTitle, setAudioTitle] = useState('');
  const [currentPageAudioSrc, setCurrentPageAudioSrc] = useState('');
  const [playbackSpeed, setPlaybackSpeedState] = useState(1.0);
  const playbackSpeedRef = useRef(1.0);

  const setPlaybackSpeed = (speed) => {
    setPlaybackSpeedState(speed);
    playbackSpeedRef.current = speed;
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('audioPlaybackSpeed', speed.toString());
    }
  };

  // Load default playback rate from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSpeed = localStorage.getItem('audioPlaybackSpeed');
      if (savedSpeed) {
        const parsed = parseFloat(savedSpeed);
        if (!isNaN(parsed)) {
          setPlaybackSpeedState(parsed);
          playbackSpeedRef.current = parsed;
        }
      }
    }
  }, []);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.controlsList = 'nodownload';
      audioRef.current.playbackRate = playbackSpeedRef.current;
    }
  }, []);

  // Handle audio source changes
  useEffect(() => {
    if (!audioRef.current) return;

    if (audioSrc) {
      const isSameSrc = audioRef.current.src === audioSrc || 
                        (typeof window !== 'undefined' && new URL(audioSrc, window.location.href).href === audioRef.current.src);
      if (!isSameSrc) {
        audioRef.current.src = audioSrc;
        audioRef.current.preload = 'metadata';
        setIsLoading(true);
        audioRef.current.playbackRate = playbackSpeedRef.current;
        audioRef.current.play().then(() => {
          if (audioRef.current) {
            audioRef.current.playbackRate = playbackSpeedRef.current;
          }
        }).catch((err) => {
          console.error('Audio play failed after source update:', err);
        });
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [audioSrc]);

  // Setup audio event listeners
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      audio.playbackRate = playbackSpeedRef.current;
    };

    const handlePlay = () => {
      setIsPlaying(true);
      audio.playbackRate = playbackSpeedRef.current;
    };
    const handlePause = () => setIsPlaying(false);
    const handleLoadStart = () => setIsLoading(true);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const play = (src, title) => {
    if (!audioRef.current) return;
    if (audioSrc === src) {
      audioRef.current.playbackRate = playbackSpeedRef.current;
      audioRef.current.play().catch((err) => {
        console.error('Audio play failed:', err);
      });
      return;
    }
    setAudioSrc(src);
    setAudioTitle(title);
  };

  const togglePlayback = async () => {
    if (!audioRef.current) return;

    try {
      if (audioRef.current.paused) {
        // Force the rate on resume/play just in case
        audioRef.current.playbackRate = playbackSpeedRef.current;
        await audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const seek = (timeInSeconds) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = timeInSeconds;
    setCurrentTime(timeInSeconds);
  };

  const stop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioSrc('');
    setAudioTitle('');
  };

  const value = {
    audioRef,
    audioSrc,
    setAudioSrc,
    currentTime,
    duration,
    isPlaying,
    isLoading,
    audioTitle,
    setAudioTitle,
    currentPageAudioSrc,
    setCurrentPageAudioSrc,
    togglePlayback,
    seek,
    stop,
    play,
    playbackSpeed,
    setPlaybackSpeed,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};
