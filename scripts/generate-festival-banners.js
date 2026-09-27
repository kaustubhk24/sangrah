const fs = require('fs');
const path = require('path');
const { getPanchangam, Observer } = require('@ishubhamx/panchangam-js');

const timezone = 'Asia/Kolkata';
const timezoneOffset = 330;
const calendarType = 'amanta';
const observer = new Observer(18.5204, 73.8567, 10);
const definitionsPath = path.join(__dirname, '..', 'src', 'data', 'festivalBanners.json');
const outputPath = path.join(__dirname, '..', 'src', 'data', 'festivalBannerDates.json');
const definitions = JSON.parse(fs.readFileSync(definitionsPath, 'utf8'));
const panchangCache = new Map();

const pakshaTithis = {
  Shukla: ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima'],
  Krishna: ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'],
};

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(value, days) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return dateKey(date);
}

function getPanchang(date) {
  if (!panchangCache.has(date)) {
    const [year, month, day] = date.split('-').map(Number);
    const localNoon = new Date(Date.UTC(year, month - 1, day, 12));
    panchangCache.set(date, getPanchangam(localNoon, observer, { timezoneOffset, calendarType }));
  }
  return panchangCache.get(date);
}

function matchesRule(date, rule) {
  const panchang = getPanchang(date);
  if (rule.festival) {
    return panchang.festivals?.some((festival) => festival.name === rule.festival) || false;
  }

  const tithiIndex = pakshaTithis[rule.paksha]?.indexOf(rule.tithi);

  return panchang.masa?.name === rule.masa
    && Boolean(panchang.masa?.isAdhika) === Boolean(rule.isAdhika)
    && panchang.paksha === rule.paksha
    && tithiIndex >= 0
    && panchang.tithi === tithiIndex + (rule.paksha === 'Krishna' ? 15 : 0);
}

function findDate(rule, from, to) {
  for (let cursor = new Date(`${from}T00:00:00Z`); cursor <= new Date(`${to}T00:00:00Z`); cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    const date = dateKey(cursor);
    if (matchesRule(date, rule)) return date;
  }
  return null;
}

const yearInPune = Number(new Intl.DateTimeFormat('en', { timeZone: timezone, year: 'numeric' }).format(new Date()));
const occurrences = [];

for (const definition of definitions) {
  for (const year of [yearInPune - 1, yearInPune, yearInPune + 1]) {
    const startDate = findDate(definition.startRule, `${year}-01-01`, `${year}-12-31`);
    if (!startDate) {
      throw new Error(`Could not resolve ${definition.id} start rule for ${year} in Pune.`);
    }

    const endDate = findDate(definition.endRule, startDate, addDays(startDate, 60));
    if (!endDate) {
      throw new Error(`Could not resolve ${definition.id} end rule for ${year} in Pune.`);
    }

    occurrences.push({
      ...definition,
      key: `${definition.id}-${year}`,
      year,
      startDate,
      endDate,
      showFromDate: addDays(startDate, -2),
    });
  }
}

occurrences.sort((left, right) => left.showFromDate.localeCompare(right.showFromDate));
fs.writeFileSync(outputPath, `${JSON.stringify(occurrences, null, 2)}\n`);