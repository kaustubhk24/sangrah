import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../utils/translations';
import styles from './counter.module.css';

const defaultMantras = [
  "राधा राधा",
  "श्री राम जय राम जय जय राम",
  "ॐ गं गणपतये नमः",
  "ॐ नमः शिवाय",
  "ॐ नमो भगवते वासुदेवाय",
  "श्री राम जय राम जय जय राम",
  "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे | हरे राम हरे राम राम राम हरे हरे",
  "ॐ नमो नारायणाय",
  "ॐ भूर्भुवः स्वः",
  "ॐ नीलांजन समाभासं रविपुत्रं यमाग्रजम्।छाया मार्तण्ड सम्भूतं तं नमामि शनैश्चरम्॥"
];

export default function CounterPage() {
  const { t, lang, translateNumbers } = useTranslation();
  const [activeMantra, setActiveMantra] = useState(defaultMantras[0]);
  const [currentCount, setCurrentCount] = useState(0);
  const [malaCount, setMalaCount] = useState(0);
  const [lifetimeCount, setLifetimeCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState([]);
  
  const dailyGoal = 1000;

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedMantra = window.localStorage.getItem('activeMantra') || defaultMantras[0];
    const storedCount = parseInt(window.localStorage.getItem('currentCount') || '0', 10);
    const storedMala = parseInt(window.localStorage.getItem('malaCount') || '0', 10);
    const storedLifetime = parseInt(window.localStorage.getItem('lifetimeCount') || '0', 10);
    const storedHistory = JSON.parse(window.localStorage.getItem('jaapHistory') || '[]');
    const storedStreak = parseInt(window.localStorage.getItem('currentStreak') || '0', 10);
    const lastDate = window.localStorage.getItem('lastJaapDate') || '';

    setActiveMantra(storedMantra);
    setCurrentCount(storedCount);
    setMalaCount(storedMala);
    setLifetimeCount(storedLifetime);
    setHistory(storedHistory);

    // Verify streak is not broken
    if (lastDate) {
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      
      if (lastDate !== today && lastDate !== yesterday) {
        // Streak is broken
        setStreak(0);
        window.localStorage.setItem('currentStreak', '0');
      } else {
        setStreak(storedStreak);
      }
    } else {
      setStreak(0);
    }
  }, []);

  // Save base counts to local storage
  useEffect(() => {
    window.localStorage.setItem('currentCount', currentCount.toString());
    window.localStorage.setItem('malaCount', malaCount.toString());
    window.localStorage.setItem('lifetimeCount', lifetimeCount.toString());
    window.localStorage.setItem('activeMantra', activeMantra);
  }, [currentCount, malaCount, lifetimeCount, activeMantra]);

  // Handle vibration
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([60]);
    }
  };

  // Perform streak updating logic
  const checkAndUpdateStreak = () => {
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = window.localStorage.getItem('lastJaapDate') || '';
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    if (lastDate === today) return; // Already updated today

    let newStreak = 1;
    if (lastDate === yesterday) {
      newStreak = streak + 1;
    }
    setStreak(newStreak);
    window.localStorage.setItem('currentStreak', newStreak.toString());
    window.localStorage.setItem('lastJaapDate', today);
  };

  // History updating helper
  const updateHistoryData = (mantraName, countToAdd, malasToAdd) => {
    const today = new Date().toISOString().slice(0, 10);
    const updatedHistory = [...history];

    const existingIdx = updatedHistory.findIndex(
      (item) => item.date === today && item.mantra === mantraName
    );

    if (existingIdx !== -1) {
      updatedHistory[existingIdx].count += countToAdd;
      updatedHistory[existingIdx].malas += malasToAdd;
    } else {
      updatedHistory.unshift({
        date: today,
        mantra: mantraName,
        count: countToAdd,
        malas: malasToAdd
      });
    }

    setHistory(updatedHistory);
    window.localStorage.setItem('jaapHistory', JSON.stringify(updatedHistory));
  };

  const handleIncrement = () => {
    triggerHaptic();
    checkAndUpdateStreak();

    const nextCount = currentCount + 1;
    setLifetimeCount((prev) => prev + 1);

    if (nextCount >= 108) {
      // Mala loop complete!
      setCurrentCount(0);
      setMalaCount((prev) => prev + 1);
      updateHistoryData(activeMantra, 1, 1);
      // Extra long vibration on mala complete
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([150, 50, 150]);
      }
    } else {
      setCurrentCount(nextCount);
      updateHistoryData(activeMantra, 1, 0);
    }
  };

  const handleDecrement = () => {
    if (currentCount > 0) {
      triggerHaptic();
      setCurrentCount((prev) => prev - 1);
      setLifetimeCount((prev) => Math.max(0, prev - 1));
      updateHistoryData(activeMantra, -1, 0);
    }
  };

  const handleReset = () => {
    if (window.confirm(lang === 'en' ? 'Are you sure you want to reset current counter?' : 'तुम्हाला वर्तमान मोजणी रीसेट करायची आहे का?')) {
      setCurrentCount(0);
    }
  };

  const getTranslatedMantra = (mantra) => {
    if (lang !== 'en') return mantra;
    const mappings = {
      "ॐ गं गणपतये नमः": "Om Gam Ganapataye Namah",
      "ॐ नमः शिवाय": "Om Namah Shivaya",
      "ॐ नमो भगवते वासुदेवाय": "Om Namo Bhagavate Vasudevaya",
      "श्री राम जय राम जय जय राम": "Shri Ram Jay Ram Jay Jay Ram",
      "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे | हरे राम हरे राम राम राम हरे हरे": "Hare Krishna Hare Krishna Krishna Krishna Hare Hare | Hare Ram Hare Ram Ram Ram Hare Hare",
      "ॐ नमो नारायणाय": "Om Namo Narayanaya",
      "ॐ भूर्भुवः स्वः": "Gayatri Mantra (Om Bhur Bhuvah Svah)"
    };
    return mappings[mantra] || mantra;
  };

  const getMotivationalQuote = (streakCount) => {
    const quotes = {
      mr: [
        "श्री कृष्ण सांगतात: तुमचे मन पवित्र ठेवा, भगवंत सदैव तुमच्या सोबत आहेत.",
        "हरिपाठ आणि विठ्ठल नामस्मरणाने मन शांत व तृप्त होते.",
        "नामस्मरणात मोठी ताकद आहे, सातत्याने जप करत राहा.",
        "ज्या घरात नामस्मरण होते, तिथे सुख-शांती नांदते."
      ],
      en: [
        "Lord Krishna says: Keep your mind pure, God is always with you.",
        "Chanting relaxes the mind and fills life with positive vibrations.",
        "Consistency in prayer leads to inner peace and strength.",
        "A home that echoes with holy names is filled with peace and joy."
      ],
      hi: [
        "श्री कृष्ण कहते हैं: अपने मन को पवित्र रखें, भगवान सदैव आपके साथ हैं।",
        "नामस्मरण में अपार शक्ति है, निरंतर जप करते रहें।",
        "प्रार्थना में निरंतरता आंतरिक शांति और शक्ति की ओर ले जाती है।",
        "जिस घर में नियमित रूप से नामस्मरण होता है, वहां सुख-शांति बनी रहती है।"
      ]
    };
    const list = quotes[lang] || quotes['mr'];
    return list[streakCount % list.length];
  };

  // Cumulative statistics calculations
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    
    // Parse timestamp differences
    const todayLogs = history.filter(item => item.date === todayStr);
    const todayJaap = todayLogs.reduce((acc, x) => acc + x.count, 0);
    const todayMalas = todayLogs.reduce((acc, x) => acc + x.malas, 0);

    const lifetimeTotal = history.reduce((acc, x) => acc + x.count, 0);
    
    return {
      todayJaap,
      todayMalas,
      lifetimeTotal
    };
  }, [history]);

  // SVG Radial Circle metrics
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentCount / 108) * circumference;

  return (
    <div className={styles.counterWrapper}>
      {/* Mantra selector card */}
      <div className={styles.card}>
        <p className={styles.settingLabel}>{t('mantraSelectLabel')}</p>
        <select 
          value={activeMantra} 
          onChange={(e) => setActiveMantra(e.target.value)} 
          className={styles.mantraSelect}
        >
          {defaultMantras.map((m) => (
            <option key={m} value={m}>
              {getTranslatedMantra(m)}
            </option>
          ))}
        </select>
        <div className={styles.activeMantraDisplay}>
          {getTranslatedMantra(activeMantra)}
        </div>
      </div>

      {/* Main Counter Section */}
      <div className={styles.card}>
        <div className={styles.counterLayout}>
          {/* Circular progress ring */}
          <div className={styles.ringContainer}>
            <svg className={styles.circularSvg}>
              <circle 
                className={styles.svgBgCircle}
                cx="120"
                cy="120"
                r={radius}
              />
              <circle 
                className={styles.svgProgressCircle}
                cx="120"
                cy="120"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className={styles.ringTextContainer}>
              <span className={styles.currentCount}>{translateNumbers(currentCount)}</span>
              <span className={styles.targetCount}>{translateNumbers(currentCount)} / {translateNumbers(108)}</span>
            </div>
          </div>
        </div>

        {/* Mala Bead Illustration */}
        <div className={styles.malaIllustration}>
          <div className={styles.bead}></div>
          <div className={styles.bead}></div>
          <div className={styles.bead}></div>
          <div className={styles.tassel}></div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className={styles.controlsRow}>
            <button className={styles.supportBtn} onClick={handleDecrement} aria-label="Decrement -1">
              {translateNumbers("-1")}
            </button>
            <button className={styles.mainIncrementBtn} onClick={handleIncrement} aria-label="Increment +1">
              {translateNumbers("+1")}
            </button>
            <button className={styles.supportBtn} onClick={handleReset} aria-label="Reset">
              ⟲
            </button>
          </div>
        </div>
      </div>

      {/* Today Dashboard */}
      <div className={styles.card}>
        <h2 className={styles.title}>{t('statistics')}</h2>
        <div className={styles.dashboardGrid}>
          <div className={styles.dashboardItem}>
            <div className={styles.dashValue}>{translateNumbers(stats.todayJaap)}</div>
            <div className={styles.dashLabel}>{t('todayJaap')}</div>
          </div>
          <div className={styles.dashboardItem}>
            <div className={styles.dashValue}>{translateNumbers(stats.todayMalas)}</div>
            <div className={styles.dashLabel}>{t('todayMalas')}</div>
          </div>
          <div className={styles.dashboardItem}>
            <div className={styles.dashValue}>{translateNumbers(dailyGoal)}</div>
            <div className={styles.dashLabel}>{t('dailyGoal')}</div>
          </div>
          <div className={styles.dashboardItem}>
            <div className={styles.dashValue}>{translateNumbers(lifetimeCount)}</div>
            <div className={styles.dashLabel}>{t('statsLifetime')}</div>
          </div>
        </div>
      </div>

      {/* Streak Dashboard */}
      {streak > 0 && (
        <div className={styles.streakCard}>
          <div className={styles.streakCount}>🔥 {translateNumbers(streak)} {t('streakLabel')}</div>
          <p className={styles.streakQuote}>{getMotivationalQuote(streak)}</p>
        </div>
      )}

      {/* Session History logs */}
      {history.length > 0 && (
        <div className={styles.card}>
          <h2 className={styles.title}>{t('sessionHistory')}</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.historyTable}>
              <thead>
                <tr>
                  <th>{t('historyDate')}</th>
                  <th>{t('historyMantra')}</th>
                  <th>{t('historyJaap')}</th>
                  <th>{t('historyMala')}</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 10).map((item, idx) => (
                  <tr key={idx}>
                    <td>{translateNumbers(item.date)}</td>
                    <td>{getTranslatedMantra(item.mantra)}</td>
                    <td>{translateNumbers(item.count)}</td>
                    <td>{translateNumbers(item.malas)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}