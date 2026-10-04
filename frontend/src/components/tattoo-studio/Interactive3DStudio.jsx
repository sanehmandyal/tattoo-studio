import React, { useState, useEffect } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Check, Heart, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

// Precise anatomical hotspot zones matching the 3D muscular écorché anatomy model
const HUMAN_BODY_ZONES = {
  front: [
    {
      id: 'Forearm',
      name: 'Forearm',
      label: 'Forearm (Right)',
      box: { x: 14, y: 35, width: 10, height: 14 },
      tattooPos: { left: '19%', top: '41.5%', maxWidth: '38px', maxHeight: '68px', rotate: '-15deg' }
    },
    {
      id: 'Upper Arm',
      name: 'Upper Arm',
      label: 'Bicep / Deltoid (Right)',
      box: { x: 20, y: 24, width: 9, height: 12 },
      tattooPos: { left: '25%', top: '29.5%', maxWidth: '40px', maxHeight: '58px', rotate: '-12deg' }
    },
    {
      id: 'Shoulder',
      name: 'Shoulder',
      label: 'Shoulder / Deltoid (Right)',
      box: { x: 26, y: 16, width: 10, height: 9 },
      tattooPos: { left: '31%', top: '21%', maxWidth: '46px', maxHeight: '46px', rotate: '-14deg' }
    },
    {
      id: 'Chest',
      name: 'Chest',
      label: 'Pectoral Chest & Sternum',
      box: { x: 34, y: 17, width: 32, height: 11 },
      tattooPos: { left: '50%', top: '23%', maxWidth: '100px', maxHeight: '65px', rotate: '0deg' }
    },
    {
      id: 'Ribs',
      name: 'Ribs',
      label: 'Ribs & Abdominals',
      box: { x: 38, y: 28, width: 24, height: 14 },
      tattooPos: { left: '50%', top: '35%', maxWidth: '72px', maxHeight: '72px', rotate: '0deg' }
    },
    {
      id: 'Neck',
      name: 'Neck',
      label: 'Neck & Throat',
      box: { x: 44, y: 12, width: 12, height: 5.5 },
      tattooPos: { left: '50%', top: '15%', maxWidth: '40px', maxHeight: '36px', rotate: '0deg' }
    },
    {
      id: 'Wrist',
      name: 'Wrist',
      label: 'Wrist & Hand',
      box: { x: 13, y: 47, width: 8, height: 6 },
      tattooPos: { left: '17%', top: '50%', maxWidth: '28px', maxHeight: '28px', rotate: '-16deg' }
    },
    {
      id: 'Thigh',
      name: 'Thigh',
      label: 'Quadriceps / Thigh',
      box: { x: 34, y: 48, width: 14, height: 19 },
      tattooPos: { left: '41%', top: '57.5%', maxWidth: '54px', maxHeight: '85px', rotate: '0deg' }
    },
    {
      id: 'Calf',
      name: 'Calf',
      label: 'Calf & Shin',
      box: { x: 34, y: 72, width: 12, height: 16 },
      tattooPos: { left: '39.5%', top: '79.5%', maxWidth: '42px', maxHeight: '70px', rotate: '0deg' }
    },
    {
      id: 'Ankle',
      name: 'Ankle',
      label: 'Ankle & Foot',
      box: { x: 33, y: 89, width: 10, height: 7 },
      tattooPos: { left: '38%', top: '92.5%', maxWidth: '28px', maxHeight: '28px', rotate: '0deg' }
    },
  ],
  back: [
    {
      id: 'Back',
      name: 'Back',
      label: 'Upper Back / Trapezius & Lats',
      box: { x: 32, y: 16, width: 36, height: 20 },
      tattooPos: { left: '50%', top: '26%', maxWidth: '110px', maxHeight: '80px', rotate: '0deg' }
    },
    {
      id: 'Spine',
      name: 'Spine',
      label: 'Full Spine Line',
      box: { x: 46, y: 17, width: 8, height: 25 },
      tattooPos: { left: '50%', top: '29.5%', maxWidth: '30px', maxHeight: '110px', rotate: '0deg' }
    },
    {
      id: 'Shoulder',
      name: 'Shoulder',
      label: 'Shoulder Blade / Posterior Deltoid',
      box: { x: 57, y: 17, width: 11, height: 10 },
      tattooPos: { left: '62.5%', top: '22%', maxWidth: '48px', maxHeight: '48px', rotate: '12deg' }
    },
    {
      id: 'Upper Arm',
      name: 'Upper Arm',
      label: 'Tricep (Left)',
      box: { x: 70, y: 23, width: 9, height: 12 },
      tattooPos: { left: '74.5%', top: '29%', maxWidth: '40px', maxHeight: '58px', rotate: '12deg' }
    },
    {
      id: 'Forearm',
      name: 'Forearm',
      label: 'Posterior Forearm',
      box: { x: 76, y: 35, width: 9, height: 14 },
      tattooPos: { left: '80%', top: '41.5%', maxWidth: '38px', maxHeight: '68px', rotate: '15deg' }
    },
    {
      id: 'Thigh',
      name: 'Thigh',
      label: 'Hamstrings / Posterior Thigh',
      box: { x: 53, y: 52, width: 13, height: 18 },
      tattooPos: { left: '58.5%', top: '61%', maxWidth: '54px', maxHeight: '85px', rotate: '0deg' }
    },
    {
      id: 'Calf',
      name: 'Calf',
      label: 'Posterior Calf / Gastrocnemius',
      box: { x: 55, y: 72, width: 12, height: 16 },
      tattooPos: { left: '60.5%', top: '79.5%', maxWidth: '42px', maxHeight: '70px', rotate: '0deg' }
    },
  ]
};

