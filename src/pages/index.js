import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import PwaInstallButton from '../components/PwaInstallButton';
import DeityIcon from '../components/DeityIcon';
import { getPanchangam, Observer, tithiNames, nakshatraNames, dayNames } from '@ishubhamx/panchangam-js';
import { useTranslation } from '../utils/translations';
import searchIndex from '../data/searchIndex.json';
import styles from './index.module.css';

const panchangValueMappings = {
  month: {
    mr: {
      Chaitra: 'चैत्र',
      Vaishakha: 'वैशाख',
      Jyeshtha: 'ज्येष्ठ',
      Jyestha: 'ज्येष्ठ',
      Jestha: 'ज्येष्ठ',
      Jeshtha: 'ज्येष्ठ',
      Ashadha: 'आषाढ',
      Aashadha: 'आषाढ',
      Ashad: 'आषाढ',
      Aashad: 'आषाढ',
      Shravana: 'श्रावण',
      Bhadrapada: 'भाद्रपद',
      Ashwin: 'आश्विन',
      Kartika: 'कार्तिक',
      Margashirsha: 'मार्गशीर्ष',
      Pausha: 'पौष',
      Magha: 'माघ',
      Phalguna: 'फाल्गुन',
    },
    hi: {
      Chaitra: 'चैत्र',
      Vaishakha: 'वैशाख',
      Jyeshtha: 'ज्येष्ठ',
      Jyestha: 'ज्येष्ठ',
      Jestha: 'ज्येष्ठ',
      Jeshtha: 'ज्येष्ठ',
      Ashadha: 'आषाढ',
      Aashadha: 'आषाढ',
      Ashad: 'आषाढ',
      Aashad: 'आषाढ',
      Shravana: 'श्रावण',
      Bhadrapada: 'भाद्रपद',
      Ashwin: 'आश्विन',
      Kartika: 'कार्तिक',
      Margashirsha: 'मार्गशीर्ष',
      Pausha: 'पौष',
      Magha: 'माघ',
      Phalguna: 'फाल्गुन',
    },
    en: {},
  },
  day: {
    mr: {
      Sunday: 'रविवार',
      Monday: 'सोमवार',
      Tuesday: 'मंगळवार',
      Wednesday: 'बुधवार',
      Thursday: 'गुरुवार',
      Friday: 'शुक्रवार',
      Saturday: 'शनिवार',
    },
    hi: {
      Sunday: 'रविवार',
      Monday: 'सोमवार',
      Tuesday: 'मंगलवार',
      Wednesday: 'बुधवार',
      Thursday: 'गुरुवार',
      Friday: 'शुक्रवार',
      Saturday: 'शनिवार',
    },
    en: {
      Sunday: 'Sunday',
      Monday: 'Monday',
      Tuesday: 'Tuesday',
      Wednesday: 'Wednesday',
      Thursday: 'Thursday',
      Friday: 'Friday',
      Saturday: 'Saturday',
    },
  },
  tithi: {
    mr: {
      Prathama: 'प्रतिपदा',
      Dwitiya: 'द्वितीया',
      Tritiya: 'तृतीया',
      Chaturthi: 'चतुर्थी',
      Panchami: 'पंचमी',
      Shashthi: 'षष्ठी',
      Saptami: 'सप्तमी',
      Ashtami: 'अष्टमी',
      Navami: 'नवमी',
      Dashami: 'दशमी',
      Ekadashi: 'एकादशी',
      Dwadashi: 'द्वादशी',
      Trayodashi: 'त्रयोदशी',
      Chaturdashi: 'चतुर्दशी',
      Purnima: 'पौर्णिमा',
      Amavasya: 'अमावस्या',
    },
    hi: {
      Prathama: 'प्रतिपदा',
      Dwitiya: 'द्वितीया',
      Tritiya: 'तृतीया',
      Chaturthi: 'चतुर्थी',
      Panchami: 'पंचमी',
      Shashthi: 'षष्ठी',
      Saptami: 'सप्तमी',
      Ashtami: 'अष्टमी',
      Navami: 'नवमी',
      Dashami: 'दशमी',
      Ekadashi: 'एकादशी',
      Dwadashi: 'द्वादशी',
      Trayodashi: 'त्रयोदशी',
      Chaturdashi: 'चतुर्दशी',
      Purnima: 'पूर्णिमा',
      Amavasya: 'अमावस्या',
    },
    en: {},
  },
  nakshatra: {
    mr: {
      Ashwini: 'अश्विनी',
      Bharani: 'भरणी',
      Krittika: 'कृत्तिका',
      Rohini: 'रोहिणी',
      Mrigashira: 'मृग',
      Ardra: 'आर्द्रा',
      Punarvasu: 'पुनर्वसु',
      Pushya: 'पुष्य',
      Ashlesha: 'आश्लेषा',
      Magha: 'मघा',
      PurvaPhalguni: 'पूर्व फाल्गुनी',
      UttaraPhalguni: 'उत्तर फाल्गुनी',
      Hasta: 'हस्त',
      Chitra: 'चित्रा',
      Swati: 'स्वाती',
      Vishakha: 'विषाखा',
      Anuradha: 'अनुराधा',
      Jyeshtha: 'ज्येष्ठा',
      Mula: 'मूळ',
      PurvaAshadha: 'पूर्वाषाढा',
      UttaraAshadha: 'उत्तराषाढा',
      Shravana: 'श्रवण',
      Dhanishta: 'धनिष्ठा',
      Shatabhisha: 'शततारका ',
      PurvaBhadrapada: 'पूर्वा भाद्रपदा',
      UttaraBhadrapada: 'उत्तरा भाद्रपदा',
      Revati: 'रेवती',
    },
    hi: {
      Ashwini: 'अश्विनी',
      Bharani: 'भरणी',
      Krittika: 'कृत्तिका',
      Rohini: 'रोहिणी',
      Mrigashira: 'मृगशिरा',
      Ardra: 'आर्द्रा',
      Punarvasu: 'पुनर्वसु',
      Pushya: 'पुष्य',
      Ashlesha: 'आश्लेषा',
      Magha: 'माघ',
      PurvaPhalguni: 'पूर्व फाल्गुनी',
      UttaraPhalguni: 'उत्तर फाल्गुनी',
      Hasta: 'हस्त',
      Chitra: 'चित्रा',
      Swati: 'स्वाति',
      Vishakha: 'विशाखा',
      Anuradha: 'अनुराधा',
      Jyeshtha: 'ज्येष्ठा',
      Mula: 'मूल',
      PurvaAshadha: 'पूर्वाषाढा',
      UttaraAshadha: 'उत्तराषाढा',
      Shravana: 'श्रवण',
      Dhanishta: 'धनिष्ठा',
      Shatabhisha: 'शतभिषा',
      PurvaBhadrapada: 'पूर्वभाद्रपदा',
      UttaraBhadrapada: 'उत्तरभाद्रपदा',
      Revati: 'रेवती',
    },
    en: {},
  },
  paksha: {
    mr: { Shukla: 'शुक्ल', Krishna: 'कृष्ण' },
    hi: { Shukla: 'शुक्ल', Krishna: 'कृष्ण' },
    en: { Shukla: 'Shukla', Krishna: 'Krishna' },
  },
};

