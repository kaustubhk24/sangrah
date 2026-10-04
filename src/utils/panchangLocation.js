export const PANCHANG_LOCATION_STORAGE_KEY = 'panchang-location';

export const DEFAULT_PANCHANG_LOCATION = {
  label: 'Pune, Maharashtra',
  lat: 18.5204,
  lon: 73.8567,
  elevation: 10,
  timezone: 'Asia/Kolkata',
  timezoneOffset: 330,
};

const cityNames = {
  pune: { mr: 'पुणे', hi: 'पुणे', en: 'Pune' },
  mumbai: { mr: 'मुंबई', hi: 'मुंबई', en: 'Mumbai' },
  nagpur: { mr: 'नागपूर', hi: 'नागपुर', en: 'Nagpur' },
  delhi: { mr: 'दिल्ली', hi: 'दिल्ली', en: 'Delhi' },
  bangalore: { mr: 'बेंगळुरू', hi: 'बेंगलुरु', en: 'Bengaluru' },
  chennai: { mr: 'चेन्नई', hi: 'चेन्नई', en: 'Chennai' },
  hyderabad: { mr: 'हैदराबाद', hi: 'हैदराबाद', en: 'Hyderabad' },
  kolkata: { mr: 'कोलकाता', hi: 'कोलकाता', en: 'Kolkata' },
  ahmedabad: { mr: 'अहमदाबाद', hi: 'अहमदाबाद', en: 'Ahmedabad' },
  jaipur: { mr: 'जयपूर', hi: 'जयपुर', en: 'Jaipur' },
  lucknow: { mr: 'लखनऊ', hi: 'लखनऊ', en: 'Lucknow' },
  kanpur: { mr: 'कानपूर', hi: 'कानपुर', en: 'Kanpur' },
  varanasi: { mr: 'वाराणसी', hi: 'वाराणसी', en: 'Varanasi' },
  bhopal: { mr: 'भोपाळ', hi: 'भोपाल', en: 'Bhopal' },
  indore: { mr: 'इंदूर', hi: 'इंदौर', en: 'Indore' },
  raipur: { mr: 'रायपूर', hi: 'रायपुर', en: 'Raipur' },
  patna: { mr: 'पटना', hi: 'पटना', en: 'Patna' },
  ranchi: { mr: 'रांची', hi: 'रांची', en: 'Ranchi' },
  guwahati: { mr: 'गुवाहाटी', hi: 'गुवाहाटी', en: 'Guwahati' },
  dispur: { mr: 'दिसपूर', hi: 'दिसपुर', en: 'Dispur' },
  imphal: { mr: 'इम्फाळ', hi: 'इम्फाल', en: 'Imphal' },
  shillong: { mr: 'शिलाँग', hi: 'शिलांग', en: 'Shillong' },
  aizawl: { mr: 'आयझॉल', hi: 'आइजोल', en: 'Aizawl' },
  kohima: { mr: 'कोहिमा', hi: 'कोहिमा', en: 'Kohima' },
  itanagar: { mr: 'ईटानगर', hi: 'ईटानगर', en: 'Itanagar' },
  gangtok: { mr: 'गंगटोक', hi: 'गंगटोक', en: 'Gangtok' },
  panaji: { mr: 'पणजी', hi: 'पणजी', en: 'Panaji' },
  thiruvananthapuram: { mr: 'तिरुवनंतपुरम', hi: 'तिरुवनंतपुरम', en: 'Thiruvananthapuram' },
  kochi: { mr: 'कोची', hi: 'कोच्चि', en: 'Kochi' },
  bhubaneswar: { mr: 'भुवनेश्वर', hi: 'भुवनेश्वर', en: 'Bhubaneswar' },
  visakhapatnam: { mr: 'विशाखापट्टणम', hi: 'विशाखापट्टनम', en: 'Visakhapatnam' },
  amaravati: { mr: 'अमरावती', hi: 'अमरावती', en: 'Amaravati' },
  gurgaon: { mr: 'गुरुग्राम', hi: 'गुरुग्राम', en: 'Gurugram' },
  agartala: { mr: 'अगरतळा', hi: 'अगरतला', en: 'Agartala' },
  chandigarh: { mr: 'चंदीगड', hi: 'चंडीगढ़', en: 'Chandigarh' },
  shimla: { mr: 'शिमला', hi: 'शिमला', en: 'Shimla' },
  dehradun: { mr: 'डेहराडून', hi: 'देहरादून', en: 'Dehradun' },
  srinagar: { mr: 'श्रीनगर', hi: 'श्रीनगर', en: 'Srinagar' },
  leh: { mr: 'लेह', hi: 'लेह', en: 'Leh' },
  portblair: { mr: 'पोर्ट ब्लेअर', hi: 'पोर्ट ब्लेयर', en: 'Port Blair' },
  puducherry: { mr: 'पुदुच्चेरी', hi: 'पुडुचेरी', en: 'Puducherry' },
  daman: { mr: 'दमण', hi: 'दमन', en: 'Daman' },
  kavaratti: { mr: 'कवरत्ती', hi: 'कवरत्ती', en: 'Kavaratti' },
};

