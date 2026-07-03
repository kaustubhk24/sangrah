import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useTranslation } from '../utils/translations';
import searchIndex from '../data/searchIndex.json';
import styles from './categories.module.css';

export default function CategoriesPage() {
  const { lang, t, translateNumbers } = useTranslation();

  // Count articles per category slug dynamically (including subfolders)
  const categoryCounts = React.useMemo(() => {
    const counts = {};
    searchIndex.forEach((doc) => {
      if (doc.category) {
        const parts = doc.category.split('/');
        let current = '';
        parts.forEach((part, index) => {
          current = index === 0 ? part : `${current}/${part}`;
          counts[current] = (counts[current] || 0) + 1;
        });
      }
    });
    return counts;
  }, []);

  const categories = React.useMemo(() => {
    const folders = [
      { key: 'aarati', mrLabel: 'आरती संग्रह', hiLabel: 'आरती संग्रह', slug: 'आरती-संग्रह', icon: '🪔' },
      { key: 'stotras-shlok', mrLabel: 'स्तोत्र / श्लोक संग्रह', hiLabel: 'स्तोत्र / श्लोक संग्रह', slug: 'स्तोत्र--श्लोक-संग्रह', icon: '📿' },
      { key: 'katha', mrLabel: 'कथा संग्रह', hiLabel: 'कथा संग्रह', slug: 'कथा-संग्रह', icon: '📖' },
      { key: 'pothi', mrLabel: 'पोथी', hiLabel: 'पोथी', slug: 'पोथी', icon: '🙏' },
      { key: 'Sukt', mrLabel: 'सूक्त संग्रह', hiLabel: 'सूक्त संग्रह', slug: 'सूक्त-संग्रह', icon: '📜' },
      { key: 'chalisa', mrLabel: 'चालीसा संग्रह', hiLabel: 'चालीसा संग्रह', slug: 'चालीसा-संग्रह', icon: '📚' },
      { key: 'Ashtak', mrLabel: 'अष्टक संग्रह', hiLabel: 'अष्टक संग्रह', slug: 'अष्टक-संग्रह', icon: '🕉️' },
      { key: 'abhang', mrLabel: 'अभंग संग्रह', hiLabel: 'अभंग संग्रह', slug: 'अभंग-संग्रह', icon: '🎼' },
      { key: 'managalastak', mrLabel: 'मंगलाष्टका', hiLabel: 'मंगलाष्टका', slug: 'मंगलाष्टका', icon: '🌸' },
      { key: 'namavali', mrLabel: 'नामावली', hiLabel: 'नामावली', slug: 'नामावली', icon: '📝' },
      { key: 'palana', mrLabel: 'पाळणा संग्रह', hiLabel: 'पाळणा संग्रह', slug: 'पाळणा-संग्रह', icon: '👶' },
      { key: 'pooja', mrLabel: 'पूजा-व्रत', hiLabel: 'पूजा-व्रत', slug: 'पूजा-व्रत', icon: '🏺' },
      { key: 'audio bhajan', mrLabel: 'ऑडिओ भजन', hiLabel: 'ऑडियो भजन', slug: 'ऑडियो-भजन', icon: '🎵' },
      { key: 'pravachane', mrLabel: 'प्रवचने', hiLabel: 'प्रवचने', slug: 'प्रवचने', icon: '🧘' },
    ];
    
    return folders.map(f => {
      const count = categoryCounts[f.key] || 0;
      const label = lang === 'hi' ? f.hiLabel : f.mrLabel;
      return {
        label,
        count,
        to: `/category/${f.slug}`,
        icon: f.icon
      };
    }).filter(f => f.count > 0);
  }, [categoryCounts, lang]);

  return (
    <Layout title={lang === 'hi' ? 'सभी श्रेणियां' : 'सर्व श्रेणी'} description="सर्व ग्रंथ श्रेणी">
      <main className={styles.container}>
        <h1 className={styles.title}>
          {lang === 'hi' ? 'सभी श्रेणियां' : 'सर्व श्रेणी'} ({translateNumbers(categories.length)})
        </h1>
        <div className={styles.grid}>
          {categories.map((cat, idx) => (
            <Link key={idx} className={styles.card} to={cat.to}>
              <span className={styles.icon}>{cat.icon}</span>
              <div className={styles.details}>
                <span className={styles.name}>{cat.label}</span>
                <span className={styles.count}>
                  {translateNumbers(cat.count)} {lang === 'en' ? 'Items' : (lang === 'hi' ? 'ग्रंथ' : 'ग्रंथ')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}
