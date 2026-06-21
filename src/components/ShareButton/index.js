import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';

export default function ShareButton() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getCurrentPageUrl = () => {
    return typeof window !== 'undefined' ? window.location.href : '';
  };

  const getPageTitle = () => {
    return typeof document !== 'undefined' ? document.title : 'Check this out';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shareOptions = {
    copyLink: () => {
      const url = getCurrentPageUrl();
      navigator.clipboard.writeText(url).then(() => {
        alert('लिंक कॉपी केले!'); // "Link copied!" in Marathi
        setIsOpen(false);
      }).catch(() => {
        alert('कॉपी करण्यात अयशस्वी');
      });
    },

    twitter: () => {
      const url = getCurrentPageUrl();
      const title = getPageTitle();
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
      window.open(twitterUrl, '_blank', 'width=600,height=400');
      setIsOpen(false);
    },

    facebook: () => {
      const url = getCurrentPageUrl();
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(facebookUrl, '_blank', 'width=600,height=400');
      setIsOpen(false);
    },

    linkedin: () => {
      const url = getCurrentPageUrl();
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      window.open(linkedinUrl, '_blank', 'width=600,height=400');
      setIsOpen(false);
    },

    email: () => {
      const url = getCurrentPageUrl();
      const title = getPageTitle();
      const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
      window.location.href = emailUrl;
      setIsOpen(false);
    },

    whatsapp: () => {
      const url = getCurrentPageUrl();
      const title = getPageTitle();
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
      window.open(whatsappUrl, '_blank');
      setIsOpen(false);
    },

    telegram: () => {
      const url = getCurrentPageUrl();
      const title = getPageTitle();
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
      window.open(telegramUrl, '_blank');
      setIsOpen(false);
    },
  };

  // Try to use native share API if available
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: getPageTitle(),
          url: getCurrentPageUrl(),
        });
        setIsOpen(false);
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else {
      // Fallback: just open the dropdown
      setIsOpen(!isOpen);
    }
  };

  return (
    <div ref={dropdownRef} className={styles.shareContainer}>
      <button
        onClick={handleNativeShare}
        className={styles.shareButton}
        aria-label="शेअर करा"
        title="शेअर करा"
      >
        🔗
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <button
            onClick={shareOptions.copyLink}
            className={styles.dropdownItem}
            title="लिंक कॉपी करा"
          >
            <span className={styles.icon}>🔗</span> लिंक कॉपी करा
          </button>

          <button
            onClick={shareOptions.twitter}
            className={styles.dropdownItem}
            title="Twitter वर शेअर करा"
          >
            <span className={styles.icon}>𝕏</span> Twitter
          </button>

          <button
            onClick={shareOptions.facebook}
            className={styles.dropdownItem}
            title="Facebook वर शेअर करा"
          >
            <span className={styles.icon}>f</span> Facebook
          </button>

          <button
            onClick={shareOptions.linkedin}
            className={styles.dropdownItem}
            title="LinkedIn वर शेअर करा"
          >
            <span className={styles.icon}>in</span> LinkedIn
          </button>

          <button
            onClick={shareOptions.whatsapp}
            className={styles.dropdownItem}
            title="WhatsApp वर शेअर करा"
          >
            <span className={styles.icon}>💬</span> WhatsApp
          </button>

          <button
            onClick={shareOptions.telegram}
            className={styles.dropdownItem}
            title="Telegram वर शेअर करा"
          >
            <span className={styles.icon}>✈️</span> Telegram
          </button>

          <button
            onClick={shareOptions.email}
            className={styles.dropdownItem}
            title="ईमेलद्वारे शेअर करा"
          >
            <span className={styles.icon}>✉️</span> ईमेल
          </button>
        </div>
      )}
    </div>
  );
}
