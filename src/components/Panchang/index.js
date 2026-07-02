import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import { useTranslation } from '../../utils/translations';
import { getPanchangam, Observer, tithiNames, nakshatraNames, rashiNames, dayNames, yogaNames, karanaNames } from '@ishubhamx/panchangam-js';
import styles from './panchang.module.css';

const translations = {
  mr: {
    title: 'दैनिक पंचांग',
    subtitle: 'आजचे पंचांग आणि शुभ-अशुभ वेळा',
    dateLabel: 'दिनांक',
    locationLabel: 'स्थान',
    sunrise: 'सूर्योदय',
    sunset: 'सूर्यास्त',
    moonrise: 'चंद्रोदय',
    moonset: 'चंद्र अस्त',
    tithi: 'तिथि',
    nakshatra: 'नक्षत्र',
    yoga: 'योग',
    karana: 'करण',
    vara: 'वार',
    masa: 'मास',
    paksha: 'पक्ष',
    ritu: 'ऋतु',
    ayana: 'अयन',
    samvat: 'संवत',
    moonRashi: 'चंद्र राशि',
    sunRashi: 'सूर्य राशि',
    loading: 'पंचांगाची माहिती लोड होत आहे...',
    defaultLocation: 'पुणे, भारत',
    mantra: 'मंत्र',
    prevDay: 'मागील दिवस',
    nextDay: 'पुढील दिवस',
    selectDate: 'तारीख निवडा',
    cityLabel: 'शहर / स्थान',
    customLocation: 'कस्टम अक्षांश-रेखांश',
    latitude: 'अक्षांश',
    longitude: 'रेखांश',
    useCurrentLocation: 'सध्याचे स्थान वापरा',
    locationHint: 'शहर निवडा किंवा शहर उपलब्ध नसल्यास अक्षांश-रेखांश टाका.',
    note: 'हे पंचांग सध्या तपासणीच्या टप्प्यावर आहे आणि त्यात चुकीची माहिती दिसू शकते.',
  },
  hi: {
    title: 'दैनिक पंचांग',
    subtitle: 'आज का पंचांग और शुभ-अशुभ समय',
    dateLabel: 'दिनांक',
    locationLabel: 'स्थान',
    sunrise: 'सूर्योदय',
    sunset: 'सूर्यास्त',
    moonrise: 'चंद्रोदय',
    moonset: 'चंद्र अस्त',
    tithi: 'तिथि',
    nakshatra: 'नक्षत्र',
    yoga: 'योग',
    karana: 'करण',
    vara: 'वार',
    masa: 'मास',
    paksha: 'पक्ष',
    ritu: 'ऋतु',
    ayana: 'अयन',
    samvat: 'संवत',
    moonRashi: 'चंद्र राशि',
    sunRashi: 'सूर्य राशि',
    loading: 'पंचांग डेटा लोड हो रहा है...',
    defaultLocation: 'पुणे, भारत',
    mantra: 'मंत्र',
    prevDay: 'पिछला दिन',
    nextDay: 'अगला दिन',
    selectDate: 'तारीख चुनें',
    cityLabel: 'शहर / स्थान',
    customLocation: 'कस्टम निर्देशांक',
    latitude: 'अक्षांश',
    longitude: 'देशांतर',
    useCurrentLocation: 'वर्तमान स्थान का उपयोग करें',
    locationHint: 'शहर चुनें या यदि शहर उपलब्ध नहीं है तो अक्षांश-देशांतर दर्ज करें।',
    note: 'यह पंचांग की जांच चल रही है और इसमें गलत जानकारी दिखाई दे सकती है।',
  },
  en: {
    title: 'Daily Panchang',
    subtitle: 'Today’s Panchang and auspicious timings',
    dateLabel: 'Date',
    locationLabel: 'Location',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    moonrise: 'Moonrise',
    moonset: 'Moonset',
    tithi: 'Tithi',
    nakshatra: 'Nakshatra',
    yoga: 'Yoga',
    karana: 'Karana',
    vara: 'Vara',
    masa: 'Masa',
    paksha: 'Paksha',
    ritu: 'Ritu',
    ayana: 'Ayana',
    samvat: 'Samvat',
    moonRashi: 'Moon Rashi',
    sunRashi: 'Sun Rashi',
    loading: 'Loading Panchang data...',
    defaultLocation: 'Pune, India',
    mantra: 'Mantra',
    prevDay: 'Previous day',
    nextDay: 'Next day',
    selectDate: 'Select date',
    cityLabel: 'City / location',
    customLocation: 'Custom coordinates',
    latitude: 'Latitude',
    longitude: 'Longitude',
    useCurrentLocation: 'Use current location',
    locationHint: 'Choose a city or enter latitude and longitude if your city is not listed.',
    note: 'This Panchang is underevaluation and it may show incorrect details',
  },
};

