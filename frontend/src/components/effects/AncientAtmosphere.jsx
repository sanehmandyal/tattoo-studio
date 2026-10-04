import React, { useMemo } from 'react';

export const AncientAtmosphere = () => {
  // Generate a minimal, lightweight set of hardware-accelerated embers (8 particles)
  const embers = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      left: `${(i * 12 + 6)}%`,
      bottom: `${(i * 10 + 5)}%`,
      size: (i % 3) + 2,
      duration: 14 + (i * 2),
      delay: i * 1.5,
      opacity: 0.45,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transform-gpu contain-strict">
      {/* Static Vignette (Pre-rendered gradient, 0 repaint cost) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(0,0,0,0.8)_100%)]" />

      {/* Hardware-accelerated rotating sacred mandala */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] opacity-[0.03] sacred-mandala-spin transform-gpu pointer-events-none will-change-transform">
        <svg viewBox="0 0 200 200" className="w-full h-full text-studio-gold stroke-current" fill="none" strokeWidth="0.8">
          <circle cx="100" cy="100" r="95" strokeDasharray="4 4"/>
          <circle cx="100" cy="100" r="85"/>
          <circle cx="100" cy="100" r="65"/>
          <polygon points="100,15 120,85 185,100 120,115 100,185 80,115 15,100 80,85" strokeWidth="0.6"/>
          <polygon points="100,30 145,55 170,100 145,145 100,170 55,145 30,100 55,55" strokeWidth="0.6"/>
        </svg>
      </div>

      {/* Lightweight hardware-accelerated embers */}
      {embers.map((ember) => (
        <div
          key={ember.id}
          className="ember-particle transform-gpu will-change-transform"
          style={{
            left: ember.left,
            bottom: ember.bottom,
            width: `${ember.size}px`,
            height: `${ember.size}px`,
            opacity: ember.opacity,
            animation: `floatEmber ${ember.duration}s infinite linear`,
            animationDelay: `${ember.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default AncientAtmosphere;
