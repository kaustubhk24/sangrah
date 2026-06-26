import React from 'react';

export default function DeityIcon({ name, size = 32, color = "#E67E22" }) {
  // Normalize key
  const key = (name || '').toLowerCase();

  switch (key) {
    case 'ganpati':
    case 'ganesha':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Head & Crown */}
          <path d="M12 6 C 9 6, 9 10, 10 12" />
          <path d="M10 5 L12 2 L14 5 Z" fill={color} fillOpacity="0.2" />
          <circle cx="12" cy="7.5" r="0.5" fill={color} />
          
          {/* Trunk with curve */}
          <path d="M10 12 C 10.5 14.5, 13 14.5, 13.5 12.5 C 13.8 11.5, 13.2 11, 12.5 11" />
          
          {/* Ears */}
          <path d="M9.5 7.5 C 6.5 7.5, 6 10, 9 11" />
          <path d="M14.5 7.5 C 17.5 7.5, 18 10, 15 11" />
          
          {/* Modak */}
          <path d="M 15 14.5 C 14.5 14.5, 14 15, 14 15.5 C 14 16.5, 15 17.5, 15.5 17.5 C 16 17.5, 17 16.5, 17 15.5 C 17 15, 16.5 14.5, 16 14.5 Z" fill={color} fillOpacity="0.1" />
        </svg>
      );
    
    case 'ram':
    case 'shriram':
    case 'rama':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Curved Bow */}
          <path d="M 6 3 C 15 5, 15 19, 6 21" strokeWidth="2" />
          {/* Bow String */}
          <path d="M 6 3 V 21" />
          {/* Arrow */}
          <path d="M 18 12 H 4" strokeWidth="1.8" />
          {/* Arrow Tip */}
          <path d="M 18 12 L 14 9 M 18 12 L 14 15" />
          {/* Saffron Temple Flag (Dhwaj) at the top of the bow */}
          <path d="M 6 4 H 12 L 10.5 6 L 12 8 H 6" fill={color} fillOpacity="0.2" />
        </svg>
      );

    case 'hanuman':
    case 'maruti':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Mace head (orbed/bulbous) */}
          <path d="M 12 4.5 C 15.5 4.5, 17 7.5, 17 9.5 C 17 11.5, 15.5 14, 12 14 C 8.5 14, 7 11.5, 7 9.5 C 7 7.5, 8.5 4.5, 12 4.5 Z" strokeWidth="2" fill={color} fillOpacity="0.15" />
          
          {/* Mace spire/top spike */}
          <path d="M 12 4.5 V 2" />
          
          {/* Mace grooves/ribs */}
          <path d="M 12 4.5 C 10 6, 10 12, 12 14" />
          <path d="M 12 4.5 C 14 6, 14 12, 12 14" />
          <path d="M 7.2 9.5 H 16.8" />
          
          {/* Shaft/Handle */}
          <path d="M 12 14 V 22" strokeWidth="2" />
          
          {/* Handle Grip Details */}
          <path d="M 10 22 H 14" strokeWidth="2" />
          
          {/* Saffron flag tied to the handle */}
          <path d="M 12 16.5 H 17.5 L 16 18 L 17.5 19.5 H 12" fill={color} fillOpacity="0.25" />
        </svg>
      );

    case 'shiv':
    case 'shiva':
    case 'shankar':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Central Shaft */}
          <path d="M 12 2 V 22" strokeWidth="2" />
          
          {/* Trishul Prongs */}
          <path d="M 7 7 C 7 12, 17 12, 17 7" strokeWidth="2" />
          <path d="M 7 7 V 4" strokeWidth="1.5" />
          <path d="M 17 7 V 4" strokeWidth="1.5" />
          
          {/* Crescent Moon */}
          <path d="M 13.5 4 C 15.5 4, 16.5 5.5, 16 7 C 14.8 6.8, 14.2 5.5, 13.5 4 Z" fill={color} fillOpacity="0.3" />
          
          {/* Damru (Hourglass shape) */}
          <path d="M 9.5 13 H 14.5 L 9.5 17 H 14.5 Z" fill={color} fillOpacity="0.15" />
          <circle cx="12" cy="15" r="1.5" fill={color} />
        </svg>
      );

    case 'devi':
    case 'durga':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Lotus Outer Petals */}
          <path d="M 12 16 C 9.5 16, 7 14, 6 12 C 5 10, 7 9, 8.5 10 C 9.5 10.5, 11 12, 12 13" />
          <path d="M 12 16 C 14.5 16, 17 14, 18 12 C 19 10, 17 9, 15.5 10 C 14.5 10.5, 13 12, 12 13" />
          
          {/* Lotus Inner Petals */}
          <path d="M 12 7 C 10 9, 10 14, 12 16 C 14 14, 14 9, 12 7 Z" fill={color} fillOpacity="0.2" />
          
          {/* Tilak / Kumkum Bindu */}
          <circle cx="12" cy="11.5" r="1.2" fill="#d32f2f" stroke="#d32f2f" />
          
          {/* Base Stem / Aura */}
          <path d="M 12 16 C 12 18, 10 19.5, 12 21 C 14 19.5, 12 18, 12 16 Z" />
        </svg>
      );

    case 'datt':
    case 'datta':
    case 'dattatreya':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Sacred Padukas (footprints) */}
          {/* Left Footprint */}
          <path d="M 9.5 9.5 C 8.5 9.5, 8.2 11.5, 8.5 13.5 C 8.8 15.5, 10.2 16.5, 10.5 14.5 C 10.8 12.5, 10.5 9.5, 9.5 9.5 Z" fill={color} fillOpacity="0.15" />
          <circle cx="9.5" cy="8" r="0.75" fill={color} />
          <circle cx="8.7" cy="8.7" r="0.45" fill={color} />
          <circle cx="8.1" cy="9.6" r="0.4" fill={color} />
          <circle cx="7.7" cy="10.7" r="0.35" fill={color} />
          
          {/* Right Footprint */}
          <path d="M 14.5 9.5 C 15.5 9.5, 15.8 11.5, 15.5 13.5 C 15.2 15.5, 13.8 16.5, 13.5 14.5 C 13.2 12.5, 13.5 9.5, 14.5 9.5 Z" fill={color} fillOpacity="0.15" />
          <circle cx="14.5" cy="8" r="0.75" fill={color} />
          <circle cx="15.3" cy="8.7" r="0.45" fill={color} />
          <circle cx="15.9" cy="9.6" r="0.4" fill={color} />
          <circle cx="16.3" cy="10.7" r="0.35" fill={color} />
          
          {/* Leaf outline underneath */}
          <path d="M 6 15 C 9 15.5, 12 18, 12 21 C 12 18, 15 15.5, 18 15" />
        </svg>
      );

    case 'krushna':
    case 'krishna':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Peacock Feather */}
          <path d="M 14 11 C 15.5 7.5, 19 6, 20.5 7.5 C 21.5 9.5, 18.5 11, 16 11 Z" fill={color} fillOpacity="0.15" />
          <circle cx="17.5" cy="8.5" r="1.5" fill={color} fillOpacity="0.3" />
          <circle cx="17.5" cy="8.5" r="0.5" fill={color} />
          <path d="M 15.5 9.5 C 16.5 8, 19 8, 19.5 9" />
          
          {/* Flute (Bansuri) */}
          <path d="M 4 19 L 19 6" strokeWidth="2.2" />
          <path d="M 5 20 L 20 7" strokeWidth="1" />
          
          {/* Holes */}
          <circle cx="7" cy="16.5" r="0.6" fill={color} />
          <circle cx="9.5" cy="14.3" r="0.6" fill={color} />
          <circle cx="12" cy="12.2" r="0.6" fill={color} />
          <circle cx="14.5" cy="10.1" r="0.6" fill={color} />
          <circle cx="17" cy="8" r="0.6" fill={color} />
          
          {/* Hanging tassels */}
          <path d="M 4.5 19.5 V 22.5" strokeWidth="1" />
          <path d="M 5.5 18.5 V 21.5" strokeWidth="1" strokeDasharray="1,1" />
        </svg>
      );

    case 'surya':
    case 'sun':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Sun center circle */}
          <circle cx="12" cy="12" r="5.5" fill={color} fillOpacity="0.15" strokeWidth="2" />
          
          {/* Straight Rays */}
          <path d="M 12 2 V 5" />
          <path d="M 12 19 V 22" />
          <path d="M 2 12 H 5" />
          <path d="M 19 12 H 22" />
          
          {/* Diagonal Rays */}
          <path d="M 5 5 L 7.5 7.5" />
          <path d="M 16.5 16.5 L 19 19" />
          <path d="M 19 5 L 16.5 7.5" />
          <path d="M 7.5 16.5 L 5 19" />
          
          {/* Sun Face expression (Serene/Tilak) */}
          <path d="M 12 9 V 10.5" strokeWidth="1.5" />
          <path d="M 10 13.5 C 10.5 14.5, 13.5 14.5, 14 13.5" />
        </svg>
      );

    default:
      return (
        <span style={{ fontSize: `${size}px` }}>🙏</span>
      );
  }
}
