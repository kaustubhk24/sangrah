import React from 'react';

export default function DeityIcon({ name, size = 32, color = "#E67E22" }) {
  const key = (name || '').toLowerCase();

  const iconMapping = {
    ganpati: '/img/deity/ganpati.png',
    ganesha: '/img/deity/ganpati.png',
    ram: '/img/deity/ram.png',
    shriram: '/img/deity/ram.png',
    rama: '/img/deity/ram.png',
    hanuman: '/img/deity/hanuman.png',
    maruti: '/img/deity/hanuman.png',
    shiv: '/img/deity/shiv.png',
    shiva: '/img/deity/shiv.png',
    shankar: '/img/deity/shiv.png',
    devi: '/img/deity/devi.png',
    durga: '/img/deity/devi.png',
    datt: '/img/deity/datt.png',
    datta: '/img/deity/datt.png',
    dattatreya: '/img/deity/datt.png',
    krushna: '/img/deity/krushna.png',
    krishna: '/img/deity/krushna.png',
    surya: '/img/deity/surya.png',
    sun: '/img/deity/surya.png'
  };

  const src = iconMapping[key];

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        style={{ borderRadius: '50%', objectFit: 'cover', display: 'inline-block', verticalAlign: 'middle' }}
      />
    );
  }

  return (
    <span style={{ fontSize: `${size}px`, display: 'inline-block', verticalAlign: 'middle' }}>🙏</span>
  );
}
