import React from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import NavbarItem from '@theme/NavbarItem';
import Link from '@docusaurus/Link';
import { useTranslation } from '@site/src/utils/translations';
import searchIndex from '@site/src/data/searchIndex.json';

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items;
}

// The primary menu displays the navbar items
export default function NavbarMobilePrimaryMenu() {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = useNavbarItems();
  const { lang, translateNumbers } = useTranslation();

  // Count articles per category slug dynamically
  const categoryCounts = React.useMemo(() => {
    const counts = {};
    searchIndex.forEach((doc) => {
      if (doc.category) {
        counts[doc.category] = (counts[doc.category] || 0) + 1;
      }
    });
    return counts;
  }, []);

  // Map category slug to labels & build category list
  const categoriesList = React.useMemo(() => {
    const folders = [
      { key: 'aarati', mrLabel: 'आरती संग्रह', hiLabel: 'आरती संग्रह', slug: 'आरती-संग्रह' },
      { key: 'stotras-shlok', mrLabel: 'स्तोत्र / श्लोक संग्रह', hiLabel: 'स्तोत्र / श्लोक संग्रह', slug: 'स्तोत्र--श्लोक-संग्रह' },
      { key: 'katha', mrLabel: 'कथा संग्रह', hiLabel: 'कथा संग्रह', slug: 'कथा-संग्रह' },
      { key: 'pothi', mrLabel: 'पोथी', hiLabel: 'पोथी', slug: 'पोथी' },
      { key: 'Sukt', mrLabel: 'सूक्त संग्रह', hiLabel: 'सूक्त संग्रह', slug: 'सूक्त-संग्रह' },
      { key: 'chalisa', mrLabel: 'चालीसा संग्रह', hiLabel: 'चालीसा संग्रह', slug: 'चालीसा-संग्रह' },
      { key: 'Ashtak', mrLabel: 'अष्टक संग्रह', hiLabel: 'अष्टक संग्रह', slug: 'अष्टक-संग्रह' },
      { key: 'abhang', mrLabel: 'अभंग संग्रह', hiLabel: 'अभंग संग्रह', slug: 'अभंग-संग्रह' },
      { key: 'managalastak', mrLabel: 'मंगलाष्टका', hiLabel: 'मंगलाष्टका', slug: 'मंगलाष्टका' },
      { key: 'namavali', mrLabel: 'नामावली', hiLabel: 'नामावली', slug: 'नामावली' },
      { key: 'palana', mrLabel: 'पाळणा संग्रह', hiLabel: 'पाळणा संग्रह', slug: 'पाळणा-संग्रह' },
      { key: 'pooja', mrLabel: 'पूजा व्रत', hiLabel: 'पूजा व्रत', slug: 'पूजा-व्रत' },
      { key: 'audio bhajan', mrLabel: 'ऑडिओ भजन', hiLabel: 'ऑडियो भजन', slug: 'ऑडियो-भजन' },
    ];
    
    return folders.map(f => {
      const count = categoryCounts[f.key] || 0;
      const label = lang === 'hi' ? f.hiLabel : f.mrLabel;
      return {
        label,
        count,
        to: `/category/${f.slug}`,
      };
    }).filter(f => f.count > 0);
  }, [categoryCounts, lang]);

  return (
    <ul className="menu__list">
      {items.map((item, i) => (
        <NavbarItem
          mobile
          {...item}
          onClick={() => mobileSidebar.toggle()}
          key={i}
        />
      ))}

      {/* Render the full list of categories with counts directly inside the primary navigation drawer */}
      {categoriesList.length > 0 && (
        <>
          <li className="menu__list-item" style={{ borderTop: '1px solid var(--ifm-toc-border-color, #eee)', marginTop: '12px', paddingTop: '8px' }}>
            <span className="menu__link" style={{ fontWeight: '700', color: '#c75d00', cursor: 'default' }}>
              📚 ग्रंथ श्रेणी
            </span>
          </li>
          {categoriesList.map((cat, idx) => (
            <li key={idx} className="menu__list-item">
              <Link 
                className="menu__link" 
                to={cat.to}
                onClick={() => mobileSidebar.toggle()}
              >
                {cat.label} ({translateNumbers(cat.count)})
              </Link>
            </li>
          ))}
        </>
      )}
    </ul>
  );
}
