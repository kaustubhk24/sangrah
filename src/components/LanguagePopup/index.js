import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../utils/translations';
import styles from './styles.module.css';

const localTranslations = {
  mr: {
    title: "तुमची आवडती भाषा निवडा",
    subtitle: "संग्रह अधिक चांगल्या प्रकारे वाचण्यासाठी आपली भाषा निवडा.",
    help: "तुम्ही ही भाषा नंतर सेटिंग्जमधून बदलू शकता.",
    save: "जतन करा",
  },
  hi: {
    title: "अपनी पसंदीदा भाषा चुनें",
    subtitle: "संग्रह को बेहतर ढंग से पढ़ने के लिए अपनी भाषा चुनें।",
    help: "आप इस भाषा को बाद में सेटिंग्स से बदल सकते हैं।",
    save: "सहेजें",
  },
  en: {
    title: "Select your preferred language",
    subtitle: "Select your language to browse Sangrah.",
    help: "You can change this language later from Settings.",
    save: "Save",
  }
};

export default function LanguagePopup() {
  const { changeLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [tempLang, setTempLang] = useState('mr'); // Default language is Marathi ('mr')

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const dismissed = window.localStorage.getItem('language-popup-dismissed');
    const siteLang = window.localStorage.getItem('site-language');

    // Show popup if never dismissed and site-language is not set
    if (!dismissed && !siteLang) {
      setIsOpen(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleSave = () => {
    changeLanguage(tempLang);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('language-popup-dismissed', 'true');
    }
    setIsOpen(false);
  };

  const currentTranslations = localTranslations[tempLang] || localTranslations.mr;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="lang-popup-title">
        <div className={styles.header}>
          <h2 id="lang-popup-title" className={styles.title}>
            {currentTranslations.title}
          </h2>
          <p className={styles.subtitle}>
            {currentTranslations.subtitle}
          </p>
        </div>

        <div className={styles.optionsList}>
          <button
            type="button"
            className={`${styles.optionCard} ${tempLang === 'mr' ? styles.optionCardSelected : ''}`}
            onClick={() => setTempLang('mr')}
            aria-pressed={tempLang === 'mr'}
          >
            <div className={styles.optionText}>
              <span className={styles.optionLabelNative}>मराठी</span>
              <span className={styles.optionLabelEnglish}>Marathi</span>
            </div>
            <div className={styles.radioIndicator}>
              <div className={styles.radioIndicatorInner} />
            </div>
          </button>

          <button
            type="button"
            className={`${styles.optionCard} ${tempLang === 'hi' ? styles.optionCardSelected : ''}`}
            onClick={() => setTempLang('hi')}
            aria-pressed={tempLang === 'hi'}
          >
            <div className={styles.optionText}>
              <span className={styles.optionLabelNative}>हिन्दी</span>
              <span className={styles.optionLabelEnglish}>Hindi</span>
            </div>
            <div className={styles.radioIndicator}>
              <div className={styles.radioIndicatorInner} />
            </div>
          </button>

          <button
            type="button"
            className={`${styles.optionCard} ${tempLang === 'en' ? styles.optionCardSelected : ''}`}
            onClick={() => setTempLang('en')}
            aria-pressed={tempLang === 'en'}
          >
            <div className={styles.optionText}>
              <span className={styles.optionLabelNative}>English</span>
              <span className={styles.optionLabelEnglish}>English</span>
            </div>
            <div className={styles.radioIndicator}>
              <div className={styles.radioIndicatorInner} />
            </div>
          </button>
        </div>

        <p className={styles.subtitle} style={{ fontSize: '0.85rem', textAlign: 'center', marginTop: '-4px' }}>
          {currentTranslations.help}
        </p>

        <button
          type="button"
          className={styles.saveButton}
          onClick={handleSave}
        >
          {currentTranslations.save}
        </button>
      </div>
    </div>
  );
}
