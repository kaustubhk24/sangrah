import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../utils/translations';
import { importBackupFile } from '../../utils/importBackup';
import styles from './styles.module.css';

const copy = {
  mr: {
    eyebrow: 'नवीन वेब पत्ता',
    title: 'श्री संग्रह आता shrisangrah.com वर',
    lead: 'तोच श्री संग्रह, आता छोट्या आणि लक्षात राहणाऱ्या पत्त्यावर.',
    changedTitle: 'काय बदलले?',
    changed: 'जुना वेब पत्ता खूप लांब होता. म्हणून आम्ही तो छोटा करून shrisangrah.com केला.',
    sameTitle: 'काय तेच आहे?',
    same: 'तोच संग्रह आणि तीच वैशिष्ट्ये. ॲप नेहमीप्रमाणे मोफत आणि जाहिरातमुक्त आहे.',
    dataNote: 'जुनी आवडती पाने, वाचन इतिहास आणि जपाची नोंद नव्या डोमेनवर आपोआप येत नाही. ती जतन करायची असल्यास जुन्या साइटवरील सेटिंग्जमधून डेटा export करा आणि इथे import करा.',
    install: 'ॲप इन्स्टॉल करा',
    close: 'बंद करा',
  },
  hi: {
    eyebrow: 'नया वेब पता',
    title: 'श्री संग्रह अब shrisangrah.com पर',
    lead: 'वही श्री संग्रह, अब छोटे और आसानी से याद रहने वाले पते पर।',
    changedTitle: 'क्या बदला?',
    changed: 'पुराना वेब पता बहुत लंबा था। इसलिए हमने इसे छोटा करके shrisangrah.com किया है।',
    sameTitle: 'क्या पहले जैसा है?',
    same: 'वही संग्रह और वही सुविधाएँ। ऐप हमेशा की तरह मुफ़्त और विज्ञापन-मुक्त है।',
    dataNote: 'पुराने पसंदीदा पृष्ठ, पढ़ने का इतिहास और जाप की गिनती नए डोमेन पर अपने-आप नहीं आएँगे। इन्हें रखना हो तो पुरानी साइट की सेटिंग्स से डेटा export करें और यहाँ import करें।',
    install: 'ऐप इंस्टॉल करें',
    close: 'बंद करें',
  },
  en: {
    eyebrow: 'NEW WEB ADDRESS',
    title: 'Sangrah is now at shrisangrah.com',
    lead: 'The same Sangrah, at a shorter, easier-to-remember address.',
    changedTitle: 'What changed?',
    changed: 'The old web address was long, so we shortened it to shrisangrah.com.',
    sameTitle: 'What stays the same?',
    same: 'The same collection and features. The app remains free to use and ad-free.',
    dataNote: 'Bookmarks, reading history, and Jaap counts saved on the old domain will not move automatically. To keep them, export your data in Settings on the old site and import it here.',
    install: 'Install the app',
    close: 'Close',
  },
};

const migrationHosts = new Set(['shrisangrah.com', 'www.shrisangrah.com']);
const dismissedKey = 'domain-migration-popup-dismissed';

export default function DomainMigrationPopup() {
  const { lang, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const importInputRef = useRef(null);
  const text = copy[lang] || copy.mr;

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const forcePreview = new URLSearchParams(window.location.search).get('showDomainUpdate') === '1';
    const isMigrationDomain = migrationHosts.has(window.location.hostname);
    if (!forcePreview && !isMigrationDomain) return undefined;
    if (!forcePreview && window.localStorage.getItem(dismissedKey)) return undefined;

    const openPopup = () => setIsOpen(true);
    const waitForLanguageChoice = !window.localStorage.getItem('site-language')
      && !window.localStorage.getItem('language-popup-dismissed');

    if (waitForLanguageChoice) {
      const handleLanguageSelected = () => window.setTimeout(openPopup, 150);
      window.addEventListener('sangrah:language-selected', handleLanguageSelected, { once: true });
      return () => window.removeEventListener('sangrah:language-selected', handleLanguageSelected);
    }

    openPopup();
    return undefined;
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleAppInstalled = () => {
      window.localStorage.setItem(dismissedKey, 'true');
      setIsOpen(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    return () => window.removeEventListener('appinstalled', handleAppInstalled);
  }, [isOpen]);

  if (!isOpen) return null;

  const dismiss = () => {
    window.localStorage.setItem(dismissedKey, 'true');
    setIsOpen(false);
  };

  const handleInstall = () => {
    window.dispatchEvent(new Event('sangrah:install-app'));
  };

  const handleImport = (event) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (file) importBackupFile(file, lang, { markMigrationSeen: true });
  };

  return (
    <div className={styles.overlay} onMouseDown={(event) => event.target === event.currentTarget && dismiss()}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="domain-migration-title">
        <button type="button" className={styles.closeButton} onClick={dismiss} aria-label={text.close}>
          ×
        </button>
        <p className={styles.eyebrow}>{text.eyebrow}</p>
        <h2 id="domain-migration-title" className={styles.title}>{text.title}</h2>
        <p className={styles.lead}>{text.lead}</p>

        <div className={styles.details}>
          <section className={styles.detailSection}>
            <h3>{text.changedTitle}</h3>
            <p>{text.changed}</p>
          </section>
          <section className={styles.detailSection}>
            <h3>{text.sameTitle}</h3>
            <p>{text.same}</p>
          </section>
        </div>

        <p className={styles.dataNote}>{text.dataNote}</p>

        <div className={styles.actions}>
          <button type="button" className={styles.installButton} onClick={handleInstall}>
            {text.install}
          </button>
          <button type="button" className={styles.importButton} onClick={() => importInputRef.current?.click()}>
            {t('importLabel')}
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept=".json,application/json"
            className={styles.fileInput}
            aria-label={t('importLabel')}
            onChange={handleImport}
          />
        </div>
      </section>
    </div>
  );
}
