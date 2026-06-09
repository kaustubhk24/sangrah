import React, {useEffect, useState} from 'react';
import '../css/pwa-install.css';

export default function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    function onBeforeInstallPrompt(e) {
      e.preventDefault();
      // only show prompt if not already installed
      if (isInstalled) return;
      setDeferredPrompt(e);
      setVisible(true);
    }

    function onAppInstalled() {
      setIsInstalled(true);
      setVisible(false);
      setDeferredPrompt(null);
    }

    // initial installed detection
    const inStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    const iosStandalone = window.navigator.standalone;
    const currentlyInstalled = !!inStandalone || !!iosStandalone;
    if (currentlyInstalled) {
      setIsInstalled(true);
      setVisible(false);
      return; // no need to attach listeners
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    // Detect iOS PWA (safari) where beforeinstallprompt isn't fired
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isInStandalone = inStandalone || iosStandalone;
    if (isIos && !isInStandalone && !currentlyInstalled) {
      // show a subtle install hint for iOS
      setVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const onInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setVisible(false);
        setDeferredPrompt(null);
        setIsInstalled(true);
      } else {
        // user dismissed prompt — keep it unobtrusive (hide)
        setVisible(false);
      }
    } else {
      // iOS fallback: show instructions modal
      setShowIosHelp(true);
    }
  };

  // never show if already installed
  if (isInstalled) return null;

  if (!visible) return null;

  return (
    <>
      <div className="pwa-install-container">
        <button className="pwa-install-button" onClick={onInstallClick} aria-label="Install app">
          Install App
        </button>
      </div>

      {showIosHelp && (
        <div className="pwa-ios-modal" role="dialog" aria-modal="true">
          <div className="pwa-ios-modal-content">
            <h3>Install this app</h3>
            <p>To install on iPhone or iPad: tap <strong>Share</strong> then choose <strong>Add to Home Screen</strong>.</p>
            <button className="pwa-modal-close" onClick={() => setShowIosHelp(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