const getTranslatedValue = (lang, value, map, fallback = '') => {
  if (value === undefined || value === null || value === '') return fallback;

  const langMap = map?.[lang] || {};
  const enMap = map?.en || {};
  const variants = [];

  if (typeof value === 'string') {
    const trimmed = value.trim();
    variants.push(trimmed);
    variants.push(trimmed.toLowerCase());
    variants.push(trimmed.replace(/\s+/g, ''));
    variants.push(trimmed.replace(/\s+/g, '').toLowerCase());
  } else {
    variants.push(String(value));
  }

  for (const variant of variants) {
    if (langMap[variant] !== undefined) return langMap[variant];
    if (enMap[variant] !== undefined) return enMap[variant];
  }

  const normalized = (entry) => String(entry).toLowerCase().replace(/\s+/g, '');
  const matches = Object.entries(langMap).find(([key]) => normalized(key) === normalized(value));
  if (matches) return matches[1];

  const englishMatch = Object.entries(enMap).find(([key]) => normalized(key) === normalized(value));
  if (englishMatch) return englishMatch[1];

  return typeof value === 'number' ? value : value;
};

export default function HomePage() {
  const { lang, t, translateNumbers } = useTranslation();
  const [recentReads, setRecentReads] = useState([]);
  const [dailyPath, setDailyPath] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [panchangWidget, setPanchangWidget] = useState(null);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  const categoryCounts = React.useMemo(() => {
    const counts = {};
    searchIndex.forEach((doc) => {
      if (doc.category) {
        const parts = doc.category.split('/');
        let current = '';
        parts.forEach((part, index) => {
          current = index === 0 ? part : `${current}/${part}`;
          counts[current] = (counts[current] || 0) + 1;
        });
      }
    });
    return counts;
  }, []);

  const categories = React.useMemo(() => {
    const folders = [
      { key: 'aarati', mrLabel: 'आरती संग्रह', hiLabel: 'आरती संग्रह', enLabel: 'Aarati', slug: 'आरती-संग्रह', icon: '🪔' },
      { key: 'stotras-shlok', mrLabel: 'स्तोत्र / श्लोक संग्रह', hiLabel: 'स्तोत्र / श्लोक संग्रह', enLabel: 'Stotra / Shlok', slug: 'स्तोत्र--श्लोक-संग्रह', icon: '📿' },
      { key: 'katha', mrLabel: 'कथा संग्रह', hiLabel: 'कथा संग्रह', enLabel: 'Katha', slug: 'कथा-संग्रह', icon: '📖' },
      { key: 'pothi', mrLabel: 'पोथी', hiLabel: 'पोथी', enLabel: 'Pothi', slug: 'पोथी', icon: '🙏' },
      { key: 'Sukt', mrLabel: 'सूक्त संग्रह', hiLabel: 'सूक्त संग्रह', enLabel: 'Sukta', slug: 'सूक्त-संग्रह', icon: '📜' },
      { key: 'chalisa', mrLabel: 'चालीसा संग्रह', hiLabel: 'चालीसा संग्रह', enLabel: 'Chalisa', slug: 'चालीसा-संग्रह', icon: '📚' },
      { key: 'Ashtak', mrLabel: 'अष्टक संग्रह', hiLabel: 'अष्टक संग्रह', enLabel: 'Ashtak', slug: 'अष्टक-संग्रह', icon: '🕉️' },
      { key: 'abhang', mrLabel: 'अभंग संग्रह', hiLabel: 'अभंग संग्रह', enLabel: 'Abhang', slug: 'अभंग-संग्रह', icon: '🎼' },
      { key: 'managalastak', mrLabel: 'मंगलाष्टका', hiLabel: 'मंगलाष्टका', enLabel: 'Mangalashtaka', slug: 'मंगलाष्टका', icon: '🌸' },
      { key: 'namavali', mrLabel: 'नामावली', hiLabel: 'नामावली', enLabel: 'Namavali', slug: 'नामावली', icon: '📝' },
      { key: 'palana', mrLabel: 'पाळणा संग्रह', hiLabel: 'पाळणा संग्रह', enLabel: 'Palana', slug: 'पाळणा-संग्रह', icon: '👶' },
      { key: 'pooja', mrLabel: 'पूजा-व्रत', hiLabel: 'पूजा-व्रत', enLabel: 'Pooja-Vrat', slug: 'पूजा-व्रत', icon: '🏺' },
      { key: 'audio bhajan', mrLabel: 'ऑडिओ भजन', hiLabel: 'ऑडियो भजन', enLabel: 'Audio Bhajan', slug: 'ऑडियो-भजन', icon: '🎵' },
      { key: 'pravachane', mrLabel: 'प्रवचने', hiLabel: 'प्रवचने', enLabel: 'Pravachane', slug: 'प्रवचने', icon: '🧘' },
      { key: 'muhurt', mrLabel: 'मुहूर्त', hiLabel: 'मुहूर्त', enLabel: 'Muhurt', slug: null, icon: '⏳', specialTo: '/muhurt' },
    ];
    
    return folders.map(f => {
      const count = categoryCounts[f.key] || 0;
      const label = lang === 'hi' ? f.hiLabel : lang === 'en' ? f.enLabel : f.mrLabel;
      return {
        label,
        count,
        to: f.specialTo || `/category/${f.slug}`,
        icon: f.icon
      };
    }).filter(f => f.specialTo || f.count > 0);
  }, [categoryCounts, lang]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedHistory = JSON.parse(window.localStorage.getItem('pageHistory') || '[]');
    const cleanedHistory = Array.isArray(storedHistory)
      ? storedHistory.filter((item) => item && typeof item.path === 'string')
      : [];
    setRecentReads(cleanedHistory.slice(0, 3));

    const storedDaily = JSON.parse(window.localStorage.getItem('dailyPath') || '[]');
    setDailyPath(Array.isArray(storedDaily) ? storedDaily : []);

    const storedBookmarks = JSON.parse(window.localStorage.getItem('bookmarks') || '[]');
    setFavorites(Array.isArray(storedBookmarks) ? storedBookmarks : []);

    const observer = new Observer(18.5204, 73.8567, 10);
    const data = getPanchangam(new Date(), observer, { timezoneOffset: 330, calendarType: 'amanta' });
    setPanchangWidget(data);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const handleRecentClick = (item) => {
    if (typeof window !== 'undefined' && item.scrollPosition) {
      window.localStorage.setItem('resumeScroll', item.scrollPosition.toString());
    }
  };

  const formatWidgetDate = () => {
    if (!panchangWidget) return '—';
    const locale = lang === 'en' ? 'en-IN' : lang === 'hi' ? 'hi-IN' : 'mr-IN';
    return translateNumbers(new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date()));
  };

  const dayDisplay = panchangWidget ? getTranslatedValue(lang, dayNames?.[panchangWidget.vara] || panchangWidget.vara, panchangValueMappings.day, '—') : '—';
  const monthDisplay = panchangWidget ? getTranslatedValue(lang, panchangWidget.masa?.name || '', panchangValueMappings.month, '—') : '—';
  const pakshaDisplay = panchangWidget ? getTranslatedValue(lang, panchangWidget.paksha, panchangValueMappings.paksha, '—') : '—';
  const currentTithi = panchangWidget?.tithis?.find((entry) => {
    const time = currentTime.getTime();
    return entry.startTime.getTime() <= time && time < entry.endTime.getTime();
  });
  const tithiDisplay = panchangWidget
    ? getTranslatedValue(lang, tithiNames?.[currentTithi?.index] || currentTithi?.name || panchangWidget.tithi, panchangValueMappings.tithi, '—')
    : '—';
  const nakshatraDisplay = panchangWidget ? getTranslatedValue(lang, nakshatraNames?.[panchangWidget.nakshatra] || panchangWidget.nakshatra, panchangValueMappings.nakshatra, '—') : '—';

  return (
    <Layout title={t('appTitle')} description={t('appSubtitle')}>
      <main className={styles.pageWrapper}>
        <PwaInstallButton />

        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2>{t('panchangWidgetTitle')}</h2>
            <div className={styles.sectionLinks}>
              <Link to="/panchang" className={styles.sectionLink}>{t('moreLink')}</Link>
              <Link to="/muhurt" className={styles.sectionLink}>{t('muhurtLabel')}</Link>
            </div>
          </div>
          <Link to="/panchang" className={styles.panchangWidgetCard}>
            <div className={styles.panchangWidgetTop}>
              <div>
                <div className={styles.panchangWidgetDate}>{formatWidgetDate()}</div>
                <div className={styles.panchangWidgetDay}>{dayDisplay}</div>
              </div>
              <span className={styles.panchangWidgetBadge}>{t('panchangWidgetBadge')}</span>
            </div>
            <div className={styles.panchangWidgetMeta}>
              <div className={styles.panchangWidgetItem}>
                <span>{t('masa')}</span>
                <strong>{monthDisplay}</strong>
              </div>
              <div className={styles.panchangWidgetItem}>
                <span>{t('pakshaLabel')}</span>
                <strong>{pakshaDisplay}</strong>
              </div>
              <div className={styles.panchangWidgetItem}>
                <span>{t('tithiLabel')}</span>
                <strong>{tithiDisplay}</strong>
              </div>
              <div className={styles.panchangWidgetItem}>
                <span>{t('nakshatraLabel')}</span>
                <strong>{nakshatraDisplay}</strong>
              </div>
            </div>
          </Link>
        </section>

        {/* My Daily Path */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2>{t('dailyPath')}</h2>
            <Link to="/settings#nityapath" className={styles.sectionLink}>{t('edit')}</Link>
          </div>
          <div className={styles.dailyPathCard}>
            {dailyPath.length > 0 ? (
              <>
                <div className={styles.dailyPathList}>
                  {dailyPath.map((item, index) => (
                    <Link 
                      key={index} 
                      className={styles.dailyPathItem} 
                      to={`${item.to}?dailyPath=true&index=${index}`}
                    >
                      <span className={styles.dailyPathIndex}>{translateNumbers(index + 1)}</span>
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
                <Link 
                  to={`${dailyPath[0].to}?dailyPath=true&index=0`} 
                  className={styles.primaryButton}
                >
                  🚩 {t('dailyPathStart')}
                </Link>
              </>
            ) : (
              <div className={styles.infoCard}>
                <p>{t('nityapathEmpty')}</p>
              </div>
            )}
          </div>
        </section>


        {/* Browse By Category */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2>{t('categorySection')}</h2>
          </div>
          <div className={styles.categoryGrid}>
            {categories.map((item) => (
              <Link key={item.label} className={styles.categoryCard} to={item.to}>
                <span className={styles.categoryIcon}>{item.icon}</span>
                <span className={styles.categoryName}>{item.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
