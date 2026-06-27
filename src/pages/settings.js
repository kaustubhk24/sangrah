import React, { useEffect, useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useTranslation } from '../utils/translations';
import searchIndex from '../data/searchIndex.json';
import styles from './settings.module.css';

const fontOptions = ['small', 'medium', 'large', 'xlarge'];

export default function Settings() {
  const { lang, changeLanguage, t, translateNumbers } = useTranslation();
  const [fontSize, setFontSize] = useState('medium');
  const [elderMode, setElderMode] = useState(false);
  const [theme, setTheme] = useState('light');
  const [scrollSpeed, setScrollSpeed] = useState('medium');
  const [dailyPath, setDailyPath] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedFont = window.localStorage.getItem('site-font-size') || 'medium';
    const storedElder = window.localStorage.getItem('elder-mode') === 'true';
    const storedTheme = window.localStorage.getItem('site-theme') || 'light';
    let storedSpeed = window.localStorage.getItem('autoScrollSpeed') || 'medium';
    if (storedSpeed !== 'slow' && storedSpeed !== 'medium' && storedSpeed !== 'fast') {
      const num = parseInt(storedSpeed, 10);
      if (!isNaN(num)) {
        if (num <= 1) storedSpeed = 'slow';
        else if (num >= 4) storedSpeed = 'fast';
        else storedSpeed = 'medium';
      } else {
        storedSpeed = 'medium';
      }
    }
    const storedDaily = JSON.parse(window.localStorage.getItem('dailyPath') || '[]');

    setFontSize(storedFont);
    setElderMode(storedElder);
    setTheme(storedTheme);
    setScrollSpeed(storedSpeed);
    setDailyPath(Array.isArray(storedDaily) ? storedDaily : []);
    
    document.documentElement.setAttribute('data-font-size', storedFont);
    document.documentElement.classList.toggle('elder-mode', storedElder);
    document.documentElement.setAttribute('data-theme', storedTheme);
  }, []);

  const handleFontChange = (key) => {
    setFontSize(key);
    window.localStorage.setItem('site-font-size', key);
    document.documentElement.setAttribute('data-font-size', key);
  };

  const decreaseFont = () => {
    const currentIndex = fontOptions.indexOf(fontSize);
    if (currentIndex > 0) {
      handleFontChange(fontOptions[currentIndex - 1]);
    }
  };

  const increaseFont = () => {
    const currentIndex = fontOptions.indexOf(fontSize);
    if (currentIndex < fontOptions.length - 1) {
      handleFontChange(fontOptions[currentIndex + 1]);
    }
  };

  const handleElderMode = () => {
    const next = !elderMode;
    setElderMode(next);
    window.localStorage.setItem('elder-mode', next.toString());
    document.documentElement.classList.toggle('elder-mode', next);
  };

  const handleThemeChange = (key) => {
    setTheme(key);
    window.localStorage.setItem('site-theme', key);
    document.documentElement.setAttribute('data-theme', key);
  };

  const handleScrollSpeedChange = (key) => {
    setScrollSpeed(key);
    window.localStorage.setItem('autoScrollSpeed', key);
  };

  const addToDailyPath = (item) => {
    if (dailyPath.some((x) => x.to === item.slug)) return;
    const updated = [...dailyPath, { title: item.title, to: item.slug }];
    setDailyPath(updated);
    window.localStorage.setItem('dailyPath', JSON.stringify(updated));
  };

  const removeFromDailyPath = (to) => {
    const updated = dailyPath.filter((x) => x.to !== to);
    setDailyPath(updated);
    window.localStorage.setItem('dailyPath', JSON.stringify(updated));
  };

  const reorderDailyPath = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= dailyPath.length) return;
    const updated = [...dailyPath];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setDailyPath(updated);
    window.localStorage.setItem('dailyPath', JSON.stringify(updated));
  };

  const handleExportData = () => {
    const data = {};
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      data[key] = window.localStorage.getItem(key);
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sangrah-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    const msg = lang === 'en' 
      ? 'Are you sure you want to reset all data?' 
      : (lang === 'hi' ? 'क्या आप सारा डेटा रीसेट करना चाहते हैं?' : 'तुम्हाला सर्व डेटा रीसेट करायचा आहे का?');
    if (window.confirm(msg)) {
      window.localStorage.clear();
      window.location.reload();
    }
  };

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      const defaults = [
        "/ganpati",
        "/ram-raksha",
        "/hanuman",
        "/datt",
        "/shri-sukta"
      ];
      return searchIndex.filter((item) => defaults.includes(item.slug));
    }

    const tokens = query.split(/\s+/).filter((t) => t.length > 0);
    if (tokens.length === 0) return [];

    return searchIndex.filter((item) => {
      const titleLower = (item.title || '').toLowerCase();
      const slugLower = (item.slug || '').toLowerCase();
      const filenameLower = (item.filename || '').toLowerCase();
      const keywordsLower = (item.keywords || '').toLowerCase();
      const fmKeywordsLower = (item.fmKeywords || '').toLowerCase();

      return tokens.every((token) => {
        return (
          titleLower.includes(token) ||
          slugLower.includes(token) ||
          filenameLower.includes(token) ||
          keywordsLower.includes(token) ||
          fmKeywordsLower.includes(token)
        );
      });
    }).slice(0, 10);
  }, [searchQuery]);

  const getFontSizeLabel = (key) => {
    const labels = {
      small: '20px',
      medium: '22px',
      large: '26px',
      xlarge: '30px'
    };
    return labels[key] || key;
  };

  return (
    <Layout title={t('settingsHeader')} description="Settings Page">
      <main className={styles.pageWrapper}>
        <div className={styles.sectionCard}>
          <h1>{t('settingsHeader')}</h1>

          {/* Language Preference */}
          <div className={styles.settingGroup}>
            <p className={styles.settingLabel}>{t('langLabel')}</p>
            <select
              className={styles.settingSelect}
              value={lang}
              onChange={(e) => changeLanguage(e.target.value)}
              aria-label="Language selection"
            >
              <option value="mr">देवनागरी (Marathi)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Theme preference */}
          <div className={styles.settingGroup}>
            <p className={styles.settingLabel}>{t('themeLabel')}</p>
            <div className={styles.optionList}>
              <button
                className={`${styles.optionButton} ${theme === 'light' ? styles.optionSelected : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                {t('themeLight')}
              </button>
              <button
                className={`${styles.optionButton} ${theme === 'dark' ? styles.optionSelected : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                {t('themeDark')}
              </button>
            </div>
          </div>

          {/* Elder Mode preference */}
          <div className={styles.settingGroup}>
            <p className={styles.settingLabel}>{t('elderModeLabel')}</p>
            <label className={styles.toggleSwitch}>
              <input type="checkbox" checked={elderMode} onChange={handleElderMode} />
              <span className={styles.slider} />
            </label>
            <p className={styles.settingHelp}>{t('elderModeHelp')}</p>
          </div>

          {/* Font Size preference */}
          <div className={styles.settingGroup}>
            <p className={styles.settingLabel}>{t('fontSizeLabel')}</p>
            <div className={styles.fontSizeControlsContainer}>
              <button
                className={styles.fontStepperBtn}
                onClick={decreaseFont}
                disabled={fontSize === 'small'}
                aria-label="Decrease font size"
              >
                −
              </button>
              <span className={styles.fontSizeDisplayValue}>
                {translateNumbers(getFontSizeLabel(fontSize))}
              </span>
              <button
                className={styles.fontStepperBtn}
                onClick={increaseFont}
                disabled={fontSize === 'xlarge'}
                aria-label="Increase font size"
              >
                +
              </button>
            </div>
          </div>

          {/* Auto Scroll Speed preference */}
          <div className={styles.settingGroup}>
            <p className={styles.settingLabel}>{t('scrollSpeedLabel')}</p>
            <div className={styles.optionList}>
              <button
                className={`${styles.optionButton} ${scrollSpeed === 'slow' ? styles.optionSelected : ''}`}
                onClick={() => handleScrollSpeedChange('slow')}
              >
                {t('scrollSlow')}
              </button>
              <button
                className={`${styles.optionButton} ${scrollSpeed === 'medium' ? styles.optionSelected : ''}`}
                onClick={() => handleScrollSpeedChange('medium')}
              >
                {t('scrollMedium')}
              </button>
              <button
                className={`${styles.optionButton} ${scrollSpeed === 'fast' ? styles.optionSelected : ''}`}
                onClick={() => handleScrollSpeedChange('fast')}
              >
                {t('scrollFast')}
              </button>
            </div>
          </div>

          {/* Daily Path Playlist Management */}
          <div className={styles.settingGroup}>
            <p className={styles.settingLabel}>{t('nityapathHeader')}</p>
            
            {dailyPath.length === 0 ? (
              <p className={styles.settingHelp}>{t('nityapathEmpty')}</p>
            ) : (
              <div className={styles.selectedList}>
                {dailyPath.map((item, index) => (
                  <div key={item.to} className={styles.selectedItem}>
                    <span>{index + 1}. {item.title}</span>
                    <div className={styles.reorderControls}>
                      <button 
                        className={styles.reorderBtn} 
                        onClick={() => reorderDailyPath(index, -1)}
                        disabled={index === 0}
                      >
                        ▲
                      </button>
                      <button 
                        className={styles.reorderBtn} 
                        onClick={() => reorderDailyPath(index, 1)}
                        disabled={index === dailyPath.length - 1}
                      >
                        ▼
                      </button>
                      <button 
                        className={styles.removeButton}
                        onClick={() => removeFromDailyPath(item.to)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.addSection}>
              <p className={styles.settingLabelSub}>{t('nityapathAddHeader')}</p>
              <input 
                type="text"
                className={styles.searchBar}
                placeholder={t('nityapathSearchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className={styles.suggestedList}>
                {filteredItems.slice(0, 5).map((item) => {
                  const isAdded = dailyPath.some((x) => x.to === item.slug);
                  return (
                    <div key={item.slug} className={styles.suggestedItem}>
                      <span>{item.title}</span>
                      {isAdded ? (
                        <span className={styles.addedBadge}>{t('addedBadge')}</span>
                      ) : (
                        <button 
                          className={styles.addButton}
                          onClick={() => addToDailyPath(item)}
                        >
                          {t('addBtn')}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Offline Status */}
          <div className={styles.settingGroup}>
            <p className={styles.settingLabel}>{t('offlineLabel')}</p>
            <p className={styles.settingHelp}>✅ {t('offlineHelp')}</p>
          </div>

          {/* Export / Reset Controls */}
          <div className={styles.settingGroup}>
            <div className={styles.actionButtons}>
              <button className={styles.exportButton} onClick={handleExportData}>
                📥 {t('exportLabel')}
              </button>
              <button className={styles.resetButton} onClick={handleResetData}>
                🗑️ {t('resetLabel')}
              </button>
            </div>
          </div>

          <Link to="/" className={styles.backButton}>
            ← {t('backBtn')}
          </Link>
        </div>
      </main>
    </Layout>
  );
}
