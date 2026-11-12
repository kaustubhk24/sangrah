export const PANCHANG_LOCATION_STORAGE_KEY = 'panchang-location';

export const DEFAULT_PANCHANG_LOCATION = {
  label: 'पुणे, महाराष्ट्र',
  lat: 18.5204,
  lon: 73.8567,
  elevation: 10,
  timezone: 'Asia/Kolkata',
  timezoneOffset: 330,
};

const cityNames = {
  pune: 'पुणे',
  mumbai: 'मुंबई',
  nagpur: 'नागपूर',
  delhi: 'दिल्ली',
  bangalore: 'बेंगळुरू',
  chennai: 'चेन्नई',
  hyderabad: 'हैदराबाद',
  kolkata: 'कोलकाता',
  ahmedabad: 'अहमदाबाद',
  jaipur: 'जयपूर',
  lucknow: 'लखनऊ',
  kanpur: 'कानपूर',
  varanasi: 'वाराणसी',
  bhopal: 'भोपाळ',
  indore: 'इंदूर',
  raipur: 'रायपूर',
  patna: 'पाटणा',
  ranchi: 'रांची',
  guwahati: 'गुवाहाटी',
  dispur: 'दिसपूर',
  imphal: 'इंफाळ',
  shillong: 'शिलाँग',
  aizawl: 'आयझॉल',
  kohima: 'कोहिमा',
  itanagar: 'ईटानगर',
  gangtok: 'गंगटोक',
  panaji: 'पणजी',
  thiruvananthapuram: 'तिरुवनंतपुरम',
  kochi: 'कोची',
  bhubaneswar: 'भुवनेश्वर',
  visakhapatnam: 'विशाखापट्टणम',
  amaravati: 'अमरावती',
  gurgaon: 'गुरुग्राम',
  agartala: 'आगरतळा',
  chandigarh: 'चंदीगड',
  shimla: 'शिमला',
  dehradun: 'डेहराडून',
  srinagar: 'श्रीनगर',
  leh: 'लेह',
  portblair: 'पोर्ट ब्लेअर',
  puducherry: 'पुदुच्चेरी',
  daman: 'दमण',
  kavaratti: 'कवरत्ती',
};

export function getPanchangCityName(cityId) {
  return cityNames[cityId] || cityId;
}

export function getPanchangLocationLabel(preferences) {
  const location = preferences.location || DEFAULT_PANCHANG_LOCATION;

  if (preferences.locationMode === 'preset') {
    return getPanchangCityName(preferences.selectedCity);
  }

  if (preferences.locationMode === 'geo') {
    const numbers = new Intl.NumberFormat('mr-IN', { maximumFractionDigits: 2 });
    return `सध्याचे स्थान (${numbers.format(location.lat)}, ${numbers.format(location.lon)})`;
  }

  if (preferences.locationMode === 'custom') return 'सानुकूल स्थान';
  return 'सानुकूल स्थान';
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