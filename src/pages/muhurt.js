import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import { getPanchangam, Observer, nakshatraNames, getPlanetaryPosition } from '@ishubhamx/panchangam-js';
import styles from './muhurt.module.css';

const nakshatraLabels = {
  Ashwini: 'अश्विनी',
  Bharani: 'भरणी',
  Krittika: 'कृत्तिका',
  Rohini: 'रोहिणी',
  Mrigashira: 'मृगशीर्ष',
  Ardra: 'आर्द्रा',
  Punarvasu: 'पुनर्वसु',
  Pushya: 'पुष्य',
  Magha: 'मघा',
  Ashlesha: 'आश्लेषा',
  PurvaPhalguni: 'पूर्वा फाल्गुनी',
  UttaraPhalguni: 'उत्तरा फाल्गुनी',
  Hasta: 'हस्त',
  Chitra: 'चित्रा',
  Swati: 'स्वाती',
  Vishakha: 'विशाखा',
  Anuradha: 'अनुराधा',
  Mula: 'मूळ',
  PurvaAshadha: 'पूर्वाषाढा',
  UttaraAshadha: 'उत्तराषाढा',
  Shravana: 'श्रवण',
  Dhanishta: 'धनिष्ठा',
  Shatabhisha: 'शततारका',
  PurvaBhadrapada: 'पूर्वा भाद्रपदा',
  UttaraBhadrapada: 'उत्तरा भाद्रपदा',
  Revati: 'रेवती',
};

const muhurtTypes = [
  {
    key: 'purchase',
    label: 'खरेदी',
    title: 'खरेदीसाठी',
    rule: 'अश्विनी, चित्रा, स्वाती, श्रवण, शततारका, रेवती',
    logic: 'या नक्षत्रांपैकी कोणतेही नक्षत्र सुरू असलेला वेळ खरेदीसाठी दाखवला जातो.',
    nakshatras: ['Ashwini', 'Chitra', 'Swati', 'Shravana', 'Shatabhisha', 'Revati'],
  },
  {
    key: 'sell',
    label: 'विक्री',
    title: 'विक्रीसाठी',
    rule: 'भरणी, कृत्तिका, आश्लेषा, पूर्वा, विशाखा, पूर्वाषाढा, पूर्वा भाद्रपदा',
    logic: 'या नक्षत्रांपैकी कोणतेही नक्षत्र सुरू असलेला वेळ विक्रीसाठी दाखवला जातो.',
    nakshatras: ['Bharani', 'Krittika', 'Ashlesha', 'PurvaPhalguni', 'Vishakha', 'PurvaAshadha', 'PurvaBhadrapada'],
  },
  {
    key: 'kuparambha',
    label: 'कूपारंभ',
    title: 'कूपारंभ मुहूर्त',
    rule: 'रोहिणी, मृगशीर्ष, आर्द्रा, पुनर्वसु, पुष्य, मघा, उत्तरा त्रयी, हस्त, चित्रा, स्वाती, अनुराधा, श्रवण, धनिष्ठा, शततारका, रेवती',
    logic: 'दिलेल्या नक्षत्रांपैकी एखादे नक्षत्र सुरू असेल, तो कालावधी कूपारंभासाठी दाखवला जातो.',
    nakshatras: [
      'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Magha',
      'UttaraPhalguni', 'UttaraAshadha', 'UttaraBhadrapada', 'Hasta',
      'Chitra', 'Swati', 'Anuradha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Revati',
    ],
  },
  {
    key: 'vastushanti',
    label: 'वास्तुशांती',
    title: 'वास्तुशांती मुहूर्त',
    monthsLabel: 'वैशाख, ज्येष्ठ, श्रावण, कार्तिक, मार्गशीर्ष, पौष, माघ, फाल्गुन',
    rule: 'अश्विनी, रोहिणी, मृगशीर्ष, पुनर्वसु, पुष्य, उत्तरा त्रयी, हस्त, चित्रा, स्वाती, अनुराधा, मूळ, श्रवण, धनिष्ठा, शततारका, रेवती',
    logic: 'दिलेल्या महिन्यांपैकी महिना आणि दिलेल्या तिथींपैकी तिथी असणे आवश्यक आहे. रविवार व मंगळवार वगळून इतर वारांमध्ये, दिलेल्या नक्षत्रांपैकी एक नक्षत्र सुरू असेल तेव्हाच वेळ दाखवला जातो.',
    nakshatras: [
      'Ashwini', 'Rohini', 'Mrigashira', 'Punarvasu', 'Pushya',
      'UttaraPhalguni', 'UttaraAshadha', 'UttaraBhadrapada', 'Hasta',
      'Chitra', 'Swati', 'Anuradha', 'Mula', 'Shravana', 'Dhanishta',
      'Shatabhisha', 'Revati',
    ],
    months: ['Vaishakha', 'Jyeshtha', 'Shravana', 'Kartika', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna'],
    tithis: [0, 3, 8, 13, 29],
    allowedWeekdays: [1, 3, 4, 5, 6],
    requirement: 'कलश किंवा वृषभ चक्र आवश्यक',
  },
];
const emptyResults = Object.fromEntries(muhurtTypes.map(({ key }) => [key, []]));
const locations = {
  pune: { label: 'पुणे, भारत', lat: 18.5204, lon: 73.8567 },
  mumbai: { label: 'मुंबई, भारत', lat: 19.076, lon: 72.8777 },
  nagpur: { label: 'नागपूर, भारत', lat: 21.1458, lon: 79.0882 },
};

const getDateKey = (date, timeZone) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date).reduce((values, part) => ({ ...values, [part.type]: part.value }), {});
  return `${parts.year}-${parts.month}-${parts.day}`;
};

