import React, { useState, useEffect } from 'react';
import { Menu, Layers } from 'lucide-react';

export const LeftVerticalBar = () => {
  const [activeSection, setActiveSection] = useState('interactive-3d');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'portfolio', 'booking', 'aftercare', 'blog', 'contact'];
      const scrollPos = window.scrollY + 300;

      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-12 bg-studio-darker/95 border-r border-studio-border/40 hidden lg:flex flex-col items-center justify-between py-6 z-40 backdrop-blur-md transition-colors">
      {/* Top Menu Icon */}
      <button 
        onClick={() => scrollToSection('top')}
        className="text-studio-textMuted hover:text-studio-bronzeLight transition-colors p-2"
        title="Top of page"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Middle Vertical Text Elements (Ancient Devbhoomi Styling) */}
      <div className="flex flex-col items-center space-y-12">
        {/* INTERACTIVE 3D (Ancient Golden Rune Glow) */}
        <button
          onClick={() => scrollToSection('interactive-3d')}
          className={`writing-vertical text-[11px] font-bold font-display tracking-[0.3em] uppercase transition-all duration-300 ${
            activeSection === 'interactive-3d' || activeSection === 'hero'
              ? 'text-studio-gold drop-shadow-[0_0_12px_rgba(226,183,125,0.95)] scale-105'
              : 'text-studio-textMuted/60 hover:text-studio-gold'
          }`}
        >
          🔱 3D STUDIO LAB
        </button>

        {/* ABOUT */}
        <button
          onClick={() => scrollToSection('about')}
          className={`writing-vertical text-[11px] font-bold font-display tracking-[0.3em] uppercase transition-all duration-300 ${
            activeSection === 'about'
              ? 'text-studio-gold drop-shadow-[0_0_10px_rgba(226,183,125,0.9)] scale-105'
              : 'text-studio-textMuted/60 hover:text-studio-textMain'
          }`}
        >
          HERITAGE
        </button>

        {/* PORTFOLIO */}
        <button
          onClick={() => scrollToSection('portfolio')}
          className={`writing-vertical text-[11px] font-bold font-display tracking-[0.3em] uppercase transition-all duration-300 ${
            activeSection === 'portfolio'
              ? 'text-studio-gold drop-shadow-[0_0_10px_rgba(226,183,125,0.9)] scale-105'
              : 'text-studio-textMuted/60 hover:text-studio-textMain'
          }`}
        >
          PORTFOLIO
        </button>
      </div>

      {/* Bottom Subtle Icon */}
      <button 
        onClick={() => scrollToSection('booking')}
        className="text-studio-bronze/70 hover:text-studio-bronze transition-colors p-1 text-xs"
        title="Quick Book"
      >
        <Layers className="w-4 h-4" />
      </button>
    </aside>
  );
};
