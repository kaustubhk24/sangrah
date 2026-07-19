import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

export default function AutoScrollControl() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [speed, setSpeed] = useState(1.5);
  const [showControls, setShowControls] = useState(false);
  const scrollIntervalRef = useRef(null);
  const scrollAccRef = useRef(0);

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('autoScrollSpeed');
    if (saved) {
      if (saved === 'slow') {
        setSpeed(0.5);
      } else if (saved === 'medium') {
        setSpeed(1.5);
      } else if (saved === 'fast') {
        setSpeed(3.0);
      } else {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed)) {
          setSpeed(parsed);
        }
      }
    }
  }, []);

  // Handle auto-scroll logic
  useEffect(() => {
    if (isScrolling) {
      scrollAccRef.current = 0;
      scrollIntervalRef.current = setInterval(() => {
        scrollAccRef.current += speed;
        const toScroll = Math.floor(scrollAccRef.current);
        if (toScroll > 0) {
          window.scrollBy(0, toScroll);
          scrollAccRef.current -= toScroll;
        }
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
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);
    localStorage.setItem('autoScrollSpeed', newSpeed.toString());
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
              min="0.2"
              max="5"
              step="0.2"
              value={speed}
              onChange={handleSpeedChange}
              className={styles.slider}
              aria-label="Scroll speed"
            />
            <span className={styles.speedValue}>{speed.toFixed(1)}</span>
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
