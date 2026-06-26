import React from 'react';
import { useHistory } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import ThemeToggle from '@site/src/components/ThemeToggle';
import styles from './styles.module.css';

export default function SearchBar() {
  const history = useHistory();

  const handleFocus = () => {
    history.push('/search');
  };

  return (
    <div className={styles.searchWrapper}>
      <div className={styles.searchBar}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="शोधा..."
          onFocus={handleFocus}
          aria-label="Search"
        />
      </div>
      <ThemeToggle />
      <Link to="/settings" className={styles.settingsBtn} aria-label="Settings">
        ⚙
      </Link>
    </div>
  );
}
