import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import CompactDocList from '@site/src/components/CompactDocList';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    // Sort bookmarks by date, newest first
    const sorted = stored.sort((a, b) => new Date(b.date) - new Date(a.date));
    setBookmarks(sorted);
  }, []);

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
              <CompactDocList
                items={bookmarks.map((bookmark) => ({
                  href: bookmark.path,
                  label: bookmark.title || 'पान',
                }))}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}