import React, { useEffect, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import { useTranslation } from '../utils/translations';
import styles from './compass.module.css';

const normalizeHeading = (heading) => (heading + 360) % 360;
const shortestHeadingDelta = (from, to) => ((to - from + 540) % 360) - 180;
const getDirectionLabel = (heading) => {
  const normalized = normalizeHeading(heading);
  const sectors = [
    { label: 'उत्तर', min: 337.5, max: 360 },
    { label: 'उत्तर-पूर्व', min: 22.5, max: 67.5 },
    { label: 'पूर्व', min: 67.5, max: 112.5 },
    { label: 'आग्नेय', min: 112.5, max: 157.5 },
    { label: 'दक्षिण', min: 157.5, max: 202.5 },
    { label: 'नैऋत्य', min: 202.5, max: 247.5 },
    { label: 'पश्चिम', min: 247.5, max: 292.5 },
    { label: 'वायव्य', min: 292.5, max: 337.5 },
  ];

  const match = sectors.find(({ min, max }) => normalized >= min && normalized < max);
  if (match) return match.label;

  return 'उत्तर';
};

export default function CompassPage() {
  const { t } = useTranslation();
  const [sensorAvailable, setSensorAvailable] = useState(null);
  const [permissionState, setPermissionState] = useState('idle');
  const [heading, setHeading] = useState(null);
  const [calibrationOffset, setCalibrationOffset] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const headingRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const orientationApiAvailable = 'DeviceOrientationEvent' in window;
    setSensorAvailable(orientationApiAvailable);

    if (!orientationApiAvailable) {
      setPermissionState('unsupported');
    }

    const savedOffset = Number(window.localStorage.getItem('compassCalibrationOffset'));
    if (Number.isFinite(savedOffset)) {
      setCalibrationOffset(savedOffset);
    }

    return undefined;
  }, []);

  useEffect(() => {
    if (permissionState !== 'granted') return undefined;

    headingRef.current = null;

    const unsupportedTimer = window.setTimeout(() => {
      setPermissionState((currentState) => (currentState === 'granted' && headingRef.current === null ? 'unsupported' : currentState));
    }, 5000);

    const handleOrientation = (event) => {
      let rawHeading = null;
      const safariHeading = Number(event.webkitCompassHeading);
      if (Number.isFinite(safariHeading)) {
        rawHeading = normalizeHeading(safariHeading);
      } else {
        const alpha = Number(event.alpha);
        if (Number.isFinite(alpha)) {
          rawHeading = normalizeHeading(alpha);
        }
      }

      if (rawHeading === null) return;
      window.clearTimeout(unsupportedTimer);

      const previousHeading = headingRef.current;
      if (previousHeading === null) {
        headingRef.current = rawHeading;
        setHeading(rawHeading);
        return;
      }

      const delta = shortestHeadingDelta(previousHeading, rawHeading);
      if (Math.abs(delta) < 1.5) return;

      const filteredHeading = normalizeHeading(previousHeading + delta * 0.2);
      headingRef.current = filteredHeading;
      setHeading(filteredHeading);
    };

    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => {
      window.clearTimeout(unsupportedTimer);
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
  const calibratedHeading = heading === null ? null : normalizeHeading(heading + calibrationOffset);
  const displayHeading = calibratedHeading === null ? '--' : `${Math.round(calibratedHeading)}°`;
  const directionLabel = calibratedHeading === null ? '—' : getDirectionLabel(calibratedHeading);

  const calibrateCompass = () => {
    if (heading === null) return;

    const offset = normalizeHeading(-heading);
    setCalibrationOffset(offset);
    window.localStorage.setItem('compassCalibrationOffset', String(offset));
  };

  const resetCalibration = () => {
    setCalibrationOffset(0);
    window.localStorage.removeItem('compassCalibrationOffset');
  };

  return (
    <Layout title={t('compassLabel')}>
      <main className={styles.page}>
        <section className={styles.compassPanel} aria-labelledby="compass-title">
          <p className={styles.eyebrow}>{t('compassLabel')}</p>
          <h1 id="compass-title">{t('compassLabel')}</h1>
          <p className={styles.status} role="status">{statusMessage()}</p>

          <div className={styles.compass} aria-label={isEnabled && calibratedHeading !== null ? `दिशा ${displayHeading}` : 'कम्पास'}>
            <div className={styles.cardinalNorth}>उ</div>
            <div className={styles.cardinalNorthEast}>ईशा</div>
            <div className={styles.cardinalEast}>पू</div>
            <div className={styles.cardinalSouthEast}>आग्ने</div>
            <div className={styles.cardinalSouth}>द</div>
            <div className={styles.cardinalSouthWest}>नैऋ</div>
            <div className={styles.cardinalWest}>प</div>
            <div className={styles.cardinalNorthWest}>वाय</div>
            <div
              className={styles.needle}
              style={{ transform: `translate(-50%, -50%) rotate(${calibratedHeading || 0}deg)` }}
              aria-hidden="true"
            >
              <span className={styles.needleNorth} />
              <span className={styles.needleSouth} />
            </div>
            <div className={styles.centerDot} aria-hidden="true" />
          </div>

          <div className={styles.reading} aria-live="polite">
            <strong>{displayHeading}</strong>
            <span>{directionLabel}</span>
          </div>

          {!isEnabled && permissionState !== 'unsupported' && (
            <button type="button" className={styles.enableButton} onClick={enableCompass}>
              कम्पास सुरू करा
            </button>
          )}

          {isEnabled && heading === null && (
            <p className={styles.helpText}>कृपया फोन सपाट धरून काही क्षण थांबा.</p>
          )}

          {isEnabled && heading !== null && (
            <div className={styles.calibrationControls}>
              <button type="button" className={styles.calibrateButton} onClick={calibrateCompass}>
                कॅलिब्रेट करा
              </button>
              {calibrationOffset !== 0 && (
                <button type="button" className={styles.resetButton} onClick={resetCalibration}>
                  रीसेट
                </button>
              )}
              <span className={styles.calibrationHint}>फोन योग्य दिशेला धरून कॅलिब्रेट करा</span>
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}