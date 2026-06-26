import React from 'react';
import Layout from '@theme-original/Layout';
import BottomNav from '@site/src/components/BottomNav';
import AutoScrollControl from '@site/src/components/AutoScrollControl';

export default function LayoutWrapper(props) {
  return (
    <>
      <Layout {...props} />
      <BottomNav />
      <AutoScrollControl />
    </>
  );
}
