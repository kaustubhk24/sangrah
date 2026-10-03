import React, { useEffect } from 'react';
import Head from '@docusaurus/Head';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HistoryTracker from '../components/HistoryTracker';
import LanguagePopup from '../components/LanguagePopup';
import { LanguageProvider } from '../utils/translations';
import { AudioProvider } from '../context/AudioContext';
import FloatingAudioPlayer from '../components/FloatingAudioPlayer';

export default function Root({children}) {
  const {pathname} = useLocation();
  const {siteConfig} = useDocusaurusContext();
  const canonicalBaseUrl = siteConfig.customFields.canonicalBaseUrl;
  const canonicalUrl = new URL(pathname, canonicalBaseUrl).href;

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
    <>
      <Head>
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <LanguageProvider>
        <AudioProvider>
          {children}
          <FloatingAudioPlayer />
          <HistoryTracker />
          <LanguagePopup />
        </AudioProvider>
      </LanguageProvider>
    </>
  );
}

