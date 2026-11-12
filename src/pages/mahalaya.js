import React, { useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import { getPanchangam, getPitruPakshaInfo, Observer, tithiNames } from '@ishubhamx/panchangam-js';
import styles from './mahalaya.module.css';

const observer = new Observer(18.5204, 73.8567, 10);
const timezoneOffset = 330;
const timezone = 'Asia/Kolkata';
const calendarType = 'amanta';

const labels = {
  mr: {
    title: 'महालया आणि पितृपक्ष',
    subtitle: 'महाराष्ट्र  पंचांगानुसार पितृपक्षातील श्राद्ध तिथी',
    year: 'वर्ष निवडा',
    location: 'पुणे, महाराष्ट्र',
    rule: 'श्राद्धाची तारीख त्या दिवशीच्या अपराह्न काळात असलेल्या तिथीनुसार ठरवली आहे. त्यामुळे क्षय तिथी स्वतंत्र दिवस म्हणून न दाखवता मागील उपलब्ध श्राद्ध तिथीसोबत दाखवली जाते आणि वृद्धी तिथी असल्यास दोन्ही दिवस दाखवले जातात.',
    date: 'दिनांक',
    tithi: 'तिथी',
    observance: 'श्राद्ध',
    bharaniShraddha: 'भरणी श्राद्ध',
    start: 'महालया आरंभ',
    end: 'सर्वपितृ दर्श अमावस्या',
    loading: 'माहिती तयार होत आहे...',
    supplemental2026: '२०२६ साठी पूरक नोंदी',
    purnimaMahalaya: 'पौर्णिमा महालयासाठी',
    chooseOneDate: 'यांपैकी कोणताही एक दिवस निवडा.',
    avidhavaNavami: 'अविधवा नवमी',
    navamiRuleConfirmed: '',
  },
  
  
};

const tithiLabels = {
  mr: ['', 'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पौर्णिमा', 'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'अमावस्या'],
  
  
};

const getTithiLabel = (tithi) => tithiLabels.mr[tithi] || tithiNames?.[tithi - 1] || '';

const getLabel = (key) => labels.mr[key];

const createIndiaDate = (year, month, day) => (
  new Date(Date.UTC(year, month, day, 12, 0))
);

const purnimaMahalayaDates2026 = [
  createIndiaDate(2026, 8, 29),
  createIndiaDate(2026, 9, 2),
  createIndiaDate(2026, 9, 3),
  createIndiaDate(2026, 9, 7),
  createIndiaDate(2026, 9, 10),
];
const avidhavaNavamiDate2026 = createIndiaDate(2026, 9, 4);

const formatDate = (date) => new Intl.DateTimeFormat(
  'mr-IN',
  { day: 'numeric', month: 'short', timeZone: timezone }
).format(date);

const shraddhaNames = {
  mr: {
    16: 'प्रतिपदा श्राद्ध', 17: 'द्वितीया श्राद्ध', 18: 'तृतीया श्राद्ध', 19: 'चतुर्थी श्राद्ध', 20: 'पंचमी श्राद्ध',
    21: 'षष्ठी श्राद्ध', 22: 'सप्तमी श्राद्ध', 23: 'अष्टमी श्राद्ध', 24: 'नवमी श्राद्ध',
    25: 'दशमी श्राद्ध', 26: 'एकादशी श्राद्ध', 27: 'द्वादशी श्राद्ध', 28: 'त्रयोदशी श्राद्ध',
    29: 'चतुर्दशी श्राद्ध', 30: 'सर्वपितृ दर्श अमावस्या',
  },
  
  
};

const getAparahnaTithi = (panchang) => {
  if (!panchang.sunrise || !panchang.sunset) return panchang.tithi;

  const aparahnaStart = panchang.sunrise.getTime() + ((panchang.sunset.getTime() - panchang.sunrise.getTime()) * 3) / 5;
  const transition = (panchang.tithis || []).find((entry) => (
    entry.startTime.getTime() <= aparahnaStart && aparahnaStart < entry.endTime.getTime()
  ));
  return transition?.index ?? panchang.tithi;
};

const getPitruDates = (year) => {
  const dates = [];
  const start = new Date(Date.UTC(year, 8, 1));
  const end = new Date(Date.UTC(year, 10, 15));

  for (const cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    const date = createIndiaDate(year, cursor.getUTCMonth(), cursor.getUTCDate());
    const panchang = getPanchangam(date, observer, { timezoneOffset, calendarType });
    const tithi = getAparahnaTithi(panchang);
    const aparahnaStart = panchang.sunrise && panchang.sunset
      ? panchang.sunrise.getTime() + ((panchang.sunset.getTime() - panchang.sunrise.getTime()) * 3) / 5
      : null;
    const nakshatra = aparahnaStart === null
      ? null
      : (panchang.nakshatras || []).find((entry) => (
        entry.startTime.getTime() <= aparahnaStart && aparahnaStart < entry.endTime.getTime()
      ));
    const info = getPitruPakshaInfo(panchang.masa.index, panchang.paksha, tithi + 1, false);

    if (info) {
      dates.push({
        date,
        tithi,
        info,
        tithiNumber: tithi + 1,
        observanceTithis: [tithi + 1],
        hasBharaniShraddha: nakshatra?.index === 1,
      });
    }
  }

  const observedTithis = new Set(dates.map((entry) => entry.tithiNumber));
  const missingTithis = Array.from({ length: 14 }, (_, index) => index + 16)
    .filter((tithiNumber) => !observedTithis.has(tithiNumber));

  return dates.map((entry) => ({
    ...entry,
    observanceTithis: [
      ...entry.observanceTithis,
      ...missingTithis.filter((tithiNumber) => tithiNumber === entry.tithiNumber + 1),
    ],
  }));
};

export default function MahalayaPage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const yearOptions = Array.from({ length: 5 }, (_, index) => currentYear - 2 + index);
  const dates = useMemo(() => getPitruDates(selectedYear), [selectedYear]);

  return (
    <Layout title={getLabel('title')}>
      <main className={styles.page}>
        <section className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{getLabel('location')}</p>
            <h1>{getLabel('title')}</h1>
            <p>{getLabel('subtitle')}</p>
          </div>
          <label className={styles.yearControl}>
            <span>{getLabel('year')}</span>
            <select value={selectedYear} onChange={(event) => setSelectedYear(Number(event.target.value))}>
              {yearOptions.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </label>
        </section>

        <p className={styles.rule}>{getLabel('rule')}</p>

        {selectedYear === 2026 && (
          <p className={styles.rule}>
            <strong>{getLabel('supplemental2026')}</strong><br />
            {getLabel('purnimaMahalaya')}: {purnimaMahalayaDates2026.map((date) => formatDate(date)).join(', ')}. {getLabel('chooseOneDate')}<br />
            {getLabel('avidhavaNavami')}: {formatDate(avidhavaNavamiDate2026)}. {getLabel('navamiRuleConfirmed')}
          </p>
        )}

        <section className={styles.schedule} aria-label={getLabel('title')}>
          <div className={styles.scheduleHeader}>
            <span>{getLabel('date')}</span>
            <span>{getLabel('tithi')}</span>
            <span>{getLabel('observance')}</span>
          </div>
          {dates.map((entry, index) => (
            <div className={styles.row} key={`${entry.date.toISOString()}-${entry.tithi}`}>
              <time dateTime={entry.date.toISOString().slice(0, 10)}>{formatDate(entry.date)}</time>
              <span>{getTithiLabel(entry.tithiNumber)}</span>
              <span>
                {index === 0 && <b>{getLabel('start')} · </b>}
                {entry.observanceTithis.map((tithiNumber) => (
                  shraddhaNames.mr[tithiNumber]
                )).join(' / ')}
                {entry.hasBharaniShraddha && (
                  <> / {getLabel('bharaniShraddha')}</>
                )}
                {index === dates.length - 1 && <b> · {getLabel('end')}</b>}
              </span>
            </div>
          ))}
        </section>
      </main>
    </Layout>
  );
}