const majorIndianCities = [
  { id: 'pune', label: 'Pune, Maharashtra', lat: 18.5204, lon: 73.8567, timezone: 'Asia/Kolkata' },
  { id: 'mumbai', label: 'Mumbai, Maharashtra', lat: 19.0760, lon: 72.8777, timezone: 'Asia/Kolkata' },
  { id: 'nagpur', label: 'Nagpur, Maharashtra', lat: 21.1458, lon: 79.0882, timezone: 'Asia/Kolkata' },
  { id: 'delhi', label: 'Delhi, Delhi', lat: 28.6139, lon: 77.2090, timezone: 'Asia/Kolkata' },
  { id: 'bangalore', label: 'Bengaluru, Karnataka', lat: 12.9716, lon: 77.5946, timezone: 'Asia/Kolkata' },
  { id: 'chennai', label: 'Chennai, Tamil Nadu', lat: 13.0827, lon: 80.2707, timezone: 'Asia/Kolkata' },
  { id: 'hyderabad', label: 'Hyderabad, Telangana', lat: 17.3850, lon: 78.4867, timezone: 'Asia/Kolkata' },
  { id: 'kolkata', label: 'Kolkata, West Bengal', lat: 22.5726, lon: 88.3639, timezone: 'Asia/Kolkata' },
  { id: 'ahmedabad', label: 'Ahmedabad, Gujarat', lat: 23.0225, lon: 72.5714, timezone: 'Asia/Kolkata' },
  { id: 'jaipur', label: 'Jaipur, Rajasthan', lat: 26.9124, lon: 75.7873, timezone: 'Asia/Kolkata' },
  { id: 'lucknow', label: 'Lucknow, Uttar Pradesh', lat: 26.8467, lon: 80.9462, timezone: 'Asia/Kolkata' },
  { id: 'kanpur', label: 'Kanpur, Uttar Pradesh', lat: 26.4499, lon: 80.3319, timezone: 'Asia/Kolkata' },
  { id: 'varanasi', label: 'Varanasi, Uttar Pradesh', lat: 25.3176, lon: 82.9739, timezone: 'Asia/Kolkata' },
  { id: 'bhopal', label: 'Bhopal, Madhya Pradesh', lat: 23.2599, lon: 77.4126, timezone: 'Asia/Kolkata' },
  { id: 'indore', label: 'Indore, Madhya Pradesh', lat: 22.7196, lon: 75.8577, timezone: 'Asia/Kolkata' },
  { id: 'raipur', label: 'Raipur, Chhattisgarh', lat: 21.2514, lon: 81.6296, timezone: 'Asia/Kolkata' },
  { id: 'patna', label: 'Patna, Bihar', lat: 25.5941, lon: 85.1376, timezone: 'Asia/Kolkata' },
  { id: 'ranchi', label: 'Ranchi, Jharkhand', lat: 23.3441, lon: 85.3096, timezone: 'Asia/Kolkata' },
  { id: 'guwahati', label: 'Guwahati, Assam', lat: 26.1445, lon: 91.7362, timezone: 'Asia/Kolkata' },
  { id: 'dispur', label: 'Dispur, Assam', lat: 26.1445, lon: 91.7362, timezone: 'Asia/Kolkata' },
  { id: 'imphal', label: 'Imphal, Manipur', lat: 24.8170, lon: 93.9368, timezone: 'Asia/Kolkata' },
  { id: 'shillong', label: 'Shillong, Meghalaya', lat: 25.5788, lon: 91.8933, timezone: 'Asia/Kolkata' },
  { id: 'aizawl', label: 'Aizawl, Mizoram', lat: 23.7271, lon: 92.7176, timezone: 'Asia/Kolkata' },
  { id: 'kohima', label: 'Kohima, Nagaland', lat: 25.6740, lon: 94.1109, timezone: 'Asia/Kolkata' },
  { id: 'itanagar', label: 'Itanagar, Arunachal Pradesh', lat: 27.0844, lon: 93.6053, timezone: 'Asia/Kolkata' },
  { id: 'gangtok', label: 'Gangtok, Sikkim', lat: 27.3389, lon: 88.6065, timezone: 'Asia/Kolkata' },
  { id: 'panaji', label: 'Panaji, Goa', lat: 15.4909, lon: 73.8278, timezone: 'Asia/Kolkata' },
  { id: 'thiruvananthapuram', label: 'Thiruvananthapuram, Kerala', lat: 8.5241, lon: 76.9366, timezone: 'Asia/Kolkata' },
  { id: 'kochi', label: 'Kochi, Kerala', lat: 9.9312, lon: 76.2673, timezone: 'Asia/Kolkata' },
  { id: 'bhubaneswar', label: 'Bhubaneswar, Odisha', lat: 20.2961, lon: 85.8245, timezone: 'Asia/Kolkata' },
  { id: 'visakhapatnam', label: 'Visakhapatnam, Andhra Pradesh', lat: 17.6868, lon: 83.2185, timezone: 'Asia/Kolkata' },
  { id: 'amaravati', label: 'Amaravati, Andhra Pradesh', lat: 16.5072, lon: 80.5151, timezone: 'Asia/Kolkata' },
  { id: 'gurgaon', label: 'Gurgaon, Haryana', lat: 28.4595, lon: 77.0266, timezone: 'Asia/Kolkata' },
  { id: 'agartala', label: 'Agartala, Tripura', lat: 23.8315, lon: 91.2868, timezone: 'Asia/Kolkata' },
  { id: 'chandigarh', label: 'Chandigarh, Punjab', lat: 30.7333, lon: 76.7794, timezone: 'Asia/Kolkata' },
  { id: 'shimla', label: 'Shimla, Himachal Pradesh', lat: 31.1048, lon: 77.1734, timezone: 'Asia/Kolkata' },
  { id: 'dehradun', label: 'Dehradun, Uttarakhand', lat: 30.3165, lon: 78.0322, timezone: 'Asia/Kolkata' },
  { id: 'srinagar', label: 'Srinagar, Jammu and Kashmir', lat: 34.0837, lon: 74.7973, timezone: 'Asia/Kolkata' },
  { id: 'leh', label: 'Leh, Ladakh', lat: 34.1526, lon: 77.5771, timezone: 'Asia/Kolkata' },
  { id: 'portblair', label: 'Port Blair, Andaman and Nicobar Islands', lat: 11.6234, lon: 92.7265, timezone: 'Asia/Kolkata' },
  { id: 'puducherry', label: 'Puducherry, Puducherry', lat: 11.9416, lon: 79.8083, timezone: 'Asia/Kolkata' },
  { id: 'daman', label: 'Daman, Dadra and Nagar Haveli and Daman and Diu', lat: 20.3974, lon: 72.8328, timezone: 'Asia/Kolkata' },
  { id: 'kavaratti', label: 'Kavaratti, Lakshadweep', lat: 10.5667, lon: 72.6167, timezone: 'Asia/Kolkata' },
];

