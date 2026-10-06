import React, { useState, useEffect } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Sliders, Check, RefreshCcw, Eye, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { getFullImageUrl } from '../../utils/imageHelper';

// Precise anatomical hotspot zones in 360° cylindrical space
const HUMAN_BODY_360_ZONES = [
  // Front Facing Zones (Theta ~ 0°)
  {
    id: 'Chest',
    name: 'Chest',
    label: 'Pectoral Chest & Sternum',
    theta: 0,
    box: { x: 34, y: 18, width: 32, height: 11 },
    tattooPos: { left: '50%', top: '23.5%', maxWidth: '110px', maxHeight: '70px', rotate: '0deg' }
  },
  {
    id: 'Ribs',
    name: 'Ribs',
    label: 'Ribs & Abdominals',
    theta: 0,
    box: { x: 38, y: 28, width: 24, height: 14 },
    tattooPos: { left: '50%', top: '35.5%', maxWidth: '80px', maxHeight: '80px', rotate: '0deg' }
  },
  {
    id: 'Neck',
    name: 'Neck',
    label: 'Neck & Throat',
    theta: 0,
    box: { x: 44, y: 12, width: 12, height: 5.5 },
    tattooPos: { left: '50%', top: '15%', maxWidth: '42px', maxHeight: '38px', rotate: '0deg' }
  },
  {
    id: 'Forearm',
    name: 'Forearm',
    label: 'Forearm (Right)',
    theta: 25,
    box: { x: 14, y: 35, width: 10, height: 14 },
    tattooPos: { left: '19%', top: '41.5%', maxWidth: '44px', maxHeight: '72px', rotate: '-14deg', skewY: '2deg' }
  },
  {
    id: 'Upper Arm',
    name: 'Upper Arm',
    label: 'Bicep / Deltoid (Right)',
    theta: 35,
    box: { x: 20, y: 24, width: 9, height: 12 },
    tattooPos: { left: '24.5%', top: '29%', maxWidth: '48px', maxHeight: '64px', rotate: '-10deg', skewY: '-3deg' }
  },
  {
    id: 'Shoulder',
    name: 'Shoulder',
    label: 'Shoulder / Deltoid (Right)',
    theta: 45,
    box: { x: 26, y: 16, width: 10, height: 9 },
    tattooPos: { left: '30%', top: '20.5%', maxWidth: '52px', maxHeight: '52px', rotate: '-14deg' }
  },
  {
    id: 'Wrist',
    name: 'Wrist',
    label: 'Wrist & Hand',
    theta: 20,
    box: { x: 13, y: 47, width: 8, height: 6 },
    tattooPos: { left: '16.5%', top: '50.5%', maxWidth: '30px', maxHeight: '30px', rotate: '-16deg' }
  },
  {
    id: 'Thigh',
    name: 'Thigh',
    label: 'Quadriceps / Thigh',
    theta: 0,
    box: { x: 34, y: 48, width: 14, height: 19 },
    tattooPos: { left: '41%', top: '57.5%', maxWidth: '58px', maxHeight: '90px', rotate: '0deg' }
  },
  {
    id: 'Calf',
    name: 'Calf',
    label: 'Calf & Shin',
    theta: 0,
    box: { x: 34, y: 72, width: 12, height: 16 },
    tattooPos: { left: '39.5%', top: '79.5%', maxWidth: '46px', maxHeight: '75px', rotate: '0deg' }
  },
  {
    id: 'Ankle',
    name: 'Ankle',
    label: 'Ankle & Foot',
    theta: 0,
    box: { x: 33, y: 89, width: 10, height: 7 },
    tattooPos: { left: '38%', top: '92.5%', maxWidth: '30px', maxHeight: '30px', rotate: '0deg' }
  },

  // Back Facing Zones (Theta ~ 180°)
  {
    id: 'Back',
    name: 'Back',
    label: 'Upper Back / Trapezius & Lats',
    theta: 180,
    box: { x: 32, y: 16, width: 36, height: 20 },
    tattooPos: { left: '50%', top: '26%', maxWidth: '120px', maxHeight: '85px', rotate: '0deg' }
  },
  {
    id: 'Spine',
    name: 'Spine',
    label: 'Full Spine Line',
    theta: 180,
    box: { x: 46, y: 17, width: 8, height: 25 },
    tattooPos: { left: '50%', top: '30%', maxWidth: '34px', maxHeight: '120px', rotate: '0deg' }
  },
  {
    id: 'Back Shoulder',
    name: 'Shoulder (Back)',
    label: 'Posterior Deltoid & Scapula',
    theta: 160,
    box: { x: 57, y: 17, width: 11, height: 10 },
    tattooPos: { left: '63%', top: '22%', maxWidth: '52px', maxHeight: '52px', rotate: '12deg' }
  },
  {
    id: 'Tricep',
    name: 'Upper Arm (Back)',
    label: 'Tricep (Left)',
    theta: 200,
    box: { x: 70, y: 23, width: 9, height: 12 },
    tattooPos: { left: '74.5%', top: '29%', maxWidth: '46px', maxHeight: '64px', rotate: '10deg' }
  },
  {
    id: 'Back Forearm',
    name: 'Forearm (Back)',
    label: 'Posterior Forearm',
    theta: 205,
    box: { x: 76, y: 35, width: 9, height: 14 },
    tattooPos: { left: '80%', top: '41.5%', maxWidth: '44px', maxHeight: '72px', rotate: '14deg' }
  },
  {
    id: 'Hamstrings',
    name: 'Thigh (Back)',
    label: 'Hamstrings / Posterior Thigh',
    theta: 180,
    box: { x: 53, y: 52, width: 13, height: 18 },
    tattooPos: { left: '58.5%', top: '61%', maxWidth: '58px', maxHeight: '90px', rotate: '0deg' }
  },
  {
    id: 'Back Calf',
    name: 'Calf (Back)',
    label: 'Posterior Calf / Gastrocnemius',
    theta: 180,
    box: { x: 55, y: 72, width: 12, height: 16 },
    tattooPos: { left: '60.5%', top: '79.5%', maxWidth: '46px', maxHeight: '75px', rotate: '0deg' }
  }
];

