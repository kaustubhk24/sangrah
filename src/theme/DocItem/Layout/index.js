import React from 'react';
import Layout from '@theme-original/DocItem/Layout';
import BookmarkButton from '@site/src/components/BookmarkButton';
import styles from './styles.module.css';

export default function DocItemLayoutWrapper(props) {
  return (
    <>
      <div className={styles.bookmarkContainer}>
        <BookmarkButton />
      </div>
      <Layout {...props} />
    </>
  );
}
