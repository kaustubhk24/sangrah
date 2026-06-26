import React, { useEffect, useState, useMemo } from 'react';
import Layout from '@theme-original/DocItem/Layout';
import BookmarkButton from '@site/src/components/BookmarkButton';
import ShareButton from '@site/src/components/ShareButton';
import AutoScrollControl from '@site/src/components/AutoScrollControl';
import ThemeToggle from '@site/src/components/ThemeToggle';
import { useTranslation } from '@site/src/utils/translations';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import searchIndex from '@site/src/data/searchIndex.json';
import styles from './styles.module.css';

export default function DocItemLayoutWrapper(props) {
  const { t, lang } = useTranslation();
  const location = useLocation();
  const [speaking, setSpeaking] = useState(false);
  const [showChapterDrawer, setShowChapterDrawer] = useState(false);
  const [chapterSearch, setChapterSearch] = useState('');
  const [showResumeToast, setShowResumeToast] = useState(false);
  const [savedScrollY, setSavedScrollY] = useState(0);
  const [dailyPathList, setDailyPathList] = useState([]);
  const [fontSize, setFontSize] = useState('medium');

  // Font size selector states
  const fontSizes = ['small', 'medium', 'large', 'xlarge'];

  const getFontSizeLabel = (key) => {
    const labels = {
      mr: { small: 'लहान', medium: 'मध्यम', large: 'मोठा', xlarge: 'अतिमोठा' },
      en: { small: 'Small', medium: 'Medium', large: 'Large', xlarge: 'Extra Large' },
      hi: { small: 'छोटा', medium: 'मध्यम', large: 'बड़ा', xlarge: 'बहुत बड़ा' }
    };
    const active = labels[lang] || labels['mr'];
    return active[key] || key;
  };

  const cleanPath = location.pathname.split('?')[0].split('#')[0];

  // Daily Path logic
  const isDailyPathMode = location.search.includes('dailyPath=true');
  const dailyPathIndex = parseInt(new URLSearchParams(location.search).get('index') || '0', 10);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedDaily = JSON.parse(window.localStorage.getItem('dailyPath') || '[]');
    setDailyPathList(storedDaily);

    const storedFont = window.localStorage.getItem('site-font-size') || 'medium';
    setFontSize(storedFont);
    document.documentElement.setAttribute('data-font-size', storedFont);
  }, [location.pathname]);

  // Load and trigger resume scroll position
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if redirect from recently read card (autoresume)
    const autoresume = window.localStorage.getItem('resumeScroll');
    if (autoresume) {
      window.localStorage.removeItem('resumeScroll');
      const y = parseInt(autoresume, 10);
      if (y > 50) {
        setTimeout(() => {
          window.scrollTo({ top: y, behavior: 'smooth' });
        }, 300);
        return;
      }
    }

    // Check for manual resume toast
    const pageHistory = JSON.parse(window.localStorage.getItem('pageHistory') || '[]');
    const matching = pageHistory.find((item) => {
      const cleanItemPath = item.path.split('?')[0].split('#')[0];
      return cleanItemPath === cleanPath;
    });

    if (matching && matching.scrollPosition > 150) {
      setSavedScrollY(matching.scrollPosition);
      setShowResumeToast(true);
    } else {
      setShowResumeToast(false);
    }
  }, [location.pathname]);

  // Track scroll position in history list
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      try {
        const pageHistory = JSON.parse(window.localStorage.getItem('pageHistory') || '[]');
        if (!Array.isArray(pageHistory)) return;

        const updated = pageHistory.map((item) => {
          const cleanItemPath = item.path.split('?')[0].split('#')[0];
          if (cleanItemPath === cleanPath) {
            return { ...item, scrollPosition: window.scrollY };
          }
          return item;
        });
        window.localStorage.setItem('pageHistory', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Automatically style shlokas containing '॥' (Devanagari double danda)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const formatShlokas = () => {
      const paragraphs = document.querySelectorAll('article p, article h1, article h2, article h3, article blockquote');
      paragraphs.forEach((p) => {
        if (p.innerText.includes('॥')) {
          p.classList.add('shloka-verse-traditional');
        }
      });
    };
    // Run after a slight delay to ensure content is fully rendered
    const timeout = setTimeout(formatShlokas, 100);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  // Speech synthesis cleanup
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (typeof window === 'undefined') return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const article = document.querySelector('article');
    if (!article) return;
    
    // Speak headers and paragraphs only
    const speakText = Array.from(article.querySelectorAll('h1, h2, h3, p'))
      .map(el => el.innerText)
      .join('. ');

    if (!speakText.trim()) return;

    const utterance = new SpeechSynthesisUtterance(speakText);
    utterance.lang = 'mr-IN';
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const handleResumeScroll = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: savedScrollY, behavior: 'smooth' });
      setShowResumeToast(false);
    }
  };

  const changeFontSize = (size) => {
    setFontSize(size);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('site-font-size', size);
      document.documentElement.setAttribute('data-font-size', size);
    }
  };

  // Chapter metadata parser for books (pothi, guru-charitra, satyanarayan)
  const isPothi = cleanPath.includes('/pothi/');
  const bookInfo = useMemo(() => {
    if (!isPothi) return null;
    const segments = cleanPath.split('/');
    if (segments.length < 3) return null;
    const parentPath = segments.slice(0, -1).join('/') + '/';

    const chapters = searchIndex.filter(item => item.slug.startsWith(parentPath));
    chapters.sort((a, b) => a.slug.localeCompare(b.slug));

    const currentIndex = chapters.findIndex(c => c.slug === cleanPath);
    if (currentIndex === -1) return null;

    return {
      chapters,
      currentIndex,
      currentChapter: chapters[currentIndex],
      total: chapters.length,
      prev: currentIndex > 0 ? chapters[currentIndex - 1] : null,
      next: currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null,
    };
  }, [cleanPath, isPothi]);

  const filteredChapters = useMemo(() => {
    if (!bookInfo) return [];
    const query = chapterSearch.trim().toLowerCase();
    if (!query) return bookInfo.chapters;
    return bookInfo.chapters.filter((c) => c.title.toLowerCase().includes(query));
  }, [bookInfo, chapterSearch]);

  return (
    <>
      {/* Reading Controls Bar */}
      <div className={styles.readingControlsBar}>
        {/* Font size picker */}
        <div className={styles.fontSizeSelect}>
          {fontSizes.map((key) => (
            <button
              key={key}
              className={`${styles.controlBtn} ${fontSize === key ? styles.active : ''}`}
              onClick={() => changeFontSize(key)}
            >
              {getFontSizeLabel(key)}
            </button>
          ))}
        </div>

        {/* Audio Read & Auto scroll & Actions */}
        <div className={styles.controlsRow}>
          <button 
            onClick={handleSpeak} 
            className={`${styles.audioBtn} ${speaking ? styles.speaking : ''}`}
          >
            {speaking ? t('stopBtn') : t('listenBtn')}
          </button>
          <AutoScrollControl />
          <div className={styles.iconActionsGroup}>
            <ShareButton className={styles.iconBtn} />
            <BookmarkButton className={styles.iconBtn} />
            <ThemeToggle className={styles.iconBtn} />
          </div>
        </div>
      </div>

      {/* Resume toast */}
      {showResumeToast && (
        <div className={styles.resumeToast}>
          <button onClick={handleResumeScroll} className={styles.resumeBtn}>
            ⚡ {t('resumeReadPrompt')}
          </button>
          <button onClick={() => setShowResumeToast(false)} className={styles.resumeClose}>
            ✕
          </button>
        </div>
      )}

      {/* Playlist mode navigation bar */}
      {isDailyPathMode && dailyPathList.length > 0 && (
        <div className={styles.dailyPathPlaylistBar}>
          <div className={styles.playlistProgress}>
            <span>🚩 {t('dailyPath')}: {dailyPathList[dailyPathIndex]?.title} ({dailyPathIndex + 1} / {dailyPathList.length})</span>
            <div className={styles.playlistProgressBg}>
              <div 
                className={styles.playlistProgressBar} 
                style={{ width: `${((dailyPathIndex + 1) / dailyPathList.length) * 100}%` }}
              />
            </div>
          </div>
          {dailyPathIndex < dailyPathList.length - 1 ? (
            <Link 
              className={styles.playlistNextBtn}
              to={`${dailyPathList[dailyPathIndex + 1].to}?dailyPath=true&index=${dailyPathIndex + 1}`}
            >
              ➡️ {t('nextBtn')}: {dailyPathList[dailyPathIndex + 1].title}
            </Link>
          ) : (
            <div className={styles.playlistDoneBadge}>
              🎉 {t('dailyPath')} समाप्त! जय श्री कृष्ण
            </div>
          )}
        </div>
      )}

      <Layout {...props} />

      {/* Book chapters pagination & drawer */}
      {bookInfo && (
        <div className={styles.bookPaginationContainer}>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBarLabel}>
              {t('pageLabel')} {bookInfo.currentIndex + 1} / {bookInfo.total}
            </div>
            <div className={styles.progressBarBg}>
              <div 
                className={styles.progressBarFill} 
                style={{ width: `${((bookInfo.currentIndex + 1) / bookInfo.total) * 100}%` }}
              />
            </div>
          </div>

          <div className={styles.paginationButtons}>
            {bookInfo.prev ? (
              <Link to={bookInfo.prev.slug} className={styles.navLinkBtn}>
                ◀ {t('prevBtn')}
              </Link>
            ) : (
              <span className={styles.disabledLinkBtn}>◀ {t('prevBtn')}</span>
            )}

            <button 
              className={styles.drawerTriggerBtn}
              onClick={() => setShowChapterDrawer(!showChapterDrawer)}
            >
              📖 {t('chapterDrawer')}
            </button>

            {bookInfo.next ? (
              <Link to={bookInfo.next.slug} className={styles.navLinkBtn}>
                {t('nextBtn')} ▶
              </Link>
            ) : (
              <span className={styles.disabledLinkBtn}>{t('nextBtn')} ▶</span>
            )}
          </div>

          {/* Sibling Chapters Drawer Modal */}
          {showChapterDrawer && (
            <div className={styles.drawerBackdrop} onClick={() => setShowChapterDrawer(false)}>
              <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.drawerHeader}>
                  <h3>📖 {t('chapterDrawer')}</h3>
                  <button className={styles.closeDrawerBtn} onClick={() => setShowChapterDrawer(false)}>✕</button>
                </div>
                <input
                  type="text"
                  className={styles.drawerSearch}
                  placeholder={t('searchBookPlaceholder')}
                  value={chapterSearch}
                  onChange={(e) => setChapterSearch(e.target.value)}
                />
                <div className={styles.drawerList}>
                  {filteredChapters.map((item, idx) => {
                    const isActive = item.slug === cleanPath;
                    return (
                      <Link
                        key={item.slug}
                        to={item.slug}
                        className={`${styles.drawerItem} ${isActive ? styles.activeDrawerItem : ''}`}
                        onClick={() => setShowChapterDrawer(false)}
                      >
                        <span className={styles.drawerItemIndex}>{idx + 1}</span>
                        <span className={styles.drawerItemTitle}>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
