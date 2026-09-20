import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import CompactDocList from '@site/src/components/CompactDocList';
import styles from './history.module.css';

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

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const stored = JSON.parse(window.localStorage.getItem('pageHistory') || '[]');
      const cleaned = Array.isArray(stored)
        ? stored.filter((item) => {
            if (!item || typeof item.path !== 'string') return false;
            return item.path.split(/[?#]/)[0].replace(/\/+$/, '') !== '/search';
          })
        : [];
      const sorted = cleaned.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setHistoryItems(sorted);
      window.localStorage.setItem('pageHistory', JSON.stringify(sorted));
    } catch (error) {
      console.error('Error reading page history:', error);
      setHistoryItems([]);
    }
  }, []);

  const clearHistory = () => {
    window.localStorage.setItem('pageHistory', '[]');
    setHistoryItems([]);
  };

  return (
    <Layout title="इतिहास">
      <div className="container margin-vert--lg">
        <h1>इतिहास</h1>
        <p>आपल्या अलीकडील पानांचे इतिहास येथे दर्शविला आहे.</p>
        {historyItems.length === 0 ? (
          <div className={styles.emptyState}>
            <p>इतिहास रिकामा आहे.</p>
            <p>आपण कोणतेही पान नाही पाहिले किंवा इतिहास साफ केला आहे.</p>
          </div>
        ) : (
          <>
            <CompactDocList
              items={historyItems.map((item) => ({
                href: item.path,
                label: item.title || 'पान',
                meta: formatTime(item.timestamp),
              }))}
              showActions={false}
            />
            <button type="button" className={styles.clearButton} onClick={clearHistory}>
              इतिहास साफ करा
            </button>
          </>
        )}
      </div>
    </Layout>
  );
}
