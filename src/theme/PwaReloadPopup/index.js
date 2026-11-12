import React from 'react';
import styles from './styles.module.css';

export default function PwaReloadPopup({ onReload }) {
  return (
    <div className={styles.reloadPopup}>
      <div className={styles.reloadContent}>
        <span>✨ नवीन आवृत्ती उपलब्ध आहे. कृपया नवीन वाचन मिळवण्यासाठी पान पुन्हा उघडा.</span>
        <button className={styles.reloadBtn} onClick={onReload}>
          पुन्हा उघडा
        </button>
      </div>
    </div>
  );
}
