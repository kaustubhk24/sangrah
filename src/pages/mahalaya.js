import React, { useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import { getPanchangam, getPitruPakshaInfo, Observer, tithiNames } from '@ishubhamx/panchangam-js';
import { useTranslation } from '../utils/translations';
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
  },
  hi: {
    title: 'महालय और पितृपक्ष',
    subtitle: 'महाराष्ट्र  पंचांग के अनुसार पितृपक्ष श्राद्ध तिथियां',
    year: 'वर्ष चुनें',
    location: 'पुणे, महाराष्ट्र',
    rule: 'श्राद्ध की तारीख उस दिन के अपराह्न में चल रही तिथि से निर्धारित होती है। क्षय तिथि को अलग दिन के रूप में न दिखाकर पिछली उपलब्ध श्राद्ध तिथि के साथ दिखाया जाता है और वृद्धि तिथि होने पर दोनों दिन दिखाए जाते हैं।',
    date: 'दिनांक',
    tithi: 'तिथि',
    observance: 'श्राद्ध',
    bharaniShraddha: 'भरणी श्राद्ध',
    start: 'महालयारंभ',
    end: 'सर्वपितृ दर्श अमावस्या',
    loading: 'जानकारी तैयार हो रही है...',
  },
  en: {
    title: 'Mahalaya and Pitru Paksha',
    subtitle: 'Pitru Paksha Shraddha dates using the Maharashtra Amanta calendar',
    year: 'Select year',
    location: 'Pune, Maharashtra',
    rule: 'Shraddha is assigned to the tithi prevailing during the afternoon (aparahna). A kshaya tithi is therefore shown with the previous available Shraddha date instead of receiving a separate row, while a vriddhi tithi remains on both observed dates.',
    date: 'Date',
    tithi: 'Tithi',
    observance: 'Shraddha',
    bharaniShraddha: 'Bharani Shraddha',
    start: 'Mahalaya Arambh',
    end: 'Sarvapitri Darsha Amavasya',
    loading: 'Preparing dates...',
  },
};

const tithiLabels = {
  mr: ['', 'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पौर्णिमा', 'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'अमावस्या'],
  hi: ['', 'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा', 'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'अमावस्या'],
  en: ['', 'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima', 'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'],
};

const normalizeLanguage = (lang) => (lang || 'mr').split('-')[0];
const getTithiLabel = (tithi, lang) => {
  const activeLang = normalizeLanguage(lang);
  return tithiLabels[activeLang]?.[tithi] || tithiLabels.mr[tithi] || tithiNames?.[tithi - 1] || '';
};

const getLabel = (lang, key) => labels[normalizeLanguage(lang)]?.[key] || labels.mr[key];

const createIndiaDate = (year, month, day) => (
  new Date(Date.UTC(year, month, day, 12, 0))
);

const formatDate = (date, lang) => new Intl.DateTimeFormat(
  lang === 'hi' ? 'hi-IN' : lang === 'en' ? 'en-IN' : 'mr-IN',
  { day: 'numeric', month: 'short', timeZone: timezone }
).format(date);

const shraddhaNames = {
  mr: {
    16: 'प्रतिपदा श्राद्ध', 17: 'द्वितीया श्राद्ध', 18: 'तृतीया श्राद्ध', 19: 'चतुर्थी श्राद्ध', 20: 'पंचमी श्राद्ध',
    21: 'षष्ठी श्राद्ध', 22: 'सप्तमी श्राद्ध', 23: 'अष्टमी श्राद्ध', 24: 'नवमी श्राद्ध',
    25: 'दशमी श्राद्ध', 26: 'एकादशी श्राद्ध', 27: 'द्वादशी श्राद्ध', 28: 'त्रयोदशी श्राद्ध',
    29: 'चतुर्दशी श्राद्ध', 30: 'सर्वपितृ दर्श अमावस्या',
  },
  hi: {
    16: 'प्रतिपदा श्राद्ध', 17: 'द्वितीया श्राद्ध', 18: 'तृतीया श्राद्ध', 19: 'चतुर्थी श्राद्ध', 20: 'पंचमी श्राद्ध',
    21: 'षष्ठी श्राद्ध', 22: 'सप्तमी श्राद्ध', 23: 'अष्टमी श्राद्ध', 24: 'नवमी श्राद्ध',
    25: 'दशमी श्राद्ध', 26: 'एकादशी श्राद्ध', 27: 'द्वादशी श्राद्ध', 28: 'त्रयोदशी श्राद्ध',
    29: 'चतुर्दशी श्राद्ध', 30: 'सर्वपितृ दर्श अमावस्या',
  },
  en: {
    16: 'Pratipada Shraddha', 17: 'Dwitiya Shraddha', 18: 'Tritiya Shraddha', 19: 'Chaturthi Shraddha', 20: 'Panchami Shraddha',
    21: 'Shashthi Shraddha', 22: 'Saptami Shraddha', 23: 'Ashtami Shraddha', 24: 'Navami Shraddha',
    25: 'Dashami Shraddha', 26: 'Ekadashi Shraddha', 27: 'Dwadashi Shraddha', 28: 'Trayodashi Shraddha',
    29: 'Chaturdashi Shraddha', 30: 'Sarvapitri Darsha Amavasya',
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
  const { lang } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const yearOptions = Array.from({ length: 5 }, (_, index) => currentYear - 2 + index);
  const dates = useMemo(() => getPitruDates(selectedYear), [selectedYear]);

  return (
    <Layout title={getLabel(lang, 'title')}>
      <main className={styles.page}>
        <section className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{getLabel(lang, 'location')}</p>
            <h1>{getLabel(lang, 'title')}</h1>
            <p>{getLabel(lang, 'subtitle')}</p>
          </div>
          <label className={styles.yearControl}>
            <span>{getLabel(lang, 'year')}</span>
            <select value={selectedYear} onChange={(event) => setSelectedYear(Number(event.target.value))}>
              {yearOptions.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </label>
        </section>

        <p className={styles.rule}>{getLabel(lang, 'rule')}</p>

        <section className={styles.schedule} aria-label={getLabel(lang, 'title')}>
          <div className={styles.scheduleHeader}>
            <span>{getLabel(lang, 'date')}</span>
            <span>{getLabel(lang, 'tithi')}</span>
            <span>{getLabel(lang, 'observance')}</span>
          </div>
          {dates.map((entry, index) => (
            <div className={styles.row} key={`${entry.date.toISOString()}-${entry.tithi}`}>
              <time dateTime={entry.date.toISOString().slice(0, 10)}>{formatDate(entry.date, lang)}</time>
              <span>{getTithiLabel(entry.tithiNumber, lang)}</span>
              <span>
                {index === 0 && <b>{getLabel(lang, 'start')} · </b>}
                {entry.observanceTithis.map((tithiNumber) => (
                  shraddhaNames[normalizeLanguage(lang)]?.[tithiNumber] || shraddhaNames.mr[tithiNumber]
                )).join(' / ')}
                {entry.hasBharaniShraddha && (
                  <> / {getLabel(lang, 'bharaniShraddha')}</>
                )}
                {index === dates.length - 1 && <b> · {getLabel(lang, 'end')}</b>}
              </span>
            </div>
          ))}
        </section>
      </main>
    </Layout>
  );
}
