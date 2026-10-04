import React, { useEffect, useState } from 'react';
import '../css/pwa-install.css';
import { useTranslation } from '../utils/translations';

const installHelpCopy = {
  mr: {
    title: 'ॲप इन्स्टॉल करा',
    ios: 'शेअर बटण दाबा आणि “होम स्क्रीनवर जोडा” निवडा.',
    other: 'ब्राउझर मेनूमधून “Install app” किंवा “Add to Home Screen” निवडा.',
    close: 'बंद करा',
  },
  hi: {
    title: 'ऐप इंस्टॉल करें',
    ios: 'शेयर बटन दबाएँ और “होम स्क्रीन पर जोड़ें” चुनें।',
    other: 'ब्राउज़र मेन्यू में “Install app” या “Add to Home Screen” चुनें।',
    close: 'बंद करें',
  },
  en: {
    title: 'Install the app',
    ios: 'Tap the Share button, then choose “Add to Home Screen”.',
    other: 'Open your browser menu and choose “Install app” or “Add to Home Screen”.',
    close: 'Close',
  },
};

export default function PwaInstallButton() {
  const { lang } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const inStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    const isIosDevice = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIos(isIosDevice);
    const iosStandalone = window.navigator.standalone;
    const currentlyInstalled = !!inStandalone || !!iosStandalone;
    if (currentlyInstalled) {
      setIsInstalled(true);
      setVisible(false);
      return;
    }

    function onBeforeInstallPrompt(e) {
      e.preventDefault();
      if (isInstalled) return;
      setDeferredPrompt(e);
      setVisible(true);
    }

    function onAppInstalled() {
      setIsInstalled(true);
      setVisible(false);
      setDeferredPrompt(null);
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    const isInStandalone = inStandalone || iosStandalone;
    if (isIosDevice && !isInStandalone && !currentlyInstalled) {
      setVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, [isInstalled]);

  const onInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setVisible(false);
        setDeferredPrompt(null);
        setIsInstalled(true);
      } else {
        setVisible(false);
      }
    } else {
      setShowIosHelp(true);
    }
  };

  if (isInstalled || !visible) return null;
  const help = installHelpCopy[lang] || installHelpCopy.mr;

  return (
    <>
      <div className="install-banner">
        <div className="install-banner__body">
          <div className="install-banner__icon">📱</div>
          <div className="install-banner__copy">
            <strong>संपूर्ण संग्रह ॲप इन्स्टॉल करा</strong>
            <p>होम स्क्रीनवर जोडा आणि इंटरनेटशिवाय वापरा.</p>
          </div>
          <button className="install-banner__cta" onClick={onInstallClick} aria-label="इन्स्टॉल करा">
            इन्स्टॉल करा
          </button>
          <button className="install-banner__dismiss" onClick={() => setVisible(false)} aria-label="Dismiss install banner">
            ✕
          </button>
        </div>
      </div>

      {showIosHelp && (
        <div className="pwa-ios-modal" role="dialog" aria-modal="true">
          <div className="pwa-ios-modal-content">
            <h3>{help.title}</h3>
            <p>{isIos ? help.ios : help.other}</p>
            <button className="pwa-modal-close" onClick={() => setShowIosHelp(false)}>{help.close}</button>
          </div>
        </div>
      )}
    </>
  );
}
