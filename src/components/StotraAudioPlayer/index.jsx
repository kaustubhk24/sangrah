import React, { useEffect, useMemo, useRef, useState } from 'react';
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

export default function StotraAudioPlayer() {
  const location = useLocation();
  const audioRef = useRef(null);
  const lyricListRef = useRef(null);
  const [audioSrc, setAudioSrc] = useState('');
  const [lyrics, setLyrics] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const slug = useMemo(() => location.pathname.split('?')[0].split('#')[0], [location.pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const configuredSrc = pageAudioMap[slug] || '';
    const fallbackAudio = document.querySelector('article audio, main article audio, .theme-doc-markdown audio');
    const resolvedSrc = configuredSrc || fallbackAudio?.getAttribute('src') || '';
    setAudioSrc(resolvedSrc);

    const article = document.querySelector('article');
    if (!article) {
      setLyrics([]);
      setCurrentLineIndex(0);
      return;
    }

    const extractedLines = [];
    const paragraphs = Array.from(article.querySelectorAll('p'));
    paragraphs.forEach((paragraph) => {
      const lines = paragraph.innerText
        .split(/\r?\n/)
        .map((line) => line.replace(/\s+/g, ' ').trim())
        .filter(Boolean);

      lines.forEach((line) => {
        const normalized = line.replace(/^[•·-]\s*/, '').trim();
        if (
          normalized.length > 1 &&
          normalized.length < 180 &&
          !normalized.includes('Your browser does not support') &&
          !normalized.includes('index-text')
        ) {
          extractedLines.push(normalized);
        }
      });
    });

    const trimmedLyrics = extractedLines.slice(0, 36);
    setLyrics(trimmedLyrics);
    setCurrentLineIndex(0);
  }, [slug]);

  useEffect(() => {
    if (!audioRef.current || !audioSrc) return;

    const audio = audioRef.current;
    const syncLyric = () => {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0 || lyrics.length === 0) {
        return;
      }

      const step = audio.duration / Math.max(lyrics.length, 1);
      const nextIndex = Math.min(lyrics.length - 1, Math.max(0, Math.floor(audio.currentTime / step)));
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
      setCurrentLineIndex(nextIndex);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentLineIndex(Math.max(0, lyrics.length - 1));
    };

    audio.addEventListener('timeupdate', syncLyric);
    audio.addEventListener('loadedmetadata', syncLyric);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', syncLyric);
      audio.removeEventListener('loadedmetadata', syncLyric);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioSrc, lyrics.length]);

  useEffect(() => {
    if (lyricListRef.current && currentLineIndex > 0) {
      const active = lyricListRef.current.querySelector(`[data-line-index="${currentLineIndex}"]`);
      active?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [currentLineIndex]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch (error) {
        console.error('Audio play failed', error);
      }
    } else {
      audio.pause();
    }
  };

  const handleSeek = (event) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(duration) || duration <= 0) return;
    const ratio = parseFloat(event.target.value) / 100;
    audio.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  if (!audioSrc || lyrics.length < 2) return null;

  return (
    <div className={styles.playerCard}>
      <div className={styles.playerHeader}>
        <span className={styles.playerBadge}>🎧 Audio + Lyrics</span>
        <span className={styles.playerHint}>Lyrics move with playback</span>
      </div>

      <audio
        ref={audioRef}
        controls
        controlsList="nodownload"
        preload="metadata"
        src={audioSrc}
      >
        Your browser does not support the HTML5 audio element.
      </audio>

      <div className={styles.playerControls}>
        <button className={styles.playBtn} onClick={togglePlayback} type="button" aria-label={isPlaying ? 'Pause audio' : 'Play audio'}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <input
          className={styles.progressBar}
          type="range"
          min="0"
          max="100"
          value={duration > 0 ? (currentTime / duration) * 100 : 0}
          onChange={handleSeek}
          aria-label="Seek audio"
        />
        <span className={styles.timeText}>{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>

      <div className={styles.lyricPanel}>
        <div className={styles.activeLine}>{lyrics[currentLineIndex] || lyrics[0]}</div>
        <div className={styles.lyricList} ref={lyricListRef}>
          {lyrics.slice(Math.max(0, currentLineIndex - 2), Math.min(lyrics.length, currentLineIndex + 3)).map((line, index) => {
            const globalIndex = Math.max(0, currentLineIndex - 2) + index;
            return (
              <div
                key={`${line}-${globalIndex}`}
                className={`${styles.lyricItem} ${globalIndex === currentLineIndex ? styles.lyricItemActive : ''}`}
                data-line-index={globalIndex}
              >
                {line}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