export const Interactive3DStudio = ({
  selectedBodyArea = 'Forearm',
  onSelectBodyArea,
  selectedDesign,
  onSelectDesign,
  compact = false,
}) => {
  const [viewAngle, setViewAngle] = useState('front'); // 'front' or 'back'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredPart, setHoveredPart] = useState(null);
  const [tattooScale, setTattooScale] = useState(1);
  const [tattooOpacity, setTattooOpacity] = useState(0.92);

  // Automatically adjust view angle when a specific back or front area is chosen
  useEffect(() => {
    if (!selectedBodyArea) return;
    const lower = selectedBodyArea.toLowerCase();
    if (lower.includes('spine') || lower === 'back') {
      setViewAngle('back');
    } else if (lower.includes('chest') || lower.includes('rib') || lower.includes('neck') || lower.includes('wrist')) {
      setViewAngle('front');
    }
  }, [selectedBodyArea]);

  const parts = HUMAN_BODY_ZONES[viewAngle];

  // Match active part in current view angle, fallback to any matching zone
  const activePartConfig = parts.find(p => 
    p.id.toLowerCase() === selectedBodyArea.toLowerCase() || 
    selectedBodyArea.toLowerCase().includes(p.id.toLowerCase())
  ) || parts[0];

  const handleToggleView = () => {
    setViewAngle(prev => prev === 'front' ? 'back' : 'front');
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 1.6));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.85));
  const handleReset = () => {
    setZoomLevel(1);
    setViewAngle('front');
    setTattooScale(1);
  };

  return (
    <div className={`relative w-full ${compact ? 'h-[500px] md:h-[620px]' : 'h-[560px] md:h-[720px]'} flex items-center justify-center select-none overflow-hidden rounded-2xl bg-studio-darker border border-studio-border/60 shadow-2xl transition-colors`}>
      
      {/* 1. TOP CONTROLS FLOATING BAR */}
      <div className="absolute top-4 left-4 z-30 flex items-center space-x-2 bg-studio-secondary/90 backdrop-blur-md border border-studio-border p-2 rounded-lg shadow-xl text-studio-textMain transition-colors">
        <button
          onClick={handleToggleView}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-studio-bronzeLight hover:text-white hover:bg-studio-card rounded transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{viewAngle === 'front' ? 'Turn to Back' : 'Turn to Front'}</span>
        </button>

        <div className="w-[1px] h-4 bg-studio-border mx-1" />

        <button
          onClick={handleZoomIn}
          className="p-1.5 text-studio-textMuted hover:text-studio-textMain hover:bg-studio-card rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 text-studio-textMuted hover:text-studio-textMain hover:bg-studio-card rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleReset}
          className="px-2 py-1 text-[10px] font-semibold text-studio-textMuted hover:text-studio-textMain hover:bg-studio-card rounded transition-colors"
        >
          Reset
        </button>
      </div>

      {/* 2. ACTIVE ANATOMICAL ZONE BADGE */}
      <div className="absolute top-4 right-4 z-30 bg-studio-darker/90 backdrop-blur-md border-2 border-studio-glowCyan px-3.5 py-1.5 rounded-full text-xs font-bold text-studio-glowCyan flex items-center space-x-2 shadow-cyan-glow">
        <span className="w-2 h-2 rounded-full bg-studio-glowCyan animate-ping" />
        <span>Zone: {activePartConfig.label || selectedBodyArea}</span>
      </div>

      {/* 3. CENTER STAGE: ACTUAL HUMAN BODY IN STUDIO BACKGROUND */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out transform-gpu will-change-transform"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* Soft studio lighting */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/90 via-white to-slate-100/80 dark:from-studio-secondary/80 dark:to-studio-darker pointer-events-none" />

        {/* Human Photo Canvas Container */}
        <div className="relative h-[92%] max-h-[660px] aspect-[2/3] flex items-center justify-center transform-gpu">
          
          {/* 3D Masculine Muscular Anatomy Model (Front / Back) */}
          <img
            src={viewAngle === 'front' ? '/images/masculine_front.jpg' : '/images/masculine_back.jpg'}
            alt="3D Masculine Muscular Anatomy Tattoo Placement Model"
            className="w-full h-full object-contain rounded-xl filter brightness-100 contrast-110 drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] pointer-events-none transform-gpu"
          />

          {/* TATTOO ARTWORK OVERLAY (Projected strictly within anatomical muscle contours) */}
          {selectedDesign && activePartConfig && (
            <div
              className="absolute z-20 pointer-events-none transition-transform duration-200 ease-out flex items-center justify-center mix-blend-multiply transform-gpu will-change-transform"
              style={{
                left: activePartConfig.tattooPos.left,
                top: activePartConfig.tattooPos.top,
                transform: `translate3d(-50%, -50%, 0) scale(${tattooScale}) rotate(${activePartConfig.tattooPos.rotate || '0deg'})`,
                width: activePartConfig.tattooPos.maxWidth,
                height: activePartConfig.tattooPos.maxHeight,
                maxWidth: activePartConfig.tattooPos.maxWidth,
                maxHeight: activePartConfig.tattooPos.maxHeight,
                opacity: tattooOpacity,
              }}
            >
              <img
                src={selectedDesign.dataUri || selectedDesign.previewImage || selectedDesign.image}
                alt={selectedDesign.name}
                className="w-full h-full object-contain filter contrast-200 brightness-75 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] pointer-events-none"
              />
            </div>
          )}

          {/* CLICKABLE ANATOMICAL BODY HOTSPOTS & GLOWING CYAN OUTLINES */}
          {parts.map((part) => {
            const isSelected = selectedBodyArea.toLowerCase().includes(part.id.toLowerCase()) || part.id.toLowerCase().includes(selectedBodyArea.toLowerCase());
            const isHovered = hoveredPart === part.id;

            return (
              <div
                key={part.id}
                onClick={() => {
                  onSelectBodyArea(part.id);
                  toast.success(`Selected ${part.label}. Showing tattoo references!`);
                }}
                onMouseEnter={() => setHoveredPart(part.id)}
                onMouseLeave={() => setHoveredPart(null)}
                className={`absolute z-25 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-150 rounded-2xl ${
                  isSelected
                    ? 'border-2 border-studio-glowCyan bg-studio-glowCyan/25 shadow-cyan-glow'
                    : isHovered
                    ? 'border border-studio-bronzeLight bg-studio-bronzeLight/20 shadow-bronze'
                    : 'border border-white/10 hover:border-studio-glowCyan/60 hover:bg-studio-glowCyan/10'
                }`}
                style={{
                  left: `${part.box.x + part.box.width / 2}%`,
                  top: `${part.box.y + part.box.height / 2}%`,
                  width: `${part.box.width}%`,
                  height: `${part.box.height}%`,
                }}
                title={`Click ${part.label} to view tattoo references`}
              >
                {/* Circular hotspot pulsing pin (Matches circular pin on elbow in reference image!) */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-studio-glowCyan shadow-[0_0_15px_#00E5FF] scale-125'
                        : isHovered
                        ? 'bg-studio-bronzeLight scale-110'
                        : 'bg-white/40'
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-studio-darker" />
                  </div>
                </div>

                {/* Body Area Label badge on select or hover */}
                {(isSelected || isHovered) && (
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-studio-darker/95 backdrop-blur-md border border-studio-border px-2 py-0.5 rounded text-[10px] font-bold text-studio-textMain pointer-events-none shadow-xl">
                    {part.name}
                  </div>
                )}
              </div>
            );
          })}

        </div>
      </div>

      {/* 4. BOTTOM TATTOO ADJUSTMENT CONTROLS */}
      {selectedDesign && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-4 bg-studio-darker/95 backdrop-blur-md border border-studio-border/60 px-5 py-2 rounded-full text-xs shadow-2xl">
          <div className="flex items-center space-x-2">
            <span className="text-studio-textMuted text-[10px] uppercase font-bold">Tattoo Size:</span>
            <input
              type="range"
              min="0.6"
              max="1.6"
              step="0.05"
              value={tattooScale}
              onChange={(e) => setTattooScale(parseFloat(e.target.value))}
              className="w-16 accent-studio-bronze cursor-pointer h-1.5 bg-studio-card rounded-lg"
            />
          </div>

          <div className="w-[1px] h-3.5 bg-studio-border/50" />

          <div className="flex items-center space-x-2">
            <span className="text-studio-textMuted text-[10px] uppercase font-bold">Ink Density:</span>
            <input
              type="range"
              min="0.3"
              max="1"
              step="0.05"
              value={tattooOpacity}
              onChange={(e) => setTattooOpacity(parseFloat(e.target.value))}
              className="w-16 accent-studio-bronze cursor-pointer h-1.5 bg-studio-card rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Hint text bottom left */}
      <div className="absolute bottom-3 left-4 hidden sm:block text-[10px] text-studio-textMuted/70 pointer-events-none">
        Click any human body region to preview tattoo placement
      </div>
    </div>
  );
};
