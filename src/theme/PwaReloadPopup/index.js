import React from 'react';
import styles from './styles.module.css';

export default function PwaReloadPopup({ onReload }) {
  const getMsg = () => {
    const msgs = {
      mr: 'नवीन आवृत्ती उपलब्ध आहे. कृपया नवीन वाचन मिळवण्यासाठी रिफ्रेश करा.',
      en: 'A new version is available. Please refresh to get the latest content.',
      hi: 'नया संस्करण उपलब्ध है। कृपया नवीनतम सामग्री के लिए रिफ्रेश करें.'
    };
    const currentLang = typeof window !== 'undefined' ? (window.localStorage.getItem('site-language') || 'mr') : 'mr';
    return msgs[currentLang] || msgs.mr;
  };

  const getBtnText = () => {
    const btns = {
      mr: 'रिफ्रेश करा',
      en: 'Refresh',
      hi: 'रिफ्रेश करें'
    };
    const currentLang = typeof window !== 'undefined' ? (window.localStorage.getItem('site-language') || 'mr') : 'mr';
    return btns[currentLang] || btns.mr;
  };

  return (
    <div className={styles.reloadPopup}>
      <div className={styles.reloadContent}>
        <span>✨ {getMsg()}</span>
        <button className={styles.reloadBtn} onClick={onReload}>
          {getBtnText()}
        </button>
      </div>
    </div>
  );
}
