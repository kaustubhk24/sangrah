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
      window.location.assign(`${MIGRATION_URL}#migration_data=${compressedData}`);
    } catch (transferError) {
      console.error('Unable to prepare local data for migration.', transferError);
      setError('डेटा वाचता आला नाही. कृपया सेटिंग्जमधील डेटा निर्यात पर्याय वापरा.');
    }
  };

  return (
    <aside className={styles.migrationCard} aria-labelledby="migration-title">
      <div>
        <h2 id="migration-title">आम्ही shrisangrah.com वर स्थलांतरित झालो आहोत!</h2>
        <p>
          १-१२-२०२६ पासून sangrah.justinclicks.com उपलब्ध राहणार नाही. आम्ही
          shrisangrah.com येथे स्थलांतरित होत आहोत.
        </p>
        <p>
          आधीचा डेटा-हस्तांतरण दुवा खूप मोठा होत असल्याने, आता तो संक्षिप्त केला आहे.
          तुमचा जतन केलेला डेटा नव्या संकेतस्थळावर नेण्यासाठी खालील बटण दाबा.
        </p>
        <p>
          नवीन संकेतस्थळावर गेल्यावर, कृपया जुन्या अॅपची स्थापना काढून टाका आणि
          shrisangrah.com वरील नवीन अॅप स्थापित करा.
        </p>
        {error && <p className={styles.error} role="alert">{error}</p>}
      </div>
      <button className={styles.migrationButton} onClick={transferData} type="button">
        माझा डेटा ट्रान्सफर करा
      </button>
    </aside>
  );
}