const formatDate = (date, timeZone) => new Intl.DateTimeFormat('mr-IN', {
  timeZone,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(date);

const formatTime = (date, timeZone) => new Intl.DateTimeFormat('mr-IN', {
  timeZone,
  hour: 'numeric',
  minute: '2-digit',
}).format(date);

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const getEntryStart = (entries, index, firstStart) => (
  entries[index].startTime || (index === 0 ? firstStart : entries[index - 1].endTime)
);

const getNakshatraKey = (entry) => {
  const name = nakshatraNames?.[entry.index] || entry.name || '';
  return Object.keys(nakshatraLabels).find((key) => key.toLowerCase() === String(name).replace(/\s/g, '').toLowerCase()) || name;
};

const getAngularDistance = (firstLongitude, secondLongitude) => {
  const distance = Math.abs(firstLongitude - secondLongitude) % 360;
  return Math.min(distance, 360 - distance);
};

const GURU_ASTA_DEGREES = 11;
const SHUKRA_ASTA_DEGREES = 10;

const isGuruShukraAsta = (date, ayanamsa) => {
  const sun = getPlanetaryPosition('Sun', date, ayanamsa).longitude;
  const guru = getPlanetaryPosition('Jupiter', date, ayanamsa).longitude;
  const shukra = getPlanetaryPosition('Venus', date, ayanamsa).longitude;
  return getAngularDistance(sun, guru) <= GURU_ASTA_DEGREES || getAngularDistance(sun, shukra) <= SHUKRA_ASTA_DEGREES;
};

const getStartingPage = (items, year) => {
  if (year !== new Date().getFullYear()) return 0;
  const todayKey = getDateKey(new Date(), 'Asia/Kolkata');
  const firstUpcomingIndex = items.findIndex((item) => item.dateKey >= todayKey);
  return firstUpcomingIndex < 0 ? 0 : firstUpcomingIndex;
};

export default function MuhurtPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [locationId, setLocationId] = useState('pune');
  const [results, setResults] = useState(emptyResults);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('purchase');
  const [pageStart, setPageStart] = useState(0);
  const [excludeGuruShukraAsta, setExcludeGuruShukraAsta] = useState(false);
  const location = locations[locationId];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setPageStart(0);

    const calculationTimer = setTimeout(() => {
      const observer = new Observer(location.lat, location.lon, 0);
      const timezone = 'Asia/Kolkata';
      const nextResults = Object.fromEntries(muhurtTypes.map(({ key }) => [key, []]));
      let date = new Date(`${year}-01-01T12:00:00`);

      for (let day = 0; day < 366 && date.getFullYear() === year; day += 1) {
        const panchang = getPanchangam(date, observer, { timezoneOffset: 330, calendarType: 'amanta' });
        (panchang.nakshatras || []).forEach((entry, index, entries) => {
          const start = getEntryStart(entries, index, panchang.nakshatraStartTime);
          const end = entry.endTime;
          const key = getNakshatraKey(entry);
          const dateKey = getDateKey(start, timezone);
          if (dateKey.startsWith(String(year))) {
            const item = { key: `${key}-${start.toISOString()}`, dateKey, date: formatDate(start, timezone), start: formatTime(start, timezone), end: formatTime(end, timezone), nakshatra: nakshatraLabels[key] || key };
            muhurtTypes.forEach((type) => {
              const matchesNakshatra = type.nakshatras.includes(key);
              const matchesMonth = !type.months || type.months.includes(panchang.masa?.name);
              const matchesTithi = !type.tithis || (panchang.tithis || []).some((tithi) => type.tithis.includes(tithi.index));
              const matchesWeekday = !type.allowedWeekdays || type.allowedWeekdays.includes(panchang.vara);
                if (matchesNakshatra && matchesMonth && matchesTithi && matchesWeekday) {
                  const isAsta = type.key === 'vastushanti'
                    && isGuruShukraAsta(new Date((start.getTime() + end.getTime()) / 2), panchang.ayanamsa);
                  nextResults[type.key].push({ ...item, requirement: type.requirement, isAsta });
              }
            });
          }
        });
        date = addDays(date, 1);
      }

      if (!cancelled) {
        const sortedResults = Object.fromEntries(
          muhurtTypes.map(({ key }) => [key, nextResults[key].sort((first, second) => first.dateKey.localeCompare(second.dateKey))])
        );
        setResults(sortedResults);
        setPageStart(getStartingPage(sortedResults[selectedType], year));
        setLoading(false);
      }
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(calculationTimer);
    };
  }, [location, year]);

  const yearOptions = useMemo(() => [year - 1, year, year + 1], [year]);
  const selectedDefinition = muhurtTypes.find((type) => type.key === selectedType) || muhurtTypes[0];
  const selectedItems = (results[selectedType] || []).filter((item) => (
    selectedType !== 'vastushanti' || !excludeGuruShukraAsta || !item.isAsta
  ));
  const astaItems = results.vastushanti || [];
  const astaCount = astaItems.filter((item) => item.isAsta).length;
  const todayKey = getDateKey(new Date(), 'Asia/Kolkata');
  const upcomingAstaCount = astaItems.filter((item) => item.isAsta && item.dateKey >= todayKey).length;

  useEffect(() => {
    const nextItems = (results[selectedType] || []).filter((item) => (
      selectedType !== 'vastushanti' || !excludeGuruShukraAsta || !item.isAsta
    ));
    const nextPageStart = getStartingPage(nextItems, year);
    setPageStart((current) => current === nextPageStart ? current : nextPageStart);
  }, [results, selectedType, excludeGuruShukraAsta, year]);

  const visibleItems = selectedItems.slice(pageStart, pageStart + 5);
  const renderList = (items, emptyText) => (items.length ? items.map((item) => (
    <div className={styles.resultRow} key={item.key}>
      <div><strong>{item.date}</strong><span>{item.nakshatra}</span></div>
      <div className={styles.timeRange}><span>{item.start}</span><b> ते </b><span>{item.end}</span></div>
    </div>
  )) : <p className={styles.empty}>{emptyText}</p>);
  const handleTypeChange = (value) => {
    setSelectedType(value);
    setPageStart(getStartingPage(results[value] || [], year));
  };

  return (
    <Layout title="मुहूर्त">
      <main className={styles.pageWrapper}>
        <section className={styles.sectionCard}>
          <header className={styles.heroBlock}>
            <div>
              <p className={styles.eyebrow}>मुहूर्त</p>
              <h1>मुहूर्त</h1>
              <p className={styles.subtitle}>अनुकूल नक्षत्रांचे संपूर्ण वेळापत्रक</p>
                        <p className={styles.note}>हे सध्या तपासणीच्या टप्प्यावर आहे आणि त्यात चुकीची माहिती दिसू शकते.</p>

            </div>
            <div className={styles.controls}>
              <label>वर्ष<select value={year} onChange={(event) => setYear(Number(event.target.value))}>{yearOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
              <label>स्थान<select value={locationId} onChange={(event) => setLocationId(event.target.value)}>{Object.entries(locations).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}</select></label>
            </div>
          </header>

          {loading ? <div className={styles.loading} role="status" aria-live="polite"><span className={styles.loadingSpinner} aria-hidden="true" />मुहूर्ताची माहिती लोड होत आहे...</div> : (
            <>
              <div className={styles.selectionBar}>
                <label>मुहूर्त प्रकार
                  <select value={selectedType} onChange={(event) => handleTypeChange(event.target.value)}>
                    {muhurtTypes.map((type) => <option key={type.key} value={type.key}>{type.label}</option>)}
                  </select>
                </label>
                <span>{selectedItems.length ? `${pageStart + 1}-${Math.min(pageStart + 5, selectedItems.length)} / ${selectedItems.length}` : '० मुहूर्त'}</span>
              </div>
              {selectedType === 'vastushanti' && <label className={styles.astaCheckbox}>
                <input type="checkbox" checked={excludeGuruShukraAsta} onChange={(event) => {
                  setExcludeGuruShukraAsta(event.target.checked);
                }} />
                <span>गुरु आणि शुक्र अस्त असलेले वेळ टाळा ({astaCount} वेळा)</span>
              </label>}
              {selectedType === 'vastushanti' && excludeGuruShukraAsta && upcomingAstaCount === 0 && (
                <p className={styles.note}>आजपासून पुढे गुरु किंवा शुक्र अस्त असलेला मुहूर्त नाही.</p>
              )}

            <div className={styles.columns}>
              <section className={styles.listSection}>
                <h2>{selectedDefinition.title}</h2>
                <p className={styles.rule}>{selectedDefinition.rule}</p>
                {selectedDefinition.monthsLabel && <p className={styles.rule}><strong>महिने:</strong> {selectedDefinition.monthsLabel}</p>}
                <p className={styles.logic}><strong>कसा ठरवला जातो:</strong> {selectedDefinition.logic}</p>
                {selectedDefinition.requirement && <p className={styles.requirement}>{selectedDefinition.requirement}</p>}
                {renderList(visibleItems, `या वर्षासाठी ${selectedDefinition.label}चा मुहूर्त सापडला नाही.`)}
                {selectedItems.length > 5 && <div className={styles.pagination}>
                  <button type="button" onClick={() => setPageStart((current) => Math.max(0, current - 5))} disabled={pageStart === 0} aria-label="मागील पाच मुहूर्त">←</button>
                  <span>पुढील / मागील मुहूर्त</span>
                  <button type="button" onClick={() => setPageStart((current) => Math.min(selectedItems.length - 5, current + 5))} disabled={pageStart + 5 >= selectedItems.length} aria-label="पुढील पाच मुहूर्त">→</button>
                </div>}
              </section>
            </div>
            </>
          )}
          <p className={styles.note}>वेळा {location.label} येथील स्थानिक वेळेनुसार आहेत.</p>
        </section>
      </main>
    </Layout>
  );
}