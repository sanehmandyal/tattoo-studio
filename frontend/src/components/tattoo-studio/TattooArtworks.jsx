import React from 'react';

// Pure Tattoo Flash & Reference Artworks for Placement Studio
export const TATTOO_ARTWORKS_CATALOG = [
  {
    id: 'una-moon-flora',
    _id: 'una-moon-flora',
    name: 'Minimalist Moon & Flora',
    artist: 'Master Sunil',
    artistTitle: 'Sacred Devbhoomi Master',
    style: 'Minimalist',
    description: 'Delicate crescent moon woven with celestial stardust and single-needle wild flora.',
    estTime: '2.0 hrs',
    difficulty: 'Delicate',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1.5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M 50 18 A 32 32 0 1 0 78 68 A 26 26 0 1 1 50 18 Z" fill="#B28854" stroke="currentColor" />
        <circle cx="50" cy="50" r="42" stroke="#966F43" strokeDasharray="3,3" />
        <polygon points="50,6 52,12 58,12 53,16 55,22 50,18 45,22 47,16 42,12 48,12" fill="currentColor" />
        <path d="M 40 85 Q 50 65 65 55 Q 75 48 70 38" stroke="#2d6a4f" strokeWidth="1.8" />
        <circle cx="70" cy="38" r="4" fill="#e11d48" />
      </svg>
    ),
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="%23101415" stroke-width="2.2"><path d="M 50 18 A 32 32 0 1 0 78 68 A 26 26 0 1 1 50 18 Z" fill="%23101415"/><circle cx="50" cy="50" r="42" stroke-dasharray="3,3"/><path d="M 40 85 Q 50 65 65 55 Q 75 48 70 38"/><circle cx="70" cy="38" r="4" fill="%23101415"/></svg>'
  },
  {
    id: 'una-fine-serpent',
    _id: 'una-fine-serpent',
    name: 'Fine Line Serpent & Peony',
    artist: 'Master Sunil',
    artistTitle: 'Sacred Devbhoomi Master',
    style: 'Fine Line',
    description: 'Signature single-needle serpentine silhouette coiled around blooming micro peony petals.',
    estTime: '3.0 hrs',
    difficulty: 'Intermediate',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1.5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M 50 14 Q 32 30 50 46 Q 68 62 50 78 Q 38 88 50 94" stroke="#966F43" strokeWidth="2.5" />
        <circle cx="50" cy="14" r="4" fill="#966F43" />
        <circle cx="50" cy="46" r="14" stroke="#e11d48" strokeDasharray="3,2" />
        <circle cx="50" cy="78" r="10" stroke="#e11d48" strokeDasharray="3,2" />
        <path d="M 36 46 C 36 34 64 34 64 46" stroke="#2d6a4f" strokeWidth="2" />
      </svg>
    ),
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="%23101415" stroke-width="2.5"><path d="M 50 14 Q 32 30 50 46 Q 68 62 50 78 Q 38 88 50 94"/><circle cx="50" cy="14" r="4" fill="%23101415"/><circle cx="50" cy="46" r="14" stroke-dasharray="3,2"/><circle cx="50" cy="78" r="10" stroke-dasharray="3,2"/></svg>'
  },
  {
    id: 'una-script-quote',
    _id: 'una-script-quote',
    name: 'Vedic Sanskrit Script Mantra',
    artist: 'Master Sunil',
    artistTitle: 'Sacred Devbhoomi Master',
    style: 'Script',
    description: 'Custom calligraphic Sanskrit shloka with sacred geometry accents and weightless flourishing.',
    estTime: '1.5 hrs',
    difficulty: 'Delicate',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full p-2">
        <text x="50" y="42" textAnchor="middle" fill="currentColor" fontFamily="Cinzel, cursive, serif" fontWeight="bold" fontSize="22" fontStyle="italic" letterSpacing="1">
          Mantra
        </text>
        <text x="50" y="66" textAnchor="middle" fill="#966F43" fontFamily="Cinzel, cursive, serif" fontWeight="bold" fontSize="20" fontStyle="italic" letterSpacing="1">
          Sacred
        </text>
        <path d="M 18 52 Q 50 48 82 52" stroke="#966F43" strokeWidth="1.5" fill="none" />
        <path d="M 28 76 Q 50 82 72 76" stroke="#966F43" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="42" text-anchor="middle" fill="%23101415" font-family="serif" font-weight="bold" font-size="22" font-style="italic">Mantra</text><text x="50" y="66" text-anchor="middle" fill="%23101415" font-family="serif" font-weight="bold" font-size="20" font-style="italic">Sacred</text><path d="M 18 52 Q 50 48 82 52" stroke="%23101415" stroke-width="2" fill="none"/><path d="M 28 76 Q 50 82 72 76" stroke="%23101415" stroke-width="2" fill="none"/></svg>'
  },
  {
    id: 'una-lotus-geometry',
    _id: 'una-lotus-geometry',
    name: 'Devbhoomi Sacred Lotus',
    artist: 'Master Sunil',
    artistTitle: 'Sacred Devbhoomi Master',
    style: 'Minimalist',
    description: 'Clean balanced micro-lotus bloom with vertical chakra alignment geometry.',
    estTime: '2.0 hrs',
    difficulty: 'Delicate',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1.5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <line x1="50" y1="10" x2="50" y2="90" stroke="#966F43" strokeWidth="1.5" strokeDasharray="2,2" />
        <circle cx="50" cy="15" r="3" fill="#966F43" />
        <circle cx="50" cy="85" r="3" fill="#966F43" />
        <path d="M 50 35 C 40 45 40 60 50 70 C 60 60 60 45 50 35 Z" fill="currentColor" stroke="#966F43" strokeWidth="1.5" />
        <path d="M 50 45 C 30 50 30 65 45 70" stroke="#966F43" strokeWidth="1.8" />
        <path d="M 50 45 C 70 50 70 65 55 70" stroke="#966F43" strokeWidth="1.8" />
      </svg>
    ),
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="%23101415" stroke-width="2"><line x1="50" y1="10" x2="50" y2="90" stroke-dasharray="2,2"/><circle cx="50" cy="15" r="3" fill="%23101415"/><path d="M 50 35 C 40 45 40 60 50 70 C 60 60 60 45 50 35 Z"/><path d="M 50 45 C 30 50 30 65 45 70"/><path d="M 50 45 C 70 50 70 65 55 70"/></svg>'
  },
  {
    id: 'mark-geom-lion',
    _id: 'mark-geom-lion',
    name: 'Geometric Lion & Mountain',
    artist: 'Master Sunil',
    artistTitle: 'Sacred Devbhoomi Master',
    style: 'Geometric',
    description: 'Low-poly royal Himalayan lion head with sacred geometry line accents.',
    estTime: '3.5 hrs',
    difficulty: 'Complex',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="50,15 35,28 65,28" stroke="currentColor" fill="none" />
        <polygon points="35,28 20,40 38,48" stroke="currentColor" fill="none" />
        <polygon points="65,28 80,40 62,48" stroke="currentColor" fill="none" />
        <polygon points="38,48 50,38 62,48" stroke="#966F43" fill="none" />
        <polygon points="38,48 50,65 62,48" stroke="#966F43" fill="none" />
        <polygon points="20,40 25,65 38,48" stroke="currentColor" fill="none" />
        <polygon points="80,40 75,65 62,48" stroke="currentColor" fill="none" />
        <polygon points="25,65 50,85 50,65" stroke="#966F43" fill="none" />
        <polygon points="75,65 50,85 50,65" stroke="#966F43" fill="none" />
        <polygon points="38,48 25,65 50,65" stroke="currentColor" fill="none" />
        <polygon points="62,48 75,65 50,65" stroke="currentColor" fill="none" />
        <line x1="50" y1="15" x2="50" y2="7" stroke="#966F43" strokeWidth="2" />
      </svg>
    ),
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="%23101415" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polygon points="50,15 35,28 65,28"/><polygon points="35,28 20,40 38,48"/><polygon points="65,28 80,40 62,48"/><polygon points="38,48 50,38 62,48"/><polygon points="38,48 50,65 62,48"/><polygon points="20,40 25,65 38,48"/><polygon points="80,40 75,65 62,48"/><polygon points="25,65 50,85 50,65"/><polygon points="75,65 50,85 50,65"/></svg>'
  },
  {
    id: 'mark-sacred-mandala',
    _id: 'mark-sacred-mandala',
    name: 'Devbhoomi Sacred Mandala',
    artist: 'Master Sunil',
    artistTitle: 'Sacred Devbhoomi Master',
    style: 'Mandala',
    description: 'Hypnotic radial sacred geometry with fine dotwork pointillism.',
    estTime: '4.5 hrs',
    difficulty: 'Masterpiece',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="50" cy="50" r="44" stroke="#966F43" strokeWidth="1.5" strokeDasharray="3,3" />
        <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="24" stroke="#966F43" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="4" fill="#966F43" />
        <path d="M 50 14 Q 58 28 50 38 Q 42 28 50 14 Z" stroke="currentColor" />
        <path d="M 50 86 Q 58 72 50 62 Q 42 72 50 86 Z" stroke="currentColor" />
        <path d="M 14 50 Q 28 58 38 50 Q 28 42 14 50 Z" stroke="currentColor" />
        <path d="M 86 50 Q 72 58 62 50 Q 72 42 86 50 Z" stroke="currentColor" />
      </svg>
    ),
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="%23101415" stroke-width="2"><circle cx="50" cy="50" r="44" stroke-dasharray="3,3"/><circle cx="50" cy="50" r="36"/><circle cx="50" cy="50" r="24"/><circle cx="50" cy="50" r="12"/><circle cx="50" cy="50" r="4" fill="%23101415"/><path d="M 50 14 Q 58 28 50 38 Q 42 28 50 14 Z"/><path d="M 50 86 Q 58 72 50 62 Q 42 72 50 86 Z"/></svg>'
  },
  {
    id: 'eliza-trad-rose',
    _id: 'eliza-trad-rose',
    name: 'Himalayan Sacred Rose',
    artist: 'Master Sunil',
    artistTitle: 'Sacred Devbhoomi Master',
    style: 'Traditional',
    description: 'Traditional blooming crimson rose with emerald leaves and bold structural outlines.',
    estTime: '2.5 hrs',
    difficulty: 'Intermediate',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1">
        <path d="M 25 70 C 15 65 15 45 35 48 C 30 65 25 70 25 70 Z" fill="#2d6a4f" stroke="#14171A" strokeWidth="2" />
        <path d="M 75 70 C 85 65 85 45 65 48 C 70 65 75 70 75 70 Z" fill="#2d6a4f" stroke="#14171A" strokeWidth="2" />
        <path d="M 50 20 C 30 20 25 45 50 65 C 75 45 70 20 50 20 Z" fill="#b91c1c" stroke="#14171A" strokeWidth="2.5" />
        <path d="M 40 28 C 45 22 55 22 60 28 C 65 38 58 48 50 48 C 42 48 35 38 40 28 Z" fill="#e11d48" stroke="#14171A" strokeWidth="2" />
        <path d="M 45 32 C 48 28 52 28 55 32 C 57 38 53 42 50 42 C 47 42 43 38 45 32 Z" fill="#ffe4e6" stroke="#14171A" strokeWidth="1.5" />
      </svg>
    ),
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M 25 70 C 15 65 15 45 35 48 C 30 65 25 70 25 70 Z" fill="%232d6a4f" stroke="%23101415" stroke-width="2"/><path d="M 75 70 C 85 65 85 45 65 48 C 70 65 75 70 75 70 Z" fill="%232d6a4f" stroke="%23101415" stroke-width="2"/><path d="M 50 20 C 30 20 25 45 50 65 C 75 45 70 20 50 20 Z" fill="%23b91c1c" stroke="%23101415" stroke-width="2.5"/></svg>'
  },
  {
    id: 'liam-gothic-skull',
    _id: 'liam-gothic-skull',
    name: 'Gothic Obsidian Skull',
    artist: 'Master Sunil',
    artistTitle: 'Sacred Devbhoomi Master',
    style: 'Blackwork',
    description: 'Heavy contrast dark art skull with filigree ornamentation and bold depth.',
    estTime: '4.0 hrs',
    difficulty: 'Complex',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M 28 45 C 28 25 72 25 72 45 C 72 58 66 65 64 78 L 36 78 C 34 65 28 58 28 45 Z" stroke="currentColor" fill="#966F43" fillOpacity="0.2" />
        <ellipse cx="40" cy="48" rx="6" ry="8" fill="currentColor" stroke="#966F43" strokeWidth="1.5" />
        <ellipse cx="60" cy="48" rx="6" ry="8" fill="currentColor" stroke="#966F43" strokeWidth="1.5" />
        <polygon points="50,56 46,65 54,65" fill="currentColor" stroke="#966F43" />
        <line x1="42" y1="72" x2="42" y2="78" stroke="currentColor" strokeWidth="2" />
        <line x1="50" y1="72" x2="50" y2="78" stroke="currentColor" strokeWidth="2" />
        <line x1="58" y1="72" x2="58" y2="78" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="%23101415" stroke-width="2.5"><path d="M 28 45 C 28 25 72 25 72 45 C 72 58 66 65 64 78 L 36 78 C 34 65 28 58 28 45 Z"/><ellipse cx="40" cy="48" rx="6" ry="8" fill="%23101415"/><ellipse cx="60" cy="48" rx="6" ry="8" fill="%23101415"/></svg>'
  },
  {
    id: 'liam-neo-dagger',
    _id: 'liam-neo-dagger',
    name: 'Devbhoomi Trishul Dagger',
    artist: 'Master Sunil',
    artistTitle: 'Sacred Devbhoomi Master',
    style: 'Neo-Traditional',
    description: 'Jeweled ornate dagger piercing sacred heart with banner shading and sacred geometry.',
    estTime: '3.5 hrs',
    difficulty: 'Intermediate',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M 50 10 L 50 90" stroke="#966F43" strokeWidth="3" />
        <line x1="32" y1="30" x2="68" y2="30" stroke="currentColor" strokeWidth="3" />
        <polygon points="50,90 44,70 56,70" fill="#966F43" stroke="#14171A" />
        <circle cx="50" cy="22" r="5" fill="#b91c1c" stroke="currentColor" />
        <path d="M 35 48 C 30 40 40 35 50 45 C 60 35 70 40 65 48 C 60 58 50 68 50 68 C 50 68 40 58 35 48 Z" fill="#e11d48" stroke="#14171A" />
      </svg>
    ),
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="%23101415" stroke-width="2.5"><path d="M 50 10 L 50 90" stroke-width="3"/><line x1="32" y1="30" x2="68" y2="30" stroke-width="3"/><polygon points="50,90 44,70 56,70" fill="%23101415"/><path d="M 35 48 C 30 40 40 35 50 45 C 60 35 70 40 65 48 C 60 58 50 68 50 68 C 50 68 40 58 35 48 Z" fill="%23b91c1c"/></svg>'
  },
  {
    id: 'sophia-jp-dragon',
    _id: 'sophia-jp-dragon',
    name: 'Spiritual Ryu Dragon',
    artist: 'Master Sunil',
    artistTitle: 'Sacred Devbhoomi Master',
    style: 'Japanese',
    description: 'Eastern dragon weaving through storm clouds and flames with divine protection.',
    estTime: '6.0 hrs',
    difficulty: 'Masterpiece',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M 20 80 Q 30 40 50 50 Q 70 60 75 30 Q 80 15 65 20 Q 50 25 55 35" stroke="#966F43" strokeWidth="3" />
        <circle cx="65" cy="20" r="6" fill="#e11d48" stroke="#14171A" />
        <path d="M 30 75 Q 40 55 60 55 Q 80 55 85 35" stroke="currentColor" strokeDasharray="2,3" />
        <path d="M 15 85 Q 25 75 35 85" stroke="#0284C7" />
      </svg>
    ),
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="%23101415" stroke-width="3"><path d="M 20 80 Q 30 40 50 50 Q 70 60 75 30 Q 80 15 65 20 Q 50 25 55 35"/><circle cx="65" cy="20" r="6" fill="%23b91c1c"/></svg>'
  },
  {
    id: 'sophia-phoenix',
    _id: 'sophia-phoenix',
    name: 'Sacred Watercolor Phoenix',
    artist: 'Master Sunil',
    artistTitle: 'Sacred Devbhoomi Master',
    style: 'Watercolor',
    description: 'Vibrant celestial wings with crimson and amber wash transitions.',
    estTime: '4.5 hrs',
    difficulty: 'Masterpiece',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
        <path d="M 50 75 Q 30 40 20 20 Q 45 35 50 50 Q 55 35 80 20 Q 70 40 50 75 Z" fill="#e11d48" opacity="0.8" />
        <path d="M 50 85 Q 35 60 25 45 Q 45 55 50 65 Q 55 55 75 45 Q 65 60 50 85 Z" fill="#966F43" opacity="0.9" />
        <circle cx="50" cy="22" r="5" fill="#f59e0b" />
        <path d="M 50 25 L 50 92" stroke="currentColor" strokeWidth="2" strokeDasharray="3,2" />
      </svg>
    ),
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M 50 75 Q 30 40 20 20 Q 45 35 50 50 Q 55 35 80 20 Q 70 40 50 75 Z" fill="%23b91c1c"/><path d="M 50 85 Q 35 60 25 45 Q 45 55 50 65 Q 55 55 75 45 Q 65 60 50 85 Z" fill="%23d97706"/></svg>'
  }
];
