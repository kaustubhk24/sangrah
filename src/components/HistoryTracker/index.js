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

    const currentPath = `${location.pathname || ''}${location.search || ''}${location.hash || ''}`;

    const saveHistory = () => {
      try {
        const savedHistory = JSON.parse(window.localStorage.getItem('pageHistory') || '[]');
        const currentPage = {
          path: normalizePath(currentPath),
          title: document.title || currentPath,
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

    const timeoutId = window.setTimeout(saveHistory, 0);
    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, location.search, location.hash]);

  return null;
}

export default HistoryTracker;