const getText = (lang, key) => translations[lang]?.[key] || translations.en[key] || key;

const getTimeZoneOffsetMinutes = (timeZone) => {
  if (!timeZone) return 330;

  try {
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'shortOffset' });
    const parts = formatter.formatToParts(new Date());
    const zoneName = parts.find((part) => part.type === 'timeZoneName')?.value || 'GMT+5:30';
    const match = zoneName.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
    if (!match) return 330;
    const sign = match[1] === '-' ? -1 : 1;
    const hours = Number(match[2] || 0);
    const minutes = Number(match[3] || 0);
    return sign * (hours * 60 + minutes);
  } catch (error) {
    return 330;
  }
};

const getLocale = (lang) => (lang === 'en' ? 'en-IN' : lang === 'hi' ? 'hi-IN' : 'mr-IN');

const formatNumber = (lang, value, options = {}) => {
  if (value === undefined || value === null || value === '') return '';
  const number = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(number)) return value;
  return new Intl.NumberFormat(getLocale(lang), options).format(number);
};

const formatTime = (lang, value) => {
  if (!value) return '';
  return new Intl.DateTimeFormat(getLocale(lang), { hour: 'numeric', minute: '2-digit' }).format(new Date(value));
};

const toDateInputValue = (date) => {
  const localDate = new Date(date);
  const offset = localDate.getTimezoneOffset();
  const adjusted = new Date(localDate.getTime() - offset * 60000);
  return adjusted.toISOString().slice(0, 10);
};

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const getTranslatedValue = (lang, value, map, fallback = '') => {
  if (value === undefined || value === null || value === '') return fallback;

  const langMap = map?.[lang] || {};
  const enMap = map?.en || {};
  const variants = [];

  if (typeof value === 'number') {
    variants.push(String(value));
    variants.push(value);
  } else if (typeof value === 'string') {
    const trimmed = value.trim();
    variants.push(trimmed);
    variants.push(trimmed.toLowerCase());
    variants.push(trimmed.replace(/\s+/g, ''));
    variants.push(trimmed.replace(/\s+/g, '').toLowerCase());
  }

  for (const variant of variants) {
    if (langMap[variant] !== undefined) return langMap[variant];
    if (enMap[variant] !== undefined) return enMap[variant];
  }

  const normalized = (entry) => String(entry).toLowerCase().replace(/\s+/g, '');
  const matches = Object.entries(langMap).find(([key]) => normalized(key) === normalized(value));
  if (matches) return matches[1];

  const englishMatch = Object.entries(enMap).find(([key]) => normalized(key) === normalized(value));
  if (englishMatch) return englishMatch[1];

  return typeof value === 'number' ? value : value;
};

