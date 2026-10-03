const migrationDismissedKey = 'domain-migration-popup-dismissed';

const importCopy = {
  mr: {
    confirm: 'बॅकअप आयात केल्याने सध्याच्या सर्व सेटिंग्ज बदलल्या जातील. पुढे जावे?',
    error: 'बॅकअप फाईल वाचता आली नाही. कृपया वैध JSON बॅकअप निवडा.',
  },
  hi: {
    confirm: 'बैकअप आयात करने से सभी वर्तमान सेटिंग्स बदल जाएंगी। जारी रखें?',
    error: 'बैकअप फ़ाइल पढ़ी नहीं जा सकी। कृपया मान्य JSON बैकअप चुनें।',
  },
  en: {
    confirm: 'Importing this backup will overwrite all current settings. Proceed?',
    error: 'Could not read the backup file. Please select a valid JSON backup.',
  },
};

export function importBackupFile(file, lang = 'mr', { markMigrationSeen = false } = {}) {
  const reader = new FileReader();
  const messages = importCopy[lang] || importCopy.mr;

  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('Invalid backup format');
      }

      const entries = Object.entries(parsed);
      if (entries.some(([, value]) => typeof value !== 'string')) {
        throw new Error('Invalid backup values');
      }

      if (!window.confirm(messages.confirm)) return;

      const migrationWasDismissed = window.localStorage.getItem(migrationDismissedKey);
      window.localStorage.clear();
      entries.forEach(([key, value]) => window.localStorage.setItem(key, value));

      if (migrationWasDismissed || markMigrationSeen) {
        window.localStorage.setItem(migrationDismissedKey, 'true');
      }
      window.location.reload();
    } catch {
      window.alert(messages.error);
    }
  };

  reader.onerror = () => window.alert(messages.error);
  reader.readAsText(file);
}
