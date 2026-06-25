import React from 'react';
import PwaInstallButton from '../components/PwaInstallButton';
import HistoryTracker from '../components/HistoryTracker';

export default function Root({children}) {
  return (
    <>
      {children}
      <PwaInstallButton />
      <HistoryTracker />
    </>
  );
}
