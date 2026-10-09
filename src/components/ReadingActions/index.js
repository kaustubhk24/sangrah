import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../utils/translations';
import styles from './styles.module.css';

function readList(key) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeList(key, value) {
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

function DailyPathIcon({ added }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={added ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
    </svg>
  );
}

export function useReadingActions() {
  const [bookmarks, setBookmarks] = useState([]);
  const [dailyPath, setDailyPath] = useState([]);

  useEffect(() => {
    const syncLists = () => {
      setBookmarks(readList('bookmarks'));
      setDailyPath(readList('dailyPath'));
    };

    syncLists();
    window.addEventListener('sangrah-storage-change', syncLists);
    return () => window.removeEventListener('sangrah-storage-change', syncLists);
  }, []);

  const isBookmarked = (path) => bookmarks.some((bookmark) => bookmark.path === path);
  const isInDailyPath = (path) => dailyPath.some((entry) => entry.to === path);

  const toggleBookmark = (path, title) => {
    const updated = isBookmarked(path)
      ? bookmarks.filter((bookmark) => bookmark.path !== path)
      : [...bookmarks, { path, title, date: new Date().toISOString() }];
    writeList('bookmarks', updated);
    setBookmarks(updated);
  };

  const toggleDailyPath = (path, title) => {
    const updated = isInDailyPath(path)
      ? dailyPath.filter((entry) => entry.to !== path)
      : [...dailyPath, { title, to: path }];
    writeList('dailyPath', updated);
    setDailyPath(updated);
  };

  return { isBookmarked, isInDailyPath, toggleBookmark, toggleDailyPath };
}

export default function ReadingActions({ path, title, actions, className = '' }) {
  const { t } = useTranslation();
  const bookmarked = actions.isBookmarked(path);
  const inDailyPath = actions.isInDailyPath(path);
  const bookmarkLabel = t(bookmarked ? 'bookmarkRemove' : 'bookmarkAdd');
  const dailyPathLabel = t(inDailyPath ? 'dailyPathRemove' : 'dailyPathAdd');

  return (
    <div className={styles.actions}>
      <button
        type="button"
        className={`${styles.actionButton} ${bookmarked ? styles.active : ''} ${className}`}
        onClick={() => actions.toggleBookmark(path, title)}
        aria-pressed={bookmarked}
        aria-label={bookmarkLabel}
        title={bookmarkLabel}
      >
        <StarIcon filled={bookmarked} />
      </button>
      <button
        type="button"
        className={`${styles.actionButton} ${inDailyPath ? styles.active : ''} ${className}`}
        onClick={() => actions.toggleDailyPath(path, title)}
        aria-pressed={inDailyPath}
        aria-label={dailyPathLabel}
        title={dailyPathLabel}
      >
        <DailyPathIcon added={inDailyPath} />
      </button>
    </div>
  );
}
