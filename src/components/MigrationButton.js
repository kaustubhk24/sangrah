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
      window.open(migrationUrl, '_blank', 'noopener,noreferrer');
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

१ डिसेंबर २०२६ पासून, sangrah.justinclicks.com ऐवजी shrisangrah.com हा आपला नवीन अधिकृत पत्ता असेल. जुने संकेतस्थळ १ डिसेंबरपासून उपलब्ध राहणार नाही.

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
