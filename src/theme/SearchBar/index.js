import React, { useEffect } from 'react';
import Link from '@docusaurus/Link';
import ThemeToggle from '@site/src/components/ThemeToggle';
import styles from './styles.module.css';

export default function SearchBar() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Prefetch settings page aggressively to prevent clicking lag
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/settings';
    document.head.appendChild(link);
  }, []);

  return (
    <div className={styles.searchWrapper}>
      <ThemeToggle />
      <Link to="/panchang" className={styles.panchangBtn} aria-label="Panchang" title="Panchang">
        📅
      </Link>
      <Link to="/settings" className={styles.settingsBtn} aria-label="Settings" title="Settings">
        ⚙
      </Link>
    </div>
  );
}
