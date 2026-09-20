import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import styles from './compass.module.css';

const normalizeHeading = (heading) => (heading + 360) % 360;

export default function CompassPage() {
  const [sensorAvailable, setSensorAvailable] = useState(null);
  const [permissionState, setPermissionState] = useState('idle');
  const [heading, setHeading] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const orientationApiAvailable = 'DeviceOrientationEvent' in window;
    setSensorAvailable(orientationApiAvailable);

    if (!orientationApiAvailable) {
      setPermissionState('unsupported');
    }

    return undefined;
  }, []);

  useEffect(() => {
    if (permissionState !== 'granted') return undefined;

    const handleOrientation = (event) => {
      const safariHeading = Number(event.webkitCompassHeading);
      if (Number.isFinite(safariHeading)) {
        setHeading(normalizeHeading(safariHeading));
        return;
      }

      const alpha = Number(event.alpha);
      if (event.absolute && Number.isFinite(alpha)) {
        setHeading(normalizeHeading(360 - alpha));
      }
    };

    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [permissionState]);

  const enableCompass = async () => {
    setErrorMessage('');

    if (!sensorAvailable) {
      setPermissionState('unsupported');
      return;
    }

    try {
      if (typeof window.DeviceOrientationEvent.requestPermission === 'function') {
        const result = await window.DeviceOrientationEvent.requestPermission();
        if (result !== 'granted') {
          setPermissionState('denied');
          setErrorMessage('कम्पास वापरण्यासाठी हालचाल सेन्सरची परवानगी आवश्यक आहे.');
          return;
        }
      }

      setPermissionState('granted');
    } catch (error) {
      setPermissionState('denied');
      setErrorMessage('सेन्सरची परवानगी मिळाली नाही. कृपया ब्राउझर सेटिंग्ज तपासा.');
    }
  };

  const statusMessage = () => {
    if (sensorAvailable === null) return 'सेन्सर तपासत आहे...';
    if (permissionState === 'unsupported') {
      return 'या फोन किंवा ब्राउझरमध्ये कम्पास सेन्सर उपलब्ध नाही.';
    }
    if (permissionState === 'denied') return errorMessage;
    if (permissionState === 'granted' && heading === null) {
      return 'फोन हलवा किंवा काही क्षण थांबा, दिशा मिळवत आहे...';
    }
    return 'कम्पास वापरण्यासाठी खालील बटण दाबा.';
  };

  const isEnabled = permissionState === 'granted';
  const displayHeading = heading === null ? '--' : `${Math.round(heading)}°`;

  return (
    <Layout title="कम्पास">
      <main className={styles.page}>
        <section className={styles.compassPanel} aria-labelledby="compass-title">
          <p className={styles.eyebrow}>दिशादर्शक</p>
          <h1 id="compass-title">कम्पास</h1>
          <p className={styles.status} role="status">{statusMessage()}</p>

          <div className={styles.compass} aria-label={isEnabled && heading !== null ? `दिशा ${displayHeading}` : 'कम्पास'}>
            <div className={styles.cardinalNorth}>उ</div>
            <div className={styles.cardinalEast}>पू</div>
            <div className={styles.cardinalSouth}>द</div>
            <div className={styles.cardinalWest}>प</div>
            <div
              className={styles.needle}
              style={{ transform: `translate(-50%, -50%) rotate(${heading || 0}deg)` }}
              aria-hidden="true"
            >
              <span className={styles.needleNorth} />
              <span className={styles.needleSouth} />
            </div>
            <div className={styles.centerDot} aria-hidden="true" />
          </div>

          <div className={styles.reading} aria-live="polite">
            <strong>{displayHeading}</strong>
            <span>उत्तरापासूनचा कोन</span>
          </div>

          {!isEnabled && permissionState !== 'unsupported' && (
            <button type="button" className={styles.enableButton} onClick={enableCompass}>
              कम्पास सुरू करा
            </button>
          )}

          {isEnabled && heading === null && (
            <p className={styles.helpText}>कृपया फोन सपाट धरून काही क्षण थांबा.</p>
          )}
        </section>
      </main>
    </Layout>
  );
}