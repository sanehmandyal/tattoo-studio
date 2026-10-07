import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Sliders, Check, RefreshCcw, Eye, Layers, Compass, Move, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { getFullImageUrl } from '../../utils/imageHelper';

// 8 Anatomical Perspectives for Full 360° Volumetric Rotation (No glitches, all clean 3D renders)
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

// Pixel-perfect anatomical coordinate mapping per viewing angle frame
const ANATOMICAL_PLACEMENTS = {
  Forearm: {
    name: 'Forearm (Right)',
    label: 'Right Forearm',
    defaultTheta: 45,
    frames: {
      0: { left: 23.5, top: 48.0, width: 12.0, height: 18.0, rotate: -14, opacity: 1, scaleX: 0.95, skewY: 2 },
      45: { left: 35.0, top: 49.5, width: 12.5, height: 18.5, rotate: -8, opacity: 1, scaleX: 1.0, skewY: 0 },
      90: { left: 65.5, top: 47.0, width: 12.0, height: 18.0, rotate: 6, opacity: 1, scaleX: 0.95, skewY: 1 },
      135: { left: 39.0, top: 50.0, width: 12.0, height: 18.0, rotate: 8, opacity: 0.95, scaleX: 0.85, skewY: -2 },
      180: { left: 23.5, top: 48.0, width: 12.0, height: 18.0, rotate: 14, opacity: 0.9, scaleX: 0.95, skewY: -2 }
    }
  },
  'Upper Arm': {
    name: 'Upper Arm (Right)',
    label: 'Right Bicep / Deltoid',
    defaultTheta: 60,
    frames: {
      0: { left: 28.0, top: 36.5, width: 13.0, height: 16.0, rotate: -10, opacity: 1, scaleX: 0.95, skewY: -2 },
      45: { left: 37.0, top: 37.0, width: 13.5, height: 16.5, rotate: -6, opacity: 1, scaleX: 1.0, skewY: 0 },
      90: { left: 63.5, top: 37.0, width: 13.5, height: 16.5, rotate: 4, opacity: 1, scaleX: 0.95, skewY: 0 },
      135: { left: 41.0, top: 38.0, width: 13.0, height: 16.0, rotate: 6, opacity: 0.95, scaleX: 0.85, skewY: 2 },
      180: { left: 28.0, top: 36.5, width: 13.0, height: 16.0, rotate: 10, opacity: 0.9, scaleX: 0.95, skewY: 2 }
    }
  },
  Shoulder: {
    name: 'Shoulder (Right)',
    label: 'Right Shoulder Cap',
    defaultTheta: 70,
    frames: {
      0: { left: 33.0, top: 27.5, width: 14.0, height: 13.0, rotate: -12, opacity: 1, scaleX: 0.95 },
      45: { left: 39.0, top: 28.0, width: 14.5, height: 13.5, rotate: -6, opacity: 1, scaleX: 1.0 },
      90: { left: 62.0, top: 29.0, width: 14.5, height: 13.5, rotate: 0, opacity: 1, scaleX: 0.95 },
      135: { left: 43.0, top: 29.0, width: 14.0, height: 13.0, rotate: 8, opacity: 0.95, scaleX: 0.9 },
      180: { left: 33.0, top: 27.5, width: 14.0, height: 13.0, rotate: 12, opacity: 0.9, scaleX: 0.95 }
    }
  },
  Chest: {
    name: 'Chest',
    label: 'Pectoral Chest & Sternum',
    defaultTheta: 0,
    frames: {
      0: { left: 50.0, top: 31.0, width: 26.0, height: 15.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      45: { left: 52.0, top: 30.0, width: 22.0, height: 14.0, rotate: -4, opacity: 0.95, scaleX: 0.8 },
      90: { left: 46.0, top: 34.0, width: 14.0, height: 13.0, rotate: -4, opacity: 0.7, scaleX: 0.5 },
      315: { left: 48.0, top: 30.0, width: 22.0, height: 14.0, rotate: 4, opacity: 0.95, scaleX: 0.8 },
      270: { left: 54.0, top: 34.0, width: 14.0, height: 13.0, rotate: 4, opacity: 0.7, scaleX: 0.5 }
    }
  },
  Back: {
    name: 'Back',
    label: 'Upper Back & Lats',
    defaultTheta: 180,
    frames: {
      180: { left: 50.0, top: 31.0, width: 28.0, height: 18.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      135: { left: 52.0, top: 31.0, width: 24.0, height: 17.0, rotate: 4, opacity: 0.95, scaleX: 0.85 },
      225: { left: 48.0, top: 31.0, width: 24.0, height: 17.0, rotate: -4, opacity: 0.95, scaleX: 0.85 },
      90: { left: 42.0, top: 34.0, width: 14.0, height: 15.0, rotate: 4, opacity: 0.4, scaleX: 0.4 },
      270: { left: 58.0, top: 34.0, width: 14.0, height: 15.0, rotate: -4, opacity: 0.4, scaleX: 0.4 }
    }
  },
  Spine: {
    name: 'Spine',
    label: 'Full Vertebral Spine Line',
    defaultTheta: 180,
    frames: {
      180: { left: 50.0, top: 36.0, width: 12.0, height: 30.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      135: { left: 52.0, top: 36.0, width: 9.0, height: 29.0, rotate: 2, opacity: 0.9, scaleX: 0.8 },
      225: { left: 48.0, top: 36.0, width: 9.0, height: 29.0, rotate: -2, opacity: 0.9, scaleX: 0.8 }
    }
  },
  Ribs: {
    name: 'Ribs',
    label: 'Ribcage & Flank',
    defaultTheta: 30,
    frames: {
      0: { left: 44.0, top: 41.0, width: 17.0, height: 16.0, rotate: 0, opacity: 1, scaleX: 0.95 },
      45: { left: 49.0, top: 41.5, width: 17.0, height: 16.0, rotate: -3, opacity: 1, scaleX: 1.0 },
      90: { left: 48.0, top: 43.0, width: 16.0, height: 16.0, rotate: 0, opacity: 0.8, scaleX: 0.8 },
      315: { left: 51.0, top: 41.0, width: 14.0, height: 15.0, rotate: 4, opacity: 0.8, scaleX: 0.8 }
    }
  },
  Thigh: {
    name: 'Thigh',
    label: 'Quadriceps / Thigh',
    defaultTheta: 0,
    frames: {
      0: { left: 42.0, top: 60.0, width: 16.0, height: 20.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      45: { left: 46.0, top: 60.5, width: 16.0, height: 20.0, rotate: -2, opacity: 1, scaleX: 0.95 },
      90: { left: 56.0, top: 61.0, width: 16.0, height: 20.0, rotate: 0, opacity: 1, scaleX: 0.95 },
      135: { left: 52.0, top: 61.0, width: 16.0, height: 20.0, rotate: 2, opacity: 0.95, scaleX: 0.95 },
      180: { left: 42.0, top: 62.0, width: 16.0, height: 20.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      225: { left: 48.0, top: 61.0, width: 16.0, height: 20.0, rotate: -2, opacity: 0.95, scaleX: 0.95 },
      270: { left: 44.0, top: 61.0, width: 16.0, height: 20.0, rotate: 0, opacity: 1, scaleX: 0.95 },
      315: { left: 54.0, top: 60.0, width: 16.0, height: 20.0, rotate: 2, opacity: 0.95, scaleX: 0.95 }
    }
  },
  Calf: {
    name: 'Calf',
    label: 'Calf & Shin',
    defaultTheta: 0,
    frames: {
      0: { left: 40.0, top: 79.0, width: 14.0, height: 17.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      45: { left: 44.0, top: 79.0, width: 14.0, height: 17.0, rotate: -1, opacity: 1, scaleX: 0.95 },
      90: { left: 58.0, top: 80.0, width: 14.0, height: 17.0, rotate: 0, opacity: 1, scaleX: 0.95 },
      135: { left: 51.0, top: 79.5, width: 14.0, height: 17.0, rotate: 1, opacity: 0.95, scaleX: 0.95 },
      180: { left: 40.0, top: 80.0, width: 14.0, height: 17.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      225: { left: 49.0, top: 79.5, width: 14.0, height: 17.0, rotate: -1, opacity: 0.95, scaleX: 0.95 },
      270: { left: 42.0, top: 80.0, width: 14.0, height: 17.0, rotate: 0, opacity: 1, scaleX: 0.95 },
      315: { left: 56.0, top: 79.0, width: 14.0, height: 17.0, rotate: 1, opacity: 0.95, scaleX: 0.95 }
    }
  },
  Wrist: {
    name: 'Wrist',
    label: 'Wrist & Hand',
    defaultTheta: 35,
    frames: {
      0: { left: 19.0, top: 59.0, width: 10.0, height: 10.0, rotate: -16, opacity: 1, scaleX: 1.0 },
      45: { left: 33.0, top: 61.0, width: 10.0, height: 10.0, rotate: -10, opacity: 1, scaleX: 1.0 },
      90: { left: 67.0, top: 57.0, width: 10.0, height: 10.0, rotate: 6, opacity: 1, scaleX: 0.95 },
      135: { left: 36.0, top: 62.0, width: 10.0, height: 10.0, rotate: 8, opacity: 0.9, scaleX: 0.9 },
      180: { left: 19.0, top: 59.0, width: 10.0, height: 10.0, rotate: 16, opacity: 0.9, scaleX: 1.0 }
    }
  },
  Neck: {
    name: 'Neck',
    label: 'Neck & Throat',
    defaultTheta: 0,
    frames: {
      0: { left: 50.0, top: 22.5, width: 12.0, height: 9.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      45: { left: 51.0, top: 23.0, width: 11.0, height: 9.0, rotate: -4, opacity: 0.95, scaleX: 0.85 },
      90: { left: 50.0, top: 24.0, width: 10.0, height: 9.0, rotate: 0, opacity: 0.8, scaleX: 0.7 },
      180: { left: 50.0, top: 22.5, width: 12.0, height: 9.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      315: { left: 49.0, top: 23.0, width: 11.0, height: 9.0, rotate: 4, opacity: 0.95, scaleX: 0.85 }
    }
  },
  Ankle: {
    name: 'Ankle',
    label: 'Ankle & Foot',
    defaultTheta: 0,
    frames: {
      0: { left: 39.0, top: 92.0, width: 10.0, height: 8.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      90: { left: 54.0, top: 92.0, width: 11.0, height: 8.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      180: { left: 40.0, top: 92.0, width: 10.0, height: 8.0, rotate: 0, opacity: 1, scaleX: 1.0 }
    }
  }
};

export const Interactive3DStudio = ({
  selectedBodyArea = 'Forearm',
  onSelectBodyArea,
  selectedDesign,
  onSelectDesign,
  designs = [],
  compact = false,
}) => {
  // Continuous 360-degree rotation state (0° to 360°)
  const [rotationDeg, setRotationDeg] = useState(45);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartAngle, setDragStartAngle] = useState(0);

  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredPart, setHoveredPart] = useState(null);
  
  // Custom Fine Tuning for Tattoo Placement
  const [tattooScale, setTattooScale] = useState(1.1);
  const [tattooOpacity, setTattooOpacity] = useState(0.95);
  const [tattooRotationOffset, setTattooRotationOffset] = useState(0);
  const [offsetNudgeX, setOffsetNudgeX] = useState(0);
  const [offsetNudgeY, setOffsetNudgeY] = useState(0);
  const [blendMode, setBlendMode] = useState('multiply'); // 'multiply' gives true skin ink absorption

  // Preload all 360 frame images into browser cache for instant rotation
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
    
    // Find matching placement config
    const matchedKey = Object.keys(ANATOMICAL_PLACEMENTS).find(k => 
      k.toLowerCase() === lower || lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower)
    );
    
    if (matchedKey && ANATOMICAL_PLACEMENTS[matchedKey]) {
      const defaultAngle = ANATOMICAL_PLACEMENTS[matchedKey].defaultTheta;
      setRotationDeg(defaultAngle);
      // Reset micro-nudges on area change so design centers cleanly
      setOffsetNudgeX(0);
      setOffsetNudgeY(0);
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

  // Normalized 0 to 360 angle
  const normalizedAngle = ((rotationDeg % 360) + 360) % 360;

  // Find the exact active 360 frame based on angle (closest of the 8 perspective views)
  const getClosestFrame = (deg) => {
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

  // Active Placement definition
  const activeZoneKey = Object.keys(ANATOMICAL_PLACEMENTS).find(k => 
    k.toLowerCase() === selectedBodyArea.toLowerCase() || 
    selectedBodyArea.toLowerCase().includes(k.toLowerCase()) || 
    k.toLowerCase().includes(selectedBodyArea.toLowerCase())
  ) || 'Forearm';

  const placementConfig = ANATOMICAL_PLACEMENTS[activeZoneKey];

  // Resolve frame-specific position for current angle
  const frameCoords = placementConfig?.frames?.[currentFrame.angle];

  // Calculate visibility based on whether frame coordinates exist for this view
  const isTattooVisibleInAngle = Boolean(frameCoords && (frameCoords.opacity ?? 1) > 0.2);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 1.6));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.85));
  const handleReset = () => {
    setZoomLevel(1);
    setRotationDeg(placementConfig?.defaultTheta ?? 0);
    setIsAutoRotating(false);
    setTattooScale(1.1);
    setTattooOpacity(0.95);
    setTattooRotationOffset(0);
    setOffsetNudgeX(0);
    setOffsetNudgeY(0);
    setBlendMode('multiply');
    toast.info('Reset 3D mannequin to calibrated alignment');
  };

  const imageSrc = selectedDesign ? getFullImageUrl(selectedDesign.dataUri || selectedDesign.previewImage || selectedDesign.image) : '';

  return (
    <div
      className={`relative w-full ${compact ? 'h-[520px] sm:h-[580px] md:h-[640px]' : 'h-[580px] sm:h-[640px] md:h-[740px]'} flex flex-col items-center justify-between select-none overflow-hidden rounded-2xl bg-[#090b0e] border border-white/10 shadow-2xl transition-colors`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      
      {/* 1. TOP 360° CONTROL & VIEW STATUS BAR */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-30 flex items-center justify-between gap-2 pointer-events-auto">
        
        {/* Angle Indicator & Orbit Controls */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 bg-black/90 backdrop-blur-md border border-amber-400/30 p-1 sm:p-1.5 rounded-full shadow-xl">
          <button
            type="button"
            onClick={() => setRotationDeg((prev) => (prev + 45) % 360)}
            className="flex items-center space-x-1 px-2.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 hover:text-amber-200 bg-amber-950/60 border border-amber-500/40 rounded-full transition-colors"
            title="Turn 45° clockwise"
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
            {isAutoRotating ? '⏸ Stop Orbit' : '▶ 360° Spin'}
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1 text-zinc-400 hover:text-white rounded-full transition-colors hidden sm:inline-block"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1 text-zinc-400 hover:text-white rounded-full transition-colors hidden sm:inline-block"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Anatomical Calibration Badge */}
        <div className="bg-black/90 backdrop-blur-md border border-emerald-500/40 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-emerald-300 flex items-center space-x-1.5 shadow-lg shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="truncate max-w-[140px] sm:max-w-none">
            {placementConfig?.label || selectedBodyArea} • {currentFrame.label}
          </span>
        </div>
      </div>

      {/* 2. ALL 8 ANGLE PRESET BUTTONS BAR */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-25 flex items-center space-x-1 bg-black/85 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-full text-[9px] text-zinc-300 pointer-events-auto">
        {ANATOMY_360_FRAMES.map((f) => {
          const isActive = Math.abs(normalizedAngle - f.angle) < 22.5 || (f.angle === 0 && normalizedAngle >= 337.5);
          return (
            <button
              key={f.angle}
              type="button"
              onClick={() => setRotationDeg(f.angle)}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                isActive ? 'text-amber-300 font-bold bg-amber-500/20' : 'hover:text-white text-zinc-400'
              }`}
            >
              {f.angle}°
            </button>
          );
        })}
      </div>

      {/* 3. CENTER STAGE: 360° ANATOMICAL HUMAN BODY TURNTABLE */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out transform-gpu will-change-transform pt-10 pb-28 cursor-grab active:cursor-grabbing"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* Soft studio vignette glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05)_0%,transparent_75%)] pointer-events-none" />

        {/* 3D Model Viewport with Real Muscular Body Contours */}
        <div className="relative h-[88%] max-h-[620px] aspect-[2/3] flex items-center justify-center transform-gpu transition-all duration-100">
          
          <div
            className="relative w-full h-full flex items-center justify-center transform-gpu will-change-transform"
            style={{
              transform: `perspective(1000px) rotateY(${subAngle * 0.3}deg)`,
              transformStyle: 'preserve-3d',
              transition: isDragging || isAutoRotating ? 'none' : 'transform 0.2s ease-out',
            }}
          >
            {/* Real 3D Full Body Anatomical Model Frame */}
            <img
              key={currentFrame.src + (currentFrame.flip ? '_flip' : '')}
              src={currentFrame.src}
              alt="360-Degree Muscular Anatomical Human Model"
              className="w-full h-full object-contain filter brightness-100 contrast-110 drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)] pointer-events-none transform-gpu transition-opacity duration-150"
              style={{
                transform: currentFrame.flip ? 'scaleX(-1)' : 'none',
              }}
            />

            {/* REALISTIC INKED-ON-SKIN TATTOO PROJECTION */}
            {selectedDesign && frameCoords && isTattooVisibleInAngle && (
              <div
                className="absolute z-20 pointer-events-none flex items-center justify-center transform-gpu will-change-transform"
                style={{
                  left: `calc(${frameCoords.left + offsetNudgeX}%)`,
                  top: `calc(${frameCoords.top + offsetNudgeY}%)`,
                  width: `${frameCoords.width}%`,
                  height: `${frameCoords.height}%`,
                  transform: `translate3d(-50%, -50%, 0) scaleX(${(frameCoords.scaleX || 1) * tattooScale}) scaleY(${tattooScale}) rotate(${((frameCoords.rotate || 0) + tattooRotationOffset)}deg) skewY(${frameCoords.skewY || 0}deg)`,
                  opacity: tattooOpacity * (frameCoords.opacity || 1),
                  mixBlendMode: blendMode === 'multiply' ? 'multiply' : 'normal',
                  filter: blendMode === 'multiply' 
                    ? 'contrast(1.2) brightness(0.92) drop-shadow(0 0 1px rgba(0,0,0,0.7))'
                    : 'drop-shadow(0 0 4px rgba(0,0,0,0.5))',
                  transition: isDragging ? 'none' : 'opacity 0.15s ease-out, transform 0.08s ease-out',
                }}
              >
                {selectedDesign.svg ? (
                  <div className="w-full h-full flex items-center justify-center text-zinc-950 font-bold">
                    {selectedDesign.svg}
                  </div>
                ) : imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={selectedDesign.name}
                    className="w-full h-full object-contain pointer-events-none filter contrast-115"
                  />
                ) : (
                  <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider text-center bg-black/70 px-2 py-1 rounded">
                    {selectedDesign.name}
                  </div>
                )}
              </div>
            )}

            {/* Dynamic Clickable Hotspot Zones Matching Current View */}
            {Object.entries(ANATOMICAL_PLACEMENTS).map(([key, config]) => {
              const activeCoords = config.frames?.[currentFrame.angle];
              if (!activeCoords || (activeCoords.opacity ?? 1) < 0.4) return null;

              const isSelected = selectedBodyArea.toLowerCase() === key.toLowerCase() || 
                                 selectedBodyArea.toLowerCase().includes(key.toLowerCase());
              const isHovered = hoveredPart === key;

              return (
                <div
                  key={key}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectBodyArea) onSelectBodyArea(key);
                  }}
                  onMouseEnter={() => setHoveredPart(key)}
                  onMouseLeave={() => setHoveredPart(null)}
                  className={`absolute z-25 cursor-pointer rounded-xl transition-all border pointer-events-auto ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                      : isHovered
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                      : 'border-transparent hover:border-white/20'
                  }`}
                  style={{
                    left: `${activeCoords.left}%`,
                    top: `${activeCoords.top}%`,
                    width: `${activeCoords.width}%`,
                    height: `${activeCoords.height}%`,
                    transform: 'translate3d(-50%, -50%, 0)',
                  }}
                >
                  {(isSelected || isHovered) && (
                    <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-black/95 backdrop-blur-md text-amber-300 border border-amber-500/40 text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-30">
                      {config.name}
                    </span>
                  )}
                </div>
              );
            })}

          </div>

        </div>

      </div>

      {/* 4. BOTTOM FINE-TUNING CONTROLS & TATTOO SELECTION DOCK */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-30 flex flex-col gap-2 pointer-events-auto">
        
        {/* Interactive Alignment Adjustment Dock */}
        <div className="flex flex-wrap items-center justify-between bg-black/90 backdrop-blur-md border border-white/10 p-2 sm:px-3 rounded-xl text-xs text-zinc-300 shadow-2xl gap-2">
          
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Scale Slider */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400">Size:</span>
              <input
                type="range"
                min="0.5"
                max="2.2"
                step="0.05"
                value={tattooScale}
                onChange={(e) => setTattooScale(parseFloat(e.target.value))}
                className="w-16 sm:w-20 accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
              />
              <span className="text-[10px] font-mono text-zinc-400">{tattooScale.toFixed(2)}x</span>
            </div>

            {/* Rotate Slider */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">Angle:</span>
              <input
                type="range"
                min="-45"
                max="45"
                step="1"
                value={tattooRotationOffset}
                onChange={(e) => setTattooRotationOffset(parseInt(e.target.value))}
                className="w-14 sm:w-16 accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
              />
              <span className="text-[10px] font-mono text-zinc-400">{tattooRotationOffset}°</span>
            </div>

            {/* Nudge D-Pad Controls */}
            <div className="flex items-center space-x-1 bg-zinc-900 border border-white/10 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setOffsetNudgeX((prev) => prev - 1)}
                className="p-1 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded"
                title="Nudge Left"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setOffsetNudgeY((prev) => prev - 1)}
                className="p-1 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded"
                title="Nudge Up"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setOffsetNudgeY((prev) => prev + 1)}
                className="p-1 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded"
                title="Nudge Down"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setOffsetNudgeX((prev) => prev + 1)}
                className="p-1 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded"
                title="Nudge Right"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Ink Depth Mode */}
            <div className="flex items-center space-x-1 text-[10px]">
              <span className="text-zinc-500 uppercase font-bold hidden sm:inline">Ink:</span>
              <button
                type="button"
                onClick={() => setBlendMode('multiply')}
                className={`px-2 py-0.5 rounded uppercase font-bold transition-all ${blendMode === 'multiply' ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white bg-zinc-900'}`}
              >
                Real Skin
              </button>
              <button
                type="button"
                onClick={() => setBlendMode('normal')}
                className={`px-2 py-0.5 rounded uppercase font-bold transition-all ${blendMode === 'normal' ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white bg-zinc-900'}`}
              >
                Direct
              </button>
            </div>

          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={handleReset}
              className="p-1 text-zinc-400 hover:text-white bg-zinc-900 border border-white/10 rounded-md transition-colors text-[10px] px-2.5 flex items-center space-x-1"
              title="Reset View and Offsets"
            >
              <RefreshCcw className="w-3 h-3" />
              <span>Center</span>
            </button>
          </div>
        </div>

        {/* In-Viewport Tattoo Selection Carousel */}
        {designs && designs.length > 0 && (
          <div className="bg-black/95 backdrop-blur-xl border border-white/10 p-1.5 rounded-xl shadow-2xl">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
              <span className="text-[9px] uppercase tracking-widest font-black text-amber-400 px-1 shrink-0">
                Tattoos ({designs.length}):
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
                    <div className="w-8 h-8 rounded bg-black p-0.5 overflow-hidden flex items-center justify-center border border-white/10 shrink-0">
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
                        {design.style || 'Custom'}
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
