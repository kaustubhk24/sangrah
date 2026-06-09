import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import styles from './styles.module.css';

export default function HistoryButton() {
  const history = useHistory();
  const location = useLocation();
  const [pageHistory, setPageHistory] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem('pageHistory') || '[]');
      const currentPage = {
        path: location.pathname,
        title: document.title || 'Page',
        timestamp: new Date().toISOString(),
      };

      const filtered = savedHistory.filter((h) => h.path !== currentPage.path);
      const updated = [currentPage, ...filtered].slice(0, 15);

      localStorage.setItem('pageHistory', JSON.stringify(updated));
      setPageHistory(updated);
    } catch (error) {
      console.error('Error updating history:', error);
    }
  }, [location.pathname]);

  const navigateToPage = (path) => {
    history.push(path);
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

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString();
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
          aria-label="View history"
          title="Page history"
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
              <h3>History</h3>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowDropdown(false)}
                aria-label="Close dropdown"
              >
                ✕
              </button>
            </div>
            
            <div className={styles.content}>
              {pageHistory.length === 0 ? (
                <div className={styles.empty}>No history yet</div>
              ) : (
                <ul className={styles.list}>
                  {pageHistory.map((item, idx) => (
                    <li key={`${item.path}-${idx}`} className={styles.item}>
                      <button
                        onClick={() => navigateToPage(item.path)}
                        className={styles.link}
                        type="button"
                      >
                        <div className={styles.itemTitle}>{item.title}</div>
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
