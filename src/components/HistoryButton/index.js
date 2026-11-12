import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import styles from './styles.module.css';

export default function HistoryButton() {
  const history = useHistory();
  const location = useLocation();
  const [pageHistory, setPageHistory] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const normalizePath = (path) => {
    if (typeof path !== 'string') return '/';
    const [pathname, ...rest] = path.split(/([?#])/);
    const suffix = rest.join('');
    const normalizedPathname = pathname.replace(/\/+$/, '') || '/';
    return `${normalizedPathname}${suffix}`;
  };

  const currentPath = `${location.pathname || ''}${location.search || ''}${location.hash || ''}`;

  useEffect(() => {
    const saveHistory = () => {
      try {
        const savedHistory = JSON.parse(localStorage.getItem('pageHistory') || '[]');
        const currentPage = {
          path: normalizePath(currentPath),
          title: document.title || currentPath,
          timestamp: new Date().toISOString(),
        };

        const cleanedHistory = Array.isArray(savedHistory)
          ? savedHistory.filter((item) => item && typeof item.path === 'string')
          : [];

        const uniqueHistory = cleanedHistory.reduce((acc, item) => {
          const normalizedPath = normalizePath(item.path);
          if (!acc.some((historyItem) => historyItem.path === normalizedPath)) {
            acc.push({
              ...item,
              path: normalizedPath,
            });
          }
          return acc;
        }, []);

        const previousPages = uniqueHistory.filter((h) => h.path !== normalizePath(currentPath));
        const updatedHistory = [currentPage, ...previousPages].slice(0, 15);

        localStorage.setItem('pageHistory', JSON.stringify(updatedHistory));
        setPageHistory(previousPages.slice(0, 15));
      } catch (error) {
        console.error('Error updating history:', error);
      }
    };

    const timeoutId = window.setTimeout(saveHistory, 0);
    return () => window.clearTimeout(timeoutId);
  }, [currentPath]);

  const navigateToPage = (path) => {
    history.push(normalizePath(path));
    setShowDropdown(false);
  };

  const clearHistory = () => {
    localStorage.setItem('pageHistory', '[]');
    setPageHistory([]);
    setShowDropdown(false);
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'आत्ताच';
      const relativeTime = new Intl.RelativeTimeFormat('mr-IN', { numeric: 'auto' });
      if (diffMins < 60) return relativeTime.format(-diffMins, 'minute');
      if (diffHours < 24) return relativeTime.format(-diffHours, 'hour');
      if (diffDays < 7) return relativeTime.format(-diffDays, 'day');
      
      return new Intl.DateTimeFormat('mr-IN').format(date);
    } catch {
      return '';
    }
  };

  return (
    <>
      <div className={styles.container}>
        <button
          className={styles.button}
          onClick={() => setShowDropdown(!showDropdown)}
          aria-label="वाचनाचा इतिहास पहा"
          title="वाचनाचा इतिहास"
          type="button"
        >
          <span className={styles.buttonIcon}>🕒</span>
        </button>
      </div>

      {showDropdown && (
        <>
          <div className={styles.overlay} onClick={() => setShowDropdown(false)} />
          <div className={styles.dropdown}>
            <div className={styles.header}>
              <h3>इतिहास</h3>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowDropdown(false)}
                aria-label="यादी बंद करा"
              >
                ✕
              </button>
            </div>
            
            <div className={styles.content}>
              {pageHistory.length === 0 ? (
                <div className={styles.empty}>अजून वाचनाचा इतिहास नाही.</div>
              ) : (
                <ul className={styles.list}>
                  {pageHistory.map((item) => (
                      <li key={item.path} className={styles.item}>
                        <button
                          onClick={() => navigateToPage(item.path)}
                          className={styles.link}
                          type="button"
                        >
                          <div className={styles.itemTitle}>{item.title || item.path}</div>
                          <div className={styles.itemPath}>{item.path}</div>
                          <div className={styles.itemTime}>{formatTime(item.timestamp)}</div>
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {pageHistory.length > 0 && (
              <div className={styles.footer}>
                <button 
                  className={styles.clearBtn}
                  onClick={clearHistory}
                  type="button"
                >
                  Clear History
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
