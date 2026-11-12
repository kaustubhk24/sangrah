import React, { useEffect, useRef } from 'react';
import LZString from 'lz-string';

const APP_SIGNATURE = 'sangrah_secure_migration_2026';
const MAX_AGE_MS = 5 * 60 * 1000;
const EXPIRED_MESSAGE = 'The migration link has expired for security reasons. Please try again.';
const SUCCESS_MESSAGE = 'तुमचा डेटा यशस्वीरित्या ट्रान्सफर झाला आहे! (Your data was successfully transferred!)';

function readMigrationParameter(parameters) {
  return new URLSearchParams(parameters.replace(/\+/g, '%2B')).get('migration_data');
}

function clearMigrationParameter() {
  const url = new URL(window.location.href);
  url.searchParams.delete('migration_data');
  const hashParameters = new URLSearchParams(url.hash.slice(1).replace(/\+/g, '%2B'));
  if (hashParameters.has('migration_data')) {
    hashParameters.delete('migration_data');
    url.hash = hashParameters.toString();
  }
  const clearedUrl = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState(window.history.state, '', clearedUrl);
}

export default function MigrationReceiver() {
  const processed = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || processed.current) return;

    const migrationData =
      readMigrationParameter(window.location.hash.slice(1)) ||
      readMigrationParameter(window.location.search.slice(1));
    if (!migrationData) return;

    processed.current = true;

    try {
      const decompressedData = LZString.decompressFromEncodedURIComponent(migrationData);
      if (typeof decompressedData !== 'string') {
        throw new Error('Migration data could not be decompressed.');
      }

      const parsedData = JSON.parse(decompressedData);
      if (!parsedData || typeof parsedData !== 'object' || Array.isArray(parsedData)) {
        throw new Error('Migration data must be an object.');
      }

      if (parsedData.__appSignature !== APP_SIGNATURE) {
        clearMigrationParameter();
        throw new Error('Migration signature is invalid.');
      }

      const timestamp = parsedData.__timestamp;
      const age = Date.now() - timestamp;
      if (!Number.isFinite(timestamp) || age < 0 || age > MAX_AGE_MS) {
        window.alert(EXPIRED_MESSAGE);
        return;
      }

      delete parsedData.__appSignature;
      delete parsedData.__timestamp;

      const entries = Object.entries(parsedData).map(([key, value]) => {
        const storedValue = typeof value === 'string' ? value : JSON.stringify(value);
        if (typeof storedValue !== 'string') {
          throw new Error(`Migration value for "${key}" could not be serialized.`);
        }
        return [key, storedValue];
      });

      entries.forEach(([key, value]) => window.localStorage.setItem(key, value));

      clearMigrationParameter();
      window.alert(SUCCESS_MESSAGE);
      window.location.reload();
    } catch (error) {
      console.error('Unable to apply migration data:', error);
    }
  }, []);

  return null;
}
