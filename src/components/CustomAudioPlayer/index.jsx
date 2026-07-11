import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';

const pageAudioMap = {
  '/maruti-stotra': 'https://cdn2.justinclicks.com/Public%20CDN/public_audios/stotras/maruti-stotra.mp3',
  '/ram-raksha': 'https://cdn2.justinclicks.com/Public%20CDN/public_audios/stotras/ram-raksha-audio.mp3',
};

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function CustomAudioPlayer() {
  const location = useLocation();
  const audioRef = useRef(null);
  const [audioSrc, setAudioSrc] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const slug = location.pathname.split('?')[0].split('#')[0];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if audio URL is in pageAudioMap
    const configuredSrc = pageAudioMap[slug] || '';
    
    // Fallback: look for audio element in the page
    const fallbackAudio = document.querySelector('article audio, main article audio, .theme-doc-markdown audio');
    const resolvedSrc = configuredSrc || fallbackAudio?.getAttribute('src') || '';
    
    setAudioSrc(resolvedSrc);
  }, [slug]);

  useEffect(() => {
    if (!audioRef.current || !audioSrc) return;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadStart = () => setIsLoading(true);
    const handleEnded = () => setIsPlaying(false);

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
  }, [audioSrc]);

  const togglePlayback = async () => {
    if (!audioRef.current) return;

    try {
      if (audioRef.current.paused) {
        await audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const handleSeek = (event) => {
    if (!audioRef.current || !Number.isFinite(duration) || duration <= 0) return;
    const ratio = parseFloat(event.target.value) / 100;
    audioRef.current.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  if (!audioSrc) return null;

  return (
    <div className={styles.playerContainer}>
      <audio
        ref={audioRef}
        src={audioSrc}
        controlsList="nodownload"
        preload="metadata"
      />

      <div className={styles.playerCard}>
        <div className={styles.playerHeader}>
          <span className={styles.playerTitle}>🎵 Audio</span>
          {isLoading && <span className={styles.loadingSpinner}>⟳</span>}
        </div>

        <div className={styles.playerControls}>
          <button
            className={styles.playButton}
            onClick={togglePlayback}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            disabled={isLoading}
          >
            {isLoading ? '⟳' : isPlaying ? '⏸' : '▶'}
          </button>

          <div className={styles.progressContainer}>
            <input
              type="range"
              min="0"
              max="100"
              value={duration > 0 ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className={styles.progressBar}
              aria-label="Seek audio"
              disabled={!audioSrc || isLoading}
            />
          </div>

          <span className={styles.timeDisplay}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
