import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Sliders, Check, RefreshCcw, Eye, Layers, Compass, Move, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Crosshair, X, Flame, ArrowRight, Palette, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { getFullImageUrl } from '../../utils/imageHelper';

// 8 Anatomical Perspectives for Full 360° Volumetric Rotation
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
    defaultScale: 1.15,
    sizeDescription: 'Medium / Elongated',
    frames: {
      0: { left: 19.5, top: 38.5, width: 11.0, height: 16.0, rotate: -26, opacity: 1 },
      45: { left: 29.5, top: 42.0, width: 11.5, height: 16.5, rotate: -15, opacity: 1 },
      90: { left: 54.0, top: 43.5, width: 11.0, height: 16.0, rotate: 0, opacity: 1 },
      135: { left: 33.0, top: 42.0, width: 11.0, height: 16.0, rotate: 12, opacity: 1 },
      180: { left: 19.5, top: 38.5, width: 11.0, height: 16.0, rotate: 26, opacity: 1 }
    }
  },
  'Upper Arm': {
    name: 'Upper Arm (Right)',
    label: 'Right Bicep / Deltoid',
    defaultTheta: 0,
    defaultScale: 1.20,
    sizeDescription: 'Medium / Cylindrical',
    frames: {
      0: { left: 25.0, top: 29.5, width: 12.0, height: 15.0, rotate: -22, opacity: 1 },
      45: { left: 33.0, top: 31.5, width: 12.0, height: 15.0, rotate: -12, opacity: 1 },
      90: { left: 54.0, top: 32.5, width: 12.0, height: 15.0, rotate: 0, opacity: 1 },
      135: { left: 36.5, top: 31.5, width: 12.0, height: 15.0, rotate: 10, opacity: 1 },
      180: { left: 25.0, top: 29.5, width: 12.0, height: 15.0, rotate: 22, opacity: 1 }
    }
  },
  Shoulder: {
    name: 'Shoulder (Right)',
    label: 'Right Shoulder Cap',
    defaultTheta: 0,
    defaultScale: 1.10,
    sizeDescription: 'Curved / Round',
    frames: {
      0: { left: 31.0, top: 22.5, width: 12.5, height: 12.5, rotate: -12, opacity: 1 },
      45: { left: 36.5, top: 23.5, width: 12.5, height: 12.5, rotate: -8, opacity: 1 },
      90: { left: 54.0, top: 23.5, width: 12.5, height: 13.0, rotate: 0, opacity: 1 },
      135: { left: 40.0, top: 23.5, width: 12.5, height: 12.5, rotate: 8, opacity: 1 },
      180: { left: 31.0, top: 22.5, width: 12.5, height: 12.5, rotate: 12, opacity: 1 }
    }
  },
  Chest: {
    name: 'Chest',
    label: 'Pectoral Chest & Sternum',
    defaultTheta: 0,
    defaultScale: 1.40,
    sizeDescription: 'Broad / Statement Plate',
    frames: {
      0: { left: 50.0, top: 26.5, width: 22.0, height: 15.0, rotate: 0, opacity: 1 },
      45: { left: 52.0, top: 26.5, width: 19.0, height: 15.0, rotate: -4, opacity: 1 },
      90: { left: 46.0, top: 28.0, width: 12.0, height: 14.0, rotate: -4, opacity: 0.95 },
      315: { left: 48.0, top: 26.5, width: 19.0, height: 15.0, rotate: 4, opacity: 1 },
      270: { left: 54.0, top: 28.0, width: 12.0, height: 14.0, rotate: 4, opacity: 0.95 }
    }
  },
  Back: {
    name: 'Back',
    label: 'Upper Back & Lats',
    defaultTheta: 180,
    defaultScale: 1.50,
    sizeDescription: 'Large / Full Canvas',
    frames: {
      180: { left: 50.0, top: 26.5, width: 24.0, height: 18.0, rotate: 0, opacity: 1 },
      135: { left: 52.0, top: 26.5, width: 20.0, height: 17.0, rotate: 4, opacity: 1 },
      225: { left: 48.0, top: 26.5, width: 20.0, height: 17.0, rotate: -4, opacity: 1 },
      90: { left: 42.0, top: 28.0, width: 12.0, height: 15.0, rotate: 4, opacity: 0.9 },
      270: { left: 58.0, top: 28.0, width: 12.0, height: 15.0, rotate: -4, opacity: 0.9 }
    }
  },
  Spine: {
    name: 'Spine',
    label: 'Full Vertebral Spine Line',
    defaultTheta: 180,
    defaultScale: 1.15,
    sizeDescription: 'Tall / Vertical Linear',
    frames: {
      180: { left: 50.0, top: 32.0, width: 10.0, height: 30.0, rotate: 0, opacity: 1 },
      135: { left: 52.0, top: 32.0, width: 9.5, height: 28.0, rotate: 2, opacity: 1 },
      225: { left: 48.0, top: 32.0, width: 9.5, height: 28.0, rotate: -2, opacity: 1 }
    }
  },
  Ribs: {
    name: 'Ribs',
    label: 'Ribcage & Flank',
    defaultTheta: 0,
    defaultScale: 1.15,
    sizeDescription: 'Curved Flank / Ribs',
    frames: {
      0: { left: 50.0, top: 36.0, width: 16.0, height: 14.0, rotate: 0, opacity: 1 },
      45: { left: 50.0, top: 36.0, width: 15.0, height: 14.0, rotate: -4, opacity: 1 },
      90: { left: 47.0, top: 36.5, width: 13.0, height: 15.0, rotate: 0, opacity: 0.95 },
      315: { left: 50.0, top: 36.0, width: 15.0, height: 14.0, rotate: 4, opacity: 1 }
    }
  },
  Thigh: {
    name: 'Thigh',
    label: 'Quadriceps / Thigh',
    defaultTheta: 0,
    defaultScale: 1.40,
    sizeDescription: 'Large / Quad Plate',
    frames: {
      0: { left: 42.0, top: 57.0, width: 15.0, height: 19.0, rotate: 0, opacity: 1 },
      45: { left: 46.0, top: 57.5, width: 15.0, height: 19.0, rotate: -2, opacity: 1 },
      90: { left: 52.0, top: 58.0, width: 15.0, height: 19.0, rotate: 0, opacity: 1 },
      135: { left: 50.0, top: 58.0, width: 15.0, height: 19.0, rotate: 2, opacity: 1 },
      180: { left: 42.0, top: 57.0, width: 15.0, height: 19.0, rotate: 0, opacity: 1 },
      225: { left: 50.0, top: 58.0, width: 15.0, height: 19.0, rotate: -2, opacity: 1 },
      270: { left: 48.0, top: 58.0, width: 15.0, height: 19.0, rotate: 0, opacity: 1 },
      315: { left: 54.0, top: 57.5, width: 15.0, height: 19.0, rotate: 2, opacity: 1 }
    }
  },
  Calf: {
    name: 'Calf',
    label: 'Calf & Shin',
    defaultTheta: 0,
    defaultScale: 1.20,
    sizeDescription: 'Medium / Tapered',
    frames: {
      0: { left: 39.5, top: 76.5, width: 13.0, height: 17.0, rotate: 0, opacity: 1 },
      45: { left: 43.5, top: 76.5, width: 13.0, height: 17.0, rotate: -2, opacity: 1 },
      90: { left: 52.0, top: 77.0, width: 13.5, height: 17.0, rotate: 0, opacity: 1 },
      135: { left: 48.0, top: 77.0, width: 13.0, height: 17.0, rotate: 2, opacity: 1 },
      180: { left: 39.5, top: 76.5, width: 13.0, height: 17.0, rotate: 0, opacity: 1 },
      225: { left: 52.0, top: 77.0, width: 13.0, height: 17.0, rotate: -2, opacity: 1 },
      270: { left: 48.0, top: 77.0, width: 13.5, height: 17.0, rotate: 0, opacity: 1 },
      315: { left: 56.5, top: 76.5, width: 13.0, height: 17.0, rotate: 2, opacity: 1 }
    }
  },
  Wrist: {
    name: 'Wrist',
    label: 'Wrist & Hand',
    defaultTheta: 0,
    defaultScale: 0.85,
    sizeDescription: 'Compact / Minimal',
    frames: {
      0: { left: 15.5, top: 48.0, width: 9.0, height: 9.0, rotate: -28, opacity: 1 },
      45: { left: 27.0, top: 51.5, width: 9.0, height: 9.0, rotate: -18, opacity: 1 },
      90: { left: 54.0, top: 53.0, width: 9.0, height: 9.0, rotate: 0, opacity: 1 },
      135: { left: 30.5, top: 51.5, width: 9.0, height: 9.0, rotate: 14, opacity: 1 },
      180: { left: 15.5, top: 48.0, width: 9.0, height: 9.0, rotate: 28, opacity: 1 }
    }
  },
  Neck: {
    name: 'Neck',
    label: 'Neck & Throat',
    defaultTheta: 0,
    defaultScale: 0.85,
    sizeDescription: 'Subtle / Compact',
    frames: {
      0: { left: 50.0, top: 17.5, width: 10.0, height: 8.5, rotate: 0, opacity: 1 },
      45: { left: 51.0, top: 18.0, width: 10.5, height: 8.5, rotate: -3, opacity: 1 },
      90: { left: 50.0, top: 18.5, width: 10.0, height: 8.5, rotate: 0, opacity: 0.9 },
      180: { left: 50.0, top: 17.5, width: 10.5, height: 8.5, rotate: 0, opacity: 1 },
      315: { left: 49.0, top: 18.0, width: 10.5, height: 8.5, rotate: 3, opacity: 1 }
    }
  },
  Ankle: {
    name: 'Ankle',
    label: 'Ankle & Foot',
    defaultTheta: 0,
    defaultScale: 0.80,
    sizeDescription: 'Small / Minimal Band',
    frames: {
      0: { left: 39.0, top: 90.0, width: 10.0, height: 8.5, rotate: 0, opacity: 1 },
      90: { left: 52.0, top: 90.0, width: 10.0, height: 8.5, rotate: 0, opacity: 1 },
      180: { left: 39.0, top: 90.0, width: 10.0, height: 8.5, rotate: 0, opacity: 1 }
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
  // Interaction Mode: 'tattoo' (Move/Rotate Tattoo) vs 'body' (Orbit 3D Mannequin)
  const [interactionMode, setInteractionMode] = useState('tattoo');

  // Track if user has chosen a tattoo
  const [hasUserChosenTattoo, setHasUserChosenTattoo] = useState(false);
  const [showTattooPicker, setShowTattooPicker] = useState(false);
  const [pickerStyleFilter, setPickerStyleFilter] = useState('All');

  // Continuous 360-degree body rotation state (0° to 360°)
  const [rotationDeg, setRotationDeg] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isDraggingBody, setIsDraggingBody] = useState(false);
  const dragStartXRef = useRef(0);
  const dragStartAngleRef = useRef(0);
  const animFrameRef = useRef(null);

  // Direct Tattoo Dragging & Rotating State
  const [isDraggingTattoo, setIsDraggingTattoo] = useState(false);
  const [isRotatingTattooHandle, setIsRotatingTattooHandle] = useState(false);
  const tattooDragStartRef = useRef({ x: 0, y: 0 });
  const tattooCenterRef = useRef({ x: 0, y: 0 });
  const tattooElemRef = useRef(null);

  // Interactive Zoom State (0.8x to 2.8x)
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [zoomFocusMode, setZoomFocusMode] = useState('tattoo');
  const [hoveredPart, setHoveredPart] = useState(null);
  const [highlightPulse, setHighlightPulse] = useState(true);

  // Fine Tuning for Tattoo Placement, Size & 360° In-Place Rotation
  const [tattooScale, setTattooScale] = useState(1.15);
  const [tattooOpacity, setTattooOpacity] = useState(1.0); // 100% crisp pure opacity
  const [tattooRotationOffset, setTattooRotationOffset] = useState(0); // 0° to 360° pure in-place spin
  const [offsetNudgeX, setOffsetNudgeX] = useState(0);
  const [offsetNudgeY, setOffsetNudgeY] = useState(0);
  const [blendMode, setBlendMode] = useState('high-contrast');

  // Active Control Panel Tab: 'transform' (size/rotate) | 'position' (drag/nudge)
  const [activeTab, setActiveTab] = useState('transform');

  const studioContainerRef = useRef(null);
  const tattooPickerScrollRef = useRef(null);

  // Preload all 360 frame images into browser cache for instant rotation
  useEffect(() => {
    ANATOMY_360_FRAMES.forEach((frame) => {
      const img = new Image();
      img.src = frame.src;
    });
  }, []);

  // Non-passive wheel event listener to avoid browser console warnings
  useEffect(() => {
    const el = studioContainerRef.current;
    if (!el) return;
    const handleWheelNonPassive = (e) => {
      // If user is hovering/scrolling over the horizontal tattoo slider or other interactive scroll areas, let it scroll naturally!
      if (e.target && (e.target.closest('.interactive-scroll-area') || e.target.closest('.no-wheel-zoom'))) {
        return;
      }
      e.preventDefault();
      const zoomDelta = e.deltaY * -0.0015;
      setZoomLevel((prev) => Math.min(Math.max(parseFloat((prev + zoomDelta).toFixed(2)), 0.8), 2.8));
    };
    el.addEventListener('wheel', handleWheelNonPassive, { passive: false });
    return () => el.removeEventListener('wheel', handleWheelNonPassive);
  }, []);

  // Automatically rotate toward chosen body area
  useEffect(() => {
    if (!selectedBodyArea) return;
    const lower = selectedBodyArea.toLowerCase();
    
    const matchedKey = Object.keys(ANATOMICAL_PLACEMENTS).find(k => 
      k.toLowerCase() === lower || lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower)
    );
    
    if (matchedKey && ANATOMICAL_PLACEMENTS[matchedKey]) {
      const config = ANATOMICAL_PLACEMENTS[matchedKey];
      setRotationDeg(config.defaultTheta);
      setTattooScale(config.defaultScale || 1.15);
      setOffsetNudgeX(0);
      setOffsetNudgeY(0);
      setHighlightPulse(true);

      // Only open horizontal picker if user has not picked a tattoo yet
      if (!hasUserChosenTattoo && !selectedDesign) {
        setShowTattooPicker(true);
      }

      const timer = setTimeout(() => setHighlightPulse(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [selectedBodyArea, hasUserChosenTattoo, selectedDesign]);

  // Smooth Auto-rotate 360 animation loop
  useEffect(() => {
    if (!isAutoRotating) return;
    let animId;
    let lastTime = performance.now();
    const animate = (time) => {
      const delta = time - lastTime;
      lastTime = time;
      setRotationDeg((prev) => (prev + (delta * 0.035)) % 360);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isAutoRotating]);

  // Unified Pointer Handlers
  const handleStagePointerDown = (e) => {
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;

    if (interactionMode === 'tattoo') {
      setIsDraggingTattoo(true);
      tattooDragStartRef.current = { x: clientX, y: clientY };
    } else {
      setIsDraggingBody(true);
      setIsAutoRotating(false);
      dragStartXRef.current = clientX;
      dragStartAngleRef.current = rotationDeg;
    }
  };

  const handlePointerMove = (e) => {
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;

    // 1. In-Place Interactive Rotation Handle Drag
    if (isRotatingTattooHandle && tattooCenterRef.current) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(() => {
        const rad = Math.atan2(clientY - tattooCenterRef.current.y, clientX - tattooCenterRef.current.x);
        let deg = Math.round((rad * 180) / Math.PI + 90);
        deg = ((deg % 360) + 360) % 360;
        setTattooRotationOffset(deg);
      });
      return;
    }

    // 2. Tattoo Position Drag (Move Tattoo)
    if (isDraggingTattoo) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(() => {
        const deltaX = (clientX - tattooDragStartRef.current.x) * (0.22 / zoomLevel);
        const deltaY = (clientY - tattooDragStartRef.current.y) * (0.22 / zoomLevel);
        setOffsetNudgeX((prev) => prev + deltaX);
        setOffsetNudgeY((prev) => prev + deltaY);
        tattooDragStartRef.current = { x: clientX, y: clientY };
      });
      return;
    }

    // 3. Body Model 360 Orbit Drag (Spin Human Body)
    if (isDraggingBody) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(() => {
        const deltaX = clientX - dragStartXRef.current;
        const newAngle = (dragStartAngleRef.current - deltaX * 0.65 + 3600) % 360;
        setRotationDeg(newAngle);
      });
    }
  };

  const handlePointerUp = () => {
    setIsDraggingBody(false);
    setIsDraggingTattoo(false);
    setIsRotatingTattooHandle(false);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  };

  // Handle Tattoo Selection: Selects tattoo and closes the selector so user can test on all body parts
  const handleSelectTattooArtwork = (design) => {
    if (onSelectDesign) onSelectDesign(design);
    setHasUserChosenTattoo(true);
    setShowTattooPicker(false);
    toast.success(`Selected "${design.name}". Tap any body part to test!`);
  };

  // Smooth Left / Right Scroll for Tattoo Selection Slider
  const scrollTattooPicker = (dir) => {
    if (tattooPickerScrollRef.current) {
      const scrollAmount = dir === 'left' ? -260 : 260;
      tattooPickerScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Normalized 0 to 360 angle
  const normalizedAngle = ((rotationDeg % 360) + 360) % 360;

  // Find the exact active 360 frame based on angle
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

  // Sub-angle delta within current view quadrant
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
  const frameCoords = placementConfig?.frames?.[currentFrame.angle];
  const isTattooVisibleInAngle = Boolean(frameCoords && (frameCoords.opacity ?? 1) > 0.2);

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(parseFloat((prev + 0.3).toFixed(2)), 2.8));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(parseFloat((prev - 0.3).toFixed(2)), 0.8));
  const handleResetZoom = () => {
    setZoomLevel(1.0);
    toast.info('Zoom reset to 100%');
  };

  const handleReset = () => {
    setZoomLevel(1.0);
    setRotationDeg(placementConfig?.defaultTheta ?? 0);
    setIsAutoRotating(false);
    setTattooScale(placementConfig?.defaultScale || 1.15);
    setTattooOpacity(1.0);
    setTattooRotationOffset(0);
    setOffsetNudgeX(0);
    setOffsetNudgeY(0);
    setBlendMode('high-contrast');
    setInteractionMode('tattoo');
    toast.info(`Centered on ${placementConfig?.label || selectedBodyArea}`);
  };

  // Filter designs for the horizontal transparent picker
  const filteredPickerDesigns = designs.filter(d => {
    const matchesStyle = pickerStyleFilter === 'All' || d.style.toLowerCase() === pickerStyleFilter.toLowerCase();
    return matchesStyle;
  });

  const zoomOriginX = zoomFocusMode === 'tattoo' && frameCoords ? `${frameCoords.left + offsetNudgeX}%` : '50%';
  const zoomOriginY = zoomFocusMode === 'tattoo' && frameCoords ? `${frameCoords.top + offsetNudgeY}%` : '50%';

  // Always use transparent PNG if available
  let imageSrc = '';
  if (selectedDesign) {
    const raw = selectedDesign.dataUri || selectedDesign.previewImage || selectedDesign.image || '';
    imageSrc = getFullImageUrl(raw.replace(/\.jpg$/, '.png'));
  }

  const totalTattooRotation = ((frameCoords?.rotate || 0) + tattooRotationOffset) % 360;

  // Calculate clean tattoo stencil filter without square background
  const getInkImageStyle = () => {
    if (blendMode === 'high-contrast') {
      return {
        filter: 'contrast(1.2) saturate(1.25) brightness(1.02) drop-shadow(0 0 2px rgba(0,0,0,0.85))',
        opacity: tattooOpacity,
      };
    }
    if (blendMode === 'natural-skin') {
      return {
        filter: 'contrast(1.1) saturate(1.15) brightness(0.98) drop-shadow(0 0 1px rgba(0,0,0,0.65))',
        opacity: tattooOpacity * 0.95,
      };
    }
    // Direct Sharp Stencil
    return {
      filter: 'saturate(1.2) drop-shadow(0 0 2px rgba(0,0,0,0.8))',
      opacity: tattooOpacity,
    };
  };

  return (
    <div
      ref={studioContainerRef}
      className={`relative w-full ${compact ? 'h-[540px] sm:h-[600px]' : 'h-[600px] sm:h-[680px] md:h-[740px]'} flex flex-col justify-between select-none overflow-hidden rounded-3xl bg-[#090b0e] border border-white/10 shadow-2xl transition-all`}
      onPointerDown={handleStagePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      
      {/* 1. TOP HEADER BAR: INTERACTION MODES, CHANGE TATTOO BUTTON & ANGLE */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        
        {/* Left Controls: Mode Switcher & Change Tattoo Button */}
        <div className="flex items-center space-x-1.5 bg-black/60 backdrop-blur-md border border-white/10 p-1 rounded-full shadow-xl">
          <button
            type="button"
            onClick={() => {
              setInteractionMode('tattoo');
              toast.info('Mode: Move & Rotate Tattoo');
            }}
            className={`flex items-center space-x-1.5 px-3 py-1 text-[11px] font-bold rounded-full transition-all ${
              interactionMode === 'tattoo'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Move and rotate tattoo directly"
          >
            <span>🎨 Adjust Tattoo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setInteractionMode('body');
              toast.info('Mode: Orbit 3D Body');
            }}
            className={`flex items-center space-x-1.5 px-3 py-1 text-[11px] font-bold rounded-full transition-all ${
              interactionMode === 'body'
                ? 'bg-cyan-400 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Drag anywhere to rotate 3D mannequin"
          >
            <span>🧍 Orbit 3D Body</span>
          </button>

          {/* Transparent Glass Button to Change Tattoo Design */}
          <button
            type="button"
            onClick={() => setShowTattooPicker(!showTattooPicker)}
            className={`flex items-center space-x-1 px-3 py-1 text-[11px] font-bold rounded-full transition-all ${
              showTattooPicker
                ? 'bg-amber-400 text-black font-black'
                : 'bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/30'
            }`}
            title="Open horizontal tattoo picker"
          >
            <Palette className="w-3 h-3" />
            <span>{showTattooPicker ? '✕ Close' : 'Change Tattoo'}</span>
          </button>
        </div>

        {/* 360 Angle Controls & Focus */}
        <div className="flex items-center space-x-1.5 bg-black/60 backdrop-blur-md border border-white/10 p-1 rounded-full shadow-lg">
          <button
            type="button"
            onClick={() => setRotationDeg((prev) => (prev + 45) % 360)}
            className="flex items-center space-x-1 px-2.5 py-1 text-[10px] font-bold text-amber-300 hover:text-white bg-amber-950/40 border border-amber-500/30 rounded-full transition-colors"
            title="Turn Mannequin 45°"
          >
            <Compass className="w-3 h-3 text-amber-400" />
            <span>{Math.round(normalizedAngle)}°</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full transition-all ${
              isAutoRotating
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-zinc-400 hover:text-white bg-zinc-900/80 border border-white/5'
            }`}
            title="Auto 360 Turntable Orbit"
          >
            {isAutoRotating ? '⏸ Stop' : '▶ 360°'}
          </button>

          <button
            type="button"
            onClick={() => {
              const nextMode = zoomFocusMode === 'tattoo' ? 'body' : 'tattoo';
              setZoomFocusMode(nextMode);
              setZoomLevel(nextMode === 'tattoo' ? 1.6 : 1.0);
            }}
            className={`px-2 py-1 text-[10px] font-bold rounded-full transition-all ${
              zoomFocusMode === 'tattoo' && zoomLevel > 1.1
                ? 'bg-amber-400/20 text-amber-300 border border-amber-500/40'
                : 'text-zinc-400 hover:text-white bg-zinc-900/80 border border-white/5'
            }`}
            title="Toggle zoom focus"
          >
            {zoomFocusMode === 'tattoo' ? '🔍 Tattoo' : '🌐 Body'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full transition-colors"
            title="Reset position"
          >
            <RefreshCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. COMPACT FLOATING ZOOM HUD (TOP LEFT) */}
      <div className="absolute left-3 top-16 z-30 flex flex-col items-center bg-black/60 backdrop-blur-md border border-white/10 p-1 rounded-xl shadow-lg pointer-events-auto space-y-1">
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-1 bg-zinc-900 hover:bg-amber-400 hover:text-black text-zinc-300 rounded-lg transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleResetZoom}
          className="px-1 py-0.5 text-[8px] font-mono font-bold text-amber-300 bg-amber-950/40 rounded border border-amber-500/30"
          title="Reset Zoom"
        >
          {Math.round(zoomLevel * 100)}%
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-1 bg-zinc-900 hover:bg-amber-400 hover:text-black text-zinc-300 rounded-lg transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. CENTER 3D TURNTABLE VIEWPORT */}
      <div
        className={`relative w-full h-full flex items-center justify-center pt-10 pb-36 transform-gpu will-change-transform ${
          interactionMode === 'tattoo' ? 'cursor-move' : 'cursor-grab active:cursor-grabbing'
        }`}
        style={{
          transformOrigin: `${zoomOriginX} ${zoomOriginY}`,
          transform: `scale(${zoomLevel})`,
          transition: isDraggingBody || isDraggingTattoo || isRotatingTattooHandle ? 'none' : 'transform 0.15s ease-out',
        }}
      >
        <div className="relative h-[90%] max-h-[580px] aspect-[2/3] flex items-center justify-center transform-gpu">
          
          <div
            className="relative w-full h-full flex items-center justify-center transform-gpu will-change-transform"
            style={{
              transform: `perspective(1000px) rotateY(${subAngle * 0.3}deg)`,
              transformStyle: 'preserve-3d',
              transition: isDraggingBody || isAutoRotating ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            {/* 3D Mannequin Frame */}
            <img
              key={currentFrame.src + (currentFrame.flip ? '_flip' : '')}
              src={currentFrame.src}
              alt="360 Body Model"
              className="w-full h-full object-contain filter brightness-100 contrast-110 drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)] pointer-events-none transform-gpu"
              style={{ transform: currentFrame.flip ? 'scaleX(-1)' : 'none' }}
            />

            {/* REALISTIC INKED TATTOO WITH CLEAN ALPHA TRANSPARENCY & ZERO ROTATION DRIFT */}
            {selectedDesign && frameCoords && isTattooVisibleInAngle && (
              <div
                ref={tattooElemRef}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setIsDraggingTattoo(true);
                  const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
                  const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
                  tattooDragStartRef.current = { x: clientX, y: clientY };
                }}
                className={`absolute z-30 pointer-events-auto flex items-center justify-center transform-gpu will-change-transform cursor-move group ${
                  highlightPulse ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black rounded-lg animate-pulse' : ''
                }`}
                style={{
                  left: `calc(${frameCoords.left + offsetNudgeX}%)`,
                  top: `calc(${frameCoords.top + offsetNudgeY}%)`,
                  width: `${frameCoords.width}%`,
                  height: `${frameCoords.height}%`,
                  transform: 'translate3d(-50%, -50%, 0)',
                  transformOrigin: '50% 50%',
                }}
                title="Drag to move tattoo • Drag top handle or use slider to rotate"
              >
                {/* Pure 360° In-Place Rotation Canvas (Rotates strictly around 50% 50% center pivot) */}
                <div
                  className="relative w-full h-full flex items-center justify-center transform-gpu will-change-transform"
                  style={{
                    transform: `rotate(${totalTattooRotation}deg) scale(${tattooScale})`,
                    transformOrigin: '50% 50%',
                  }}
                >
                  {/* Subtle Rotation Handle on Hover */}
                  <div className="absolute inset-0 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <div
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        setIsRotatingTattooHandle(true);
                        if (tattooElemRef.current) {
                          const rect = tattooElemRef.current.getBoundingClientRect();
                          tattooCenterRef.current = {
                            x: rect.left + rect.width / 2,
                            y: rect.top + rect.height / 2,
                          };
                        }
                      }}
                      className="absolute -top-5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg pointer-events-auto hover:scale-110 transition-transform"
                      title="Drag to Rotate Tattoo 360°"
                    >
                      <RotateCw className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Clean Transparent Ink Rendering (NO background box or dark square) */}
                  {selectedDesign.svg ? (
                    <div className="w-full h-full flex items-center justify-center text-zinc-950 font-bold pointer-events-none">
                      {selectedDesign.svg}
                    </div>
                  ) : imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={selectedDesign.name}
                      className="w-full h-full object-contain pointer-events-none"
                      style={getInkImageStyle()}
                    />
                  ) : (
                    <div className="text-[10px] text-amber-300 font-bold text-center bg-black/70 px-2 py-1 rounded pointer-events-none">
                      {selectedDesign.name}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Clickable Muscle Hotspots (Seamless body part switching for testing on all body parts) */}
            {Object.entries(ANATOMICAL_PLACEMENTS).map(([key, config]) => {
              const activeCoords = config.frames?.[currentFrame.angle];
              if (!activeCoords || (activeCoords.opacity ?? 1) < 0.4) return null;

              const isSelected = selectedBodyArea.toLowerCase() === key.toLowerCase() || 
                                 selectedBodyArea.toLowerCase().includes(key.toLowerCase());
              const isHovered = hoveredPart === key;

              if (isSelected && selectedDesign) return null;

              return (
                <div
                  key={key}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectBodyArea) onSelectBodyArea(key);
                    
                    if (!hasUserChosenTattoo && !selectedDesign) {
                      setShowTattooPicker(true);
                    }
                    toast.info(`Testing on ${config.name}!`);
                  }}
                  onMouseEnter={() => setHoveredPart(key)}
                  onMouseLeave={() => setHoveredPart(null)}
                  className={`absolute z-20 cursor-pointer rounded-xl transition-all border pointer-events-auto ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                      : isHovered
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
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
                    <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-black/95 text-amber-300 border border-amber-500/40 text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-30 pointer-events-none">
                      {config.name}
                    </span>
                  )}
                </div>
              );
            })}

          </div>

        </div>

      </div>

      {/* 4. SLEEK HORIZONTAL TRANSPARENT TATTOO PICKER DOCK (SEAMLESS SLIDER WITH LEFT/RIGHT SCROLL & TOUCH/DRAG) */}
      {showTattooPicker && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="interactive-scroll-area no-wheel-zoom absolute top-12 sm:top-14 left-2 right-2 sm:left-3 sm:right-3 z-40 bg-zinc-950/90 backdrop-blur-2xl border border-amber-500/30 rounded-2xl p-2.5 sm:p-3 shadow-[0_15px_40px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
        >
          {/* Header of Horizontal Bar */}
          <div className="flex flex-wrap items-center justify-between pb-2 border-b border-white/10 mb-2 gap-1.5">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider">
                {selectedBodyArea} Tattoos
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                {filteredPickerDesigns.length}
              </span>
            </div>

            {/* Filter Styles in Horizontal Bar */}
            <div className="flex items-center space-x-1 overflow-x-auto max-w-full sm:max-w-[55%] scrollbar-none py-0.5">
              {['All', 'Sacred Devbhoomi', 'Geometric', 'Fine Line', 'Blackwork', 'Japanese'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPickerStyleFilter(s)}
                  className={`shrink-0 px-2 py-0.5 text-[9px] font-bold rounded-md transition-all ${
                    pickerStyleFilter === s
                      ? 'bg-amber-400 text-black shadow-sm'
                      : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowTattooPicker(false)}
              className="p-1 text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 rounded-lg border border-white/10 transition-colors ml-auto"
              title="Close picker"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Horizontal Scrollable Slider Container with Left & Right Scroll Buttons */}
          <div className="relative group/slider flex items-center">
            
            {/* Left Scroll Arrow */}
            <button
              type="button"
              onClick={() => scrollTattooPicker('left')}
              className="absolute -left-1 z-10 p-1.5 bg-black/85 hover:bg-amber-400 hover:text-black text-amber-300 rounded-full border border-amber-500/40 shadow-xl transition-all hover:scale-110 active:scale-95"
              title="Scroll Left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Horizontal Scroll Track */}
            <div
              ref={tattooPickerScrollRef}
              onWheel={(e) => {
                e.stopPropagation();
                if (e.deltaY && tattooPickerScrollRef.current) {
                  tattooPickerScrollRef.current.scrollLeft += e.deltaY;
                }
              }}
              className="interactive-scroll-area flex items-center space-x-2.5 overflow-x-auto px-6 py-1.5 scroll-smooth overscroll-contain touch-pan-x w-full"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#f59e0b #18181b',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {filteredPickerDesigns.map((design) => {
                const isSelected = selectedDesign?._id === design._id || selectedDesign?.name === design.name;
                const rawSrc = design.previewImage || design.dataUri || design.image || '';
                const imgSrc = getFullImageUrl(rawSrc.replace(/\.jpg$/, '.png'));

                return (
                  <button
                    key={design._id || design.name}
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => handleSelectTattooArtwork(design)}
                    className={`shrink-0 flex items-center space-x-2 p-1.5 pr-3 rounded-xl transition-all border select-none cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/25 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)] ring-1 ring-amber-400'
                        : 'bg-zinc-900/70 hover:bg-zinc-800/90 border-white/10 hover:border-amber-400/50 text-left hover:scale-[1.02]'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-lg bg-black/90 p-0.5 overflow-hidden border border-white/10 shrink-0 flex items-center justify-center">
                      {design.svg ? (
                        design.svg
                      ) : (
                        <img src={imgSrc} alt={design.name} className="w-full h-full object-contain pointer-events-none" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-[11px] font-bold text-white uppercase truncate max-w-[120px]">
                        {design.name}
                      </div>
                      <div className="text-[9px] text-amber-400/90 font-semibold">
                        {design.style}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Arrow */}
            <button
              type="button"
              onClick={() => scrollTattooPicker('right')}
              className="absolute -right-1 z-10 p-1.5 bg-black/85 hover:bg-amber-400 hover:text-black text-amber-300 rounded-full border border-amber-500/40 shadow-xl transition-all hover:scale-110 active:scale-95"
              title="Scroll Right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 5. CLEAN BOTTOM STUDIO DOCK */}
      <div className="absolute bottom-2 left-2 right-2 z-30 flex flex-col gap-1.5 pointer-events-auto">
        
        {/* Navigation Tabs for Clean Organization */}
        <div className="flex items-center justify-between bg-black/60 backdrop-blur-md border border-white/10 p-1.5 rounded-xl text-xs text-zinc-300 shadow-xl">
          
          {/* Tab Switchers */}
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setActiveTab('transform')}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg transition-all ${
                activeTab === 'transform' ? 'bg-amber-400 text-black shadow-sm' : 'text-zinc-400 hover:text-white bg-zinc-900/60'
              }`}
            >
              Tattoo 360° Rotate &amp; Size
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('position')}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg transition-all ${
                activeTab === 'position' ? 'bg-amber-400 text-black shadow-sm' : 'text-zinc-400 hover:text-white bg-zinc-900/60'
              }`}
            >
              Fine Nudge &amp; Ink Visibility
            </button>
          </div>

          {/* Quick Body Angle Jumpers */}
          <div className="hidden sm:flex items-center space-x-0.5 text-[9px]">
            <span className="text-zinc-500 font-bold uppercase mr-1">Angle:</span>
            {ANATOMY_360_FRAMES.map((f) => (
              <button
                key={f.angle}
                type="button"
                onClick={() => setRotationDeg(f.angle)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  Math.abs(normalizedAngle - f.angle) < 22.5 || (f.angle === 0 && normalizedAngle >= 337.5)
                    ? 'text-amber-300 font-bold bg-amber-500/20'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {f.angle}°
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content 1: Tattoo Size & 360° In-Place Rotation */}
        {activeTab === 'transform' && (
          <div className="flex flex-wrap items-center justify-between bg-black/75 backdrop-blur-md border border-white/10 p-2 sm:px-3 rounded-xl text-xs text-zinc-300 shadow-xl gap-2">
            
            {/* Tattoo Size */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] uppercase font-bold text-amber-400">Size:</span>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setTattooScale((prev) => Math.max(parseFloat((prev - 0.1).toFixed(2)), 0.2))}
                className="w-5 h-5 flex items-center justify-center bg-zinc-900 hover:bg-amber-400 hover:text-black rounded text-zinc-300 font-bold"
                title="Decrease Tattoo Size"
              >
                -
              </button>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.05"
                value={tattooScale}
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onChange={(e) => setTattooScale(parseFloat(e.target.value))}
                className="w-20 accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
              />
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setTattooScale((prev) => Math.min(parseFloat((prev + 0.1).toFixed(2)), 3.0))}
                className="w-5 h-5 flex items-center justify-center bg-zinc-900 hover:bg-amber-400 hover:text-black rounded text-zinc-300 font-bold"
                title="Increase Tattoo Size"
              >
                +
              </button>
              <span className="text-[10px] font-mono text-amber-300 font-bold w-10">
                {Math.round(tattooScale * 100)}%
              </span>
            </div>

            {/* Tattoo 360° In-Place Rotation */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center space-x-1">
                <RotateCw className="w-3 h-3 text-amber-400 inline" />
                <span>In-Place Rotate:</span>
              </span>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setTattooRotationOffset((prev) => (prev - 15 + 360) % 360)}
                className="p-1 text-zinc-400 hover:text-amber-400 bg-zinc-900 rounded"
                title="Rotate -15°"
              >
                ↺
              </button>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={tattooRotationOffset}
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onChange={(e) => setTattooRotationOffset(parseInt(e.target.value))}
                className="w-20 accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
              />
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setTattooRotationOffset((prev) => (prev + 15) % 360)}
                className="p-1 text-zinc-400 hover:text-amber-400 bg-zinc-900 rounded"
                title="Rotate +15°"
              >
                ↻
              </button>
              <span className="text-[10px] font-mono text-amber-300 font-bold w-9 text-right">
                {tattooRotationOffset}°
              </span>
            </div>

            {/* Quick Tattoo Angle Buttons */}
            <div className="flex items-center space-x-1 text-[8px] font-bold">
              {[0, 45, 90, 180, 270].map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => setTattooRotationOffset(deg)}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    tattooRotationOffset === deg 
                      ? 'bg-amber-400 text-black' 
                      : 'text-zinc-400 bg-zinc-900 hover:text-white'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 2: Position Nudge & Ink Visibility Mode */}
        {activeTab === 'position' && (
          <div className="flex flex-wrap items-center justify-between bg-black/75 backdrop-blur-md border border-white/10 p-2 sm:px-3 rounded-xl text-xs text-zinc-300 shadow-xl gap-2">
            
            {/* Nudge D-Pad */}
            <div className="flex items-center space-x-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400 mr-1">Fine Nudge:</span>
              <button
                type="button"
                onClick={() => setOffsetNudgeX((prev) => prev - 1)}
                className="p-1 text-zinc-400 hover:text-amber-400 bg-zinc-900 rounded"
                title="Nudge Left"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setOffsetNudgeY((prev) => prev - 1)}
                className="p-1 text-zinc-400 hover:text-amber-400 bg-zinc-900 rounded"
                title="Nudge Up"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setOffsetNudgeY((prev) => prev + 1)}
                className="p-1 text-zinc-400 hover:text-amber-400 bg-zinc-900 rounded"
                title="Nudge Down"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setOffsetNudgeX((prev) => prev + 1)}
                className="p-1 text-zinc-400 hover:text-amber-400 bg-zinc-900 rounded"
                title="Nudge Right"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Ink Visibility Mode */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] uppercase font-bold text-amber-400">Ink Visibility:</span>
              <button
                type="button"
                onClick={() => setBlendMode('high-contrast')}
                className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold transition-all ${
                  blendMode === 'high-contrast' ? 'bg-amber-400 text-black shadow-sm' : 'text-zinc-400 bg-zinc-900'
                }`}
                title="Ultra sharp and clear on skin"
              >
                🔥 High Contrast
              </button>
              <button
                type="button"
                onClick={() => setBlendMode('natural-skin')}
                className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold transition-all ${
                  blendMode === 'natural-skin' ? 'bg-amber-400 text-black shadow-sm' : 'text-zinc-400 bg-zinc-900'
                }`}
                title="Natural skin multiplier"
              >
                ✨ Natural
              </button>
              <button
                type="button"
                onClick={() => setBlendMode('direct')}
                className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold transition-all ${
                  blendMode === 'direct' ? 'bg-amber-400 text-black shadow-sm' : 'text-zinc-400 bg-zinc-900'
                }`}
                title="Direct stencil view"
              >
                💎 Direct
              </button>
            </div>

            {/* Opacity slider */}
            <div className="flex items-center space-x-1">
              <Sun className="w-3 h-3 text-zinc-400" />
              <input
                type="range"
                min="0.4"
                max="1.0"
                step="0.05"
                value={tattooOpacity}
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onChange={(e) => setTattooOpacity(parseFloat(e.target.value))}
                className="w-14 accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                title="Adjust ink opacity"
              />
              <span className="text-[9px] font-mono text-zinc-400 w-6 text-right">
                {Math.round(tattooOpacity * 100)}%
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
