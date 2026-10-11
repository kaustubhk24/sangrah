import React, { useEffect, useState, useRef } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useLocation, useHistory } from '@docusaurus/router';
import { useTranslation } from '@site/src/utils/translations';
import ReadingActions, { useReadingActions } from '@site/src/components/ReadingActions';
import styles from './search.module.css';

export default function SearchPage() {
  const { lang, t, translateNumbers } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const inputRef = useRef(null);
  const readingActions = useReadingActions();
  
  // Get initial query from URL search param 'q'
  const getQueryParam = () => {
    return new URLSearchParams(location.search).get('q') || '';
  };

  const [searchTerm, setSearchTerm] = useState(getQueryParam());
  const [searchResults, setSearchResults] = useState([]);
  const [searchIndex, setSearchIndex] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/search-index.json')
      .then((response) => {
        if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
        return response.json();
      })
      .catch(() => import('@site/src/data/searchIndex.json').then((module) => module.default))
      .then((index) => {
        if (!cancelled) setSearchIndex(index);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

    const searchItems = searchIndex.flatMap((item) => [
      ...((item.sections || []).map((section) => ({
        ...item,
        title: section.title,
        slug: `${item.slug}#${section.id}`,
        parentSlug: item.slug,
        isSection: true,
        keywords: section.keywords,
        headings: section.title,
      }))),
      item,
    ]);

    const matchingItems = searchItems
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

    const documentsWithSectionMatches = new Set(
      matchingItems.filter((item) => item.isSection).map((item) => item.parentSlug),
    );
    setSearchResults(matchingItems.filter(
      (item) => item.isSection || !documentsWithSectionMatches.has(item.slug),
    ));
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
      ashtak: { mr: 'अष्टक संग्रह', hi: 'अष्टक संग्रह', en: 'Ashtak' },
      sukt: { mr: 'सूक्त संग्रह', hi: 'सूक्त संग्रह', en: 'Sukta' },
      aarati: { mr: 'आरती संग्रह', hi: 'आरती संग्रह', en: 'Aarati' },
      abhang: { mr: 'अभंग संग्रह', hi: 'अभंग संग्रह', en: 'Abhang' },
      'audio bhajan': { mr: 'ऑडिओ भजन', hi: 'ऑडियो भजन', en: 'Audio Bhajan' },
      chalisa: { mr: 'चालीसा संग्रह', hi: 'चालीसा संग्रह', en: 'Chalisa' },
      katha: { mr: 'कथा/कहाणी संग्रह', hi: 'कथा/कहाणी संग्रह', en: 'Katha' },
      kavacham: { mr: 'कवच संग्रह', hi: 'कवच संग्रह', en: 'Kavacham' },
      managalastak: { mr: 'मंगलाष्टका', hi: 'मंगलाष्टका', en: 'Mangalashtaka' },
      mantras: { mr: 'मंत्र संग्रह', hi: 'मंत्र संग्रह', en: 'Mantras' },
      namavali: { mr: 'नामावली', hi: 'नामावली', en: 'Namavali' },
      palana: { mr: 'पाळणा संग्रह', hi: 'पालना संग्रह', en: 'Palana' },
      pooja: { mr: 'पूजा-व्रत', hi: 'पूजा-व्रत', en: 'Pooja-Vrat' },
      pothi: { mr: 'पोथी', hi: 'पोथी', en: 'Pothi' },
      shastrarth: { mr: 'शास्त्रार्थ', hi: 'शास्त्रार्थ', en: 'Shastrarth' },
      'stotras-shlok': { mr: 'स्तोत्र / श्लोक संग्रह', hi: 'स्तोत्र / श्लोक संग्रह', en: 'Stotra / Shlok' },
    };
    const key = (cat || '').split('/')[0].trim().toLowerCase();
    return (labels[key] && labels[key][lang]) || cat;
  };

  const hasQuery = searchTerm.trim().length > 0;
  const popularResults = ['/ganpati', '/ram-raksha', '/hanuman', '/datt', '/shri-sukta']
    .map((slug) => searchIndex.find((item) => item.slug === slug))
    .filter(Boolean);

  return (
    <Layout title={t('searchTab')}>
      <div className="container margin-vert--lg">
        <h1>{t('searchTab')}</h1>
        
        {/* Full-width Search Input */}
        <div className={styles.searchBarContainer}>
          <input
            ref={inputRef}
            type="search"
            className={styles.searchPageInput}
            placeholder={t('searchPrompt')}
            aria-label={t('searchTab')}
            value={searchTerm}
            onChange={handleInputChange}
          />
          {searchTerm.trim() && (
            <button
              type="button"
              className={styles.clearBtn} 
              aria-label={t('clearSearch')}
              onClick={() => {
                setSearchTerm('');
                history.replace({ search: '' });
              }}
            >
              ✕
            </button>
          )}
        </div>

        {!hasQuery ? (
          <section className={styles.searchSuggestions} aria-labelledby="popular-searches-heading">
            <h2 id="popular-searches-heading">{t('searchPopularReads')}</h2>
            <ul className={styles.searchResultList}>
              {popularResults.map((item) => (
                <li key={item.slug} className={styles.searchResultItem}>
                  <Link to={item.slug} className={styles.searchResultLink}>
                    <div className={styles.searchResultTitle}>{item.title}</div>
                  </Link>
                  {item.category && <span className={styles.searchResultCategory}>{getCategoryLabel(item.category)}</span>}
                  <ReadingActions path={item.slug} title={item.title} actions={readingActions} className={styles.searchActionButton} />
                </li>
              ))}
            </ul>
          </section>
        ) : searchResults.length === 0 ? (
          <div className={styles.emptyState} role="status">
            <p>{t('searchNoResults')}</p>
          </div>
        ) : (
          <>
            <p className={styles.searchResultsCount} aria-live="polite">
              {translateNumbers(searchResults.length)} {t('searchResultsLabel')}
            </p>
            <ul className={styles.searchResultList}>
              {searchResults.map((item, index) => (
                <li key={`${item.slug}-${index}`} className={styles.searchResultItem}>
                  <Link to={item.slug} className={styles.searchResultLink}>
                    <div className={styles.searchResultTitle}>{item.title}</div>
                  </Link>
                  {item.category && (
                    <span className={styles.searchResultCategory}>
                      {getCategoryLabel(item.category)}
                    </span>
                  )}
                  <ReadingActions path={item.parentSlug || item.slug} title={item.title} actions={readingActions} className={styles.searchActionButton} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Layout>
  );
}
