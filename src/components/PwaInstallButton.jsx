import React, { useEffect, useState } from 'react';
import '../css/pwa-install.css';

export default function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const inStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
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

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isInStandalone = inStandalone || iosStandalone;
    if (isIos && !isInStandalone && !currentlyInstalled) {
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
            <h3>ॲप इन्स्टॉल कसे करावे</h3>
            <p>iPhone किंवा iPad वर, शेअर बटण दाबा आणि "होम स्क्रीनवर जोडा" निवडा.</p>
            <button className="pwa-modal-close" onClick={() => setShowIosHelp(false)}>बंद करा</button>
          </div>
        </div>
      )}
    </>
  );
}
