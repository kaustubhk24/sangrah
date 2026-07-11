import React, { useEffect } from 'react';
import HistoryTracker from '../components/HistoryTracker';
import LanguagePopup from '../components/LanguagePopup';
import { LanguageProvider } from '../utils/translations';
import { AudioProvider } from '../context/AudioContext';
import FloatingAudioPlayer from '../components/FloatingAudioPlayer';

export default function Root({children}) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const theme = window.localStorage.getItem('site-theme') || 'light';
    const fontSize = window.localStorage.getItem('site-font-size') || 'medium';
    const elderMode = window.localStorage.getItem('elder-mode') === 'true';

    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-font-size', fontSize);
    document.documentElement.classList.toggle('elder-mode', elderMode);
  }, []);

  return (
    <LanguageProvider>
      <AudioProvider>
        {children}
        <FloatingAudioPlayer />
        <HistoryTracker />
        <LanguagePopup />
      </AudioProvider>
    </LanguageProvider>
  );
}

