import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import { findFirstSidebarItemLink } from '@docusaurus/plugin-content-docs/client';
import styles from './styles.module.css';

function readStorage(key) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeStorage(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('sangrah-storage-change', { detail: { key } }));
}

function StarIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        fill={filled ? 'currentColor' : 'none'}
      />
    </svg>
  );
}

function PathIcon({ added }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={added ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
    </svg>
  );
}

export default function CompactDocList({ items, showActions = true }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [dailyPath, setDailyPath] = useState([]);

  const loadState = () => {
    setBookmarks(readStorage('bookmarks'));
    setDailyPath(readStorage('dailyPath'));
  };

  useEffect(() => {
    loadState();
    window.addEventListener('sangrah-storage-change', loadState);
    return () => window.removeEventListener('sangrah-storage-change', loadState);
  }, []);

  const toggleBookmark = (event, item) => {
    event.preventDefault();
    event.stopPropagation();
    const exists = bookmarks.some((bookmark) => bookmark.path === item.href);
    const updated = exists
      ? bookmarks.filter((bookmark) => bookmark.path !== item.href)
      : [...bookmarks, { path: item.href, title: item.label, date: new Date().toISOString() }];
    writeStorage('bookmarks', updated);
    setBookmarks(updated);
  };

  const toggleDailyPath = (event, item) => {
    event.preventDefault();
    event.stopPropagation();
    const exists = dailyPath.some((entry) => entry.to === item.href);
    const updated = exists
      ? dailyPath.filter((entry) => entry.to !== item.href)
      : [...dailyPath, { title: item.label, to: item.href }];
    writeStorage('dailyPath', updated);
    setDailyPath(updated);
  };

  return (
    <ul className={styles.list}>
      {items.map((item) => {
        const href = item.href || (item.type === 'category' ? findFirstSidebarItemLink(item) : null);
        if (!href) return null;
        const rowItem = { ...item, href };
        const isBookmarked = bookmarks.some((bookmark) => bookmark.path === href);
        const isInDailyPath = dailyPath.some((entry) => entry.to === href);
        return (
          <li key={href} className={styles.item}>
            <Link to={href} className={styles.link}>
              <span className={styles.title}>{rowItem.label}</span>
              {rowItem.meta && <span className={styles.meta}>{rowItem.meta}</span>}
            </Link>
            {showActions && <div className={styles.actions}>
              <button
                type="button"
                className={`${styles.actionButton} ${isBookmarked ? styles.active : ''}`}
                onClick={(event) => toggleBookmark(event, rowItem)}
                aria-pressed={isBookmarked}
                aria-label={isBookmarked ? 'आवडीतून काढा' : 'आवडीत जोडा'}
                title={isBookmarked ? 'आवडीतून काढा' : 'आवडीत जोडा'}
              >
                <StarIcon filled={isBookmarked} />
              </button>
              <button
                type="button"
                className={`${styles.actionButton} ${isInDailyPath ? styles.active : ''}`}
                onClick={(event) => toggleDailyPath(event, rowItem)}
                aria-pressed={isInDailyPath}
                aria-label={isInDailyPath ? 'नित्यपाठातून काढा' : 'नित्यपाठात जोडा'}
                title={isInDailyPath ? 'नित्यपाठातून काढा' : 'नित्यपाठात जोडा'}
              >
                <PathIcon added={isInDailyPath} />
              </button>
            </div>}
          </li>
        );
      })}
    </ul>
  );
}
