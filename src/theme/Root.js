import React from 'react';
import PwaInstallButton from '../components/PwaInstallButton';

export default function Root({children}) {
  return (
    <>
      {children}
      <PwaInstallButton />
    </>
  );
}
