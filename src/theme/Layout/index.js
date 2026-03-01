import React from 'react';
import Layout from '@theme-original/Layout';
import FontSizeControl from '@site/src/components/FontSizeControl';
import AutoScrollControl from '@site/src/components/AutoScrollControl';

export default function LayoutWrapper(props) {
  return (
    <>
      <Layout {...props} />
      <FontSizeControl />
      <AutoScrollControl />
    </>
  );
}
