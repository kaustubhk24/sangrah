import React from 'react';
import { PageMetadata } from '@docusaurus/theme-common';
import { useCurrentSidebarCategory } from '@docusaurus/plugin-content-docs/client';
import useBaseUrl from '@docusaurus/useBaseUrl';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import DocPaginator from '@theme/DocPaginator';
import Heading from '@theme/Heading';
import CompactDocList from '@site/src/components/CompactDocList';
import styles from './styles.module.css';

function CategoryMetadata({ categoryGeneratedIndex }) {
  return (
    <PageMetadata
      title={categoryGeneratedIndex.title}
      description={categoryGeneratedIndex.description}
      keywords={categoryGeneratedIndex.keywords}
      image={useBaseUrl(categoryGeneratedIndex.image)}
    />
  );
}

export default function DocCategoryGeneratedIndexPage({ categoryGeneratedIndex }) {
  const category = useCurrentSidebarCategory();
  const items = category.items || [];

  return (
    <>
      <CategoryMetadata categoryGeneratedIndex={categoryGeneratedIndex} />
      <div className={styles.generatedIndexPage}>
        <DocVersionBanner />
        <DocBreadcrumbs />
        <DocVersionBadge />
        <article className="margin-top--lg">
          <CompactDocList
            items={items}
            header={(
              <header>
                <Heading as="h1" className={styles.title}>
                  {categoryGeneratedIndex.title}
                </Heading>
                {categoryGeneratedIndex.description && <p>{categoryGeneratedIndex.description}</p>}
              </header>
            )}
          />
        </article>
        <footer className="margin-top--md">
          <DocPaginator
            previous={categoryGeneratedIndex.navigation.previous}
            next={categoryGeneratedIndex.navigation.next}
          />
        </footer>
      </div>
    </>
  );
}
