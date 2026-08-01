import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { useTranslation } from '@site/src/utils/translations';
import styles from './updates.module.css';

export default function UpdatesPage() {
  const { t } = useTranslation();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUpdates = async () => {
    setLoading(true);
    setError(null);
    try {
      // Dynamic fetch with timestamp query param and headers to prevent caching
      const response = await fetch(`/updates.md?t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch updates');
      }
      const text = await response.text();
      setContent(text);
    } catch (err) {
      console.error(err);
      setError(t('retryUpdates') === 'Retry' ? 'Something went wrong. Please try again.' : 'काहीतरी त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const renderMarkdown = (md) => {
    if (!md) return '';
    
    // Safely escape basic HTML chars (we control updates.md content)
    let html = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Markdown structures parsing
    // 1. Headings
    html = html.replace(/^# (.*$)/gim, `<h1 class="${styles.title}">$1</h1>`);
    html = html.replace(/^## (.*$)/gim, `<h2 class="${styles.subTitle}">$1</h2>`);
    html = html.replace(/^### (.*$)/gim, `<h3 class="${styles.sectionHeader}">$1</h3>`);

    // 2. Bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 3. Links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // 4. Bullet lists
    const lines = html.split('\n');
    let inList = false;
    let processedLines = [];

    for (let line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          processedLines.push(`<ul class="${styles.updatesList}">`);
          inList = true;
        }
        processedLines.push(`<li>${trimmed.substring(2)}</li>`);
      } else {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        if (trimmed !== '') {
          // If it isn't already a tag we generated, wrap in a paragraph
          if (!trimmed.startsWith('<h1') && !trimmed.startsWith('<h2') && !trimmed.startsWith('<h3') && !trimmed.startsWith('<ul') && !trimmed.startsWith('</ul') && !trimmed.startsWith('<li')) {
            processedLines.push(`<p class="${styles.paragraph}">${trimmed}</p>`);
          } else {
            processedLines.push(trimmed);
          }
        }
      }
    }
    if (inList) {
      processedLines.push('</ul>');
    }

    return processedLines.join('\n');
  };

  return (
    <Layout title={t('updatesHeader')}>
      <div className="container margin-vert--lg">
        <div className={styles.updatesContainer}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>{t('loadingUpdates')}</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p className={styles.errorText}>{error}</p>
              <button onClick={fetchUpdates} className={styles.retryButton}>
                {t('retryUpdates')}
              </button>
            </div>
          ) : (
            <div
              className={styles.markdownBody}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
