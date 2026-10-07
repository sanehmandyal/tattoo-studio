import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Interactive3DStudio } from '../components/tattoo-studio/Interactive3DStudio';
import { designsAPI } from '../services/api';
import { Sparkles, ArrowRight, Star, X, Image as ImageIcon, Sliders, Check, Layers, RotateCcw, Flame } from 'lucide-react';
import { toast } from 'sonner';
import { createArtworkInquiryUrl } from '../utils/whatsapp';

import { TATTOO_ARTWORKS_CATALOG } from '../components/tattoo-studio/TattooArtworks';
import { getFullImageUrl } from '../utils/imageHelper';

export const Interactive3DPage = () => {
  const [selectedBodyArea, setSelectedBodyArea] = useState('Forearm');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [designs, setDesigns] = useState(TATTOO_ARTWORKS_CATALOG);
  const [selectedDesign, setSelectedDesign] = useState(TATTOO_ARTWORKS_CATALOG[0]);
  const [loading, setLoading] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const bodyAreas = [
    'Forearm', 'Upper Arm', 'Chest', 'Back', 'Shoulder', 'Neck', 'Wrist', 'Thigh', 'Calf', 'Ankle', 'Ribs', 'Spine'
  ];

  const styles = [
    'All', 'Sacred Devbhoomi', 'Geometric', 'Fine Line', 'Blackwork', 'Japanese', 'Traditional', 'Mandala', 'Neo-Traditional'
  ];

  // Helper to find best reference tattoo for a body area
  const findReferenceTattooForArea = useCallback((area, allDesigns) => {
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
  }, []);

  useEffect(() => {
    const fetchDesigns = async () => {
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

          // Merge DB designs with catalog fallback if DB has few items
          const combined = [...dbList];
          TATTOO_ARTWORKS_CATALOG.forEach(catalogItem => {
            if (!combined.some(d => d.name.toLowerCase() === catalogItem.name.toLowerCase())) {
              combined.push(catalogItem);
            }
          });

          setDesigns(combined);

          // Find the reference tattoo for the current body area
          const initialDesign = findReferenceTattooForArea(selectedBodyArea, combined) || combined[0];
          setSelectedDesign(initialDesign);
        } else {
          setDesigns(TATTOO_ARTWORKS_CATALOG);
          if (!selectedDesign) {
            setSelectedDesign(TATTOO_ARTWORKS_CATALOG[0]);
          }
        }
      } catch (err) {
        console.error(err);
        setDesigns(TATTOO_ARTWORKS_CATALOG);
      }
    };
    fetchDesigns();
  }, [findReferenceTattooForArea, selectedBodyArea]);

  // When body area is clicked, load reference tattoo and open mobile sidebar drawer
  const handleSelectBodyArea = (area) => {
    setSelectedBodyArea(area);
    const matchingDesign = findReferenceTattooForArea(area, designs);
    if (matchingDesign) {
      setSelectedDesign(matchingDesign);
      toast.success(`Selected ${area}! Showing tattoo options.`);
    }

    // On mobile screens (< 1024px), automatically open tattoo options drawer
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileDrawerOpen(true);
    }
  };

  // Filter designs by style
  const styleFiltered = designs.filter(d => {
    const matchesStyle = selectedStyle === 'All' || d.style.toLowerCase() === selectedStyle.toLowerCase();
    return matchesStyle;
  });

  // Split into Recommended for this body area vs other versatile options
  const recommendedForArea = styleFiltered.filter(d => 
    (d.bodyAreas || []).some(a => 
      a.toLowerCase() === selectedBodyArea.toLowerCase() || 
      selectedBodyArea.toLowerCase().includes(a.toLowerCase()) || 
      a.toLowerCase().includes(selectedBodyArea.toLowerCase())
    )
  );

  const otherArtworks = styleFiltered.filter(d => !recommendedForArea.includes(d));

  const handleProceedToBooking = () => {
    if (!selectedDesign) return;
    navigate(`/booking?style=${encodeURIComponent(selectedDesign.style)}&placement=${encodeURIComponent(selectedBodyArea)}&design=${encodeURIComponent(selectedDesign.name)}`);
  };

  const renderTattooCard = (design, isRecommended = false) => {
    const isSelected = selectedDesign?._id === design._id || selectedDesign?.name === design.name;
    const isDefaultRef = Boolean(design.isDefaultReference);

    return (
      <div
        key={design._id || design.name}
        onClick={() => {
          setSelectedDesign(design);
          toast.success(`Applied "${design.name}" to ${selectedBodyArea}!`);
        }}
        className={`group flex items-center space-x-3 p-2.5 rounded-xl cursor-pointer transition-all border ${
          isSelected
            ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/15 ring-1 ring-amber-400'
            : 'bg-zinc-950/70 border-white/5 hover:border-amber-500/40 hover:bg-zinc-900/90'
        }`}
      >
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-lg bg-black/90 p-1 overflow-hidden border border-white/10 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
          {design.svg ? (
            design.svg
          ) : (
            <img
              src={getFullImageUrl(design.previewImage || design.dataUri)}
              alt={design.name}
              className="w-full h-full object-contain"
            />
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex items-center justify-between gap-1">
            <h4 className="font-bold text-xs text-white uppercase truncate group-hover:text-amber-300 transition-colors">
              {design.name}
            </h4>
            {isSelected && (
              <span className="bg-amber-400 text-black text-[8px] font-black uppercase px-1.5 py-0.2 rounded shrink-0">
                Active
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between text-[10px] text-zinc-400">
            <span className="font-semibold text-amber-400/90 truncate">
              {design.style}
            </span>
            <span className="text-zinc-500 text-[9px] shrink-0 font-mono">
              {design.estTime || '2-3 hrs'}
            </span>
          </div>

          <div className="flex items-center space-x-1 text-[9px] text-zinc-400">
            <span className="text-zinc-500">Fit:</span>
            <span className="text-zinc-300 truncate">
              {(design.bodyAreas || ['Universal']).slice(0, 3).join(', ')}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#090b0e] text-left text-zinc-100 relative">
      <Helmet>
        <title>3D Tattoo Body Placement Studio — LAND OF GOD TATTOO STUDIO (Una)</title>
        <meta
          name="description"
          content="Explore anatomical tattoo placements in real-time on our 3D muscular model. Test custom designs and book your session in Friends Colony, Una."
        />
      </Helmet>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clean Professional Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-5 mb-6 gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              <span>3D Anatomical Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              3D Tattoo Placement Simulator
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Select any body part to explore multiple curated tattoo options and test on 360° human anatomy.
            </p>
          </div>

          {/* Quick Active Selection Badge */}
          {selectedDesign && (
            <div className="flex items-center space-x-2 bg-zinc-900/90 border border-white/10 px-3.5 py-2 rounded-xl text-xs shadow-lg">
              <span className="text-zinc-400 font-medium">Testing on:</span>
              <span className="font-bold text-amber-300">{selectedBodyArea}</span>
              <span className="text-zinc-500">•</span>
              <span className="text-white font-semibold truncate max-w-[140px]">{selectedDesign.name}</span>
            </div>
          )}
        </div>

        {/* Anatomical Zone Filter Pills */}
        <div className="flex items-center flex-wrap gap-1.5 mb-6 bg-zinc-900/60 p-2 rounded-xl border border-white/5">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider px-2">
            Target Muscle:
          </span>
          {bodyAreas.map(area => {
            const isSelected = selectedBodyArea.toLowerCase() === area.toLowerCase();
            return (
              <button
                key={area}
                onClick={() => handleSelectBodyArea(area)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-black font-bold shadow-md shadow-amber-500/20'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
                }`}
              >
                <span>{area}</span>
              </button>
            );
          })}
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* CENTER 3D MANNEQUIN CANVAS (8 COLS) */}
          <div className="lg:col-span-8 flex flex-col relative">
            <Interactive3DStudio
              selectedBodyArea={selectedBodyArea}
              onSelectBodyArea={handleSelectBodyArea}
              selectedDesign={selectedDesign}
              onSelectDesign={setSelectedDesign}
              designs={styleFiltered}
            />

            {/* Mobile Quick Trigger Bar to Open Tattoo Drawer */}
            <div className="lg:hidden mt-3 w-full flex items-center justify-between bg-zinc-900/95 border border-amber-500/40 p-2.5 rounded-xl shadow-lg">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-bold text-white">{selectedBodyArea}</span>
                <span className="text-[10px] text-amber-300 font-mono">({recommendedForArea.length} recommended)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(true)}
                className="bg-amber-400 hover:bg-amber-300 text-black font-black text-xs px-3.5 py-1.5 rounded-lg shadow-md flex items-center space-x-1.5 transition-all"
              >
                <span>🎨 View Multiple Tattoos</span>
              </button>
            </div>
          </div>

          {/* DESKTOP RIGHT DESIGN CATALOG & ACTIONS (4 COLS) */}
          <div className="hidden lg:block lg:col-span-4 space-y-4">
            
            {/* Style Filters */}
            <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-white/10 space-y-2.5 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Filter Design Styles
              </span>
              <div className="flex flex-wrap gap-1">
                {styles.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedStyle(s)}
                    className={`px-2 py-0.5 text-[10px] font-semibold rounded-md transition-all ${
                      selectedStyle === s
                        ? 'bg-amber-400 text-black font-bold shadow-sm'
                        : 'bg-zinc-950/80 text-zinc-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar Multiple Tattoo Options */}
            <div className="bg-zinc-900/80 p-4 rounded-2xl border border-white/10 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div>
                  <h3 className="text-xs font-bold uppercase text-white tracking-wider flex items-center space-x-1.5">
                    <span>{selectedBodyArea} Tattoo Options</span>
                  </h3>
                  <p className="text-[10px] text-zinc-400">
                    {recommendedForArea.length} tailored for {selectedBodyArea} ({styleFiltered.length} total)
                  </p>
                </div>
              </div>

              {/* Scrollable Tattoo Flash Cards */}
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                
                {/* 1. Recommended for selected body area */}
                {recommendedForArea.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1">
                      <Flame className="w-3 h-3 text-amber-400" />
                      <span>Top Curated for {selectedBodyArea}</span>
                    </div>
                    {recommendedForArea.map(design => renderTattooCard(design, true))}
                  </div>
                )}

                {/* 2. Other versatile flash artworks */}
                {otherArtworks.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-zinc-400" />
                      <span>More Studio Flash Artworks</span>
                    </div>
                    {otherArtworks.map(design => renderTattooCard(design, false))}
                  </div>
                )}

                {styleFiltered.length === 0 && (
                  <div className="py-8 text-center text-xs text-zinc-500">
                    No tattoos found for "{selectedStyle}". Select 'All' to browse catalog.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <button
                  onClick={handleProceedToBooking}
                  disabled={!selectedDesign}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-black font-black py-2.5 px-4 text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-40"
                >
                  <span>Book Session with {selectedDesign?.name || 'Selected'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const waUrl = createArtworkInquiryUrl(
                      selectedDesign?.name || '3D Tattoo Design',
                      'Land of God Studio',
                      selectedBodyArea
                    );
                    window.open(waUrl, '_blank');
                  }}
                  className="w-full bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold py-2 px-3 text-[11px] uppercase tracking-wider rounded-xl flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                >
                  <span>💬 WhatsApp Inquiry for this Placement</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* MOBILE SLIDE-OVER TATTOO OPTIONS SIDEBAR / DRAWER */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Slide-In Content Drawer */}
          <div className="relative w-full max-w-sm bg-[#0d1015] border-l border-white/10 h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                    {selectedBodyArea} Tattoo Options
                  </h3>
                  <p className="text-[10px] text-zinc-400">
                    Tap any tattoo to test on 3D mannequin
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 rounded-lg border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Style Filters */}
            <div className="p-3 border-b border-white/5 bg-zinc-950/50">
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {styles.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedStyle(s)}
                    className={`shrink-0 px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                      selectedStyle === s
                        ? 'bg-amber-400 text-black shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 border border-white/5'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Designs List in Mobile Drawer */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
              {/* 1. Recommended for selected body area */}
              {recommendedForArea.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>Top Curated for {selectedBodyArea}</span>
                  </div>
                  {recommendedForArea.map(design => renderTattooCard(design, true))}
                </div>
              )}

              {/* 2. Other versatile flash artworks */}
              {otherArtworks.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-zinc-400" />
                    <span>More Studio Flash Artworks</span>
                  </div>
                  {otherArtworks.map(design => renderTattooCard(design, false))}
                </div>
              )}
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-3 border-t border-white/10 bg-black/60 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  handleProceedToBooking();
                }}
                className="w-full bg-amber-400 hover:bg-amber-300 text-black font-black py-2.5 px-4 text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center space-x-1.5"
              >
                <span>Book with {selectedDesign?.name || 'Selected'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const waUrl = createArtworkInquiryUrl(
                    selectedDesign?.name || '3D Tattoo Design',
                    'Land of God Studio',
                    selectedBodyArea
                  );
                  window.open(waUrl, '_blank');
                }}
                className="w-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold py-2 px-3 text-[10px] uppercase rounded-xl flex items-center justify-center space-x-1.5"
              >
                <span>💬 WhatsApp Inquiry</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
