import React, { useState, useEffect } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Sliders, Check, RefreshCcw, Eye, Layers, Compass } from 'lucide-react';
import { toast } from 'sonner';
import { getFullImageUrl } from '../../utils/imageHelper';

// 8 Anatomical Perspectives for Full 360° Volumetric Rotation (No flat card effect)
const ANATOMY_360_FRAMES = [
  { angle: 0, label: 'Front View (0°)', src: '/images/masculine_front.jpg', flip: false },
  { angle: 45, label: 'Front-Right 3/4 (45°)', src: '/images/masculine_front_right.jpg', flip: false },
  { angle: 90, label: 'Right Side Profile (90°)', src: '/images/masculine_right.jpg', flip: false },
  { angle: 135, label: 'Back-Right 3/4 (135°)', src: '/images/masculine_back_right.jpg', flip: false },
  { angle: 180, label: 'Full Back View (180°)', src: '/images/masculine_back.jpg', flip: false },
  { angle: 225, label: 'Back-Left 3/4 (225°)', src: '/images/masculine_back_right.jpg', flip: true },
  { angle: 270, label: 'Left Side Profile (270°)', src: '/images/masculine_left.jpg', flip: false },
  { angle: 315, label: 'Front-Left 3/4 (315°)', src: '/images/masculine_front_right.jpg', flip: true },
];

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
    theta: 45,
    box: { x: 14, y: 35, width: 10, height: 14 },
    tattooPos: { left: '19%', top: '41.5%', maxWidth: '44px', maxHeight: '72px', rotate: '-14deg', skewY: '2deg' }
  },
  {
    id: 'Upper Arm',
    name: 'Upper Arm',
    label: 'Bicep / Deltoid (Right)',
    theta: 60,
    box: { x: 20, y: 24, width: 9, height: 12 },
    tattooPos: { left: '24.5%', top: '29%', maxWidth: '48px', maxHeight: '64px', rotate: '-10deg', skewY: '-3deg' }
  },
  {
    id: 'Shoulder',
    name: 'Shoulder',
    label: 'Shoulder / Deltoid (Right)',
    theta: 70,
    box: { x: 26, y: 16, width: 10, height: 9 },
    tattooPos: { left: '30%', top: '20.5%', maxWidth: '52px', maxHeight: '52px', rotate: '-14deg' }
  },
  {
    id: 'Wrist',
    name: 'Wrist',
    label: 'Wrist & Hand',
    theta: 35,
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

  // Preload all 360 frame images into browser cache for instant lag-free rotation
  useEffect(() => {
    ANATOMY_360_FRAMES.forEach((frame) => {
      const img = new Image();
      img.src = frame.src;
    });
  }, []);

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

  // Normalized 0 to 360 angle
  const normalizedAngle = ((rotationDeg % 360) + 360) % 360;

  // Find the exact active 360 frame based on angle (closest of the 8 perspective views)
  const getClosestFrame = (deg) => {
    // Distance calculation on a circle
    let bestFrame = ANATOMY_360_FRAMES[0];
    let minDiff = 360;
    for (const frame of ANATOMY_360_FRAMES) {
      const diff = Math.min(
        Math.abs(deg - frame.angle),
        360 - Math.abs(deg - frame.angle)
      );
      if (diff < minDiff) {
        minDiff = diff;
        bestFrame = frame;
      }
    }
    return bestFrame;
  };

  const currentFrame = getClosestFrame(normalizedAngle);

  // Sub-angle delta within current view quadrant for smooth subtle perspective shift (-22.5 to +22.5)
  let subAngle = normalizedAngle - currentFrame.angle;
  if (subAngle > 180) subAngle -= 360;
  if (subAngle < -180) subAngle += 360;

  // Calculate 3D tattoo visibility & cylindrical wrap across 360 space
  const partTheta = activePartConfig?.theta ?? 0;
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
      className={`relative w-full ${compact ? 'h-[520px] sm:h-[580px] md:h-[640px]' : 'h-[580px] sm:h-[640px] md:h-[740px]'} flex flex-col items-center justify-between select-none overflow-hidden rounded-2xl bg-[#0a0c10] border border-studio-border/60 shadow-2xl transition-colors`}
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
            onClick={() => setRotationDeg((prev) => (prev + 45) % 360)}
            className="flex items-center space-x-1 px-2.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 hover:text-amber-200 bg-amber-950/60 border border-amber-500/40 rounded-full transition-colors"
            title="Rotate +45 degrees"
          >
            <Compass className="w-3 h-3 text-amber-400" />
            <span>{Math.round(normalizedAngle)}° 360°</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all ${
              isAutoRotating
                ? 'bg-amber-400 text-black shadow-[0_0_10px_#f59e0b]'
                : 'text-zinc-400 hover:text-white bg-zinc-900 border border-white/10'
            }`}
            title="Auto 360 Orbit"
          >
            {isAutoRotating ? '⏸ Orbit' : '▶ 360° Orbit'}
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
          <span className="truncate max-w-[140px] sm:max-w-none">
            {activePartConfig.label || selectedBodyArea} • {currentFrame.label}
          </span>
        </div>
      </div>

      {/* 2. 360° ROTATION ANGLE PRESETS BAR (All 8 Angles) */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-25 flex items-center space-x-1 bg-black/80 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-full text-[9px] text-zinc-300 pointer-events-auto">
        <button
          type="button"
          onClick={() => setRotationDeg(0)}
          className={`px-1.5 py-0.5 rounded ${normalizedAngle < 22.5 || normalizedAngle >= 337.5 ? 'text-amber-300 font-bold bg-amber-500/20' : 'hover:text-white'}`}
        >
          0° Front
        </button>
        <span className="text-zinc-600">|</span>
        <button
          type="button"
          onClick={() => setRotationDeg(45)}
          className={`px-1.5 py-0.5 rounded ${normalizedAngle >= 22.5 && normalizedAngle < 67.5 ? 'text-amber-300 font-bold bg-amber-500/20' : 'hover:text-white'}`}
        >
          45°
        </button>
        <span className="text-zinc-600">|</span>
        <button
          type="button"
          onClick={() => setRotationDeg(90)}
          className={`px-1.5 py-0.5 rounded ${normalizedAngle >= 67.5 && normalizedAngle < 112.5 ? 'text-amber-300 font-bold bg-amber-500/20' : 'hover:text-white'}`}
        >
          90° Side
        </button>
        <span className="text-zinc-600">|</span>
        <button
          type="button"
          onClick={() => setRotationDeg(135)}
          className={`px-1.5 py-0.5 rounded ${normalizedAngle >= 112.5 && normalizedAngle < 157.5 ? 'text-amber-300 font-bold bg-amber-500/20' : 'hover:text-white'}`}
        >
          135°
        </button>
        <span className="text-zinc-600">|</span>
        <button
          type="button"
          onClick={() => setRotationDeg(180)}
          className={`px-1.5 py-0.5 rounded ${normalizedAngle >= 157.5 && normalizedAngle < 202.5 ? 'text-amber-300 font-bold bg-amber-500/20' : 'hover:text-white'}`}
        >
          180° Back
        </button>
        <span className="text-zinc-600">|</span>
        <button
          type="button"
          onClick={() => setRotationDeg(225)}
          className={`px-1.5 py-0.5 rounded ${normalizedAngle >= 202.5 && normalizedAngle < 247.5 ? 'text-amber-300 font-bold bg-amber-500/20' : 'hover:text-white'}`}
        >
          225°
        </button>
        <span className="text-zinc-600">|</span>
        <button
          type="button"
          onClick={() => setRotationDeg(270)}
          className={`px-1.5 py-0.5 rounded ${normalizedAngle >= 247.5 && normalizedAngle < 292.5 ? 'text-amber-300 font-bold bg-amber-500/20' : 'hover:text-white'}`}
        >
          270° Side
        </button>
        <span className="text-zinc-600">|</span>
        <button
          type="button"
          onClick={() => setRotationDeg(315)}
          className={`px-1.5 py-0.5 rounded ${normalizedAngle >= 292.5 && normalizedAngle < 337.5 ? 'text-amber-300 font-bold bg-amber-500/20' : 'hover:text-white'}`}
        >
          315°
        </button>
      </div>

      {/* 3. CENTER STAGE: 360° MULTI-ANGLE VOLUMETRIC HUMAN ANATOMY TURNTABLE */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out transform-gpu will-change-transform pt-12 pb-24 cursor-grab active:cursor-grabbing"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* Soft radial studio lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06)_0%,transparent_70%)] pointer-events-none" />

        {/* 3D Model Viewport with Real Volumetric Side Depth */}
        <div className="relative h-[90%] max-h-[640px] aspect-[2/3] flex items-center justify-center transform-gpu transition-all duration-100">
          
          {/* Subtle Dynamic 3D Micro-Perspective */}
          <div
            className="relative w-full h-full flex items-center justify-center transform-gpu will-change-transform"
            style={{
              transform: `perspective(1000px) rotateY(${subAngle * 0.4}deg)`,
              transformStyle: 'preserve-3d',
              transition: isDragging || isAutoRotating ? 'none' : 'transform 0.2s ease-out',
            }}
          >
            {/* Real 3D Full Body Anatomical Model (Changes with full 360° profile) */}
            <img
              key={currentFrame.src + (currentFrame.flip ? '_flip' : '')}
              src={currentFrame.src}
              alt="360-Degree Muscular Anatomical Human Model"
              className="w-full h-full object-contain filter brightness-100 contrast-110 drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)] pointer-events-none transform-gpu transition-opacity duration-150"
              style={{
                transform: currentFrame.flip ? 'scaleX(-1)' : 'none',
              }}
            />

            {/* 360° CYLINDRICAL TATTOO PROJECTION (Seamlessly wraps around muscle contours) */}
            {selectedDesign && activePartConfig && isTattooVisibleInAngle && (
              <div
                className="absolute z-20 pointer-events-none flex items-center justify-center transform-gpu will-change-transform"
                style={{
                  left: activePartConfig.tattooPos.left,
                  top: activePartConfig.tattooPos.top,
                  transform: `translate3d(-50%, -50%, 0) translate3d(${tattooCylinderSin * 26}px, 0, 0) scaleX(${tattooCylinderCos * tattooScale}) scaleY(${tattooScale}) rotate(${activePartConfig.tattooPos.rotate || '0deg'}) skewY(${activePartConfig.tattooPos.skewY || '0deg'})`,
                  width: activePartConfig.tattooPos.maxWidth,
                  height: activePartConfig.tattooPos.maxHeight,
                  maxWidth: activePartConfig.tattooPos.maxWidth,
                  maxHeight: activePartConfig.tattooPos.maxHeight,
                  opacity: tattooOpacity * Math.min(1, tattooCylinderCos + 0.3),
                  mixBlendMode: blendMode === 'multiply' ? 'multiply' : blendMode === 'screen' ? 'screen' : 'normal',
                  filter: featherEdge
                    ? 'drop-shadow(0 0 2px rgba(0,0,0,0.8))'
                    : 'none',
                  transition: 'opacity 0.15s ease-out, transform 0.05s ease-out',
                }}
              >
                {selectedDesign.svg ? (
                  <div className="w-full h-full flex items-center justify-center text-slate-900 dark:text-zinc-950 font-bold">
                    {selectedDesign.svg}
                  </div>
                ) : imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={selectedDesign.name}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                ) : (
                  <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider text-center bg-black/60 px-2 py-1 rounded">
                    {selectedDesign.name}
                  </div>
                )}
              </div>
            )}

            {/* Dynamic 360 Hotspot Click Zones */}
            {HUMAN_BODY_360_ZONES.map((zone) => {
              const zoneDiff = ((zone.theta - normalizedAngle + 540) % 360) - 180;
              const isZoneFacingCamera = Math.abs(zoneDiff) < 80;
              if (!isZoneFacingCamera) return null;

              const isSelected = selectedBodyArea.toLowerCase() === zone.id.toLowerCase();
              const isHovered = hoveredPart === zone.id;

              return (
                <div
                  key={zone.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectBodyArea) onSelectBodyArea(zone.id);
                  }}
                  onMouseEnter={() => setHoveredPart(zone.id)}
                  onMouseLeave={() => setHoveredPart(null)}
                  className={`absolute z-25 cursor-pointer rounded-lg transition-all border pointer-events-auto ${
                    isSelected
                      ? 'bg-amber-500/25 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                      : isHovered
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                      : 'border-transparent hover:border-white/20'
                  }`}
                  style={{
                    left: `${zone.box.x}%`,
                    top: `${zone.box.y}%`,
                    width: `${zone.box.width}%`,
                    height: `${zone.box.height}%`,
                  }}
                >
                  {(isSelected || isHovered) && (
                    <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-md text-amber-300 border border-amber-500/40 text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-30">
                      {zone.name}
                    </span>
                  )}
                </div>
              );
            })}

          </div>

        </div>

      </div>

      {/* 4. BOTTOM IN-VIEWPORT CONTROLS & INSTANT TATTOO SELECTION DOCK */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-30 flex flex-col gap-2 pointer-events-auto">
        
        {/* Fine-Tuning Mini Bar */}
        <div className="flex items-center justify-between bg-black/85 backdrop-blur-md border border-studio-border/60 p-1.5 sm:px-3 rounded-xl text-xs text-studio-textMuted shadow-xl">
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Scale Control */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400">Scale</span>
              <input
                type="range"
                min="0.4"
                max="2.2"
                step="0.05"
                value={tattooScale}
                onChange={(e) => setTattooScale(parseFloat(e.target.value))}
                className="w-16 sm:w-24 accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
              />
              <span className="text-[10px] font-mono text-zinc-400">{tattooScale.toFixed(2)}x</span>
            </div>

            {/* Ink Density Control */}
            <div className="flex items-center space-x-1.5 hidden xs:flex">
              <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-400">Ink</span>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={tattooOpacity}
                onChange={(e) => setTattooOpacity(parseFloat(e.target.value))}
                className="w-16 sm:w-20 accent-cyan-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
              />
              <span className="text-[10px] font-mono text-zinc-400">{Math.round(tattooOpacity * 100)}%</span>
            </div>

            {/* Blend Mode Switcher */}
            <div className="flex items-center space-x-1 hidden sm:flex text-[9px]">
              <span className="text-zinc-500 uppercase font-bold">Blend:</span>
              <button
                type="button"
                onClick={() => setBlendMode('normal')}
                className={`px-1.5 py-0.5 rounded uppercase font-bold transition-all ${blendMode === 'normal' ? 'bg-cyan-500 text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                Direct
              </button>
              <button
                type="button"
                onClick={() => setBlendMode('multiply')}
                className={`px-1.5 py-0.5 rounded uppercase font-bold transition-all ${blendMode === 'multiply' ? 'bg-cyan-500 text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                Ink
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={handleReset}
              className="p-1 text-zinc-400 hover:text-white bg-zinc-900 border border-white/10 rounded-md transition-colors text-[10px] px-2 flex items-center space-x-1"
              title="Reset 360 View"
            >
              <RefreshCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* In-Viewport Tattoo Selection Carousel - Shows ALL Admin Tattoos */}
        {designs && designs.length > 0 && (
          <div className="bg-black/90 backdrop-blur-xl border border-studio-border/70 p-1.5 rounded-xl shadow-2xl">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
              <span className="text-[9px] uppercase tracking-widest font-black text-studio-glowCyan px-1 shrink-0">
                Admin Designs ({designs.length}):
              </span>
              {designs.map((design) => {
                const isSelected = selectedDesign?._id === design._id || selectedDesign?.name === design.name;
                const imgSrc = getFullImageUrl(design.previewImage || design.dataUri || design.image);

                return (
                  <button
                    key={design._id || design.name}
                    type="button"
                    onClick={() => {
                      if (onSelectDesign) onSelectDesign(design);
                      toast.success(`Testing "${design.name}" on 3D Body!`);
                    }}
                    className={`relative shrink-0 flex items-center space-x-1.5 px-2 py-1 rounded-lg transition-all border ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)] scale-105'
                        : 'bg-zinc-900/80 border-white/10 hover:border-amber-500/40 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded bg-black/90 p-0.5 overflow-hidden flex items-center justify-center border border-white/10">
                      {design.svg ? (
                        design.svg
                      ) : (
                        <img
                          src={imgSrc}
                          alt={design.name}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] font-bold text-zinc-200 uppercase truncate max-w-[85px]">
                        {design.name}
                      </div>
                      <div className="text-[8px] text-amber-400/80 font-mono">
                        {design.style || 'Admin Tattoo'}
                      </div>
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
