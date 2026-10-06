import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Interactive3DStudio } from '../components/tattoo-studio/Interactive3DStudio';
import { designsAPI } from '../services/api';
import { Sparkles, ArrowRight, Star, Sliders, Check, Layers, RotateCcw } from 'lucide-react';
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
  const navigate = useNavigate();

  const bodyAreas = [
    'Forearm', 'Upper Arm', 'Chest', 'Back', 'Shoulder', 'Neck', 'Wrist', 'Thigh', 'Calf', 'Ankle', 'Ribs', 'Spine'
  ];

  const styles = [
    'All', 'Geometric', 'Sacred Devbhoomi', 'Traditional', 'Realism', 'Fine Line', 'Mandala', 'Blackwork', 'Japanese', 'Script', 'Watercolor'
  ];

  // Helper to find best admin reference tattoo for a body area
  const findReferenceTattooForArea = useCallback((area, allDesigns) => {
    if (!area || !allDesigns || allDesigns.length === 0) return null;
    const lowerArea = area.toLowerCase();

    // 1. Look for admin default reference explicitly assigned to this body area
    const defaultRef = allDesigns.find(d => 
      Boolean(d.isDefaultReference) &&
      (d.bodyAreas || []).some(a => a.toLowerCase() === lowerArea || lowerArea.includes(a.toLowerCase()) || a.toLowerCase().includes(lowerArea))
    );
    if (defaultRef) return defaultRef;

    // 2. Look for any design tagged with this body area (DB designs first, then default catalog)
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

          setDesigns(dbList);

          // Find the admin's assigned tattoo for the current body area
          const initialDesign = findReferenceTattooForArea(selectedBodyArea, dbList) || dbList[0];
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

  // When body area is clicked, load the admin's designated reference tattoo or preview current tattoo on that body part
  const handleSelectBodyArea = (area) => {
    setSelectedBodyArea(area);
    const matchingAdminDesign = findReferenceTattooForArea(area, designs);
    if (matchingAdminDesign) {
      setSelectedDesign(matchingAdminDesign);
      toast.success(`Testing "${matchingAdminDesign.name}" on ${area}!`);
    } else if (selectedDesign) {
      toast.success(`Testing "${selectedDesign.name}" on ${area}!`);
    }
  };

  const filteredDesigns = designs.filter(d => {
    const matchesStyle = selectedStyle === 'All' || d.style.toLowerCase() === selectedStyle.toLowerCase();
    return matchesStyle;
  });

  const handleProceedToBooking = () => {
    if (!selectedDesign) return;
    navigate(`/booking?style=${encodeURIComponent(selectedDesign.style)}&placement=${encodeURIComponent(selectedBodyArea)}&design=${encodeURIComponent(selectedDesign.name)}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-studio-bg text-left">
      <Helmet>
        <title>3D Tattoo Body Placement Studio — LAND OF GOD TATTOO STUDIO (Una)</title>
        <meta
          name="description"
          content="Explore anatomical tattoo placements in real-time on our 3D muscular model. Test custom designs and book your session in Friends Colony, Una."
        />
      </Helmet>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-left mb-8 space-y-2 border-b border-white/10 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Interactive 3D Placement Studio
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Live Body Placement &amp; Reference Studio
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Select any anatomical zone below to preview reference tattoos assigned by Master Sunil on the 360-degree body model.
          </p>
        </div>

        {/* Anatomical Zone Filter Pills */}
        <div className="flex items-center flex-wrap gap-2 mb-8">
          <span className="text-xs text-zinc-400 font-semibold uppercase mr-2">Body Zone:</span>
          {bodyAreas.map(area => {
            const isSelected = selectedBodyArea.toLowerCase() === area.toLowerCase();
            return (
              <button
                key={area}
                onClick={() => handleSelectBodyArea(area)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-black font-bold shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
                }`}
              >
                <span>{area}</span>
              </button>
            );
          })}
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CENTER 3D MANNEQUIN CANVAS */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center">
            
            {/* Active Reference Notification Banner */}
            <div className="w-full mb-3 flex items-center justify-between bg-zinc-900/90 border border-white/10 px-4 py-2.5 rounded-xl text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-amber-400 font-bold flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="uppercase tracking-wider">Active Reference:</span>
                </span>
                <span className="font-bold text-white">{selectedDesign?.name || 'Selected Motif'}</span>
                <span className="text-zinc-400 hidden sm:inline">for {selectedBodyArea}</span>
              </div>
              <span className="text-[11px] text-amber-300 font-semibold bg-amber-400/10 px-2.5 py-0.5 rounded-md border border-amber-400/20">
                Admin Reference
              </span>
            </div>

            <Interactive3DStudio
              selectedBodyArea={selectedBodyArea}
              onSelectBodyArea={handleSelectBodyArea}
              selectedDesign={selectedDesign}
              onSelectDesign={setSelectedDesign}
              designs={filteredDesigns}
            />
          </div>

          {/* RIGHT DESIGN CATALOG & CONTROLS */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Style Filters */}
            <div className="glass-panel p-4 rounded-xl border border-studio-border/50 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-studio-bronzeLight block">
                Filter Styles
              </span>
              <div className="flex flex-wrap gap-1.5">
                {styles.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedStyle(s)}
                    className={`px-2.5 py-1 text-[11px] rounded transition-all ${
                      selectedStyle === s
                        ? 'bg-studio-bronze text-white font-bold'
                        : 'bg-studio-card text-studio-textMuted hover:text-studio-textMain'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Design List matching selected body area */}
            <div className="glass-panel p-4 rounded-xl border border-studio-border/50 space-y-3">
              <div className="flex items-center justify-between border-b border-studio-border/30 pb-2">
                <span className="text-xs font-bold uppercase text-studio-textMain">
                  {selectedBodyArea} Tattoo References
                </span>
                <span className="text-[10px] text-studio-textMuted">
                  {filteredDesigns.length} designs available
                </span>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredDesigns.length === 0 ? (
                  <div className="py-8 text-center text-xs text-studio-textMuted">
                    No custom designs tagged for {selectedBodyArea} with style {selectedStyle}. Try selecting 'All'.
                  </div>
                ) : (
                  filteredDesigns.map(design => {
                    const isSelected = selectedDesign?._id === design._id;
                    const isDefaultRef = Boolean(design.isDefaultReference);

                    return (
                      <div
                        key={design._id}
                        onClick={() => setSelectedDesign(design)}
                        className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-studio-card border-studio-glowCyan shadow-cyan-glow'
                            : 'bg-studio-secondary/60 border-studio-border/30 hover:border-studio-bronze/60'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-lg bg-studio-darker/90 overflow-hidden border border-studio-border/50 shrink-0 flex items-center justify-center p-1.5">
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
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-condensed font-bold text-sm text-studio-textMain uppercase truncate">
                              {design.name}
                            </h4>
                            {isDefaultRef && (
                              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-black uppercase px-1.5 py-0.2 rounded shrink-0">
                                ⭐ Primary Ref
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between text-[10px] text-studio-textMuted">
                            <span className="uppercase font-bold text-studio-bronzeLight">
                              {design.style} • {design.difficulty}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDesign(design);
                                const waUrl = createArtworkInquiryUrl(design.name, 'Land of God Master Studio', selectedBodyArea);
                                window.open(waUrl, '_blank');
                              }}
                              className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded flex items-center space-x-1 transition-all"
                            >
                              <span>💬 WhatsApp</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Book with this Design & Direct WhatsApp CTA */}
              <div className="pt-3 border-t border-studio-border/30 space-y-2">
                <button
                  onClick={handleProceedToBooking}
                  disabled={!selectedDesign}
                  className="w-full bg-studio-bronze hover:bg-studio-bronzeLight text-white font-condensed font-black py-2.5 px-4 text-xs uppercase tracking-[0.2em] rounded shadow-bronze flex items-center justify-center space-x-2 transition-all disabled:opacity-40"
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
                  className="w-full bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 font-bold py-2 px-3 text-[11px] uppercase tracking-wider rounded flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                >
                  <span>💬 Direct WhatsApp Contact for Details</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
