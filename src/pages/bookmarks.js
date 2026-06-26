import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './bookmarks.module.css';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    // Sort bookmarks by date, newest first
    const sorted = stored.sort((a, b) => new Date(b.date) - new Date(a.date));
    setBookmarks(sorted);
  }, []);

  const removeBookmark = (path) => {
    const newBookmarks = bookmarks.filter(bookmark => bookmark.path !== path);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
    setBookmarks(newBookmarks);
  };

  return (
    <Layout title="My Bookmarks">
      <div className="container margin-vert--lg">
        <h1>चिन्हांकित पाने</h1>
        <div className="row">
          <div className="col">
            {bookmarks.length === 0 ? (
              <p><b>तुम्ही कोणतेही पाने चिन्हांकीत केली नाहीत .</b>  <br /><br /><span>
        पान चिन्हांकित करण्यासाठी कोणत्याही पानावरील तारा (☆) चिन्हावर क्लिक करा. 
        चिन्हांकित केलेले पान काढून टाकण्यासाठी भरलेल्या ताऱ्यावर (⭐) पुन्हा क्लिक करा.
        तुमची सर्व चिन्हांकित पाने "चिन्हांकित पाने" मध्ये पाहू शकता.
      </span></p>
            ) : (
              <ul className={styles.bookmarksList}>
                {bookmarks.map((bookmark) => (
                  <li key={bookmark.path} className={styles.bookmarkItem}>
                    <Link to={bookmark.path} className={styles.bookmarkLink}>
                      <div className={styles.bookmarkTitle}>{bookmark.title || bookmark.path}</div>
                      <div className={styles.bookmarkPath}>{bookmark.path}</div>
                    </Link>
                    <button
                      onClick={() => removeBookmark(bookmark.path)}
                      className={styles.removeButton}
                      aria-label="Remove bookmark"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}