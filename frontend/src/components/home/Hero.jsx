import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Interactive3DStudio } from '../tattoo-studio/Interactive3DStudio';
import { TATTOO_ARTWORKS_CATALOG } from '../tattoo-studio/TattooArtworks';
import { designsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Heart, ArrowRight, Check, Shield, Edit3, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { createArtworkInquiryUrl } from '../../utils/whatsapp';
import { getFullImageUrl } from '../../utils/imageHelper';

export const Hero = () => {
  const { isAdmin } = useAuth();
  const [selectedBodyArea, setSelectedBodyArea] = useState('Forearm');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState('All');
  const [designs, setDesigns] = useState(TATTOO_ARTWORKS_CATALOG);
  const [selectedDesign, setSelectedDesign] = useState(TATTOO_ARTWORKS_CATALOG[0]);
  const [savedFavorites, setSavedFavorites] = useState([]);
  const [loadingDesigns, setLoadingDesigns] = useState(true);
  const navigate = useNavigate();

  const stylesList = ['All', 'Minimalist', 'Fine Line', 'Geometric', 'Traditional', 'Script', 'Mandala', 'Realism', 'Blackwork', 'Neo-Traditional', 'Watercolor'];

  // Helper to find best admin reference tattoo for a body area
  const findReferenceTattooForArea = (area, allDesigns) => {
    if (!area || !allDesigns || allDesigns.length === 0) return null;
    const lowerArea = area.toLowerCase();

    // 1. Look for admin default reference explicitly assigned to this body area
    const defaultRef = allDesigns.find(d => 
      Boolean(d.isDefaultReference) &&
      (d.bodyAreas || []).some(a => a.toLowerCase() === lowerArea || lowerArea.includes(a.toLowerCase()) || a.toLowerCase().includes(lowerArea))
    );
    if (defaultRef) return defaultRef;

    // 2. Look for any design tagged with this body area
    const matching = allDesigns.find(d => 
      (d.bodyAreas || []).some(a => a.toLowerCase() === lowerArea || lowerArea.includes(a.toLowerCase()) || a.toLowerCase().includes(lowerArea))
    );
    return matching || allDesigns[0];
  };

  // Fetch dynamic designs from Admin database, preserving all 11 core vector flash artworks
  useEffect(() => {
    const loadDynamicDesigns = async () => {
      try {
        const res = await designsAPI.getAll();
        if (res.success && res.designs && res.designs.length > 0) {
          const dbList = res.designs.map((d) => ({
            id: d._id,
            _id: d._id,
            name: d.name,
            artist: d.artist || 'Master Sunil',
            style: d.style || 'Custom',
            description: d.description || '',
            estTime: `${d.estTimeHours || 2} hrs`,
            difficulty: d.difficulty || 'Custom',
            previewImage: d.previewImage,
            dataUri: d.previewImage || d.transparentOverlay,
            bodyAreas: d.bodyAreas || ['Forearm'],
            isDefaultReference: Boolean(d.isDefaultReference),
            isFromDB: true,
          }));

          // Merge without losing original artworks
          const merged = [...TATTOO_ARTWORKS_CATALOG];
          dbList.forEach((dbItem) => {
            const existingIdx = merged.findIndex(m => m.name.toLowerCase() === dbItem.name.toLowerCase());
            if (existingIdx >= 0) {
              merged[existingIdx] = { ...merged[existingIdx], ...dbItem };
            } else {
              merged.push(dbItem);
            }
          });

          setDesigns(merged);

          // If no design selected yet, select the first
          if (!selectedDesign && merged.length > 0) {
            setSelectedDesign(merged[0]);
          }
        }
      } catch (err) {
        console.warn('Using default flash motifs catalog:', err);
      } finally {
        setLoadingDesigns(false);
      }
    };

    loadDynamicDesigns();
  }, []);

  const filteredTattoos = designs.filter((t) => {
    const matchesStyle = selectedStyleFilter === 'All' || t.style.toLowerCase() === selectedStyleFilter.toLowerCase();
    return matchesStyle;
  });

  // When body part is clicked, keep the selected tattoo locked and test on that body part!
  const handleSelectBodyPart = (areaName) => {
    setSelectedBodyArea(areaName);
    if (selectedDesign) {
      toast.success(`Testing "${selectedDesign.name}" on ${areaName}!`);
    } else if (designs.length > 0) {
      setSelectedDesign(designs[0]);
      toast.success(`Testing "${designs[0].name}" on ${areaName}!`);
    }
  };

  const handleSelectDesign = (design) => {
    setSelectedDesign(design);
    toast.success(`Selected "${design.name}". Testing on ${selectedBodyArea}!`);
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
    <section id="hero" className="relative min-h-screen pt-20 pb-12 sm:pb-16 bg-studio-bg flex flex-col justify-center overflow-hidden transition-colors">
      {/* Studio ambient lighting backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,_rgba(167,131,93,0.12)_0%,_transparent_70%)] pointer-events-none transform-gpu" />

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center min-h-[640px]">
          
          {/* LEFT COLUMN: HERO HEADLINE & ACTIONS */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6 pt-2 lg:pt-0 text-left lg:pl-4">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-studio-bronze/10 border border-studio-bronze/40 rounded-full">
                <span className="text-studio-gold text-xs">🔱</span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold text-studio-bronzeLight">
                  DEVBHOOMI ATELIER • FRIENDS COLONY, UNA
                </span>
                <span className="text-studio-gold text-xs">🔱</span>
              </div>
              
              <h1 className="ancient-carved-heading text-3xl sm:text-5xl xl:text-6xl leading-[1.08] tracking-wide text-studio-textMain">
                YOUR VISION, <br />
                <span className="ancient-gold-text">SACRED INK.</span>
              </h1>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-studio-textMuted leading-relaxed max-w-md font-sans border-l-2 border-studio-bronze/40 pl-3 italic">
              "Where ancient Himalayan spiritual reverence meets eternal needlework." Touch any spot on the human body model to discover sacred designs crafted in Friends Colony, Una.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#portfolio"
                className="bg-gradient-to-r from-studio-bronze via-amber-700 to-studio-bronzeDark hover:from-amber-600 hover:to-studio-bronze text-white font-bold px-5 sm:px-7 py-3 text-[11px] sm:text-xs font-display tracking-[0.2em] uppercase shadow-lg shadow-amber-950/50 transition-all duration-300 transform hover:scale-[1.02] rounded border border-amber-400/30 text-center"
              >
                EXPLORE SACRED ART
              </a>
              <a
                href="#booking"
                className="border border-studio-bronze/60 hover:border-studio-gold text-studio-bronzeLight hover:text-white hover:bg-studio-bronze/20 px-5 sm:px-6 py-3 text-[11px] sm:text-xs font-display tracking-[0.2em] uppercase transition-all duration-300 rounded font-bold backdrop-blur-sm text-center"
              >
                CONSULT WITH MASTERS
              </a>
            </div>

            {/* Studio credentials */}
            <div className="pt-3 sm:pt-4 flex items-center space-x-4 sm:space-x-6 border-t border-studio-border/40 text-xs text-studio-textMuted font-serif">
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
          <div className="lg:col-span-5 relative flex items-center justify-center my-2 lg:my-0">
            <Interactive3DStudio
              selectedBodyArea={selectedBodyArea}
              onSelectBodyArea={handleSelectBodyPart}
              selectedDesign={selectedDesign}
              onSelectDesign={setSelectedDesign}
            />
          </div>

          {/* RIGHT COLUMN: TATTOO OPTIONS & ARTIST FLASH (Ancient Stone Tablet Card) */}
          <div className="lg:col-span-3 w-full">
            <div className="ancient-stone-card ancient-ornate-corner rounded-xl p-4 sm:p-5 border border-studio-bronze/40 shadow-2xl space-y-3 transition-colors text-left">
              
              {/* Card Header with Admin Edit Shortcut */}
              <div className="border-b border-studio-border/40 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="ancient-carved-heading text-xs sm:text-sm tracking-widest text-studio-gold flex items-center space-x-1.5">
                    <span>॥ SACRED DESIGNS ॥</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 inline" />
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-studio-textMuted mt-0.5 font-serif italic">
                    Handcrafted by Land of God resident masters.
                  </p>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin/designs"
                    className="shrink-0 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/40 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 transition-colors"
                    title="Manage & Add 3D Suggested Tattoos"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Manage</span>
                  </Link>
                )}
              </div>

              {/* Active Touched Body Spot Indicator */}
              <div className="flex items-center justify-between text-xs bg-studio-secondary/90 p-2 sm:p-2.5 rounded-lg border border-studio-bronze/40">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
                  <span className="text-studio-bronzeLight font-bold uppercase text-[10px] sm:text-[11px] font-display tracking-wider">
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
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[10px] no-scrollbar scroll-smooth">
                  {stylesList.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedStyleFilter(s)}
                      className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all text-[10px] font-semibold shrink-0 ${
                        selectedStyleFilter === s
                          ? 'bg-studio-bronze text-white font-bold shadow-sm'
                          : 'bg-studio-secondary/80 text-studio-textMuted hover:text-studio-textMain border border-studio-border/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tattoo Options List - Responsive Scrolling */}
              <div className="space-y-2 sm:space-y-2.5 max-h-[260px] sm:max-h-[320px] overflow-y-auto pr-1">
                {filteredTattoos.map((idea) => {
                  const isSelected = selectedDesign?._id === idea._id || selectedDesign?.name === idea.name;
                  const isFavorite = savedFavorites.includes(idea._id);

                  return (
                    <div
                      key={idea._id}
                      onClick={() => handleSelectDesign(idea)}
                      className={`group relative flex items-center space-x-3 p-2 sm:p-2.5 rounded-lg cursor-pointer transition-all duration-200 border ${
                        isSelected
                          ? 'bg-studio-secondary/95 border-2 border-studio-glowCyan shadow-cyan-glow'
                          : 'bg-studio-secondary/50 border-studio-border/30 hover:border-studio-bronze/60 hover:bg-studio-secondary/80 shadow-sm'
                      }`}
                    >
                      {/* Thumbnail / Vector Flash or Uploaded Motif Artwork */}
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-md bg-studio-darker/90 overflow-hidden shrink-0 border border-studio-border/60 flex items-center justify-center relative p-1 text-studio-textMain">
                        {idea.svg ? (
                          idea.svg
                        ) : (
                          <img
                            src={getFullImageUrl(idea.previewImage || idea.dataUri)}
                            alt={idea.name}
                            className="w-full h-full object-contain filter drop-shadow-sm"
                          />
                        )}
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

                        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-studio-border/20">
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
                  className="w-full bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 font-display font-bold py-2 px-3 text-[10px] sm:text-[11px] tracking-wider uppercase rounded-lg transition-all flex items-center justify-center space-x-1.5 shadow-sm"
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
