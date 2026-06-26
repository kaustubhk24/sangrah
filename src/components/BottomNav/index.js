import React from 'react';
import Link from '@docusaurus/Link';
import { useTranslation } from '@site/src/utils/translations';
import styles from './styles.module.css';

export default function BottomNav() {
  const { t } = useTranslation();

  const navItems = [
    { label: t('homeTab'), to: '/', icon: '🏠' },
    { label: t('searchTab'), to: '/search', icon: '🔍' },
    { label: t('jaapTab'), to: '/counter', icon: '📿' },
    { label: t('favTab'), to: '/bookmarks', icon: '❤️' },
    { label: t('historyTab'), to: '/history', icon: '🕒' },
  ];

  const handleNavClick = (item, e) => {
    // Standard routing is handled directly by Link component
  };

  return (
    <nav className={styles.bottomNav} aria-label="मोबाईल नेव्हिगेशन">
      {navItems.map((item) => (
        <Link 
          key={item.label} 
          className={styles.navItem} 
          to={item.to}
          onClick={(e) => handleNavClick(item, e)}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
