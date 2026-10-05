import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Interactive3DStudio } from '../components/tattoo-studio/Interactive3DStudio';
import { designsAPI } from '../services/api';
import { Sparkles, ArrowRight, Heart, Sliders, Check, Layers, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { createArtworkInquiryUrl } from '../utils/whatsapp';

export const Interactive3DPage = () => {
  const [selectedBodyArea, setSelectedBodyArea] = useState('Forearm');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const bodyAreas = [
    'Forearm', 'Upper Arm', 'Chest', 'Back', 'Shoulder', 'Neck', 'Wrist', 'Thigh', 'Calf', 'Ankle', 'Ribs'
  ];

  const styles = [
    'All', 'Geometric', 'Traditional', 'Realism', 'Fine Line', 'Mandala', 'Blackwork', 'Japanese', 'Script'
  ];

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const res = await designsAPI.getAll();
        if (res.success && res.designs) {
          setDesigns(res.designs);
          const initial = res.designs.find(d => d.bodyAreas.includes('Forearm')) || res.designs[0];
          setSelectedDesign(initial);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDesigns();
  }, []);

  const filteredDesigns = designs.filter(d => {
    const matchesStyle = selectedStyle === 'All' || d.style.toLowerCase() === selectedStyle.toLowerCase();
    const matchesArea = d.bodyAreas.some(area => 
      area.toLowerCase().includes(selectedBodyArea.toLowerCase()) || selectedBodyArea.toLowerCase().includes(area.toLowerCase())
    );
    return matchesStyle && matchesArea;
  });

  const handleProceedToBooking = () => {
    if (!selectedDesign) return;
    navigate(`/booking?style=${encodeURIComponent(selectedDesign.style)}&placement=${encodeURIComponent(selectedBodyArea)}&design=${encodeURIComponent(selectedDesign.name)}`);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-studio-bg">
      <Helmet>
        <title>Interactive 3D Sacred Tattoo Placement Lab — LAND OF GOD TATTOO STUDIO (Una)</title>
        <meta
          name="description"
          content="Explore anatomical tattoo placements in real-time on our 3D muscular écorché model. Project sacred Devbhoomi designs and book your bespoke session in Friends Colony, Una."
        />
      </Helmet>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-studio-glowCyan flex items-center justify-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>INTERACTIVE ATELIER LAB</span>
          </span>
          <h1 className="font-condensed font-black text-4xl sm:text-5xl uppercase tracking-tight text-studio-textMain">
            3D Body Placement &amp; Design Studio
          </h1>
          <p className="text-xs sm:text-sm text-studio-textMuted">
            Select an anatomical zone, test suggested artworks with dynamic scale &amp; opacity, and preview placement before sitting in the chair.
          </p>
        </div>

        {/* Anatomical Zone Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
          <span className="text-xs text-studio-textMuted uppercase font-bold mr-2">Body Zone:</span>
          {bodyAreas.map(area => (
            <button
              key={area}
              onClick={() => setSelectedBodyArea(area)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedBodyArea === area
                  ? 'bg-sky-600 dark:bg-studio-glowCyan text-white dark:text-gray-950 font-bold shadow-md'
                  : 'bg-studio-card/80 text-studio-textMuted hover:text-studio-textMain border border-studio-border/30'
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CENTER 3D MANNEQUIN CANVAS */}
          <div className="lg:col-span-8 glass-panel-dark rounded-2xl p-4 border border-studio-border/60 shadow-2xl relative min-h-[580px] flex items-center justify-center">
            <Interactive3DStudio
              selectedBodyArea={selectedBodyArea}
              onSelectBodyArea={setSelectedBodyArea}
              selectedDesign={selectedDesign}
              onSelectDesign={setSelectedDesign}
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
                  {selectedBodyArea} Artwork Library
                </span>
                <span className="text-[10px] text-studio-textMuted">
                  {filteredDesigns.length} designs available
                </span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {filteredDesigns.length === 0 ? (
                  <div className="py-8 text-center text-xs text-studio-textMuted">
                    No custom designs tagged for {selectedBodyArea} with style {selectedStyle}. Try selecting 'All'.
                  </div>
                ) : (
                  filteredDesigns.map(design => {
                    const isSelected = selectedDesign?._id === design._id;
                    return (
                      <div
                        key={design._id}
                        onClick={() => setSelectedDesign(design)}
                        className={`flex items-center space-x-3 p-2.5 rounded-lg cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-studio-card border-studio-glowCyan shadow-cyan-glow'
                            : 'bg-studio-secondary/60 border-studio-border/30 hover:border-studio-bronze/60'
                        }`}
                      >
                        <img
                          src={design.previewImage}
                          alt={design.name}
                          className="w-12 h-12 rounded object-cover border border-studio-border/50"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[9px] uppercase font-bold text-studio-bronzeLight bg-studio-card px-1.5 py-0.5 rounded">
                              {design.difficulty} • ~{design.estTimeHours}h
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
