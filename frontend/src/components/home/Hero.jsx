import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Interactive3DStudio } from '../tattoo-studio/Interactive3DStudio';
import { TATTOO_ARTWORKS_CATALOG } from '../tattoo-studio/TattooArtworks';
import { Sparkles, Heart, ArrowRight, Check, Compass, Shield, Flame, Sliders } from 'lucide-react';
import { toast } from 'sonner';
import { createArtworkInquiryUrl } from '../../utils/whatsapp';

export const Hero = () => {
  const [selectedBodyArea, setSelectedBodyArea] = useState('Forearm');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState('All');
  const [selectedDesign, setSelectedDesign] = useState(TATTOO_ARTWORKS_CATALOG[0]);
  const [savedFavorites, setSavedFavorites] = useState([]);
  const navigate = useNavigate();

  const stylesList = ['All', 'Minimalist', 'Fine Line', 'Geometric', 'Traditional', 'Script', 'Mandala', 'Realism', 'Blackwork', 'Neo-Traditional', 'Watercolor'];

  const filteredTattoos = TATTOO_ARTWORKS_CATALOG.filter((t) => {
    return selectedStyleFilter === 'All' || t.style.toLowerCase() === selectedStyleFilter.toLowerCase();
  });

  const handleSelectBodyPart = (areaName) => {
    setSelectedBodyArea(areaName);
    toast.success(`Touched ${areaName}! Previewing "${selectedDesign.name}" on your ${areaName}`);
  };

  const handleSelectDesign = (design) => {
    setSelectedDesign(design);
    toast.success(`Selected "${design.name}". Applied to ${selectedBodyArea}!`);
  };

  const handleToggleFavorite = (design, e) => {
    e.stopPropagation();
    const isFav = savedFavorites.includes(design._id);
    if (isFav) {
      setSavedFavorites(savedFavorites.filter(id => id !== design._id));
      toast.info(`Removed "${design.name}" from favorites`);
    } else {
      setSavedFavorites([...savedFavorites, design._id]);
      toast.success(`Saved "${design.name}" to favorites!`);
    }
  };

  const handleBookWithSelected = () => {
    navigate(`/booking?style=${encodeURIComponent(selectedDesign?.style || 'Custom')}&placement=${encodeURIComponent(selectedBodyArea)}&design=${encodeURIComponent(selectedDesign?.name || 'Custom')}`);
  };

  return (
    <section id="hero" className="relative min-h-screen pt-20 pb-16 bg-studio-bg flex flex-col justify-center overflow-hidden transition-colors">
      {/* Studio ambient lighting backdrop (Hardware accelerated, zero blur cost) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,_rgba(167,131,93,0.12)_0%,_transparent_70%)] pointer-events-none transform-gpu" />

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[640px]">
          
          {/* LEFT COLUMN: HERO HEADLINE & ACTIONS (Matches Reference UI Left Side) */}
          <div className="lg:col-span-4 space-y-6 pt-4 lg:pt-0 text-left lg:pl-4">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-studio-bronze/10 border border-studio-bronze/40 rounded-full">
                <span className="text-studio-gold text-xs">🔱</span>
                <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-studio-bronzeLight">
                  DEVBHOOMI ATELIER • FRIENDS COLONY, UNA
                </span>
                <span className="text-studio-gold text-xs">🔱</span>
              </div>
              
              <h1 className="ancient-carved-heading text-4xl sm:text-5xl xl:text-6xl leading-[1.05] tracking-wide text-studio-textMain">
                YOUR VISION, <br />
                <span className="ancient-gold-text">SACRED INK.</span>
              </h1>
            </div>

            <p className="text-sm md:text-base text-studio-textMuted leading-relaxed max-w-md font-sans border-l-2 border-studio-bronze/40 pl-3 italic">
              "Where ancient Himalayan spiritual reverence meets eternal needlework." Touch any spot on the human body model to discover sacred designs crafted in Friends Colony, Una.
            </p>

            {/* Action Buttons with Antique Gold Borders */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#portfolio"
                className="bg-gradient-to-r from-studio-bronze via-amber-700 to-studio-bronzeDark hover:from-amber-600 hover:to-studio-bronze text-white font-bold px-7 py-3.5 text-xs font-display tracking-[0.2em] uppercase shadow-lg shadow-amber-950/50 transition-all duration-300 transform hover:scale-[1.02] rounded border border-amber-400/30"
              >
                EXPLORE SACRED ART
              </a>
              <a
                href="#booking"
                className="border border-studio-bronze/60 hover:border-studio-gold text-studio-bronzeLight hover:text-white hover:bg-studio-bronze/20 px-6 py-3.5 text-xs font-display tracking-[0.2em] uppercase transition-all duration-300 rounded font-bold backdrop-blur-sm"
              >
                CONSULT WITH MASTERS
              </a>
            </div>

            {/* Studio credentials */}
            <div className="pt-4 flex items-center space-x-6 border-t border-studio-border/40 text-xs text-studio-textMuted font-serif">
              <div className="flex items-center space-x-1.5">
                <span className="text-studio-gold">❖</span>
                <span><strong className="text-studio-textMain">100%</strong> Sterile Single-Use</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-studio-bronze/50" />
              <div className="flex items-center space-x-1.5">
                <span className="text-studio-gold">★</span>
                <span><strong className="text-studio-textMain">5.0★</strong> Google Reviews (Una)</span>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: ACTUAL HUMAN BODY - TOUCH ANY PART TO SEE TATTOO LOOK */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <Interactive3DStudio
              selectedBodyArea={selectedBodyArea}
              onSelectBodyArea={handleSelectBodyPart}
              selectedDesign={selectedDesign}
              onSelectDesign={setSelectedDesign}
            />
          </div>

          {/* RIGHT COLUMN: TATTOO OPTIONS & ARTIST FLASH (Ancient Stone Tablet Card) */}
          <div className="lg:col-span-3">
            <div className="ancient-stone-card ancient-ornate-corner rounded-xl p-5 border border-studio-bronze/40 shadow-2xl space-y-3.5 transition-colors">
              
              {/* Card Header */}
              <div className="border-b border-studio-border/40 pb-2.5">
                <h3 className="ancient-carved-heading text-xs tracking-widest text-studio-gold flex items-center justify-between">
                  <span>॥ SACRED DESIGNS ॥</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h3>
                <p className="text-[11px] text-studio-textMuted mt-0.5 font-serif italic">
                  Handcrafted by Land of God resident masters.
                </p>
              </div>

              {/* Active Touched Body Spot Indicator */}
              <div className="flex items-center justify-between text-xs bg-studio-secondary/90 p-2.5 rounded-lg border border-studio-bronze/40">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
                  <span className="text-studio-bronzeLight font-bold uppercase text-[11px] font-display tracking-wider">
                    Spot: {selectedBodyArea.toUpperCase()}
                  </span>
                </div>
                <span className="text-[10px] text-studio-textMuted bg-studio-card/80 px-2 py-0.5 rounded border border-studio-border/40 font-serif">
                  {filteredTattoos.length} motifs
                </span>
              </div>

              {/* Style Category Filter Pills */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-studio-textMuted">
                  <span>Filter By Sacred Style:</span>
                  {selectedStyleFilter !== 'All' && (
                    <button
                      onClick={() => setSelectedStyleFilter('All')}
                      className="text-studio-bronzeLight hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-[10px] no-scrollbar">
                  {stylesList.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedStyleFilter(s)}
                      className={`px-2.5 py-1 rounded whitespace-nowrap transition-all text-[10px] font-semibold ${
                        selectedStyleFilter === s
                          ? 'bg-studio-bronze text-white font-bold shadow-sm'
                          : 'bg-studio-secondary/70 text-studio-textMuted hover:text-studio-textMain border border-studio-border/20'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tattoo Options List */}
              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {filteredTattoos.map((idea) => {
                  const isSelected = selectedDesign?._id === idea._id || selectedDesign?.name === idea.name;
                  const isFavorite = savedFavorites.includes(idea._id);

                  return (
                    <div
                      key={idea._id}
                      onClick={() => handleSelectDesign(idea)}
                      className={`group relative flex items-center space-x-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200 border ${
                        isSelected
                          ? 'bg-studio-secondary/95 border-2 border-studio-glowCyan shadow-cyan-glow'
                          : 'bg-studio-secondary/50 border-studio-border/30 hover:border-studio-bronze/60 hover:bg-studio-secondary/80 shadow-sm'
                      }`}
                    >
                      {/* Thumbnail / Pure Tattoo Flash Vector Artwork */}
                      <div className="w-12 h-12 rounded-md bg-studio-darker/90 overflow-hidden shrink-0 border border-studio-border/60 flex items-center justify-center relative p-1 text-studio-textMain">
                        {idea.svg}
                        {isSelected && (
                          <div className="absolute inset-0 bg-sky-500/20 backdrop-blur-[1px] flex items-center justify-center">
                            <Check className="w-4 h-4 text-studio-glowCyan drop-shadow-md" />
                          </div>
                        )}
                      </div>

                      {/* Info & Description */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-studio-glowCyan font-extrabold' : 'text-studio-textMain'}`}>
                            {idea.name}
                          </h4>
                          <button
                            onClick={(e) => handleToggleFavorite(idea, e)}
                            className="p-1 text-studio-textMuted hover:text-red-400 transition-colors"
                            title="Save design"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <span className="text-[9px] font-bold text-studio-bronzeLight bg-studio-secondary px-1.5 py-0.2 rounded border border-studio-border/30">
                            {idea.style}
                          </span>
                          <span className="text-[9px] text-studio-textMuted font-mono">
                            {idea.estTime}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-studio-border/20">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectDesign(idea);
                              const waUrl = createArtworkInquiryUrl(
                                idea.name,
                                idea.artist || 'Master Sunil',
                                selectedBodyArea
                              );
                              window.open(waUrl, '_blank');
                            }}
                            className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 px-2 py-0.5 rounded transition-all shadow-sm"
                            title="Contact Admin on WhatsApp for details"
                          >
                            <span>💬 WhatsApp Details</span>
                          </button>
                          <span className="text-[9px] text-studio-textMuted font-mono">
                            ~{idea.estTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Booking & WhatsApp CTA Buttons with Selected Design */}
              <div className="pt-2 border-t border-studio-border/40 space-y-2">
                <button
                  onClick={handleBookWithSelected}
                  className="w-full bg-gradient-to-r from-studio-bronze to-amber-700 hover:from-amber-600 hover:to-studio-bronze text-white font-bold py-2.5 px-4 text-xs font-display tracking-wider uppercase rounded-lg shadow-md flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.01] border border-amber-400/30"
                >
                  <span>Book {selectedDesign?.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* WhatsApp Quick Ask */}
                <button
                  onClick={() => {
                    const waUrl = createArtworkInquiryUrl(
                      selectedDesign?.name || 'Tattoo Design',
                      selectedDesign?.artist || 'Master Sunil',
                      selectedBodyArea
                    );
                    window.open(waUrl, '_blank');
                  }}
                  className="w-full bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 font-display font-bold py-2 px-3 text-[11px] tracking-wider uppercase rounded-lg transition-all flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <span>💬 Inquire This Design on WhatsApp</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
