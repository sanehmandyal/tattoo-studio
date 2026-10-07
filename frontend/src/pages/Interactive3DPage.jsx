import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Interactive3DStudio } from '../components/tattoo-studio/Interactive3DStudio';
import { designsAPI } from '../services/api';
import { Sparkles, ArrowRight, Star, X, Image as ImageIcon, Sliders, Check, Layers, RotateCcw, Flame, Palette } from 'lucide-react';
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

          const combined = [...dbList];
          TATTOO_ARTWORKS_CATALOG.forEach(catalogItem => {
            if (!combined.some(d => d.name.toLowerCase() === catalogItem.name.toLowerCase())) {
              combined.push(catalogItem);
            }
          });

          setDesigns(combined);

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

  // When body area is clicked, smoothly test current tattoo on that muscle
  const handleSelectBodyArea = (area) => {
    setSelectedBodyArea(area);
  };

  const handleProceedToBooking = () => {
    if (!selectedDesign) return;
    navigate(`/booking?style=${encodeURIComponent(selectedDesign.style)}&placement=${encodeURIComponent(selectedBodyArea)}&design=${encodeURIComponent(selectedDesign.name)}`);
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

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clean Professional Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 mb-4 gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              <span>3D Anatomical Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              3D Tattoo Placement Simulator
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Select your design, then touch any body part to test how it looks across the 360° human anatomy.
            </p>
          </div>

          {/* Active Testing Badge */}
          {selectedDesign && (
            <div className="flex items-center space-x-2 bg-zinc-900/90 border border-white/10 px-3.5 py-2 rounded-xl text-xs shadow-lg">
              <span className="text-zinc-400 font-medium">Testing:</span>
              <span className="font-bold text-amber-300">{selectedDesign.name}</span>
              <span className="text-zinc-500">•</span>
              <span className="text-white font-semibold">{selectedBodyArea}</span>
            </div>
          )}
        </div>

        {/* Anatomical Zone Filter Pills */}
        <div className="flex items-center flex-wrap gap-1.5 mb-4 bg-zinc-900/60 p-2 rounded-2xl border border-white/5">
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

        {/* CENTER 3D MANNEQUIN CANVAS */}
        <div className="relative w-full">
          <Interactive3DStudio
            selectedBodyArea={selectedBodyArea}
            onSelectBodyArea={handleSelectBodyArea}
            selectedDesign={selectedDesign}
            onSelectDesign={setSelectedDesign}
            designs={designs}
          />
        </div>

        {/* BOTTOM BOOKING & CONSULTATION ACTION BAR */}
        <div className="mt-4 bg-zinc-900/80 border border-white/10 p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-black/80 border border-white/10 p-1 flex items-center justify-center shrink-0">
              {selectedDesign?.svg ? (
                selectedDesign.svg
              ) : selectedDesign?.previewImage || selectedDesign?.dataUri ? (
                <img
                  src={getFullImageUrl(selectedDesign.previewImage || selectedDesign.dataUri)}
                  alt={selectedDesign.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Palette className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-medium">Ready to ink this placement?</div>
              <div className="text-sm font-bold text-white">
                {selectedDesign?.name || 'Selected Design'} on <span className="text-amber-400">{selectedBodyArea}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
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
              className="flex-1 sm:flex-none bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold py-2.5 px-4 text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              💬 WhatsApp Inquiry
            </button>

            <button
              onClick={handleProceedToBooking}
              disabled={!selectedDesign}
              className="flex-1 sm:flex-none bg-amber-400 hover:bg-amber-300 text-black font-black py-2.5 px-5 text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center space-x-1.5 transition-all disabled:opacity-40"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
