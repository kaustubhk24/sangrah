import React, { createContext, useContext, useEffect } from 'react';

const translations = {
  mr: {
    appTitle: "श्री संग्रह",
    appSubtitle: "मराठी भक्तिसाहित्याचा संग्रह",
    homeTab: "होम",
    searchTab: "शोधा",
    jaapTab: "जप",
    favTab: "आवडते",
    settingsTab: "सेटिंग्ज",
    historyTab: "इतिहास",
    settingsHeader: "सेटिंग्ज",
    themeLabel: "रंगरूप",
    themeLight: "☀️ प्रकाशमान",
    themeDark: "🌙 गडद",
    elderModeLabel: "ज्येष्ठ नागरिकांसाठी मोड",
    elderModeHelp: "मोठा मजकूर, मोठे बटण आणि अधिक जागा सक्षम करा.",
    fontSizeLabel: "अक्षरांचा आकार",
    scrollSpeedLabel: "स्वयंचलित स्क्रोल गती",
    offlineLabel: "ऑफलाइन व्यवस्थापन",
    offlineHelp: "✅ ऑफलाइन उपलब्ध",
    exportLabel: "माहिती जतन करा",
    importLabel: "माहिती आयात करा",
    resetLabel: "माहिती पुसून टाका",
    backBtn: "मुख्यपृष्ठावर परत या",
    nityapathHeader: "माझे नित्यपाठ",
    nityapathEmpty: "कोणतीही पाने निवडलेली नाहीत. खालील यादीतून जोडा.",
    nityapathAddHeader: "नवीन नित्यपाठ जोडा",
    nityapathSearchPlaceholder: "आरती किंवा स्तोत्र शोधा...",
    addedBadge: "जोडले आहे",
    addBtn: "+ जोडा",
    quickAccess: "लोकप्रिय",
    recentReads: "तुम्ही अलीकडे वाचलेले",
    recentEmpty: "आपले अलीकडील वाचन येथे दिसेल.",
    dailyPath: "माझा नित्यपाठ",
    dailyPathStart: "नित्यपाठ सुरू करा",
    dailyPathSetup: "नित्यपाठ निवडा",
    removeDailyPathItem: "नित्यपाठातून काढा",
    bookmarkAdd: "आवडीत जोडा",
    bookmarkRemove: "आवडीतून काढा",
    dailyPathAdd: "नित्यपाठात जोडा",
    dailyPathRemove: "नित्यपाठातून काढा",
    deitySection: "देवानुसार वाचा",
    categorySection: "सामग्रीनुसार वाचा",
    searchPrompt: "आरती, स्तोत्र किंवा देवतेचे नाव शोधा.",
    searchNoResults: "काहीही आढळले नाही. वेगळे शब्द वापरून पहा.",
    searchResultsLabel: "परिणाम",
    searchPopularReads: "लोकप्रिय वाचन",
    clearSearch: "शोध मिटवा",
    favSection: "❤️ माझे आवडते",
    favEmpty: "आपली आवडती पाने येथे दिसतील.",
    moreLink: "अधिक पाहा",
    edit: "संपादित करा",
    jaapHeader: "जप काउंटर",
    mantraSelectLabel: "मंत्र निवडा",
    addMantraLabel: "नवीन मंत्र",
    addMantraPlaceholder: "आपला आवडता मंत्र लिहा",
    addMantraButton: "जोडा",
    myMantras: "माझे मंत्र",
    removeMantra: "मंत्र काढा",
    todayJaap: "आजचा जप",
    todayMalas: "आजची माला",
    dailyGoal: "ध्येय",
    sessionHistory: "सत्र इतिहास",
    statistics: "आकडेवारी",
    streakLabel: "सतत जप दिवस",
    streakMessage: "खूप छान! आपला जप सुरू ठेवा.",
    historyDate: "दिनांक",
    historyMantra: "मंत्र",
    historyJaap: "जप संख्या",
    historyMala: "माला संख्या",
    statsToday: "आज",
    statsWeek: "या आठवड्यात",
    statsMonth: "या महिन्यात",
    statsLifetime: "एकूण",
    listenBtn: "🔊 ऐका",
    stopBtn: "⏹ थांबवा",
    autoScrollBtn: "▶ स्वयंचलित स्क्रोल",
    scrollSpeedControls: "वेग: ",
    audioSpeedLabel: "ऑडिओ गती",
    audioSpeedControls: "गती: ",
    scrollSlow: "हळूवार",
    scrollMedium: "मध्यम",
    scrollFast: "जलद",
    chapterDrawer: "अध्याय यादी",
    prevBtn: "मागील",
    nextBtn: "पुढील",
    pageLabel: "अध्याय",
    searchBookPlaceholder: "या पुस्तकात शोधा...",
    resumeReadPrompt: "मागील वाचनापासून सुरू करा",
    panchangWidgetTitle: "आजचे पंचांग",
    panchangWidgetBadge: "पंचांग",
    panchangLocation: "स्थान",
    dismissBanner: "बंद करा",
    muhurtLabel: "मुहूर्त",
    compassLabel: "दिशादर्शक",
    masa: "मास",
    pakshaLabel: "पक्ष",
    tithiLabel: "तिथी",
    nakshatraLabel: "नक्षत्र",
    selectDateTitle: "प्रवचन दिनांक निवडा",
    monthLabel: "महिना",
    dayLabel: "दिवस",
    verified: "सत्यापित",
    unverified: "पडताळणी प्रलंबित",
    verifiedDetailTitle: "अधिकृत स्रोत सत्यापित",
    verifiedDetailDesc: "हे पान एका अधिकृत आणि विश्वासार्ह स्रोताकडून पडताळले गेले आहे.",
    unverifiedDetailTitle: "पडताळणी प्रलंबित",
    unverifiedDetailDesc: "या पानाची पडताळणी अजून पूर्ण झालेली नाही.",
    close: "बंद करा",
    updatesTitle: "नवीन बदल आणि अपडेट्स",
    updatesHeader: "ॲप अपडेट्स",
    updatesTab: "अपडेट्स",
    loadingUpdates: "माहिती लोड होत आहे...",
    retryUpdates: "पुन्हा प्रयत्न करा",
    currentVersionLabel: "तुमची सध्याची आवृत्ती:",
    latestVersionLabel: "नवीन उपलब्ध आवृत्ती:",
    appUpToDate: "तुमचे ॲप अद्ययावत आहे",
    updateAvailable: "नवीन अपडेट उपलब्ध आहे! पेज अद्ययावत करण्यासाठी कृपया रीफ्रेश करा.",
  }
};

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const lang = 'mr';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem('site-language');
    window.localStorage.removeItem('language-popup-dismissed');
  }, []);

  const t = (key) => translations.mr[key] || key;

  const translateNumbers = (value) => {
    if (value === undefined || value === null) return '';
    const numStr = value.toString();
    const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return numStr.replace(/[0-9]/g, (digit) => devanagariDigits[parseInt(digit, 10)]);
  };

  return (
    <LanguageContext.Provider value={{ lang, t, translateNumbers }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