const locationLabels = {
  mr: { current: 'सध्याचे स्थान', custom: 'सानुकूल स्थान' },
  hi: { current: 'वर्तमान स्थान', custom: 'कस्टम स्थान' },
  en: { current: 'Current location', custom: 'Custom location' },
};

export function getPanchangCityName(cityId, lang) {
  return cityNames[cityId]?.[lang] || cityNames[cityId]?.en || cityId;
}

export function getPanchangLocationLabel(preferences, lang) {
  const labels = locationLabels[lang] || locationLabels.en;
  const location = preferences.location || DEFAULT_PANCHANG_LOCATION;

  if (preferences.locationMode === 'preset') {
    return getPanchangCityName(preferences.selectedCity, lang);
  }

  if (preferences.locationMode === 'geo') {
    const locale = lang === 'en' ? 'en-IN' : lang === 'hi' ? 'hi-IN' : 'mr-IN';
    const numbers = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
    return `${labels.current} (${numbers.format(location.lat)}, ${numbers.format(location.lon)})`;
  }

  if (preferences.locationMode === 'custom') return labels.custom;
  return location.label;
}

export function getDefaultPanchangLocationPreferences() {
  return {
    location: { ...DEFAULT_PANCHANG_LOCATION },
    locationMode: 'preset',
    selectedCity: 'pune',
    customCoords: { lat: '', lon: '' },
  };
}

export function readPanchangLocationPreferences() {
  if (typeof window === 'undefined') return getDefaultPanchangLocationPreferences();

  try {
    const saved = JSON.parse(window.localStorage.getItem(PANCHANG_LOCATION_STORAGE_KEY) || 'null');
    const latitude = Number(saved?.location?.lat);
    const longitude = Number(saved?.location?.lon);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return getDefaultPanchangLocationPreferences();
    }

    const defaults = getDefaultPanchangLocationPreferences();
    const timezoneOffset = Number(saved.location.timezoneOffset);

    return {
      location: {
        ...defaults.location,
        ...saved.location,
        label: typeof saved.location.label === 'string' ? saved.location.label : defaults.location.label,
        lat: latitude,
        lon: longitude,
        elevation: Number.isFinite(Number(saved.location.elevation)) ? Number(saved.location.elevation) : 0,
        timezone: typeof saved.location.timezone === 'string' ? saved.location.timezone : defaults.location.timezone,
        timezoneOffset: Number.isFinite(timezoneOffset) ? timezoneOffset : defaults.location.timezoneOffset,
      },
      locationMode: ['preset', 'geo', 'custom'].includes(saved.locationMode) ? saved.locationMode : 'preset',
      selectedCity: typeof saved.selectedCity === 'string' ? saved.selectedCity : defaults.selectedCity,
      customCoords: {
        lat: typeof saved.customCoords?.lat === 'string' ? saved.customCoords.lat : '',
        lon: typeof saved.customCoords?.lon === 'string' ? saved.customCoords.lon : '',
      },
    };
  } catch {
    return getDefaultPanchangLocationPreferences();
  }
}