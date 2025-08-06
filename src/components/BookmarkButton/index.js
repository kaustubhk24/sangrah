import React, { useEffect, useState } from 'react';
import { useLocation } from '@docusaurus/router';

export default function BookmarkButton() {
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
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '24px',
        color: isBookmarked ? '#fbbf24' : '#718096',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 200  // Add higher z-index to ensure button is clickable
      }}
      aria-label={isBookmarked ? 'चिन्हांकन काढून टाका' : 'चिन्हांकीत करा'}
    >
      {isBookmarked ? '⭐' : '☆'}
    </button>
  );
}