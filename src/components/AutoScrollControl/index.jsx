import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

export default function AutoScrollControl() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [showControls, setShowControls] = useState(false);
  const scrollIntervalRef = useRef(null);

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('autoScrollSpeed');
    if (saved) {
      if (saved === 'slow') {
        setSpeed(1);
      } else if (saved === 'medium') {
        setSpeed(2);
      } else if (saved === 'fast') {
        setSpeed(4);
      } else {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) {
          setSpeed(parsed);
        }
      }
    }
  }, []);

  // Handle auto-scroll logic
  useEffect(() => {
    if (isScrolling) {
      scrollIntervalRef.current = setInterval(() => {
        window.scrollBy(0, speed);
      }, 50);
    } else {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    }
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isScrolling, speed]);

  const toggleScroll = () => {
    setIsScrolling(!isScrolling);
    setShowControls(!isScrolling);
  };

  const handleSpeedChange = (e) => {
    const newSpeed = parseInt(e.target.value, 10);
    setSpeed(newSpeed);
    localStorage.setItem('autoScrollSpeed', newSpeed);
  };

  const handleStop = () => {
    setIsScrolling(false);
    setShowControls(false);
  };

  return (
    <div className={styles.container} aria-label="Auto-scroll control">
      <button
        className={`${styles.mainBtn} ${isScrolling ? styles.active : ''}`}
        onClick={toggleScroll}
        aria-label="Toggle auto-scroll"
        title="Click to auto-scroll"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {/* Scroll/arrow down icon */}
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </button>

      {showControls && (
        <div className={styles.controlPanel}>
          <div className={styles.speedControl}>
            <label htmlFor="scrollSpeed">Speed:</label>
            <input
              id="scrollSpeed"
              type="range"
              min="1"
              max="10"
              value={speed}
              onChange={handleSpeedChange}
              className={styles.slider}
              aria-label="Scroll speed"
            />
            <span className={styles.speedValue}>{speed}</span>
          </div>
          <div className={styles.buttonGroup}>
            <button
              className={styles.controlBtn}
              onClick={() => setIsScrolling(!isScrolling)}
              aria-label={isScrolling ? 'Pause scroll' : 'Resume scroll'}
            >
              {isScrolling ? '⏸ Pause' : '▶ Resume'}
            </button>
            <button
              className={styles.controlBtn}
              onClick={handleStop}
              aria-label="Stop auto-scroll"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
