import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import { useAudio } from '@site/src/context/AudioContext';
import { useTranslation } from '@site/src/utils/translations';
import styles from './styles.module.css';

const pageAudioMap = {
  '/maruti-stotra': 'https://cdn2.justinclicks.com/Public%20CDN/public_audios/stotras/maruti-stotra.mp3',
  '/bhimrupi': 'https://cdn2.justinclicks.com/Public%20CDN/public_audios/stotras/maruti-stotra.mp3',
  '/ram-raksha': 'https://cdn2.justinclicks.com/Public%20CDN/public_audios/stotras/ram-raksha-audio.mp3',
};

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function CustomAudioPlayer() {
  const { t } = useTranslation();
  const location = useLocation();
  const { 
    audioSrc, 
    currentTime, 
    duration, 
    isPlaying, 
    isLoading,
    togglePlayback, 
    seek,
    play,
    setCurrentPageAudioSrc,
    playbackSpeed,
    setPlaybackSpeed,
  } = useAudio();

  const slug = useMemo(() => location.pathname.split('?')[0].split('#')[0], [location.pathname]);
  const [pageAudioSrc, setPageAudioSrc] = useState('');
  const [pageAudioTitle, setPageAudioTitle] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkAudio = () => {
      const configuredSrc = pageAudioMap[slug] || '';
      const fallbackAudio = document.querySelector('article audio, main article audio, .theme-doc-markdown audio');
      const resolvedSrc = configuredSrc || fallbackAudio?.getAttribute('src') || '';
      const pageTitle = document.querySelector('article h1, main h1, .theme-doc-markdown h1')?.textContent || slug.slice(1);

      setPageAudioSrc(resolvedSrc);
      setPageAudioTitle(pageTitle);
      
      return !!resolvedSrc;
    };

    // Initial check
    if (checkAudio()) return;

    // Retry checking DOM at intervals to handle mounting during Docusaurus page transitions
    const timeouts = [100, 300, 600, 1000].map(delay => 
      setTimeout(checkAudio, delay)
    );

    return () => {
      timeouts.forEach(t => clearTimeout(t));
    };
  }, [slug]);

  useEffect(() => {
    setCurrentPageAudioSrc(pageAudioSrc);
    return () => {
      setCurrentPageAudioSrc('');
    };
  }, [pageAudioSrc, setCurrentPageAudioSrc]);

  const isCurrentAudioActive = audioSrc === pageAudioSrc && pageAudioSrc !== '';

  const handlePlayPause = () => {
    if (isCurrentAudioActive) {
      togglePlayback();
    } else {
      play(pageAudioSrc, pageAudioTitle);
    }
  };

  const handleSeek = (event) => {
    if (!isCurrentAudioActive || !Number.isFinite(duration) || duration <= 0) return;
    const ratio = parseFloat(event.target.value) / 100;
    seek(ratio * duration);
  };

  if (!pageAudioSrc) return null;

  return (
    <div className={styles.playerContainer}>
      <div className={styles.playerCard}>
        <div className={styles.playerHeader}>
          <span className={styles.playerTitle}>🎵 Audio</span>
          {isLoading && isCurrentAudioActive && <span className={styles.loadingSpinner}>⟳</span>}
        </div>

        <div className={styles.playerControls}>
          <button
            className={styles.playButton}
            onClick={handlePlayPause}
            aria-label={isCurrentAudioActive && isPlaying ? 'Pause' : 'Play'}
            disabled={isCurrentAudioActive && isLoading}
          >
            {isCurrentAudioActive && isLoading ? '⟳' : (isCurrentAudioActive && isPlaying ? '⏸' : '▶')}
          </button>

          <div className={styles.progressContainer}>
            <input
              type="range"
              min="0"
              max="100"
              value={isCurrentAudioActive && duration > 0 ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className={styles.progressBar}
              aria-label="Seek audio"
              disabled={!isCurrentAudioActive || (isCurrentAudioActive && isLoading)}
            />
          </div>

          <span className={styles.timeDisplay}>
            {isCurrentAudioActive ? `${formatTime(currentTime)} / ${formatTime(duration)}` : '0:00 / 0:00'}
          </span>

          <div className={styles.speedControlGroup}>
            <label htmlFor="audioSpeed" className={styles.speedLabel}>{t('audioSpeedControls')}</label>
            <select
              id="audioSpeed"
              className={styles.speedSelect}
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              aria-label="Audio speed"
              disabled={!isCurrentAudioActive}
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1.0x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2.0x</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

