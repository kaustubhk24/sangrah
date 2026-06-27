import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';

const normalizePath = (path) => {
  if (typeof path !== 'string') return '/';
  const [pathname, ...rest] = path.split(/([?#])/);
  const suffix = rest.join('');
  const normalizedPathname = pathname.replace(/\/+/g, '/')?.replace(/\/+$/, '') || '/';
  return `${normalizedPathname}${suffix}`;
};

function HistoryTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const pathname = normalizePath(location.pathname);
    const ignorePaths = [
      '/',
      '/bookmarks',
      '/history',
      '/counter',
      '/settings',
      '/categories'
    ];
    
    // Ignore homepage, bookmarks, history, settings, counter, and category directory lists
    if (ignorePaths.includes(pathname) || pathname.startsWith('/category/')) {
      return;
    }

    const currentPath = `${location.pathname || ''}${location.search || ''}${location.hash || ''}`;

    const saveHistory = () => {
      try {
        const savedHistory = JSON.parse(window.localStorage.getItem('pageHistory') || '[]');
        
        let pageTitle = document.title;
        // If document.title hasn't updated or is fallback, extract the header text of the article
        if (!pageTitle || pageTitle === 'संपूर्ण संग्रह' || pageTitle.includes('localhost') || pageTitle.includes('http')) {
          const h1 = document.querySelector('article h1') || document.querySelector('h1');
          if (h1) {
            pageTitle = h1.textContent || h1.innerText;
          }
        }

        const currentPage = {
          path: normalizePath(currentPath),
          title: pageTitle || currentPath,
          timestamp: new Date().toISOString(),
        };

        const cleanedHistory = Array.isArray(savedHistory)
          ? savedHistory.filter((item) => item && typeof item.path === 'string')
          : [];

        const uniqueHistory = cleanedHistory.reduce((acc, item) => {
          const normalizedItemPath = normalizePath(item.path);
          if (!acc.some((historyItem) => historyItem.path === normalizedItemPath)) {
            acc.push({
              ...item,
              path: normalizedItemPath,
            });
          }
          return acc;
        }, []);

        const previousPages = uniqueHistory.filter((item) => item.path !== normalizePath(currentPath));
        const updatedHistory = [currentPage, ...previousPages].slice(0, 15);

        window.localStorage.setItem('pageHistory', JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Error updating history:', error);
      }
    };

    // 500ms delay to guarantee React-Helmet has updated document.title
    const timeoutId = window.setTimeout(saveHistory, 500);
    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, location.search, location.hash]);

  return null;
}

export default HistoryTracker;
