import React from 'react';
import Layout from '@theme-original/Layout';
import FontSizeControl from '@site/src/components/FontSizeControl';

export default function LayoutWrapper(props) {
  return (
    <>
      <Layout {...props} />
      <FontSizeControl />
    </>
  );
}