export const Interactive3DStudio = ({
  selectedBodyArea = 'Forearm',
  onSelectBodyArea,
  selectedDesign,
  onSelectDesign,
  designs = [],
  compact = false,
}) => {
  // Continuous 360-degree rotation state (0° to 360°)
  const [rotationDeg, setRotationDeg] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartAngle, setDragStartAngle] = useState(0);

  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredPart, setHoveredPart] = useState(null);
  const [tattooScale, setTattooScale] = useState(1);
  const [tattooOpacity, setTattooOpacity] = useState(0.92);
  const [blendMode, setBlendMode] = useState('multiply');
  const [featherEdge, setFeatherEdge] = useState(true);
  const [showControlsModal, setShowControlsModal] = useState(false);

  // Automatically rotate toward chosen body area when clicked
  useEffect(() => {
    if (!selectedBodyArea) return;
    const lower = selectedBodyArea.toLowerCase();
    if (lower.includes('spine') || lower === 'back' || lower.includes('tricep') || lower.includes('hamstring')) {
      if (rotationDeg < 110 || rotationDeg > 250) {
        setRotationDeg(180);
      }
    } else if (lower.includes('chest') || lower.includes('rib') || lower.includes('neck') || lower.includes('wrist')) {
      if (rotationDeg > 70 && rotationDeg < 290) {
        setRotationDeg(0);
      }
    }
  }, [selectedBodyArea]);

  // Auto-rotate 360 animation loop
  useEffect(() => {
    if (!isAutoRotating) return;
    let animId;
    const animate = () => {
      setRotationDeg((prev) => (prev + 0.6) % 360);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isAutoRotating]);

  // Pointer drag to spin in 360°
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    setDragStartX(clientX);
    setDragStartAngle(rotationDeg);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const deltaX = clientX - dragStartX;
    const newAngle = (dragStartAngle - deltaX * 0.7 + 3600) % 360;
    setRotationDeg(newAngle);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Find active part config
  const activePartConfig = HUMAN_BODY_360_ZONES.find((p) =>
    p.id.toLowerCase() === selectedBodyArea.toLowerCase() ||
    selectedBodyArea.toLowerCase().includes(p.id.toLowerCase()) ||
    p.name.toLowerCase().includes(selectedBodyArea.toLowerCase())
  ) || HUMAN_BODY_360_ZONES[0];

  // Calculate 360 view angle properties
  const normalizedAngle = ((rotationDeg % 360) + 360) % 360;
  const isBackView = normalizedAngle >= 90 && normalizedAngle <= 270;
  
  // Angle relative to front view for visual rotation (-90 to +90)
  const visualAngle = isBackView ? normalizedAngle - 180 : (normalizedAngle > 270 ? normalizedAngle - 360 : normalizedAngle);
  
  // Calculate depth & opacity of tattoo in 360° space
  const partTheta = activePartConfig?.theta ?? (isBackView ? 180 : 0);
  const diffAngle = ((partTheta - normalizedAngle + 540) % 360) - 180;
  const isTattooVisibleInAngle = Math.abs(diffAngle) < 95;
  const tattooCylinderCos = Math.max(0.1, Math.cos((diffAngle * Math.PI) / 180));
  const tattooCylinderSin = Math.sin((diffAngle * Math.PI) / 180);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 1.6));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.85));
  const handleReset = () => {
    setZoomLevel(1);
    setRotationDeg(0);
    setIsAutoRotating(false);
    setTattooScale(1);
    setTattooOpacity(0.92);
    setBlendMode('multiply');
    setFeatherEdge(true);
  };

  const imageSrc = selectedDesign ? getFullImageUrl(selectedDesign.dataUri || selectedDesign.previewImage || selectedDesign.image) : '';

  return (
    <div
      className={`relative w-full ${compact ? 'h-[520px] sm:h-[580px] md:h-[640px]' : 'h-[580px] sm:h-[640px] md:h-[740px]'} flex flex-col items-center justify-between select-none overflow-hidden rounded-2xl bg-studio-darker border border-studio-border/60 shadow-2xl transition-colors`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      
      {/* 1. TOP 360° CONTROL BAR */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-30 flex items-center justify-between gap-2 pointer-events-auto">
        
        {/* 360 Quick Turn Angles & Auto-Spin */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 bg-black/85 backdrop-blur-md border border-amber-500/30 p-1 sm:p-1.5 rounded-full shadow-xl">
          <button
            type="button"
            onClick={() => setRotationDeg((prev) => (prev + 90) % 360)}
            className="flex items-center space-x-1 px-2.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 hover:text-amber-200 bg-amber-950/60 border border-amber-500/40 rounded-full transition-colors"
            title="Rotate +90 degrees"
          >
            <RotateCw className="w-3 h-3" />
            <span>{Math.round(normalizedAngle)}° 360°</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all ${
              isAutoRotating
                ? 'bg-amber-400 text-black shadow-[0_0_10px_#f59e0b]'
                : 'text-zinc-400 hover:text-white bg-zinc-900 border border-white/10'
            }`}
            title="Auto 360 Orbit"
          >
            {isAutoRotating ? '⏸ Spin' : '▶ 360°'}
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1 text-studio-textMuted hover:text-white rounded-full transition-colors hidden sm:inline-block"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1 text-studio-textMuted hover:text-white rounded-full transition-colors hidden sm:inline-block"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Action: Clean Zone & Angle Badge */}
        <div className="bg-black/85 backdrop-blur-md border border-cyan-400/60 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-cyan-300 flex items-center space-x-1.5 shadow-[0_0_12px_rgba(6,182,212,0.25)] shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <span className="truncate max-w-[110px] sm:max-w-none">
            {activePartConfig.label || selectedBodyArea} ({isBackView ? 'Back' : 'Front'})
          </span>
        </div>
      </div>

      {/* 2. 360° ROTATION ANGLE PRESETS BAR */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-25 flex items-center space-x-1 bg-black/70 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded-full text-[9px] text-zinc-300 pointer-events-auto">
        <button
          type="button"
          onClick={() => setRotationDeg(0)}
          className={`px-1.5 py-0.5 rounded ${normalizedAngle < 45 || normalizedAngle >= 315 ? 'text-amber-300 font-bold bg-amber-500/20' : 'hover:text-white'}`}
        >
          0° Front
        </button>
        <span className="text-zinc-600">|</span>
        <button
          type="button"
          onClick={() => setRotationDeg(90)}
          className={`px-1.5 py-0.5 rounded ${normalizedAngle >= 45 && normalizedAngle < 135 ? 'text-amber-300 font-bold bg-amber-500/20' : 'hover:text-white'}`}
        >
          90° Right
        </button>
        <span className="text-zinc-600">|</span>
        <button
          type="button"
          onClick={() => setRotationDeg(180)}
          className={`px-1.5 py-0.5 rounded ${normalizedAngle >= 135 && normalizedAngle < 225 ? 'text-amber-300 font-bold bg-amber-500/20' : 'hover:text-white'}`}
        >
          180° Back
        </button>
        <span className="text-zinc-600">|</span>
        <button
          type="button"
          onClick={() => setRotationDeg(270)}
          className={`px-1.5 py-0.5 rounded ${normalizedAngle >= 225 && normalizedAngle < 315 ? 'text-amber-300 font-bold bg-amber-500/20' : 'hover:text-white'}`}
        >
          270° Left
        </button>
      </div>

      {/* 3. CENTER STAGE: 360° 3D HUMAN ANATOMY TURNTABLE */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out transform-gpu will-change-transform pt-12 pb-24 cursor-grab active:cursor-grabbing"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* Soft studio lighting */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/90 via-white to-slate-100/80 dark:from-studio-secondary/80 dark:to-studio-darker pointer-events-none" />

        {/* 3D Turntable Perspective Wrapper */}
        <div
          className="relative h-[90%] max-h-[640px] aspect-[2/3] flex items-center justify-center transform-gpu transition-all duration-100"
          style={{
            perspective: '1200px',
          }}
        >
          
          {/* Rotating Anatomy Plane */}
          <div
            className="relative w-full h-full flex items-center justify-center transform-gpu will-change-transform"
            style={{
              transform: `rotateY(${visualAngle}deg)`,
              transformStyle: 'preserve-3d',
              transition: isDragging || isAutoRotating ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
          >
            {/* 3D Muscular Anatomy Model Image (Front / Back with 3D Depth) */}
            <img
              src={isBackView ? '/images/masculine_back.jpg' : '/images/masculine_front.jpg'}
              alt="3D 360-Degree Muscular Anatomy Model"
              className="w-full h-full object-contain rounded-xl filter brightness-100 contrast-110 drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] pointer-events-none transform-gpu"
              style={{
                filter: `brightness(${0.9 + Math.cos((visualAngle * Math.PI) / 180) * 0.15}) contrast(110%)`,
              }}
            />

            {/* 360° CYLINDRICAL TATTOO PROJECTION (Seamlessly follows 3D curvature) */}
            {selectedDesign && activePartConfig && isTattooVisibleInAngle && (
              <div
                className="absolute z-20 pointer-events-none flex items-center justify-center transform-gpu will-change-transform"
                style={{
                  left: activePartConfig.tattooPos.left,
                  top: activePartConfig.tattooPos.top,
                  transform: `translate3d(-50%, -50%, 0) translate3d(${tattooCylinderSin * 28}px, 0, 0) scaleX(${tattooCylinderCos * tattooScale}) scaleY(${tattooScale}) rotate(${activePartConfig.tattooPos.rotate || '0deg'}) skewY(${activePartConfig.tattooPos.skewY || '0deg'})`,
                  width: activePartConfig.tattooPos.maxWidth,
                  height: activePartConfig.tattooPos.maxHeight,
                  maxWidth: activePartConfig.tattooPos.maxWidth,
                  maxHeight: activePartConfig.tattooPos.maxHeight,
                  mixBlendMode: blendMode,
                  opacity: tattooOpacity * tattooCylinderCos,
                  WebkitMaskImage: featherEdge
                    ? 'radial-gradient(ellipse at center, rgba(0,0,0,1) 42%, rgba(0,0,0,0.85) 68%, rgba(0,0,0,0) 98%)'
                    : 'none',
                  maskImage: featherEdge
                    ? 'radial-gradient(ellipse at center, rgba(0,0,0,1) 42%, rgba(0,0,0,0.85) 68%, rgba(0,0,0,0) 98%)'
                    : 'none',
                  transition: isDragging || isAutoRotating ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out',
                }}
              >
                {selectedDesign.svg ? (
                  <div className="w-full h-full flex items-center justify-center text-[#101415] filter contrast-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] pointer-events-none">
                    {selectedDesign.svg}
                  </div>
                ) : (
                  <img
                    src={imageSrc}
                    alt={selectedDesign.name}
                    className="w-full h-full object-contain filter contrast-[180%] brightness-85 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] pointer-events-none"
                  />
                )}
              </div>
            )}

            {/* 360° CLICKABLE ANATOMICAL HOTSPOTS */}
            {HUMAN_BODY_360_ZONES.map((part) => {
              const partIsBack = part.theta >= 90 && part.theta <= 270;
              if (partIsBack !== isBackView) return null;

              const isSelected = selectedBodyArea.toLowerCase().includes(part.id.toLowerCase()) || part.id.toLowerCase().includes(selectedBodyArea.toLowerCase());
              const isHovered = hoveredPart === part.id;

              return (
                <div
                  key={part.id + (partIsBack ? '_back' : '_front')}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBodyArea(part.id);
                    toast.success(`Selected ${part.label}. Previewing placement!`);
                  }}
                  onMouseEnter={() => setHoveredPart(part.id)}
                  onMouseLeave={() => setHoveredPart(null)}
                  className={`absolute z-25 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-150 rounded-2xl ${
                    isSelected
                      ? 'border-2 border-studio-glowCyan/50 bg-studio-glowCyan/10 shadow-cyan-glow'
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
                  title={`Click ${part.label} to view tattoo placement`}
                >
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                    <div
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-studio-glowCyan shadow-[0_0_15px_#00E5FF] scale-110'
                          : isHovered
                          ? 'bg-studio-bronzeLight scale-105'
                          : 'bg-white/40'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-studio-darker" />
                    </div>
                  </div>

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
      </div>

      {/* 360 Drag Instruction Hint */}
      <div className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none text-[10px] text-amber-300/80 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
        ↔ Drag horizontally across model to spin in 360°
      </div>

      {/* 4. INSTANT TATTOO SELECTOR & ADJUSTMENT DOCK DIRECTLY ON PRESENCE OF BODY */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-30 flex flex-col gap-1.5 pointer-events-auto">
        
        {/* Collapsible Tuning Controls Bar */}
        {showControlsModal && selectedDesign && (
          <div className="bg-black/95 backdrop-blur-xl border border-amber-500/40 p-2.5 rounded-xl shadow-2xl flex items-center justify-between gap-2 overflow-x-auto text-[11px] animate-in fade-in slide-in-from-bottom duration-150">
            {/* Tattoo Size Slider */}
            <div className="flex items-center space-x-1.5 shrink-0">
              <span className="text-amber-400 text-[10px] uppercase font-bold">Size:</span>
              <input
                type="range"
                min="0.5"
                max="1.8"
                step="0.05"
                value={tattooScale}
                onChange={(e) => setTattooScale(parseFloat(e.target.value))}
                className="w-14 accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                title="Tattoo Scale"
              />
            </div>

            <div className="w-px h-3.5 bg-white/10 shrink-0" />

            {/* Ink Density Slider */}
            <div className="flex items-center space-x-1.5 shrink-0">
              <span className="text-amber-400 text-[10px] uppercase font-bold">Ink Depth:</span>
              <input
                type="range"
                min="0.4"
                max="1"
                step="0.05"
                value={tattooOpacity}
                onChange={(e) => setTattooOpacity(parseFloat(e.target.value))}
                className="w-14 accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                title="Ink Density / Opacity"
              />
            </div>

            <div className="w-px h-3.5 bg-white/10 shrink-0" />

            {/* Feather Border Toggle */}
            <button
              type="button"
              onClick={() => setFeatherEdge((prev) => !prev)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 transition-colors ${
                featherEdge
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                  : 'bg-zinc-800 text-zinc-400 border border-white/10'
              }`}
            >
              {featherEdge ? '✓ Soft Skin Blend' : 'Sharp Border'}
            </button>
          </div>
        )}

        {/* Instant Tattoo Horizontal Selector Bar (Zero scroll up/down needed) */}
        {designs && designs.length > 0 && (
          <div className="bg-black/90 backdrop-blur-xl border border-amber-500/30 rounded-xl p-2 shadow-2xl space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                  Instant Tattoo Selector
                </span>
                <span className="text-[9px] text-zinc-400 font-serif hidden sm:inline">
                  (Tap to test on {selectedBodyArea})
                </span>
              </div>

              {/* Adjust Ink Toggle */}
              {selectedDesign && (
                <button
                  type="button"
                  onClick={() => setShowControlsModal(!showControlsModal)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 border transition-colors ${
                    showControlsModal
                      ? 'bg-amber-400 text-black border-amber-400'
                      : 'bg-zinc-900 text-amber-300 border-amber-500/40 hover:border-amber-400'
                  }`}
                >
                  <Sliders className="w-2.5 h-2.5" />
                  <span>{showControlsModal ? 'Close Adjust' : 'Adjust Ink'}</span>
                </button>
              )}
            </div>

            {/* Horizontal Scrollable Thumbnails List */}
            <div className="flex items-center space-x-2 overflow-x-auto py-0.5 px-0.5 no-scrollbar scroll-smooth">
              {designs.map((item) => {
                const isSelected = selectedDesign?._id === item._id || selectedDesign?.name === item.name;
                return (
                  <button
                    key={item._id || item.name}
                    type="button"
                    onClick={() => {
                      if (onSelectDesign) onSelectDesign(item);
                      toast.success(`Testing "${item.name}" on ${selectedBodyArea}!`);
                    }}
                    className={`shrink-0 flex items-center space-x-2 p-1 rounded-lg border transition-all duration-200 text-left ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.35)] scale-[1.02]'
                        : 'bg-zinc-900/80 border-white/10 hover:border-amber-400/50 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-black/80 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 p-0.5">
                      {item.svg ? (
                        <div className="w-full h-full text-white">{item.svg}</div>
                      ) : (
                        <img
                          src={getFullImageUrl(item.previewImage || item.dataUri)}
                          alt={item.name}
                          className="w-full h-full object-contain filter contrast-125"
                        />
                      )}
                    </div>
                    <div className="pr-1.5 max-w-[85px] sm:max-w-[110px]">
                      <p className={`text-[10px] font-bold truncate leading-tight ${isSelected ? 'text-amber-300' : 'text-zinc-200'}`}>
                        {item.name}
                      </p>
                      <p className="text-[8.5px] text-zinc-400 truncate">
                        {item.style}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