export default function PanchangSection() {
  const { lang } = useTranslation();
  const [panchang, setPanchang] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [locationMode, setLocationMode] = useState('preset');
  const [selectedCity, setSelectedCity] = useState('pune');
  const [customCoords, setCustomCoords] = useState({ lat: '', lon: '' });
  const [location, setLocation] = useState({
    label: 'Pune, Maharashtra',
    lat: 18.5204,
    lon: 73.8567,
    elevation: 10,
    timezone: 'Asia/Kolkata',
    timezoneOffset: 330,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new Observer(location.lat, location.lon, location.elevation || 0);
    const timezoneOffset = location.timezoneOffset ?? getTimeZoneOffsetMinutes(location.timezone);
    const data = getPanchangam(selectedDate, observer, { timezoneOffset, calendarType: 'amanta' });
    setPanchang(data);
  }, [selectedDate, location.lat, location.lon, location.elevation, location.timezone, location.timezoneOffset]);

  useEffect(() => {
    if (locationMode !== 'custom') return;

    const parsedLat = Number(customCoords.lat);
    const parsedLon = Number(customCoords.lon);
    if (Number.isNaN(parsedLat) || Number.isNaN(parsedLon)) return;

    setLocation((current) => ({
      ...current,
      label: `Custom location (${parsedLat.toFixed(4)}, ${parsedLon.toFixed(4)})`,
      lat: parsedLat,
      lon: parsedLon,
      timezoneOffset: current.timezoneOffset ?? 330,
    }));
  }, [customCoords.lat, customCoords.lon, locationMode]);

  const useCurrentLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
        setLocationMode('geo');
        setSelectedCity('current');
        setLocation({
          label: `Current location (${formatNumber(lang, pos.coords.latitude, { maximumFractionDigits: 2 })}, ${formatNumber(lang, pos.coords.longitude, { maximumFractionDigits: 2 })})`,
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          elevation: pos.coords.altitude || 0,
          timezone,
          timezoneOffset: getTimeZoneOffsetMinutes(timezone),
        });
      },
      () => undefined,
      { timeout: 5000 }
    );
  };

  const handleCityChange = (value) => {
    if (value === '__custom__') {
      setLocationMode('custom');
      setSelectedCity('__custom__');
      setLocation((current) => ({
        ...current,
        label: 'Custom location',
        timezoneOffset: current.timezoneOffset ?? 330,
      }));
      return;
    }

    const city = majorIndianCities.find((item) => item.id === value);
    if (!city) return;

    setLocationMode('preset');
    setSelectedCity(value);
    setLocation({
      label: city.label,
      lat: city.lat,
      lon: city.lon,
      elevation: 0,
      timezone: city.timezone,
      timezoneOffset: getTimeZoneOffsetMinutes(city.timezone),
    });
  };

  const handleCustomCoordChange = (field, value) => {
    setCustomCoords((current) => ({ ...current, [field]: value }));
  };

  const formattedDate = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const locale = getLocale(lang);
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(selectedDate);
  }, [lang, selectedDate]);

  const displayData = useMemo(() => {
    if (!panchang) return null;

    const dayMap = {
      mr: {
        Sunday: 'रविवार',
        Monday: 'सोमवार',
        Tuesday: 'मंगळवार',
        Wednesday: 'बुधवार',
        Thursday: 'गुरुवार',
        Friday: 'शुक्रवार',
        Saturday: 'शनिवार',
      },
      hi: {
        Sunday: 'रविवार',
        Monday: 'सोमवार',
        Tuesday: 'मंगलवार',
        Wednesday: 'बुधवार',
        Thursday: 'गुरुवार',
        Friday: 'शुक्रवार',
        Saturday: 'शनिवार',
      },
      en: {
        Sunday: 'Sunday',
        Monday: 'Monday',
        Tuesday: 'Tuesday',
        Wednesday: 'Wednesday',
        Thursday: 'Thursday',
        Friday: 'Friday',
        Saturday: 'Saturday',
      },
    };

    const tithiMap = {
      mr: {
        Prathama: 'प्रतिपदा',
        Dwitiya: 'द्वितीया',
        Tritiya: 'तृतीया',
        Chaturthi: 'चतुर्थी',
        Panchami: 'पंचमी',
        Shashthi: 'षष्ठी',
        Saptami: 'सप्तमी',
        Ashtami: 'अष्टमी',
        Navami: 'नवमी',
        Dashami: 'दशमी',
        Ekadashi: 'एकादशी',
        Dwadashi: 'द्वादशी',
        Trayodashi: 'त्रयोदशी',
        Chaturdashi: 'चतुर्दशी',
        Purnima: 'पौर्णिमा',
        Amavasya: 'अमावस्या',
      },
      hi: {
        Prathama: 'प्रतिपदा',
        Dwitiya: 'द्वितीया',
        Tritiya: 'तृतीया',
        Chaturthi: 'चतुर्थी',
        Panchami: 'पंचमी',
        Shashthi: 'षष्ठी',
        Saptami: 'सप्तमी',
        Ashtami: 'अष्टमी',
        Navami: 'नवमी',
        Dashami: 'दशमी',
        Ekadashi: 'एकादशी',
        Dwadashi: 'द्वादशी',
        Trayodashi: 'त्रयोदशी',
        Chaturdashi: 'चतुर्दशी',
        Purnima: 'पूर्णिमा',
        Amavasya: 'अमावस्या',
      },
      en: {},
    };

    const nakshatraMap = {
      mr: {
        Ashwini: 'अश्विनी',
        Bharani: 'भरणी',
        Krittika: 'कृत्तिका',
        Rohini: 'रोहिणी',
        Mrigashira: 'मृग',
        Ardra: 'आर्द्रा',
        Punarvasu: 'पुनर्वसु',
        Pushya: 'पुष्य',
        Ashlesha: 'आश्लेषा',
        Magha: 'मघा',
        PurvaPhalguni: 'पूर्व फाल्गुनी',
        UttaraPhalguni: 'उत्तर फाल्गुनी',
        Hasta: 'हस्त',
        Chitra: 'चित्रा',
        Swati: 'स्वाती',
        Vishakha: 'विषाखा',
        Anuradha: 'अनुराधा',
        Jyeshtha: 'ज्येष्ठा',
        Mula: 'मूळ',
        PurvaAshadha: 'पूर्वाषाढा',
        UttaraAshadha: 'उत्तराषाढा',
        Shravana: 'श्रवण',
        Dhanishta: 'धनिष्ठा',
        Shatabhisha: 'शततारका ',
        PurvaBhadrapada: 'पूर्वा भाद्रपदा',
        UttaraBhadrapada: 'उत्तरा भाद्रपदा',
        Revati: 'रेवती',
      },
      hi: {
        Ashwini: 'अश्विनी',
        Bharani: 'भरणी',
        Krittika: 'कृत्तिका',
        Rohini: 'रोहिणी',
        Mrigashira: 'मृगशिरा',
        Ardra: 'आर्द्रा',
        Punarvasu: 'पुनर्वसु',
        Pushya: 'पुष्य',
        Ashlesha: 'आश्लेषा',
        Magha: 'माघ',
        PurvaPhalguni: 'पूर्व फाल्गुनी',
        UttaraPhalguni: 'उत्तर फाल्गुनी',
        Hasta: 'हस्त',
        Chitra: 'चित्रा',
        Swati: 'स्वाति',
        Vishakha: 'विशाखा',
        Anuradha: 'अनुराधा',
        Jyeshtha: 'ज्येष्ठा',
        Mula: 'मूल',
        PurvaAshadha: 'पूर्वाषाढ़ा',
        UttaraAshadha: 'उत्तराषाढ़ा',
        Shravana: 'श्रावण',
        Dhanishta: 'धनिष्ठा',
        Shatabhisha: 'शतभिषा',
        PurvaBhadrapada: 'पूर्वभाद्रपदा',
        UttaraBhadrapada: 'उत्तरभाद्रपदा',
        Revati: 'रेवती',
      },
      en: {},
    };

    const yogaMap = {
      mr: {
        Vishkumbha: 'विष्कुम्भ',
        Preeti: 'प्रीति',
        Ayushman: 'आयुष्मान',
        Saubhagya: 'सौभाग्य',
        Shobhana: 'शोभना',
        Atiganda: 'अतिगण्ड',
        Sukarma: 'सुकर्मा',
        Dhriti: 'धृती',
        Shoola: 'शूल',
        Ganda: 'गण्ड',
        Vriddhi: 'वृद्धि',
        Dhruva: 'ध्रुव',
        Vyaghata: 'व्याघात',
        Harshana: 'हर्षण',
        Vajra: 'वज्र',
        Siddhi: 'सिद्धी',
        Vyatipata: 'व्यतीपात',
        Variyan: 'वारियान',
        Parigha: 'परिघ',
        Shiva: 'शिव',
        Siddha: 'सिद्ध',
        Sadhya: 'साध्य',
        Shubha: 'शुभ',
        Shukla: 'शुक्ल',
        Brahma: 'ब्रह्म',
        Indra: 'इंद्र',
        Vaidhriti: 'वैधृत',
      },
      hi: {
        Vishkumbha: 'विष्कुम्भ',
        Preeti: 'प्रीति',
        Ayushman: 'आयुष्मान',
        Saubhagya: 'सौभाग्य',
        Shobhana: 'शोभना',
        Atiganda: 'अतिगण्ड',
        Sukarma: 'सुकर्मा',
        Dhriti: 'धृती',
        Shoola: 'शूल',
        Ganda: 'गण्ड',
        Vriddhi: 'वृद्धि',
        Dhruva: 'ध्रुव',
        Vyaghata: 'व्याघात',
        Harshana: 'हर्षण',
        Vajra: 'वज्र',
        Siddhi: 'सिद्धी',
        Vyatipata: 'व्यतीपात',
        Variyan: 'वारियान',
        Parigha: 'परिघ',
        Shiva: 'शिव',
        Siddha: 'सिद्ध',
        Sadhya: 'साध्य',
        Shubha: 'शुभ',
        Shukla: 'शुक्ल',
        Brahma: 'ब्रह्म',
        Indra: 'इंद्र',
        Vaidhriti: 'वैधृत',
      },
      en: {},
    };

    const karanaMap = {
      mr: {
        Kimstughna: 'किंस्तुघ्न',
        Bava: 'बव',
        Baalava: 'बालव',
        Kaulava: 'कौलव',
        Taitila: 'तैतिल',
        Garaja: 'गरज',
        Vanija: 'वणिज',
        Vishti: 'विष्टि',
      },
      hi: {
        Kimstughna: 'किंस्तुघ्न',
        Bava: 'बव',
        Baalava: 'बालव',
        Kaulava: 'कौलव',
        Taitila: 'तैतिल',
        Garaja: 'गरज',
        Vanija: 'वणिज',
        Vishti: 'विष्टि',
      },
      en: {},
    };

    const rashiMap = {
      mr: {
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
      },
      hi: {
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
      },
      en: {},
    };

    const masaMap = {
      mr: {
        Chaitra: 'चैत्र',
        Vaishakha: 'वैशाख',
        Jyeshtha: 'ज्येष्ठ',
        Jyestha: 'ज्येष्ठ',
        Jestha: 'ज्येष्ठ',
        Jeshtha: 'ज्येष्ठ',
        Ashadha: 'आषाढ',
        Aashadha: 'आषाढ',
        Ashad: 'आषाढ',
        Aashad: 'आषाढ',
        Shravana: 'श्रावण',
        Bhadrapada: 'भाद्रपद',
        Ashwin: 'आश्विन',
        Kartika: 'कार्तिक',
        Margashirsha: 'मार्गशीर्ष',
        Pausha: 'पौष',
        Magha: 'माघ',
        Phalguna: 'फाल्गुन',
      },
      hi: {
        Chaitra: 'चैत्र',
        Vaishakha: 'वैशाख',
        Jyeshtha: 'ज्येष्ठ',
        Jyestha: 'ज्येष्ठ',
        Jestha: 'ज्येष्ठ',
        Jeshtha: 'ज्येष्ठ',
        Ashadha: 'आषाढ',
        Aashadha: 'आषाढ',
        Ashad: 'आषाढ़',
        Aashad: 'आषाढ़',
        Shravana: 'श्रावण',
        Bhadrapada: 'भाद्रपद',
        Ashwin: 'आश्विन',
        Kartika: 'कार्तिक',
        Margashirsha: 'मार्गशीर्ष',
        Pausha: 'पौष',
        Magha: 'माघ',
        Phalguna: 'फाल्गुन',
      },
      en: {},
    };

    const pakshaMap = {
      mr: { Shukla: 'शुक्ल', Krishna: 'कृष्ण' },
      hi: { Shukla: 'शुक्ल', Krishna: 'कृष्ण' },
      en: {},
    };

    const ayanaMap = {
      mr: { Uttarayana: 'उत्तरायण', Dakshinayana: 'दक्षिणायण' },
      hi: { Uttarayana: 'उत्तरायण', Dakshinayana: 'दक्षिणायण' },
      en: {},
    };

    const rituMap = {
      mr: { Vasanta: 'वसंत', Grishma: 'ग्रीष्म', Varsha: 'वर्षा', Sharad: 'शरद', Hemanta: 'हेमंत', Shishira: 'शिशिर' },
      hi: { Vasanta: 'वसंत', Grishma: 'ग्रीष्म', Varsha: 'वर्षा', Sharad: 'शरद', Hemanta: 'हेमंत', Shishira: 'शिशिर' },
      en: {},
    };

    const tithiDisplay = getTranslatedValue(lang, tithiNames?.[panchang.tithi] || panchang.tithi, tithiMap, '');
    const nakshatraDisplay = getTranslatedValue(lang, nakshatraNames?.[panchang.nakshatra] || panchang.nakshatra, nakshatraMap, '');
    const yogaDisplay = getTranslatedValue(lang, yogaNames?.[panchang.yoga] || panchang.yoga, yogaMap, '');
    const karanaDisplay = getTranslatedValue(lang, karanaNames?.[panchang.karana] || panchang.karana, karanaMap, '');
    const varaDisplay = getTranslatedValue(lang, dayNames?.[panchang.vara] || panchang.vara, dayMap, '');
    const masaIndex = Number(panchang.masa?.index);
    const masaNameByIndex = {
      0: 'Chaitra',
      1: 'Vaishakha',
      2: 'Jyeshtha',
      3: 'Ashadha',
      4: 'Shravana',
      5: 'Bhadrapada',
      6: 'Ashwin',
      7: 'Kartika',
      8: 'Margashirsha',
      9: 'Pusha',
      10: 'Magha',
      11: 'Phalguna',
    };
    const masaDisplay = getTranslatedValue(lang, masaNameByIndex[masaIndex] || panchang.masa?.name || '', masaMap, '');
    const pakshaDisplay = getTranslatedValue(lang, panchang.paksha || '', pakshaMap, '');
    const rituDisplay = getTranslatedValue(lang, panchang.ritu || '', rituMap, '');
    const ayanaDisplay = getTranslatedValue(lang, panchang.ayana || '', ayanaMap, '');
    const moonRashiDisplay = getTranslatedValue(lang, panchang.moonRashi?.name || '', rashiMap, '');
    const sunRashiDisplay = getTranslatedValue(lang, panchang.sunRashi?.name || '', rashiMap, '');
    const mantraText = (() => {
      const safeValue = (value) => (value === undefined || value === null || value === '' ? '' : String(value));
      const samvatsaraSanskrit = {
        Parabhava: 'पराभव',
        Plava: 'प्लव',
        Shubhakritu: 'शुभकृत्',
        Shobhakritu: 'शोभकृत्',
        Krodhin: 'क्रोधी',
        Vishvavasu: 'विश्ववासु',
        Paridhavi: 'परिधावी',
        Pramadi: 'प्रमादी',
        Ananda: 'आनंद',
        Rakshasa: 'राक्षस',
        Nandana: 'नंदन',
        Vijaya: 'विजय',
        Jaya: 'जय',
        Manmatha: 'मन्मथ',
        Durmukhi: 'दुर्मुखी',
        Hevilambi: 'हेविलंबी',
        Vilambi: 'विलंबी',
        Vikari: 'विकारि',
        Shari: 'शरी',
        Plavaang: 'प्लवङ्ग',
      }[panchang.samvat?.samvatsara] || safeValue(panchang.samvat?.samvatsara);

      const ayanaSanskrit = panchang.ayana === 'Dakshinayana' ? 'दक्षिणायन' : panchang.ayana === 'Uttarayana' ? 'उत्तरायण' : safeValue(ayanaDisplay);
      const rituSanskrit = panchang.ritu === 'Varsha' ? 'वर्षा' : safeValue(rituDisplay);
      const masaName = safeValue(panchang.masa?.name || '');
      const masaIndexForMantra = Number(panchang.masa?.index);
      const masaSanskrit = masaIndexForMantra === 2 ? 'ज्येष्ठ' : masaIndexForMantra === 3 ? 'आषाढ' : ['Ashadha', 'Aashadha', 'Ashad', 'Aashad'].includes(masaName) ? 'आषाढ' : safeValue(masaDisplay);
      const pakshaSanskrit = panchang.paksha === 'Krishna' ? 'कृष्ण' : safeValue(pakshaDisplay);
      const tithiSanskrit = {
        Prathama: 'प्रतिपदा',
        Dwitiya: 'द्वितीया',
        Tritiya: 'तृतीया',
        Chaturthi: 'चतुर्थी',
        Panchami: 'पंचमी',
        Shashthi: 'षष्ठी',
        Saptami: 'सप्तमी',
        Ashtami: 'अष्टमी',
        Navami: 'नवमी',
        Dashami: 'दशमी',
        Ekadashi: 'एकादशी',
        Dwadashi: 'द्वादशी',
        Trayodashi: 'त्रयोदशी',
        Chaturdashi: 'चतुर्दशी',
        Purnima: 'पूर्णिमा',
        Amavasya: 'अमावस्या',
      }[safeValue(tithiNames?.[panchang.tithi] || panchang.tithi)] || safeValue(tithiDisplay);

      const vasaraSanskrit = {
        Sunday: 'भानु',
        Monday: 'इंदू',
        Tuesday: 'भौम',
        Wednesday: 'सौम्य',
        Thursday: 'बृहस्पति',
        Friday: 'भृगु',
        Saturday: 'मंद',
      }[safeValue(dayNames?.[panchang.vara] || panchang.vara)] || safeValue(varaDisplay);
      const nakshatraSanskrit = {
        Ashwini: 'अश्विनी',
        Bharani: 'भरणी',
        Krittika: 'कृत्तिका',
        Rohini: 'रोहिणी',
        Mrigashira: 'मृगशिरा',
        Ardra: 'आर्द्रा',
        Punarvasu: 'पुनर्वसु',
        Pushya: 'पुष्य',
        Ashlesha: 'आश्लेषा',
        Magha: 'मघा',
        PurvaPhalguni: 'पूर्व फाल्गुनी',
        UttaraPhalguni: 'उत्तर फाल्गुनी',
        Hasta: 'हस्त',
        Chitra: 'चित्रा',
        Swati: 'स्वाति',
        Vishakha: 'विशाखा',
        Anuradha: 'अनुराधा',
        Jyeshtha: 'ज्येष्ठा',
        Mula: 'मूल',
        PurvaAshadha: 'पूर्वाषाढा',
        UttaraAshadha: 'उत्तराषाढा',
        Shravana: 'श्रवण',
        Dhanishta: 'धनिष्ठा',
        Shatabhisha: 'शतभिषा',
        PurvaBhadrapada: 'पूर्वभाद्रपदा',
        UttaraBhadrapada: 'उत्तरभाद्रपदा',
        Revati: 'रेवती',
      }[safeValue(nakshatraNames?.[panchang.nakshatra] || panchang.nakshatra)] || safeValue(nakshatraDisplay);
      const chandraRashiSanskrit = panchang.moonRashi?.name === 'Sagittarius' ? 'धनु' : safeValue(moonRashiDisplay);
      const suryaRashiSanskrit = panchang.sunRashi?.name === 'Gemini' ? 'मिथुन' : safeValue(sunRashiDisplay);
      const guruRashiSanskrit = panchang.guruRashi?.name === 'Gemini' ? 'मिथुन' : safeValue(sunRashiDisplay);

      return [
        'श्रीमद्भगवतो महापुरुषस्य विष्णोराज्ञया प्रवर्तमानस्य अद्य',
        'ब्रह्मणो द्वितीये परार्धे विष्णुपदे श्रीश्वेतवाराहकल्पे वैवस्वतमन्वंतरे',
        'कलियुगे प्रथमचरणे भरतवर्षे भरतखंडे जंबुद्वीपे दंडकारण्ये देशे',
        'गोदावर्याः दक्षिणेतीरे शालिवाहन शके',
        '',
        <span key="samvatsara"><strong>{safeValue(samvatsaraSanskrit)}</strong> नाम संवत्सरे</span>,
        <span key="ayana"><strong>{safeValue(ayanaSanskrit)}</strong>यने</span>,
        <span key="ritu"><strong>{safeValue(rituSanskrit)}</strong>ऋतौ</span>,
        <span key="masa"><strong>{safeValue(masaSanskrit)}</strong>मासे</span>,
        <span key="paksha"><strong>{safeValue(pakshaSanskrit)}</strong>पक्षे</span>,
        <span key="tithi"><strong>{safeValue(tithiSanskrit)}</strong>तिथौ</span>,
        <span key="vasara"><strong>{safeValue(vasaraSanskrit)}</strong>वासरे</span>,
        <span key="nakshatra"><strong>{safeValue(nakshatraSanskrit)}</strong>दिवसनक्षत्रे</span>,
        'विष्णुयोगे विष्णुकरणे',
        <span key="chandra"><strong>{safeValue(chandraRashiSanskrit)}</strong>स्थिते वर्तमाने चन्द्रे</span>,
        <span key="surya"><strong>{safeValue(suryaRashiSanskrit)}</strong>स्थिते श्रीसूर्ये</span>,
        <span key="guru"><strong>{safeValue(guruRashiSanskrit)}</strong>स्थिते देवगुरौ</span>,
        '',
        'शेषेषु ग्रहेषु यथायथं राशिस्थानस्थितेषु सत्सु शुभनामयोगे शुभकरणे',
        <span key="self-recite">एवंगुणविशेषणविशिष्टायां शुभपुण्यतिथौ <strong>(येथे पूजा करणाऱ्याने स्वतः म्हणावे)</strong> मम आत्मनः</span>,
        'श्रुतिस्मृतिपुराणोक्तफलप्राप्त्यर्थं अस्माकं सकुटुंबानां सपरिवाराणां क्षेमस्थैर्यआयुरायोग्यऐश्वर्य-',
        'प्राप्त्यर्थं सकलपीडापरिहारार्थं मनेप्सितसकलमनोरथसिद्ध्यर्थं',
        'श्रीमहाविष्णुप्रमुखपंचायतनदेवताप्रीत्यर्थं यथाज्ञानेन यथा-',
        'मिलितोपचारद्रव्यैः ध्यानावाहनादिषोडशोपचारपूजां पुरुषसूक्तेन',
        'पुराणोक्तमंत्रेण वा करिष्ये।',
      ];
    })();

    return {
      tithi: tithiDisplay,
      nakshatra: nakshatraDisplay,
      yoga: yogaDisplay,
      karana: karanaDisplay,
      vara: varaDisplay,
      masa: masaDisplay,
      paksha: pakshaDisplay,
      ritu: rituDisplay,
      ayana: ayanaDisplay,
      samvat: `${formatNumber(lang, panchang.samvat?.vikram, { maximumFractionDigits: 0 }) || ''} / ${formatNumber(lang, panchang.samvat?.shaka, { maximumFractionDigits: 0 }) || ''}`,
      samvatsara: panchang.samvat?.samvatsara || '',
      moonRashi: moonRashiDisplay,
      sunRashi: sunRashiDisplay,
      sunrise: formatTime(lang, panchang.sunrise),
      moonrise: formatTime(lang, panchang.moonrise),
      moonset: formatTime(lang, panchang.moonset),
      sunset: formatTime(lang, panchang.sunset),
      mantraText,
    };
  }, [lang, panchang]);

  const label = (key) => getText(lang, key);

  const shiftDate = (days) => {
    setSelectedDate((current) => addDays(current, days));
  };

  const handleDateChange = (value) => {
    if (!value) return;
    setSelectedDate(new Date(`${value}T12:00:00`));
  };

  return (
    <Layout title={label('title')} description={label('subtitle')}>
      <main className={styles.pageWrapper}>
        <div className={styles.sectionCard}>
          <div className={styles.heroBlock}>
            <div>
              <p className={styles.eyebrow}>{label('title')}</p>
              <h1>{label('title')}</h1>
              <p className={styles.subtitle}>{label('subtitle')}</p>
            </div>
            <div className={styles.metaCard}>
              <div className={styles.dateControls}>
                <button type="button" className={styles.navButton} onClick={() => shiftDate(-1)} aria-label={label('prevDay')}>
                  &lt;
                </button>
                <label className={styles.dateInputWrapper}>
                  <span>{label('selectDate')}</span>
                  <input type="date" value={toDateInputValue(selectedDate)} onChange={(e) => handleDateChange(e.target.value)} />
                </label>
                <button type="button" className={styles.navButton} onClick={() => shiftDate(1)} aria-label={label('nextDay')}>
                  &gt;
                </button>
              </div>
              <div className={styles.locationControls}>
                <label className={styles.inputGroup}>
                  <span>{label('cityLabel')}</span>
                  <select className={styles.locationSelect} value={selectedCity} onChange={(e) => handleCityChange(e.target.value)}>
                    {majorIndianCities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.label}
                      </option>
                    ))}
                    <option value="__custom__">{label('customLocation')}</option>
                  </select>
                </label>
                {locationMode === 'custom' && (
                  <div className={styles.coordRow}>
                    <label className={styles.inputGroup}>
                      <span>{label('latitude')}</span>
                      <input
                        type="number"
                        step="0.0001"
                        className={styles.coordInput}
                        value={customCoords.lat}
                        onChange={(e) => handleCustomCoordChange('lat', e.target.value)}
                        placeholder="18.5204"
                      />
                    </label>
                    <label className={styles.inputGroup}>
                      <span>{label('longitude')}</span>
                      <input
                        type="number"
                        step="0.0001"
                        className={styles.coordInput}
                        value={customCoords.lon}
                        onChange={(e) => handleCustomCoordChange('lon', e.target.value)}
                        placeholder="73.8567"
                      />
                    </label>
                  </div>
                )}
                <button type="button" className={styles.locationButton} onClick={useCurrentLocation}>
                  {label('useCurrentLocation')}
                </button>
                <div className={styles.locationHint}>{label('locationHint')}</div>
              </div>
              <div><strong>{label('dateLabel')}:</strong> {formattedDate}</div>
              <div><strong>{label('locationLabel')}:</strong> {location.label}</div>
              <div><strong>Lat / Lon:</strong> {location.lat.toFixed(4)}, {location.lon.toFixed(4)}</div>
            </div>
          </div>

          {!panchang || !displayData ? (
            <div className={styles.loadingState}>{label('loading')}</div>
          ) : (
            <>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}><span>{label('tithi')}</span><strong>{displayData.tithi}</strong></div>
                <div className={styles.summaryCard}><span>{label('nakshatra')}</span><strong>{displayData.nakshatra}</strong></div>
                <div className={styles.summaryCard}><span>{label('vara')}</span><strong>{displayData.vara}</strong></div>
                <div className={styles.summaryCard}><span>{label('masa')}</span><strong>{displayData.masa}</strong></div>
              </div>

              <div className={styles.grid}>
                <div className={styles.infoCard}>
                  <h2>{label('yoga')}</h2>
                  <p>{displayData.yoga || '-'}</p>
                </div>
                <div className={styles.infoCard}>
                  <h2>{label('karana')}</h2>
                  <p>{displayData.karana || '-'}</p>
                </div>
                <div className={styles.infoCard}>
                  <h2>{label('paksha')}</h2>
                  <p>{displayData.paksha}</p>
                </div>
                <div className={styles.infoCard}>
                  <h2>{label('ritu')}</h2>
                  <p>{displayData.ritu}</p>
                </div>
                <div className={styles.infoCard}>
                  <h2>{label('ayana')}</h2>
                  <p>{displayData.ayana}</p>
                </div>
                <div className={styles.infoCard}>
                  <h2>{label('samvat')}</h2>
                  <p>{displayData.samvat} · {displayData.samvatsara}</p>
                </div>
              </div>

              <div className={styles.grid}>
                <div className={styles.infoCard}>
                  <h2>{label('sunrise')}</h2>
                  <p>{displayData.sunrise || '-'}</p>
                </div>
                <div className={styles.infoCard}>
                  <h2>{label('sunset')}</h2>
                  <p>{displayData.sunset || '-'}</p>
                </div>
                <div className={styles.infoCard}>
                  <h2>{label('moonrise')}</h2>
                  <p>{displayData.moonrise || '-'}</p>
                </div>
                <div className={styles.infoCard}>
                  <h2>{label('moonset')}</h2>
                  <p>{displayData.moonset || '-'}</p>
                </div>
                <div className={styles.infoCard}>
                  <h2>{label('moonRashi')}</h2>
                  <p>{displayData.moonRashi || '-'}</p>
                </div>
                <div className={styles.infoCard}>
                  <h2>{label('sunRashi')}</h2>
                  <p>{displayData.sunRashi || '-'}</p>
                </div>
              </div>

              <div className={styles.mantraCard}>
                <h2>{label('mantra')}</h2>
                <p className={styles.mantraText}>
                  {displayData.mantraText.map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line}
                      {idx < displayData.mantraText.length - 1 && '\n'}
                    </React.Fragment>
                  ))}
                </p>
              </div>

              <p className={styles.note}>{label('note')}</p>
            </>
          )}
        </div>
      </main>
    </Layout>
  );
}
