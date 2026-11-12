import React, { useState } from 'react';
import LZString from 'lz-string';
import styles from './MigrationButton.module.css';

const MIGRATION_URL = 'https://shrisangrah.com/';

export default function MigrationButton() {
  const [error, setError] = useState('');

  const transferData = () => {
    try {
      const data = Object.create(null);

      for (let index = 0; index < window.localStorage.length; index += 1) {
        const key = window.localStorage.key(index);
        if (key !== null) {
          data[key] = window.localStorage.getItem(key);
        }
      }

      data.__appSignature = 'sangrah_secure_migration_2026';
      data.__timestamp = Date.now();

      const compressedData = LZString.compressToEncodedURIComponent(JSON.stringify(data));
      const migrationUrl = `${MIGRATION_URL}#migration_data=${compressedData}`;
      const androidIntentUrl =
        `${migrationUrl.replace(/^https:/, 'intent:')}#Intent;` +
        `scheme=https;package=com.android.chrome;` +
        `S.browser_fallback_url=${encodeURIComponent(migrationUrl)};end`;
      if (/Android/i.test(window.navigator.userAgent)) {
        window.location.assign(androidIntentUrl);
        return;
      }

      const link = document.createElement('a');
      link.href = migrationUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (transferError) {
      console.error('Unable to prepare local data for migration.', transferError);
      setError('डेटा वाचता आला नाही. कृपया सेटिंग्जमधील डेटा निर्यात पर्याय वापरा.');
    }
  };

  return (
    <aside className={styles.migrationCard} aria-labelledby="migration-title">
      <div>
        <h2 id="migration-title">🔔 महत्त्वाची सूचना: 'संग्रह' नव्या पत्त्यावर!</h2>
        <p>
         नमस्कार,

आपल्या दैनंदिन साधनेचे हक्काचे व्यासपीठ असणारे 'संपूर्ण संग्रह' आता अधिक सक्षम आणि स्वतंत्र होत आहे.
एक महत्त्वाची आणि आनंदाची बाब म्हणजे, हे ॲप आपल्या सर्वांसाठी नेहमीप्रमाणेच कायमस्वरूपी पूर्णपणे मोफत राहील आणि यात कोणत्याही प्रकारच्या जाहिराती (Ads) नसतील. हे ॲप केवळ आणि केवळ आपल्या साधनेसाठीच समर्पित आहे.

१ डिसेंबर २०२६ पासून, sangrah.justinclicks.com ऐवजी <a href="https://shrisangrah.com" target="_blank" rel="noopener noreferrer">shrisangrah.com</a> हा आपला नवीन अधिकृत पत्ता असेल. जुने संकेतस्थळ १ डिसेंबरपासून उपलब्ध राहणार नाही.

तुमची जपमाळेची संख्या, आवडते स्तोत्र (Bookmarks) आणि इतर जतन केलेला डेटा अत्यंत सुरक्षितपणे नव्या पत्त्यावर नेण्यासाठी आम्ही प्रक्रिया अधिक सोपी केली आहे. तांत्रिक अडचणी टाळण्यासाठी आधीचा मोठा डेटा-हस्तांतरण दुवा (Link) आता संक्षिप्त केला आहे.
        </p>
       
        {error && <p className={styles.error} role="alert">{error}</p>}
      </div>
      <button className={styles.migrationButton} onClick={transferData} type="button">
        माझा डेटा ट्रान्सफर करा
      </button>
    </aside>
  );
}
