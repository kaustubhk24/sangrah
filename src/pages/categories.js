import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useTranslation } from '../utils/translations';
import searchIndex from '../data/searchIndex.json';
import styles from './categories.module.css';

export default function CategoriesPage() {
  const { translateNumbers } = useTranslation();

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
      { key: 'aarati', mrLabel: 'आरती संग्रह', slug: 'आरती-संग्रह', icon: '🪔' },
      { key: 'stotras-shlok', mrLabel: 'स्तोत्र / श्लोक संग्रह', slug: 'स्तोत्र--श्लोक-संग्रह', icon: '📿' },
      { key: 'katha', mrLabel: 'कथा/कहाणी संग्रह', slug: 'कथा-संग्रह', icon: '📖' },
      { key: 'pothi', mrLabel: 'पोथी', slug: 'पोथी', icon: '🙏' },
      { key: 'Sukt', mrLabel: 'सूक्त संग्रह', slug: 'सूक्त-संग्रह', icon: '📜' },
      { key: 'chalisa', mrLabel: 'चालीसा संग्रह', slug: 'चालीसा-संग्रह', icon: '📚' },
      { key: 'Ashtak', mrLabel: 'अष्टक संग्रह', slug: 'अष्टक-संग्रह', icon: '🕉️' },
      { key: 'abhang', mrLabel: 'अभंग संग्रह', slug: 'अभंग-संग्रह', icon: '🎼' },
      { key: 'managalastak', mrLabel: 'मंगलाष्टका', slug: 'मंगलाष्टका', icon: '🌸' },
      { key: 'namavali', mrLabel: 'नामावली', slug: 'नामावली', icon: '📝' },
      { key: 'palana', mrLabel: 'पाळणा संग्रह', slug: 'पाळणा-संग्रह', icon: '👶' },
      { key: 'pooja', mrLabel: 'पूजा-व्रत', slug: 'पूजा-व्रत', icon: '🏺' },
      { key: 'kavacham', mrLabel: 'कवच संग्रह', slug: 'कवचम्', icon: '🛡️' },
      { key: 'mantras', mrLabel: 'मंत्र संग्रह', slug: 'मंत्र', icon: '🔔' },
      { key: 'audio bhajan', mrLabel: 'ऑडिओ भजन', slug: 'ऑडियो-भजन', icon: '🎵' },
      { key: 'pravachane', mrLabel: 'प्रवचने', slug: 'प्रवचने', icon: '🧘', specialTo: 'https://pravachane.sangrah.justinclicks.com/' },
      { key: 'muhurt', mrLabel: 'मुहूर्त', slug: null, icon: '⏳', specialTo: '/muhurt' },
      { key: 'project-information', mrLabel: 'प्रकल्प माहिती', slug: null, icon: 'ℹ️', specialTo: '/project-information' },
    ];
    
    return folders.map(f => {
      const count = categoryCounts[f.key] || 0;
      const label = f.mrLabel;
      return {
        label,
        count,
        to: f.specialTo || `/category/${f.slug}`,
        icon: f.icon,
        specialTo: f.specialTo
      };
    }).filter(f => f.specialTo || f.count > 0);
  }, [categoryCounts]);

  return (
    <Layout title="सर्व श्रेणी" description="सर्व ग्रंथ श्रेणी">
      <main className={styles.container}>
        <h1 className={styles.title}>
          सर्व श्रेणी ({translateNumbers(categories.length)})
        </h1>
        <div className={styles.grid}>
          {categories.map((cat, idx) => (
            <Link key={idx} className={styles.card} to={cat.to}>
              <span className={styles.icon}>{cat.icon}</span>
              <div className={styles.details}>
                <span className={styles.name}>{cat.label}</span>
                {cat.specialTo ? null : <span className={styles.count}>
                  {translateNumbers(cat.count)} ग्रंथ
                </span>}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}
