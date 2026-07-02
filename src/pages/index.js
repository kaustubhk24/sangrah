import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import PwaInstallButton from '../components/PwaInstallButton';
import DeityIcon from '../components/DeityIcon';
import { getPanchangam, Observer, tithiNames, nakshatraNames, dayNames } from '@ishubhamx/panchangam-js';
import { useTranslation } from '../utils/translations';
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

const categoryItems = [
  { name: 'आरत्या', to: '/category/आरती-संग्रह', icon: '🪔' },
  { name: 'स्तोत्रे', to: '/category/स्तोत्र--श्लोक-संग्रह', icon: '📿' },
  { name: 'पूजा व्रत', to: '/category/पूजा-व्रत', icon: '🏺' },
  { name: 'पोथी', to: '/category/पोथी', icon: '🙏' },
  { name: 'सूक्त', to: '/category/सूक्त-संग्रह', icon: '📜' },
  { name: 'चालीसा', to: '/category/चालीसा-संग्रह', icon: '📚' },
];

export default function HomePage() {
  const { lang, t, translateNumbers } = useTranslation();
  const [recentReads, setRecentReads] = useState([]);
  const [dailyPath, setDailyPath] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [panchangWidget, setPanchangWidget] = useState(null);

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

  const getTranslatedTitle = (title) => {
    const mapping = {
      'आरत्या': { en: 'Aarati', hi: 'आरती' },
      'स्तोत्रे': { en: 'Stotras', hi: 'स्तोत्र' },
      'पूजा-व्रत': { en: 'Pooja Vrat', hi: 'पूजा-व्रत' },
      'पोथी': { en: 'Pothi', hi: 'पोथी' },
      'सूक्त': { en: 'Sukta', hi: 'सूक्त' },
      'चालीसा': { en: 'Chalisa', hi: 'चालीसा' },
    };
    return (mapping[title] && mapping[title][lang]) || title;
  };

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
  const tithiDisplay = panchangWidget ? getTranslatedValue(lang, tithiNames?.[panchangWidget.tithi] || panchangWidget.tithi, panchangValueMappings.tithi, '—') : '—';
  const nakshatraDisplay = panchangWidget ? getTranslatedValue(lang, nakshatraNames?.[panchangWidget.nakshatra] || panchangWidget.nakshatra, panchangValueMappings.nakshatra, '—') : '—';

  return (
    <Layout title={t('appTitle')} description={t('appSubtitle')}>
      <main className={styles.pageWrapper}>
        <PwaInstallButton />

        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2>{t('panchangWidgetTitle')}</h2>
            <Link to="/panchang" className={styles.sectionLink}>{t('moreLink')}</Link>
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
            <Link to="/settings" className={styles.sectionLink}>{t('edit')}</Link>
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

        {/* Favorites */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2>{t('favSection')}</h2>
            <Link to="/bookmarks" className={styles.sectionLink}>{t('moreLink')}</Link>
          </div>
          {favorites.length === 0 ? (
            <div className={styles.infoCard}>
              <p>{t('favEmpty')}</p>
            </div>
          ) : (
            <div className={styles.verticalCardList}>
              {favorites.slice(0, 5).map((item) => (
                <Link key={item.path} className={styles.recentCard} to={item.path}>
                  <div>
                    <div className={styles.recentTitle}>{item.title}</div>
                  </div>
                  <span className={styles.recentArrow}>›</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recently Read */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2>{t('recentReads')}</h2>
          </div>
          {recentReads.length === 0 ? (
            <div className={styles.infoCard}>
              <p>{t('recentEmpty')}</p>
            </div>
          ) : (
            <div className={styles.verticalCardList}>
              {recentReads.map((item) => (
                <Link 
                  key={item.path} 
                  className={styles.recentCard} 
                  to={item.path}
                  onClick={() => handleRecentClick(item)}
                >
                  <div>
                    <div className={styles.recentTitle}>{item.title || item.path}</div>
                    {item.scrollPosition > 0 && (
                      <div className={styles.recentResumeLabel}>
                        ⚡ {t('resumeReadPrompt')}
                      </div>
                    )}
                    <div className={styles.recentMeta}>
                      {item.timestamp ? translateNumbers(new Date(item.timestamp).toLocaleTimeString(lang === 'en' ? 'en-US' : 'mr-IN', { hour: '2-digit', minute: '2-digit' })) : ''}
                    </div>
                  </div>
                  <span className={styles.recentArrow}>›</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Browse By Category */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2>{t('categorySection')}</h2>
            <Link to="/categories" className={styles.sectionLink}>{t('moreLink')}</Link>
          </div>
          <div className={styles.categoryGrid}>
            {categoryItems.map((item) => (
              <Link key={item.name} className={styles.categoryCard} to={item.to}>
                <span className={styles.categoryIcon}>{item.icon}</span>
                <span className={styles.categoryName}>{getTranslatedTitle(item.name)}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
