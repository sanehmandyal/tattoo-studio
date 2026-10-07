import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Sliders, Check, RefreshCcw, Eye, Layers, Compass, Move, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Crosshair } from 'lucide-react';
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

// Pixel-perfect anatomical coordinate mapping per viewing angle frame directly onto muscle bodies
const ANATOMICAL_PLACEMENTS = {
  Forearm: {
    name: 'Forearm (Right)',
    label: 'Right Forearm',
    defaultTheta: 0,
    defaultScale: 1.10,
    sizeDescription: 'Medium / Elongated',
    frames: {
      0: { left: 19.5, top: 38.5, width: 11.0, height: 16.0, rotate: -26, opacity: 1, scaleX: 0.95, skewY: 1 },
      45: { left: 29.5, top: 42.0, width: 11.5, height: 16.5, rotate: -15, opacity: 1, scaleX: 1.0, skewY: 0 },
      90: { left: 54.0, top: 43.5, width: 11.0, height: 16.0, rotate: 0, opacity: 1, scaleX: 0.95, skewY: 0 },
      135: { left: 33.0, top: 42.0, width: 11.0, height: 16.0, rotate: 12, opacity: 0.95, scaleX: 0.9, skewY: -1 },
      180: { left: 19.5, top: 38.5, width: 11.0, height: 16.0, rotate: 26, opacity: 0.95, scaleX: 0.95, skewY: -1 }
    }
  },
  'Upper Arm': {
    name: 'Upper Arm (Right)',
    label: 'Right Bicep / Deltoid',
    defaultTheta: 0,
    defaultScale: 1.15,
    sizeDescription: 'Medium / Cylindrical',
    frames: {
      0: { left: 25.0, top: 29.5, width: 11.5, height: 14.5, rotate: -22, opacity: 1, scaleX: 0.95, skewY: 0 },
      45: { left: 33.0, top: 31.5, width: 12.0, height: 14.5, rotate: -12, opacity: 1, scaleX: 1.0, skewY: 0 },
      90: { left: 54.0, top: 32.5, width: 12.0, height: 15.0, rotate: 0, opacity: 1, scaleX: 0.95, skewY: 0 },
      135: { left: 36.5, top: 31.5, width: 12.0, height: 14.5, rotate: 10, opacity: 0.95, scaleX: 0.9, skewY: 0 },
      180: { left: 25.0, top: 29.5, width: 11.5, height: 14.5, rotate: 22, opacity: 0.95, scaleX: 0.95, skewY: 0 }
    }
  },
  Shoulder: {
    name: 'Shoulder (Right)',
    label: 'Right Shoulder Cap',
    defaultTheta: 0,
    defaultScale: 1.05,
    sizeDescription: 'Curved / Round',
    frames: {
      0: { left: 31.0, top: 22.5, width: 12.5, height: 12.0, rotate: -12, opacity: 1, scaleX: 0.95 },
      45: { left: 36.5, top: 23.5, width: 13.0, height: 12.5, rotate: -8, opacity: 1, scaleX: 1.0 },
      90: { left: 54.0, top: 23.5, width: 13.0, height: 13.0, rotate: 0, opacity: 1, scaleX: 0.95 },
      135: { left: 40.0, top: 23.5, width: 13.0, height: 12.5, rotate: 8, opacity: 0.95, scaleX: 0.9 },
      180: { left: 31.0, top: 22.5, width: 12.5, height: 12.0, rotate: 12, opacity: 0.95, scaleX: 0.95 }
    }
  },
  Chest: {
    name: 'Chest',
    label: 'Pectoral Chest & Sternum',
    defaultTheta: 0,
    defaultScale: 1.35,
    sizeDescription: 'Broad / Statement Plate',
    frames: {
      0: { left: 50.0, top: 26.5, width: 24.0, height: 14.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      45: { left: 52.0, top: 26.5, width: 20.0, height: 14.0, rotate: -4, opacity: 0.95, scaleX: 0.8 },
      90: { left: 46.0, top: 28.0, width: 12.0, height: 13.0, rotate: -4, opacity: 0.7, scaleX: 0.5 },
      315: { left: 48.0, top: 26.5, width: 20.0, height: 14.0, rotate: 4, opacity: 0.95, scaleX: 0.8 },
      270: { left: 54.0, top: 28.0, width: 12.0, height: 13.0, rotate: 4, opacity: 0.7, scaleX: 0.5 }
    }
  },
  Back: {
    name: 'Back',
    label: 'Upper Back & Lats',
    defaultTheta: 180,
    defaultScale: 1.45,
    sizeDescription: 'Large / Full Canvas',
    frames: {
      180: { left: 50.0, top: 26.5, width: 26.0, height: 17.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      135: { left: 52.0, top: 26.5, width: 22.0, height: 16.0, rotate: 4, opacity: 0.95, scaleX: 0.85 },
      225: { left: 48.0, top: 26.5, width: 22.0, height: 16.0, rotate: -4, opacity: 0.95, scaleX: 0.85 },
      90: { left: 42.0, top: 28.0, width: 12.0, height: 14.0, rotate: 4, opacity: 0.4, scaleX: 0.4 },
      270: { left: 58.0, top: 28.0, width: 12.0, height: 14.0, rotate: -4, opacity: 0.4, scaleX: 0.4 }
    }
  },
  Spine: {
    name: 'Spine',
    label: 'Full Vertebral Spine Line',
    defaultTheta: 180,
    defaultScale: 1.10,
    sizeDescription: 'Tall / Vertical Linear',
    frames: {
      180: { left: 50.0, top: 32.0, width: 10.0, height: 30.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      135: { left: 52.0, top: 32.0, width: 9.0, height: 28.0, rotate: 2, opacity: 0.9, scaleX: 0.8 },
      225: { left: 48.0, top: 32.0, width: 9.0, height: 28.0, rotate: -2, opacity: 0.9, scaleX: 0.8 }
    }
  },
  Ribs: {
    name: 'Ribs',
    label: 'Ribcage & Flank',
    defaultTheta: 0,
    defaultScale: 1.10,
    sizeDescription: 'Curved Flank / Ribs',
    frames: {
      0: { left: 50.0, top: 36.0, width: 18.0, height: 14.0, rotate: 0, opacity: 1, scaleX: 0.95 },
      45: { left: 50.0, top: 36.0, width: 16.0, height: 14.0, rotate: -4, opacity: 1, scaleX: 1.0 },
      90: { left: 47.0, top: 36.5, width: 14.0, height: 15.0, rotate: 0, opacity: 0.85, scaleX: 0.8 },
      315: { left: 50.0, top: 36.0, width: 16.0, height: 14.0, rotate: 4, opacity: 1, scaleX: 1.0 }
    }
  },
  Thigh: {
    name: 'Thigh',
    label: 'Quadriceps / Thigh',
    defaultTheta: 0,
    defaultScale: 1.35,
    sizeDescription: 'Large / Quad Plate',
    frames: {
      0: { left: 42.0, top: 57.0, width: 15.0, height: 19.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      45: { left: 46.0, top: 57.5, width: 15.0, height: 19.0, rotate: -2, opacity: 1, scaleX: 0.95 },
      90: { left: 52.0, top: 58.0, width: 16.0, height: 19.0, rotate: 0, opacity: 1, scaleX: 0.95 },
      135: { left: 50.0, top: 58.0, width: 15.0, height: 19.0, rotate: 2, opacity: 0.95, scaleX: 0.95 },
      180: { left: 42.0, top: 57.0, width: 15.0, height: 19.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      225: { left: 50.0, top: 58.0, width: 15.0, height: 19.0, rotate: -2, opacity: 0.95, scaleX: 0.95 },
      270: { left: 48.0, top: 58.0, width: 16.0, height: 19.0, rotate: 0, opacity: 1, scaleX: 0.95 },
      315: { left: 54.0, top: 57.5, width: 15.0, height: 19.0, rotate: 2, opacity: 0.95, scaleX: 0.95 }
    }
  },
  Calf: {
    name: 'Calf',
    label: 'Calf & Shin',
    defaultTheta: 0,
    defaultScale: 1.15,
    sizeDescription: 'Medium / Tapered',
    frames: {
      0: { left: 39.5, top: 76.5, width: 13.0, height: 17.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      45: { left: 43.5, top: 76.5, width: 13.0, height: 17.0, rotate: -2, opacity: 1, scaleX: 0.95 },
      90: { left: 52.0, top: 77.0, width: 14.0, height: 17.0, rotate: 0, opacity: 1, scaleX: 0.95 },
      135: { left: 48.0, top: 77.0, width: 13.0, height: 17.0, rotate: 2, opacity: 0.95, scaleX: 0.95 },
      180: { left: 39.5, top: 76.5, width: 13.0, height: 17.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      225: { left: 52.0, top: 77.0, width: 13.0, height: 17.0, rotate: -2, opacity: 0.95, scaleX: 0.95 },
      270: { left: 48.0, top: 77.0, width: 14.0, height: 17.0, rotate: 0, opacity: 1, scaleX: 0.95 },
      315: { left: 56.5, top: 76.5, width: 13.0, height: 17.0, rotate: 2, opacity: 0.95, scaleX: 0.95 }
    }
  },
  Wrist: {
    name: 'Wrist',
    label: 'Wrist & Hand',
    defaultTheta: 0,
    defaultScale: 0.75,
    sizeDescription: 'Compact / Minimal',
    frames: {
      0: { left: 15.5, top: 48.0, width: 9.0, height: 9.0, rotate: -28, opacity: 1, scaleX: 1.0 },
      45: { left: 27.0, top: 51.5, width: 9.0, height: 9.0, rotate: -18, opacity: 1, scaleX: 1.0 },
      90: { left: 54.0, top: 53.0, width: 9.0, height: 9.0, rotate: 0, opacity: 1, scaleX: 0.95 },
      135: { left: 30.5, top: 51.5, width: 9.0, height: 9.0, rotate: 14, opacity: 0.9, scaleX: 0.9 },
      180: { left: 15.5, top: 48.0, width: 9.0, height: 9.0, rotate: 28, opacity: 0.9, scaleX: 1.0 }
    }
  },
  Neck: {
    name: 'Neck',
    label: 'Neck & Throat',
    defaultTheta: 0,
    defaultScale: 0.80,
    sizeDescription: 'Subtle / Compact',
    frames: {
      0: { left: 50.0, top: 17.5, width: 10.0, height: 8.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      45: { left: 51.0, top: 18.0, width: 11.0, height: 8.0, rotate: -3, opacity: 0.95, scaleX: 0.85 },
      90: { left: 50.0, top: 18.5, width: 10.0, height: 8.0, rotate: 0, opacity: 0.8, scaleX: 0.7 },
      180: { left: 50.0, top: 17.5, width: 11.0, height: 8.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      315: { left: 49.0, top: 18.0, width: 11.0, height: 8.0, rotate: 3, opacity: 0.95, scaleX: 0.85 }
    }
  },
  Ankle: {
    name: 'Ankle',
    label: 'Ankle & Foot',
    defaultTheta: 0,
    defaultScale: 0.70,
    sizeDescription: 'Small / Minimal Band',
    frames: {
      0: { left: 39.0, top: 90.0, width: 10.0, height: 8.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      90: { left: 52.0, top: 90.0, width: 10.0, height: 8.0, rotate: 0, opacity: 1, scaleX: 1.0 },
      180: { left: 39.0, top: 90.0, width: 10.0, height: 8.0, rotate: 0, opacity: 1, scaleX: 1.0 }
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
  const [rotationDeg, setRotationDeg] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartAngle, setDragStartAngle] = useState(0);

  // Direct Tattoo Dragging State
  const [isDraggingTattoo, setIsDraggingTattoo] = useState(false);
  const [tattooDragStart, setTattooDragStart] = useState({ x: 0, y: 0 });

  // Powerful Interactive Zoom State (0.8x to 2.5x)
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Focus Mode: 'body' (center zoom) or 'tattoo' (focus zoom directly on tattoo part)
  const [zoomFocusMode, setZoomFocusMode] = useState('tattoo');

  // Custom Fine Tuning for Tattoo Placement, Size & 360° Rotation
  const [tattooScale, setTattooScale] = useState(1.10);
  const [tattooOpacity, setTattooOpacity] = useState(0.95);
  const [tattooRotationOffset, setTattooRotationOffset] = useState(0); // Full 0° to 360°
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

  // Automatically rotate toward chosen body area and adjust default tattoo size
  useEffect(() => {
    if (!selectedBodyArea) return;
    const lower = selectedBodyArea.toLowerCase();
    
    // Find matching placement config
    const matchedKey = Object.keys(ANATOMICAL_PLACEMENTS).find(k => 
      k.toLowerCase() === lower || lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower)
    );
    
    if (matchedKey && ANATOMICAL_PLACEMENTS[matchedKey]) {
      const config = ANATOMICAL_PLACEMENTS[matchedKey];
      setRotationDeg(config.defaultTheta);
      setTattooScale(config.defaultScale || 1.10);
      setOffsetNudgeX(0);
      setOffsetNudgeY(0);
      setHighlightPulse(true);
      const timer = setTimeout(() => setHighlightPulse(false), 1400);
      return () => clearTimeout(timer);
    }
  }, [selectedBodyArea]);

  // Auto-rotate 360 animation loop
  useEffect(() => {
    if (!isAutoRotating) return;
    let animId;
    const animate = () => {
      setRotationDeg((prev) => (prev + 0.6) % 360);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isAutoRotating]);

  // Pointer drag on turntable to spin in 360° or pan when zoomed in
  const handlePointerDown = (e) => {
    if (isDraggingTattoo) return;
    
    // If zoomed in significantly (> 1.2x) and right click or space/shift held, enable pan
    if (zoomLevel > 1.2 && (e.button === 2 || e.shiftKey)) {
      setIsPanning(true);
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
      setPanStart({ x: clientX - panOffset.x, y: clientY - panOffset.y });
      return;
    }

    setIsDragging(true);
    setIsAutoRotating(false);
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    setDragStartX(clientX);
    setDragStartAngle(rotationDeg);
  };

  const handlePointerMove = (e) => {
    if (isDraggingTattoo) {
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
      const deltaX = (clientX - tattooDragStart.x) * (0.2 / zoomLevel);
      const deltaY = (clientY - tattooDragStart.y) * (0.2 / zoomLevel);
      setOffsetNudgeX((prev) => prev + deltaX);
      setOffsetNudgeY((prev) => prev + deltaY);
      setTattooDragStart({ x: clientX, y: clientY });
      return;
    }

    if (isPanning) {
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
      setPanOffset({
        x: clientX - panStart.x,
        y: clientY - panStart.y,
      });
      return;
    }

    if (!isDragging) return;
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const deltaX = clientX - dragStartX;
    const newAngle = (dragStartAngle - deltaX * 0.7 + 3600) % 360;
    setRotationDeg(newAngle);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setIsDraggingTattoo(false);
    setIsPanning(false);
  };

  // Mouse wheel zoom support on viewport
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * -0.0015;
    setZoomLevel((prev) => Math.min(Math.max(parseFloat((prev + zoomDelta).toFixed(2)), 0.8), 2.8));
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

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(parseFloat((prev + 0.3).toFixed(2)), 2.8));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(parseFloat((prev - 0.3).toFixed(2)), 0.8));
  const handleResetZoom = () => {
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
    toast.info('Zoom reset to 100%');
  };

  // Body Part Specific Sizing Helper
  const handleApplyBodyPartPresetSize = (multiplier = 1.0) => {
    const base = placementConfig?.defaultScale || 1.10;
    const newScale = parseFloat((base * multiplier).toFixed(2));
    setTattooScale(newScale);
    toast.success(`Size adjusted for ${placementConfig?.name}: ${(multiplier * 100).toFixed(0)}% fit`);
  };

  const handleReset = () => {
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
    setRotationDeg(placementConfig?.defaultTheta ?? 0);
    setIsAutoRotating(false);
    setTattooScale(placementConfig?.defaultScale || 1.10);
    setTattooOpacity(0.95);
    setTattooRotationOffset(0);
    setOffsetNudgeX(0);
    setOffsetNudgeY(0);
    setBlendMode('multiply');
    toast.info(`Centered and reset on ${placementConfig?.label || selectedBodyArea}`);
  };

  // Focus Origin: if 'tattoo' mode, pivot zoom right on the tattoo coordinates!
  const zoomOriginX = zoomFocusMode === 'tattoo' && frameCoords ? `${frameCoords.left + offsetNudgeX}%` : '50%';
  const zoomOriginY = zoomFocusMode === 'tattoo' && frameCoords ? `${frameCoords.top + offsetNudgeY}%` : '50%';

  const imageSrc = selectedDesign ? getFullImageUrl(selectedDesign.dataUri || selectedDesign.previewImage || selectedDesign.image) : '';

  return (
    <div
      className={`relative w-full ${compact ? 'h-[560px] sm:h-[620px] md:h-[680px]' : 'h-[620px] sm:h-[700px] md:h-[800px]'} flex flex-col items-center justify-between select-none overflow-hidden rounded-2xl bg-[#090b0e] border border-white/10 shadow-2xl transition-colors`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
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
            <span>{Math.round(normalizedAngle)}°</span>
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

          {/* Zoom Target Focus Mode (Tattoo vs Body) */}
          <div className="hidden sm:flex items-center space-x-1 border-l border-white/10 pl-1.5 ml-1">
            <button
              type="button"
              onClick={() => {
                setZoomFocusMode('tattoo');
                setZoomLevel(1.8);
                toast.success(`Zooming in on ${placementConfig?.name}!`);
              }}
              className={`px-2 py-0.5 text-[9px] font-bold rounded transition-all ${
                zoomFocusMode === 'tattoo' && zoomLevel > 1.2
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white bg-zinc-900 border border-white/10'
              }`}
              title="Zoom directly onto the tattoo & muscle area"
            >
              🔍 Focus Tattoo
            </button>
            <button
              type="button"
              onClick={() => {
                setZoomFocusMode('body');
                setZoomLevel(1.0);
                setPanOffset({ x: 0, y: 0 });
              }}
              className={`px-2 py-0.5 text-[9px] font-bold rounded transition-all ${
                zoomLevel === 1.0
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white bg-zinc-900 border border-white/10'
              }`}
              title="Full Body Overview"
            >
              1x Full Body
            </button>
          </div>
        </div>

        {/* Anatomical Calibration Badge */}
        <div className="bg-black/90 backdrop-blur-md border border-amber-400/50 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-amber-300 flex items-center space-x-1.5 shadow-lg shrink-0">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
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
                isActive ? 'text-amber-300 font-bold bg-amber-500/20 shadow-sm' : 'hover:text-white text-zinc-400'
              }`}
            >
              {f.angle}°
            </button>
          );
        })}
      </div>

      {/* 3. FLOATING INTERACTIVE ZOOM HUD (LEFT SIDE) */}
      <div className="absolute left-3 top-20 z-30 flex flex-col items-center bg-black/90 backdrop-blur-md border border-amber-500/30 p-1.5 rounded-2xl shadow-2xl pointer-events-auto space-y-1.5">
        <div className="text-[9px] font-black uppercase text-amber-400 tracking-wider">
          Zoom
        </div>

        {/* Zoom In Button */}
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-1.5 bg-zinc-900 hover:bg-amber-400 hover:text-black text-zinc-300 rounded-xl transition-all border border-white/10 shadow-sm"
          title="Zoom In (Inspect Details)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Vertical Zoom Level Slider */}
        <div className="relative py-1 flex items-center justify-center">
          <input
            type="range"
            min="0.8"
            max="2.8"
            step="0.05"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
            className="w-16 accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg -rotate-90 my-6"
            title="Drag to zoom"
          />
        </div>

        {/* Zoom Out Button */}
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-1.5 bg-zinc-900 hover:bg-amber-400 hover:text-black text-zinc-300 rounded-xl transition-all border border-white/10 shadow-sm"
          title="Zoom Out (Full Body)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Live Zoom Percentage Badge / Reset */}
        <button
          type="button"
          onClick={handleResetZoom}
          className="px-1.5 py-0.5 bg-amber-500/20 hover:bg-amber-400 hover:text-black text-amber-300 font-mono text-[9px] font-bold rounded-md border border-amber-500/30 transition-all"
          title="Click to reset zoom to 100%"
        >
          {Math.round(zoomLevel * 100)}%
        </button>
      </div>

      {/* 4. CENTER STAGE: 360° ANATOMICAL HUMAN BODY TURNTABLE */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-150 ease-out transform-gpu will-change-transform pt-10 pb-44 cursor-grab active:cursor-grabbing"
        style={{
          transformOrigin: `${zoomOriginX} ${zoomOriginY}`,
          transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
        }}
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

            {/* REALISTIC INKED-ON-SKIN TATTOO PROJECTION WITH DIRECT DRAG, 360° ROTATION & RESIZING */}
            {selectedDesign && frameCoords && isTattooVisibleInAngle && (
              <div
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setIsDraggingTattoo(true);
                  const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
                  const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
                  setTattooDragStart({ x: clientX, y: clientY });
                }}
                className={`absolute z-30 pointer-events-auto flex items-center justify-center transform-gpu will-change-transform cursor-move group ${
                  highlightPulse ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black rounded-lg animate-pulse' : ''
                }`}
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
                  transition: isDragging || isDraggingTattoo ? 'none' : 'opacity 0.15s ease-out, transform 0.08s ease-out',
                }}
                title="Click and drag tattoo to adjust placement on skin"
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
                    toast.success(`Testing design on ${config.name}!`);
                  }}
                  onMouseEnter={() => setHoveredPart(key)}
                  onMouseLeave={() => setHoveredPart(null)}
                  className={`absolute z-25 cursor-pointer rounded-xl transition-all border pointer-events-auto ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
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

      {/* 5. BOTTOM FINE-TUNING CONTROLS & TATTOO SELECTION DOCK */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-30 flex flex-col gap-2 pointer-events-auto">
        
        {/* Interactive Alignment, Full 360° Rotation & Size Adjustment Dock */}
        <div className="flex flex-wrap items-center justify-between bg-black/95 backdrop-blur-md border border-white/10 p-2 sm:px-3 rounded-xl text-xs text-zinc-300 shadow-2xl gap-2">
          
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Body-Part Tailored Tattoo Size Zoom In / Out Control */}
            <div className="flex items-center space-x-1.5 bg-zinc-900/90 border border-white/10 px-2 py-1 rounded-lg">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400">
                Tattoo Size:
              </span>
              <button
                type="button"
                onClick={() => setTattooScale((prev) => Math.max(parseFloat((prev - 0.1).toFixed(2)), 0.2))}
                className="w-5 h-5 flex items-center justify-center bg-black/60 hover:bg-amber-400 hover:text-black rounded text-zinc-300 font-bold transition-all text-xs"
                title="Decrease Tattoo Size (-10%)"
              >
                -
              </button>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.05"
                value={tattooScale}
                onChange={(e) => setTattooScale(parseFloat(e.target.value))}
                className="w-16 sm:w-20 accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                title="Adjust tattoo scale"
              />
              <button
                type="button"
                onClick={() => setTattooScale((prev) => Math.min(parseFloat((prev + 0.1).toFixed(2)), 3.0))}
                className="w-5 h-5 flex items-center justify-center bg-black/60 hover:bg-amber-400 hover:text-black rounded text-zinc-300 font-bold transition-all text-xs"
                title="Increase Tattoo Size (+10%)"
              >
                +
              </button>
              <span className="text-[10px] font-mono text-amber-300 font-bold">
                {Math.round(tattooScale * 100)}%
              </span>
            </div>

            {/* FULL 360° TATTOO ROTATION CONTROL */}
            <div className="flex items-center space-x-1.5 bg-zinc-900/90 border border-white/10 px-2 py-1 rounded-lg">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400">
                Tattoo 360°:
              </span>
              <button
                type="button"
                onClick={() => setTattooRotationOffset((prev) => (prev - 15 + 360) % 360)}
                className="p-0.5 text-zinc-400 hover:text-amber-400"
                title="Rotate Tattoo -15°"
              >
                ↺
              </button>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={tattooRotationOffset}
                onChange={(e) => setTattooRotationOffset(parseInt(e.target.value))}
                className="w-14 sm:w-18 accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                title="Rotate tattoo 0° to 360°"
              />
              <button
                type="button"
                onClick={() => setTattooRotationOffset((prev) => (prev + 15) % 360)}
                className="p-0.5 text-zinc-400 hover:text-amber-400"
                title="Rotate Tattoo +15°"
              >
                ↻
              </button>
              <span className="text-[10px] font-mono text-zinc-300 w-7 text-right">
                {tattooRotationOffset}°
              </span>
            </div>

            {/* Quick 360° Angle Presets */}
            <div className="hidden lg:flex items-center space-x-0.5 bg-zinc-900/70 border border-white/10 rounded-lg p-0.5 text-[8px] font-bold">
              {[0, 90, 180, 270].map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => setTattooRotationOffset(deg)}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    tattooRotationOffset === deg ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>

            {/* Nudge D-Pad Controls */}
            <div className="flex items-center space-x-0.5 bg-zinc-900 border border-white/10 rounded-lg p-0.5">
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
                className={`px-2 py-0.5 rounded uppercase font-bold transition-all ${blendMode === 'multiply' ? 'bg-amber-400 text-black shadow-sm' : 'text-zinc-400 hover:text-white bg-zinc-900'}`}
              >
                Real Skin
              </button>
              <button
                type="button"
                onClick={() => setBlendMode('normal')}
                className={`px-2 py-0.5 rounded uppercase font-bold transition-all ${blendMode === 'normal' ? 'bg-amber-400 text-black shadow-sm' : 'text-zinc-400 hover:text-white bg-zinc-900'}`}
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
              title="Reset View, Sizing and Rotation"
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
