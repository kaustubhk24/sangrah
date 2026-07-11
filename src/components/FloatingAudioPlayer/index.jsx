import React from 'react';
import { useAudio } from '@site/src/context/AudioContext';
import styles from './styles.module.css';

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function FloatingAudioPlayer() {
  const { 
    audioSrc, 
    audioTitle,
    isPlaying, 
    currentTime, 
    duration, 
    isLoading, 
    togglePlayback, 
    seek, 
    stop,
    currentPageAudioSrc
  } = useAudio();

  // Hide if no audio is playing or if the active audio matches the current page's inline player
  if (!audioSrc || audioSrc === currentPageAudioSrc) return null;

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(ratio * duration);
  };

  return (
    <div className={styles.floatingPlayer}>
      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBar}
          onClick={handleProgressClick}
          role="progressbar"
          aria-valuenow={Math.round((currentTime / (duration || 1)) * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={styles.progressFill}
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className={styles.playerContent}>
        <button
          className={styles.playBtn}
          onClick={togglePlayback}
          disabled={isLoading}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? '⟳' : isPlaying ? '⏸' : '▶'}
        </button>

        <div className={styles.songInfo}>
          <span className={styles.songTitle} title={audioTitle}>{audioTitle || 'Audio'}</span>
          <span className={styles.time}>{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>

        <button
          className={styles.closeBtn}
          onClick={stop}
          aria-label="Close player"
          title="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

