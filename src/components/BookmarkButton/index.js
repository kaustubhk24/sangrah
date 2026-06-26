import React, { useEffect, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';

export default function BookmarkButton({ className }) {
  const location = useLocation();
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Get clean pathname without query parameters or hash
  const getCleanPath = (path) => {
    return path.split('?')[0].split('#')[0];
  };
  
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const currentPath = getCleanPath(location.pathname);
    setIsBookmarked(bookmarks.some(b => b.path === currentPath));
  }, [location.pathname]);

  const toggleBookmark = (e) => {
    // Prevent default behavior
    e.preventDefault();
    e.stopPropagation();

    try {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      const currentPath = getCleanPath(location.pathname);
      
      if (isBookmarked) {
        const newBookmarks = bookmarks.filter(b => b.path !== currentPath);
        localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      } else {
        const newBookmarks = [...bookmarks, {
          path: currentPath, // Store only the clean pathname
          title: document.title,
          date: new Date().toISOString()
        }];
        localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      }
      
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  return (
    <button 
      onClick={toggleBookmark}
      className={className || styles.bookmarkButton}
      aria-label={isBookmarked ? 'चिन्हांकन काढून टाका' : 'चिन्हांकीत करा'}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill={isBookmarked ? "#fbbf24" : "none"} stroke={isBookmarked ? "#fbbf24" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
  );
}