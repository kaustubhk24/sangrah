import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import PwaInstallButton from '../components/PwaInstallButton';
import DeityIcon from '../components/DeityIcon';
import { useTranslation } from '../utils/translations';
import styles from './index.module.css';

const popularItems = [
  { title: 'गणपती आरती', to: '/ganpati', deity: 'ganpati' },
  { title: 'रामरक्षा स्तोत्र', to: '/ram-raksha', deity: 'ram' },
  { title: 'मारुती स्तोत्र', to: '/hanuman', deity: 'hanuman' },
  { title: 'दत्त स्तोत्र', to: '/datt', deity: 'datt' },
  { title: 'श्रीसूक्त', to: '/shri-sukta', deity: 'devi' },
  { title: 'गणपती अथर्वशीर्ष', to: '/ganapati-stotra', deity: 'ganpati' },
];

const deityItems = [
  { name: 'गणपती', to: '/ganpati', deity: 'ganpati' },
  { name: 'राम', to: '/shriram', deity: 'ram' },
  { name: 'हनुमान', to: '/hanuman', deity: 'hanuman' },
  { name: 'शिव', to: '/shankar', deity: 'shiv' },
  { name: 'देवी', to: '/devi', deity: 'devi' },
  { name: 'दत्त', to: '/datt', deity: 'datt' },
  { name: 'कृष्ण', to: '/krushna-aarati', deity: 'krushna' },
  { name: 'सूर्य', to: '/surya', deity: 'surya' },
];

const categoryItems = [
  { name: 'आरत्या', to: '/category/आरती-संग्रह', icon: '🪔' },
  { name: 'स्तोत्रे', to: '/category/स्तोत्र--श्लोक-संग्रह', icon: '📿' },
  { name: 'कथा', to: '/category/कथा-संग्रह', icon: '📖' },
  { name: 'पोथी', to: '/category/पोथी', icon: '🙏' },
  { name: 'सूक्त', to: '/category/सूक्त-संग्रह', icon: '📜' },
  { name: 'चालीसा', to: '/category/चालीसा-संग्रह', icon: '📚' },
];

export default function HomePage() {
  const { lang, t } = useTranslation();
  const [recentReads, setRecentReads] = useState([]);
  const [dailyPath, setDailyPath] = useState([]);
  const [favorites, setFavorites] = useState([]);

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
  }, []);

  const getTranslatedTitle = (title) => {
    const mapping = {
      'गणपती आरती': { en: 'Ganpati Aarti', hi: 'गणपति आरती' },
      'रामरक्षा स्तोत्र': { en: 'Ramraksha Stotra', hi: 'रामरक्षा स्तोत्र' },
      'मारुती स्तोत्र': { en: 'Maruti Stotra', hi: 'मारुति स्तोत्र' },
      'दत्त स्तोत्र': { en: 'Datta Stotram', hi: 'दत्त स्तोत्र' },
      'श्रीसूक्त': { en: 'Shri Suktam', hi: 'श्रीसूक्त' },
      'गणपती अथर्वशीर्ष': { en: 'Ganapati Atharvashirsha', hi: 'गणपति अथर्वशीर्ष' },
      'आरत्या': { en: 'Aarati', hi: 'आरती' },
      'स्तोत्रे': { en: 'Stotras', hi: 'स्तोत्र' },
      'कथा': { en: 'Katha', hi: 'कथा' },
      'पोथी': { en: 'Pothi', hi: 'पोथी' },
      'सूक्त': { en: 'Sukta', hi: 'सूक्त' },
      'चालीसा': { en: 'Chalisa', hi: 'चालीसा' },
      'गणपती': { en: 'Ganesha', hi: 'गणपति' },
      'राम': { en: 'Rama', hi: 'राम' },
      'हनुमान': { en: 'Hanuman', hi: 'हनुमान' },
      'शिव': { en: 'Shiva', hi: 'शिव' },
      'देवी': { en: 'Devi', hi: 'देवी' },
      'दत्त': { en: 'Datta', hi: 'दत्त' },
      'कृष्ण': { en: 'Krishna', hi: 'कृष्ण' },
      'सूर्य': { en: 'Surya', hi: 'सूर्य' },
    };
    return (mapping[title] && mapping[title][lang]) || title;
  };

  const handleRecentClick = (item) => {
    if (typeof window !== 'undefined' && item.scrollPosition) {
      window.localStorage.setItem('resumeScroll', item.scrollPosition.toString());
    }
  };

  return (
    <Layout title={t('appTitle')} description={t('appSubtitle')}>
      <main className={styles.pageWrapper}>
        <PwaInstallButton />

        {/* Quick Access */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2>{t('quickAccess')}</h2>
          </div>
          <div className={styles.popularGrid}>
            {popularItems.map((item) => (
              <Link key={item.title} className={styles.popularCard} to={item.to}>
                <div className={styles.popularCardIcon}>
                  <DeityIcon name={item.deity} size={32} />
                </div>
                <div className={styles.popularCardTitle}>{getTranslatedTitle(item.title)}</div>
              </Link>
            ))}
          </div>
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
                      {item.timestamp ? new Date(item.timestamp).toLocaleTimeString(lang === 'en' ? 'en-US' : 'mr-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </div>
                  </div>
                  <span className={styles.recentArrow}>›</span>
                </Link>
              ))}
            </div>
          )}
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
                      <span className={styles.dailyPathIndex}>{index + 1}</span>
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

        {/* Browse By Deity */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2>{t('deitySection')}</h2>
          </div>
          <div className={styles.deityGrid}>
            {deityItems.map((item) => (
              <Link key={item.name} className={styles.deityCard} to={item.to}>
                <div className={styles.deityIcon}>
                  <DeityIcon name={item.deity} size={30} />
                </div>
                <div className={styles.deityName}>{getTranslatedTitle(item.name)}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Browse By Category */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2>{t('categorySection')}</h2>
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
      </main>
    </Layout>
  );
}
