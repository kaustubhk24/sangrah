import React, { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import { getPanchangam, Observer } from '@ishubhamx/panchangam-js';
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

const rashiLabels = {
  Aries: 'मेष',
  Taurus: 'वृषभ',
  Gemini: 'मिथुन',
  Cancer: 'कर्क',
  Leo: 'सिंह',
  Virgo: 'कन्या',
  Libra: 'तुला',
  Scorpio: 'वृश्चिक',
  Sagittarius: 'धनु',
  Capricorn: 'मकर',
  Aquarius: 'कुंभ',
  Pisces: 'मीन',
};

const chandraDishaGroups = [
  { rashis: ['Aries', 'Leo', 'Sagittarius'], label: 'मेष, सिंह, धनु', direction: 'पूर्व' },
  { rashis: ['Taurus', 'Capricorn', 'Virgo'], label: 'वृषभ, मकर, कन्या', direction: 'दक्षिण' },
  { rashis: ['Gemini', 'Libra', 'Aquarius'], label: 'मिथुन, तुला, कुंभ', direction: 'पश्चिम' },
  { rashis: ['Cancer', 'Scorpio', 'Pisces'], label: 'कर्क, वृश्चिक, मीन', direction: 'उत्तर' },
];

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
    chandraDisha: [
      ['मेष, सिंह, धनु', 'पूर्व'],
      ['वृषभ, मकर, कन्या', 'दक्षिण'],
      ['मिथुन, तुला, कुंभ', 'पश्चिम'],
      ['कर्क, वृश्चिक, मीन', 'उत्तर'],
    ],
    chandraDishaNote: 'चंद्र समोर किंवा उजव्या बाजूला असावा. पाठीमागे किंवा डाव्या बाजूला असल्यास प्राणसंकट व धनक्षय होतो.',
  },
  {
    key: 'chandraDisha',
    label: 'चंद्र दिशा',
    title: 'चंद्र दिशा',
    rule: 'राशीप्रमाणे चंद्राची दिशा तपासा.',
    logic: 'चंद्र समोर किंवा उजव्या बाजूला असावा. पाठीमागे किंवा डाव्या बाजूला असल्यास प्राणसंकट व धनक्षय होतो.',
    informational: true,
    chandraDisha: [
      ['मेष, सिंह, धनु', 'पूर्व'],
      ['वृषभ, मकर, कन्या', 'दक्षिण'],
      ['मिथुन, तुला, कुंभ', 'पश्चिम'],
      ['कर्क, वृश्चिक, मीन', 'उत्तर'],
    ],
    chandraDishaNote: 'चंद्र समोर किंवा उजव्या बाजूला असावा. पाठीमागे किंवा डाव्या बाजूला असल्यास प्राणसंकट व धनक्षय होतो.',
    nakshatras: [],
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

const getCurrentChandraDisha = (location) => {
  const observer = new Observer(location.lat, location.lon, 0);
  const panchang = getPanchangam(new Date(), observer, { timezoneOffset: 330, calendarType: 'amanta' });
  const now = new Date();
  const currentRashi = (panchang.rashis || []).find((entry, index, entries) => {
    const start = getEntryStart(entries, index, panchang.rashiStartTime);
    return start.getTime() <= now.getTime() && now.getTime() < entry.endTime.getTime();
  }) || panchang.rashis?.[0];
  const rashi = currentRashi?.name || panchang.moonRashi?.name || '';
  const group = chandraDishaGroups.find(({ rashis }) => rashis.includes(rashi));
  return { rashi: rashiLabels[rashi] || rashi, direction: group?.direction || '' };
};

const getEntryStart = (entries, index, firstStart) => (
  entries[index].startTime || (index === 0 ? firstStart : entries[index - 1].endTime)
);

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
  const [showNextYearVastu, setShowNextYearVastu] = useState(false);
  const location = locations[locationId];
  const currentChandraDisha = useMemo(() => getCurrentChandraDisha(location), [location]);
  const workerRef = useRef(null);
  const requestIdRef = useRef(0);
  const [workerReady, setWorkerReady] = useState(false);

  useEffect(() => {
    const worker = new Worker(new URL('../workers/muhurt.worker.js', import.meta.url));
    workerRef.current = worker;
    setWorkerReady(true);

    return () => {
      worker.terminate();
      workerRef.current = null;
      setWorkerReady(false);
    };
  }, []);

  useEffect(() => {
    if (!workerReady || !workerRef.current) return undefined;

    if (selectedType === 'chandraDisha') {
      setLoading(false);
      return undefined;
    }

    const worker = workerRef.current;
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setLoading(true);
    setPageStart(0);
    worker.onmessage = (event) => {
      if (event.data.requestId !== requestId) return;
      if (event.data.error) {
        setLoading(false);
        return;
      }
      const { currentResults, nextYearResults } = event.data;
      const sortedResults = {
        ...currentResults,
        vastushanti: nextYearResults?.vastushanti || currentResults.vastushanti,
      };

      setResults(sortedResults);
      setShowNextYearVastu(Boolean(nextYearResults?.vastushanti.length));
      setPageStart(getStartingPage(sortedResults[selectedType], year));
      setLoading(false);
    };
    worker.onerror = () => setLoading(false);
    worker.postMessage({
      requestId,
      year,
      location: { lat: location.lat, lon: location.lon },
      includeNextYear: selectedType === 'vastushanti',
    });

    return () => {
      worker.onmessage = null;
      worker.onerror = null;
    };
  }, [location, selectedType, year, workerReady]);

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
              {selectedType === 'vastushanti' && showNextYearVastu && (
                <p className={styles.note}>या वर्षी वास्तुशांतीचा मुहूर्त नसल्यामुळे पुढील वर्षाचे मुहूर्त दाखवत आहोत.</p>
              )}

            <div className={styles.columns}>
              <section className={styles.listSection}>
                <h2>{selectedDefinition.title}</h2>
                <p className={styles.rule}>{selectedDefinition.rule}</p>
                {selectedDefinition.monthsLabel && <p className={styles.rule}><strong>महिने:</strong> {selectedDefinition.monthsLabel}</p>}
                <p className={styles.logic}><strong>कसा ठरवला जातो:</strong> {selectedDefinition.logic}</p>
                {selectedDefinition.requirement && <p className={styles.requirement}>{selectedDefinition.requirement}</p>}
                {selectedDefinition.chandraDisha && <div className={styles.chandraDisha}>
                  <strong>चंद्र दिशा:</strong>
                  {selectedDefinition.informational && <p className={styles.currentChandraDisha}>
                    सध्याची चंद्र रास: <b>{currentChandraDisha.rashi || 'उपलब्ध नाही'}</b>
                    {currentChandraDisha.direction && <> | दिशा: <b>{currentChandraDisha.direction}</b></>}
                  </p>}
                  <div className={styles.chandraDishaGrid}>
                    {selectedDefinition.chandraDisha.map(([rashis, direction]) => <span key={direction}><b>{rashis}</b> - {direction}</span>)}
                  </div>
                  <p>{selectedDefinition.chandraDishaNote}</p>
                </div>}
                {!selectedDefinition.informational && renderList(visibleItems, showNextYearVastu ? `या वर्षासाठी किंवा पुढील वर्षासाठी ${selectedDefinition.label}चा मुहूर्त सापडला नाही.` : `या वर्षासाठी ${selectedDefinition.label}चा मुहूर्त सापडला नाही.`)}
                {selectedDefinition.informational && <p className={styles.note}>चंद्र दिशा पाहण्यासाठी खालील राशीचा संदर्भ घ्या.</p>}
                {!selectedDefinition.informational && selectedItems.length > 5 && <div className={styles.pagination}>
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