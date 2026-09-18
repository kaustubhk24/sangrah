import { getPanchangam, Observer, nakshatraNames, getPlanetaryPosition } from '@ishubhamx/panchangam-js';

const nakshatraLabels = {
  Ashwini: 'अश्विनी', Bharani: 'भरणी', Krittika: 'कृत्तिका', Rohini: 'मृगशीर्ष',
  Mrigashira: 'मृगशीर्ष', Ardra: 'आर्द्रा', Punarvasu: 'पुनर्वसु', Pushya: 'पुष्य',
  Magha: 'मघा', Ashlesha: 'आश्लेषा', PurvaPhalguni: 'पूर्वा फाल्गुनी',
  UttaraPhalguni: 'उत्तरा फाल्गुनी', Hasta: 'हस्त', Chitra: 'चित्रा', Swati: 'स्वाती',
  Vishakha: 'विशाखा', Anuradha: 'अनुराधा', Mula: 'मूळ', PurvaAshadha: 'पूर्वाषाढा',
  UttaraAshadha: 'उत्तराषाढा', Shravana: 'श्रवण', Dhanishta: 'धनिष्ठा',
  Shatabhisha: 'शततारका', PurvaBhadrapada: 'पूर्वा भाद्रपदा',
  UttaraBhadrapada: 'उत्तराभाद्रपदा', Revati: 'रेवती',
};

const calculationTypes = [
  { key: 'purchase', nakshatras: ['Ashwini', 'Chitra', 'Swati', 'Shravana', 'Shatabhisha', 'Revati'] },
  { key: 'sell', nakshatras: ['Bharani', 'Krittika', 'Ashlesha', 'PurvaPhalguni', 'Vishakha', 'PurvaAshadha', 'PurvaBhadrapada'] },
  {
    key: 'kuparambha',
    nakshatras: ['Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Magha', 'UttaraPhalguni', 'UttaraAshadha', 'UttaraBhadrapada', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Revati'],
  },
  {
    key: 'vastushanti',
    nakshatras: ['Ashwini', 'Rohini', 'Mrigashira', 'Punarvasu', 'Pushya', 'UttaraPhalguni', 'UttaraAshadha', 'UttaraBhadrapada', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Mula', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Revati'],
    months: ['Vaishakha', 'Jyeshtha', 'Shravana', 'Kartika', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna'],
    tithis: [0, 3, 8, 13, 29],
    allowedWeekdays: [1, 3, 4, 5, 6],
    requirement: 'कलश किंवा वृषभ चक्र आवश्यक',
  },
];

const MAX_RESULTS_CACHE_ENTRIES = 6;
const resultsCache = new Map();
const getDateKey = (date, timeZone) => {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(date).reduce((values, part) => ({ ...values, [part.type]: part.value }), {});
  return `${parts.year}-${parts.month}-${parts.day}`;
};
const formatDate = (date, timeZone) => new Intl.DateTimeFormat('mr-IN', { timeZone, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
const formatTime = (date, timeZone) => new Intl.DateTimeFormat('mr-IN', { timeZone, hour: 'numeric', minute: '2-digit' }).format(date);
const addDays = (date, days) => { const next = new Date(date); next.setDate(next.getDate() + days); return next; };
const getEntryStart = (entries, index, firstStart) => entries[index].startTime || (index === 0 ? firstStart : entries[index - 1].endTime);
const getNakshatraKey = (entry) => {
  const name = nakshatraNames?.[entry.index] || entry.name || '';
  return Object.keys(nakshatraLabels).find((key) => key.toLowerCase() === String(name).replace(/\s/g, '').toLowerCase()) || name;
};
const getAngularDistance = (firstLongitude, secondLongitude) => {
  const distance = Math.abs(firstLongitude - secondLongitude) % 360;
  return Math.min(distance, 360 - distance);
};
const isGuruShukraAsta = (date, ayanamsa) => {
  const sun = getPlanetaryPosition('Sun', date, ayanamsa).longitude;
  const guru = getPlanetaryPosition('Jupiter', date, ayanamsa).longitude;
  const shukra = getPlanetaryPosition('Venus', date, ayanamsa).longitude;
  return getAngularDistance(sun, guru) <= 11 || getAngularDistance(sun, shukra) <= 10;
};

const calculateResults = (year, location, selectedType) => {
  const cacheKey = `${year}:${location.lat}:${location.lon}:${selectedType}`;
  if (resultsCache.has(cacheKey)) {
    const cachedResults = resultsCache.get(cacheKey);
    resultsCache.delete(cacheKey);
    resultsCache.set(cacheKey, cachedResults);
    return cachedResults;
  }
  const observer = new Observer(location.lat, location.lon, 0);
  const timezone = 'Asia/Kolkata';
  const calculationType = calculationTypes.find(({ key }) => key === selectedType);
  if (!calculationType) return {};
  const nextResults = { [selectedType]: [] };
  let date = new Date(`${year}-01-01T12:00:00`);

  for (let day = 0; day < 366 && date.getFullYear() === year; day += 1) {
    const panchang = getPanchangam(date, observer, { timezoneOffset: 330, calendarType: 'amanta' });
    (panchang.nakshatras || []).forEach((entry, index, entries) => {
      const start = getEntryStart(entries, index, panchang.nakshatraStartTime);
      const end = entry.endTime;
      const key = getNakshatraKey(entry);
      const dateKey = getDateKey(start, timezone);
      if (!dateKey.startsWith(String(year))) return;
      const item = { key: `${key}-${start.toISOString()}`, dateKey, date: formatDate(start, timezone), start: formatTime(start, timezone), end: formatTime(end, timezone), nakshatra: nakshatraLabels[key] || key };
      const matchesNakshatra = calculationType.nakshatras.includes(key);
      const matchesMonth = !calculationType.months || calculationType.months.includes(panchang.masa?.name);
      const matchesTithi = !calculationType.tithis || (panchang.tithis || []).some((tithi) => calculationType.tithis.includes(tithi.index));
      const matchesWeekday = !calculationType.allowedWeekdays || calculationType.allowedWeekdays.includes(panchang.vara);
      if (matchesNakshatra && matchesMonth && matchesTithi && matchesWeekday) {
        const isAsta = calculationType.key === 'vastushanti' && isGuruShukraAsta(new Date((start.getTime() + end.getTime()) / 2), panchang.ayanamsa);
        nextResults[selectedType].push({ ...item, requirement: calculationType.requirement, isAsta });
      }
    });
    date = addDays(date, 1);
  }
  const results = { [selectedType]: nextResults[selectedType].sort((first, second) => first.dateKey.localeCompare(second.dateKey)) };
  if (resultsCache.size >= MAX_RESULTS_CACHE_ENTRIES) {
    resultsCache.delete(resultsCache.keys().next().value);
  }
  resultsCache.set(cacheKey, results);
  return results;
};

self.onmessage = (event) => {
  const { requestId, year, location, selectedType } = event.data;
  try {
    const currentResults = calculateResults(year, location, selectedType);
    const nextYearResults = selectedType === 'vastushanti' && !currentResults.vastushanti.length
      ? calculateResults(year + 1, location, selectedType)
      : null;
    self.postMessage({ requestId, currentResults, nextYearResults });
  } catch (error) {
    self.postMessage({ requestId, error: error instanceof Error ? error.message : String(error) });
  }
};
