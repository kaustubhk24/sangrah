import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

export default function FontSizeControl() {
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const saved = localStorage.getItem('docFontSize');
    if (saved) {
      const s = parseInt(saved, 10);
      setFontSize(s);
      applyFontSize(s);
    } else {
      applyFontSize(fontSize);
    }
  }, []);

  const applyFontSize = (size) => {
    try {
      document.documentElement.style.setProperty('--ifm-font-size-base', `${size}px`);
    } catch (e) {
      document.documentElement.style.fontSize = `${size}px`;
    }
  };

  const increase = () => {
    setFontSize((prev) => {
      const next = Math.min(50, prev + 2);
      localStorage.setItem('docFontSize', next);
      applyFontSize(next);
      return next;
    });
  };

  const decrease = () => {
    setFontSize((prev) => {
      const next = Math.max(2, prev - 2);
      localStorage.setItem('docFontSize', next);
      applyFontSize(next);
      return next;
    });
  };

  return (
    <div className={styles.container} aria-label="Font size control">
      <button className={styles.btn} onClick={decrease} aria-label="Decrease font size">A−</button>
      <div className={styles.label}>{fontSize}px</div>
      <button className={styles.btn} onClick={increase} aria-label="Increase font size">A+</button>
    </div>
  );
}
