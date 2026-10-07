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
    <div className="min-h-screen pt-24 pb-16 bg-[#090b0e] text-left text-zinc-100">
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
              <span>3D Mannequin Placement Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Anatomical Tattoo Simulator
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Select any muscle group to test tattoo designs on the 360° human anatomy in real-time.
            </p>
          </div>

          {/* Quick Active Selection Badge */}
          {selectedDesign && (
            <div className="flex items-center space-x-2 bg-zinc-900/90 border border-white/10 px-3.5 py-2 rounded-xl text-xs">
              <span className="text-zinc-400 font-medium">Testing:</span>
              <span className="font-bold text-amber-300">{selectedDesign.name}</span>
              <span className="text-zinc-500">•</span>
              <span className="text-white font-semibold">{selectedBodyArea}</span>
            </div>
          )}
        </div>

        {/* Anatomical Zone Filter Pills */}
        <div className="flex items-center flex-wrap gap-1.5 mb-6 bg-zinc-900/60 p-2 rounded-xl border border-white/5">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider px-2">
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
          <div className="lg:col-span-8 flex flex-col">
            <Interactive3DStudio
              selectedBodyArea={selectedBodyArea}
              onSelectBodyArea={handleSelectBodyArea}
              selectedDesign={selectedDesign}
              onSelectDesign={setSelectedDesign}
              designs={filteredDesigns}
            />
          </div>

          {/* RIGHT DESIGN CATALOG & ACTIONS (4 COLS) */}
          <div className="lg:col-span-4 space-y-4">
            
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
                        ? 'bg-amber-400 text-black font-bold'
                        : 'bg-zinc-950/80 text-zinc-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Design List matching selected body area */}
            <div className="bg-zinc-900/80 p-4 rounded-2xl border border-white/10 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-bold uppercase text-white tracking-wider">
                  {selectedBodyArea} Artworks
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {filteredDesigns.length} available
                </span>
              </div>

              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredDesigns.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-500">
                    No custom designs for style "{selectedStyle}". Select 'All' to view all artworks.
                  </div>
                ) : (
                  filteredDesigns.map(design => {
                    const isSelected = selectedDesign?._id === design._id || selectedDesign?.name === design.name;
                    const isDefaultRef = Boolean(design.isDefaultReference);

                    return (
                      <div
                        key={design._id || design.name}
                        onClick={() => setSelectedDesign(design)}
                        className={`flex items-center space-x-3 p-2.5 rounded-xl cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-400 shadow-md shadow-amber-500/10'
                            : 'bg-zinc-950/60 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-lg bg-black/80 overflow-hidden border border-white/10 shrink-0 flex items-center justify-center p-1">
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
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-xs text-white uppercase truncate">
                              {design.name}
                            </h4>
                            {isDefaultRef && (
                              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[8px] font-black uppercase px-1.5 py-0.2 rounded shrink-0">
                                Primary Ref
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between text-[10px] text-zinc-400">
                            <span className="font-semibold text-amber-400/90">
                              {design.style}
                            </span>
                            <span className="text-zinc-500 text-[9px]">
                              {design.estTime || '2 hrs'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
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
    </div>
  );
};
