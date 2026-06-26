import React, { useEffect, useState, useRef } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useLocation, useHistory } from '@docusaurus/router';
import searchIndex from '@site/src/data/searchIndex.json';
import { useTranslation } from '@site/src/utils/translations';
import styles from './search.module.css';

export default function SearchPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const inputRef = useRef(null);
  
  // Get initial query from URL search param 'q'
  const getQueryParam = () => {
    return new URLSearchParams(location.search).get('q') || '';
  };

  const [searchTerm, setSearchTerm] = useState(getQueryParam());
  const [searchResults, setSearchResults] = useState([]);

  // Sync search input if URL query changes
  useEffect(() => {
    setSearchTerm(getQueryParam());
  }, [location.search]);

  // Focus input on page load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Search logic (same tokenized scored matching)
  useEffect(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      setSearchResults([]);
      return;
    }

    const tokens = query.split(/\s+/).filter((t) => t.length > 0);
    if (tokens.length === 0) {
      setSearchResults([]);
      return;
    }

    const scored = searchIndex
      .map((item) => {
        const titleLower = (item.title || '').toLowerCase();
        const slugLower = (item.slug || '').toLowerCase();
        const filenameLower = (item.filename || '').toLowerCase();
        const keywordsLower = (item.keywords || '').toLowerCase();
        const fmKeywordsLower = (item.fmKeywords || '').toLowerCase();
        const headingsLower = (item.headings || '').toLowerCase();
        const categoryLower = (item.category || '').toLowerCase();

        const allTokensMatch = tokens.every((token) => {
          return (
            titleLower.includes(token) ||
            slugLower.includes(token) ||
            filenameLower.includes(token) ||
            keywordsLower.includes(token) ||
            fmKeywordsLower.includes(token) ||
            headingsLower.includes(token) ||
            categoryLower.includes(token)
          );
        });

        if (!allTokensMatch) return { ...item, score: 0 };

        let score = 0;
        tokens.forEach((token) => {
          if (titleLower === token) score += 100;
          else if (titleLower.startsWith(token)) score += 80;
          else if (titleLower.includes(token)) score += 50;

          if (filenameLower === token) score += 90;
          else if (filenameLower.startsWith(token)) score += 70;
          else if (filenameLower.includes(token)) score += 40;

          if (keywordsLower.includes(token)) score += 30;
          if (fmKeywordsLower.includes(token)) score += 30;
          if (headingsLower.includes(token)) score += 15;
          if (slugLower.includes(token)) score += 10;
          if (categoryLower.includes(token)) score += 5;
        });

        if (tokens.length > 1) {
          if (titleLower.includes(query)) score += 100;
          if (filenameLower.includes(query)) score += 80;
          if (keywordsLower.includes(query)) score += 60;
          if (fmKeywordsLower.includes(query)) score += 60;
        }

        return { ...item, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    setSearchResults(scored);
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    
    // Update URL query parameter
    const params = new URLSearchParams(location.search);
    if (val.trim()) {
      params.set('q', val);
    } else {
      params.delete('q');
    }
    history.replace({ search: params.toString() });
  };

  const getCategoryLabel = (cat) => {
    const labels = {
      aarati: { mr: 'आरती', hi: 'आरती', en: 'Aarti' },
      stotras: { mr: 'स्तोत्र', hi: 'स्तोत्र', en: 'Stotra' },
      'stotras-shlok': { mr: 'स्तोत्र/श्लोक', hi: 'स्तोत्र/श्लोक', en: 'Stotra/Shloka' },
      katha: { mr: 'कथा', hi: 'कथा', en: 'Katha' },
      pothi: { mr: 'पोथी', hi: 'पोथी', en: 'Pothi' },
      sukta: { mr: 'सूक्त', hi: 'सूक्त', en: 'Sukta' },
      chalisa: { mr: 'चालीसा', hi: 'चालीसा', en: 'Chalisa' },
    };
    const key = (cat || '').toLowerCase();
    const currentLang = typeof window !== 'undefined' ? (window.localStorage.getItem('site-language') || 'mr') : 'mr';
    return (labels[key] && labels[key][currentLang]) || cat;
  };

  const displayResults = searchTerm.trim() === ''
    ? [...searchIndex].sort((a, b) => a.title.localeCompare(b.title))
    : searchResults;

  return (
    <Layout title={t('searchTab')}>
      <div className="container margin-vert--lg">
        <h1>{t('searchTab')}</h1>
        
        {/* Full-width Search Input */}
        <div className={styles.searchBarContainer}>
          <input
            ref={inputRef}
            type="text"
            className={styles.searchPageInput}
            placeholder={t('nityapathSearchPlaceholder')}
            value={searchTerm}
            onChange={handleInputChange}
          />
          {searchTerm.trim() && (
            <button 
              className={styles.clearBtn} 
              onClick={() => {
                setSearchTerm('');
                history.replace({ search: '' });
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Results List */}
        {displayResults.length === 0 ? (
          <div className={styles.emptyState}>
            <p>काहीही आढळले नाही</p>
          </div>
        ) : (
          <ul className={styles.searchResultList}>
            {displayResults.map((item, index) => (
              <li key={`${item.slug}-${index}`} className={styles.searchResultItem}>
                <Link to={item.slug} className={styles.searchResultLink}>
                  <div className={styles.searchResultTitle}>{item.title}</div>
                  <div className={styles.searchResultPath}>{item.slug}</div>
                </Link>
                {item.category && (
                  <span className={styles.searchResultCategory}>
                    {getCategoryLabel(item.category)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
