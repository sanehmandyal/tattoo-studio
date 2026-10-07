import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Interactive3DStudio } from '../tattoo-studio/Interactive3DStudio';
import { TATTOO_ARTWORKS_CATALOG } from '../tattoo-studio/TattooArtworks';
import { designsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Heart, ArrowRight, Check, Shield, Settings, MessageSquare, Star, CheckCircle } from 'lucide-react';
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

  const stylesList = ['All', 'Sacred Devbhoomi', 'Fine Line', 'Geometric', 'Blackwork', 'Japanese', 'Traditional', 'Mandala', 'Neo-Traditional'];

  // Fetch dynamic designs from Admin database and ensure 100% authentic named tattoo artworks
  useEffect(() => {
    const loadDynamicDesigns = async () => {
      try {
        const res = await designsAPI.getAll();
        if (res.success && res.designs && res.designs.length > 0) {
          // Filter out legacy unsplash/stale mock items
          const dbList = res.designs
            .filter((d) => !d.previewImage?.includes('images.unsplash.com') && !d.previewImage?.includes('photo-'))
            .map((d) => ({
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

          // Merge with TATTOO_ARTWORKS_CATALOG so all 15 authentic named tattoos are available
          const combined = [...dbList];
          TATTOO_ARTWORKS_CATALOG.forEach((catalogItem) => {
            if (!combined.some((d) => d.name.toLowerCase() === catalogItem.name.toLowerCase())) {
              combined.push(catalogItem);
            }
          });

          setDesigns(combined.length > 0 ? combined : TATTOO_ARTWORKS_CATALOG);
          if (!selectedDesign && combined.length > 0) {
            setSelectedDesign(combined[0]);
          }
        } else {
          setDesigns(TATTOO_ARTWORKS_CATALOG);
          if (!selectedDesign) {
            setSelectedDesign(TATTOO_ARTWORKS_CATALOG[0]);
          }
        }
      } catch (err) {
        setDesigns(TATTOO_ARTWORKS_CATALOG);
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
    <section id="hero" className="relative min-h-screen pt-24 pb-16 bg-studio-bg flex flex-col justify-center overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[640px]">
          
          {/* LEFT COLUMN: HERO VALUE PROPOSITION */}
          <div className="lg:col-span-4 space-y-6 text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-semibold text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Premier Tattoo Studio • Friends Colony, Una</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Bespoke Tattoo <br />
                <span className="text-amber-400">Artistry &amp; Precision.</span>
              </h1>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-md">
                Master Sunil and resident artists specialize in fine-line realism, sacred geometry, and bespoke custom tattoos with hospital-grade sterile hygiene.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/booking"
                className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-6 py-3 text-xs uppercase tracking-wider rounded-lg shadow-lg transition-all transform active:scale-95 text-center"
              >
                Book Appointment
              </Link>
              <Link
                to="/portfolio"
                className="border border-white/20 hover:border-amber-400 text-zinc-200 hover:text-white bg-zinc-900/60 hover:bg-zinc-800 px-6 py-3 text-xs uppercase tracking-wider rounded-lg transition-all text-center"
              >
                View Portfolio
              </Link>
            </div>

            {/* Trust Metrics */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/10 text-left">
              <div>
                <div className="text-lg font-black text-white">420+</div>
                <div className="text-[11px] text-zinc-400">5.0★ Google Reviews</div>
              </div>
              <div>
                <div className="text-lg font-black text-amber-400">100%</div>
                <div className="text-[11px] text-zinc-400">Sterile Single-Use</div>
              </div>
              <div>
                <div className="text-lg font-black text-white">10+ Yrs</div>
                <div className="text-[11px] text-zinc-400">Master Experience</div>
              </div>
            </div>

          </div>

          {/* CENTER COLUMN: 360° HUMAN MODEL STUDIO */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <Interactive3DStudio
              selectedBodyArea={selectedBodyArea}
              onSelectBodyArea={handleSelectBodyPart}
              selectedDesign={selectedDesign}
              onSelectDesign={handleSelectDesign}
              designs={designs}
            />
          </div>

          {/* RIGHT COLUMN: DESIGN EXPLORER */}
          <div className="lg:col-span-3 w-full">
            <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4 text-left">
              
              {/* Header */}
              <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Design Catalog
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Select a motif to test on the body
                  </p>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin/designs"
                    className="bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Admin</span>
                  </Link>
                )}
              </div>

              {/* Style Category Filter Pills */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 uppercase">
                  <span>Category:</span>
                  {selectedStyleFilter !== 'All' && (
                    <button
                      onClick={() => setSelectedStyleFilter('All')}
                      className="text-amber-400 hover:underline"
                    >
                      All
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-thin">
                  {stylesList.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedStyleFilter(s)}
                      className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-all text-[11px] font-medium shrink-0 ${
                        selectedStyleFilter === s
                          ? 'bg-amber-400 text-black font-bold'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tattoo List */}
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredTattoos.map((idea) => {
                  const isSelected = selectedDesign?._id === idea._id || selectedDesign?.name === idea.name;
                  const isFavorite = savedFavorites.includes(idea._id);

                  return (
                    <div
                      key={idea._id}
                      onClick={() => handleSelectDesign(idea)}
                      className={`flex items-center space-x-3 p-2.5 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-zinc-800 border-amber-400 shadow-md'
                          : 'bg-zinc-950/60 border-white/5 hover:border-white/20 hover:bg-zinc-800/60'
                      }`}
                    >
                      {/* Artwork Thumbnail */}
                      <div className="w-12 h-12 rounded-lg bg-black p-1 overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
                        {idea.svg ? (
                          idea.svg
                        ) : (
                          <img
                            src={getFullImageUrl(idea.previewImage || idea.dataUri)}
                            alt={idea.name}
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-amber-400' : 'text-zinc-200'}`}>
                            {idea.name}
                          </h4>
                          <button
                            onClick={(e) => handleToggleFavorite(idea, e)}
                            className="p-1 text-zinc-500 hover:text-red-400"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1">
                          <span className="font-semibold text-zinc-300">{idea.style}</span>
                          <span>{idea.estTime}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Booking Actions */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <button
                  onClick={handleBookWithSelected}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold py-2.5 px-4 text-xs uppercase tracking-wider rounded-lg shadow-sm flex items-center justify-center space-x-2 transition-all"
                >
                  <span>Book with Selected Design</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    const waUrl = createArtworkInquiryUrl(
                      selectedDesign?.name || 'Tattoo Design',
                      selectedDesign?.artist || 'Master Sunil',
                      selectedBodyArea
                    );
                    window.open(waUrl, '_blank');
                  }}
                  className="w-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-semibold py-2 px-3 text-xs rounded-lg transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>💬 WhatsApp Inquiry</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
