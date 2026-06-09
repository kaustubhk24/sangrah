import React from 'react';
import PwaInstallButton from '../components/PwaInstallButton';
import HistoryButton from '../components/HistoryButton';

export default function Root({children}) {
  return (
    <>
      {children}
      <PwaInstallButton />
      <HistoryButton />
    </>
  );
}
