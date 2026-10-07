import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Sliders, Check, RefreshCcw, Eye, Layers, Compass, Move, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Crosshair, X, Flame, ArrowRight } from 'lucide-react';
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
  // Interaction Mode: 'tattoo' (Move/Rotate Tattoo) vs 'body' (Orbit 3D Mannequin)
  const [interactionMode, setInteractionMode] = useState('tattoo');

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

  // In-Studio Reference Sidebar Slide-Out State (Opens on body part click)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarStyleFilter, setSidebarStyleFilter] = useState('All');

  // Interactive Zoom State (0.8x to 2.8x)
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [zoomFocusMode, setZoomFocusMode] = useState('tattoo');
  const [hoveredPart, setHoveredPart] = useState(null);
  const [highlightPulse, setHighlightPulse] = useState(true);

  // Fine Tuning for Tattoo Placement, Size & 360° Rotation
  const [tattooScale, setTattooScale] = useState(1.10);
  const [tattooOpacity, setTattooOpacity] = useState(0.95);
  const [tattooRotationOffset, setTattooRotationOffset] = useState(0); // Full 0° to 360°
  const [offsetNudgeX, setOffsetNudgeX] = useState(0);
  const [offsetNudgeY, setOffsetNudgeY] = useState(0);
  const [blendMode, setBlendMode] = useState('multiply'); // 'multiply' gives true skin ink absorption

  // Active Control Panel Tab: 'transform' (size/rotate) | 'position' (drag/nudge) | 'designs' (tattoos)
  const [activeTab, setActiveTab] = useState('transform');

  const studioContainerRef = useRef(null);

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
      e.preventDefault();
      const zoomDelta = e.deltaY * -0.0015;
      setZoomLevel((prev) => Math.min(Math.max(parseFloat((prev + zoomDelta).toFixed(2)), 0.8), 2.8));
    };
    el.addEventListener('wheel', handleWheelNonPassive, { passive: false });
    return () => el.removeEventListener('wheel', handleWheelNonPassive);
  }, []);

  // Automatically rotate toward chosen body area and open reference sidebar
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
      setIsSidebarOpen(true); // Open reference sidebar on body part select
      const timer = setTimeout(() => setHighlightPulse(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [selectedBodyArea]);

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

    // 1. Interactive Rotation Handle Drag
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
    setTattooScale(placementConfig?.defaultScale || 1.10);
    setTattooOpacity(0.95);
    setTattooRotationOffset(0);
    setOffsetNudgeX(0);
    setOffsetNudgeY(0);
    setBlendMode('multiply');
    setInteractionMode('tattoo');
    toast.info(`Centered on ${placementConfig?.label || selectedBodyArea}`);
  };

  // Filter tattoo reference options for sidebar
  const matchingDesigns = designs.filter(d => {
    const matchesStyle = sidebarStyleFilter === 'All' || d.style.toLowerCase() === sidebarStyleFilter.toLowerCase();
    return matchesStyle;
  });

  const recommendedTattoos = matchingDesigns.filter(d => 
    (d.bodyAreas || []).some(a => 
      a.toLowerCase() === selectedBodyArea.toLowerCase() || 
      selectedBodyArea.toLowerCase().includes(a.toLowerCase()) || 
      a.toLowerCase().includes(selectedBodyArea.toLowerCase())
    )
  );

  const otherTattoos = matchingDesigns.filter(d => !recommendedTattoos.includes(d));

  // Focus Origin: if 'tattoo' mode, pivot zoom right on the tattoo coordinates!
  const zoomOriginX = zoomFocusMode === 'tattoo' && frameCoords ? `${frameCoords.left + offsetNudgeX}%` : '50%';
  const zoomOriginY = zoomFocusMode === 'tattoo' && frameCoords ? `${frameCoords.top + offsetNudgeY}%` : '50%';

  const imageSrc = selectedDesign ? getFullImageUrl(selectedDesign.dataUri || selectedDesign.previewImage || selectedDesign.image) : '';
  const totalTattooRotation = ((frameCoords?.rotate || 0) + tattooRotationOffset) % 360;

  return (
    <div
      ref={studioContainerRef}
      className={`relative w-full ${compact ? 'h-[540px] sm:h-[600px]' : 'h-[600px] sm:h-[680px] md:h-[740px]'} flex flex-col justify-between select-none overflow-hidden rounded-2xl bg-[#090b0e] border border-white/10 shadow-2xl transition-all`}
      onPointerDown={handleStagePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      
      {/* 1. TOP HEADER BAR: MODE TOGGLE, ANGLE, & STATUS */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        
        {/* Interaction Mode Switcher */}
        <div className="flex items-center bg-black/90 backdrop-blur-md border border-white/15 p-1 rounded-full shadow-xl">
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
            title="Drag anywhere to rotate 3D human body"
          >
            <span>🧍 Orbit 3D Body</span>
          </button>
        </div>

        {/* 360 Angle Presets & Auto Orbit */}
        <div className="flex items-center space-x-1.5 bg-black/85 backdrop-blur-md border border-white/10 p-1 rounded-full shadow-lg">
          <button
            type="button"
            onClick={() => setRotationDeg((prev) => (prev + 45) % 360)}
            className="flex items-center space-x-1 px-2.5 py-1 text-[10px] font-bold text-amber-300 hover:text-white bg-amber-950/50 border border-amber-500/30 rounded-full transition-colors"
            title="Turn Mannequin 45°"
          >
            <Compass className="w-3 h-3 text-amber-400" />
            <span>{Math.round(normalizedAngle)}° Body</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full transition-all ${
              isAutoRotating
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-zinc-400 hover:text-white bg-zinc-900 border border-white/10'
            }`}
            title="Auto 360 Turntable Orbit"
          >
            {isAutoRotating ? '⏸ Stop' : '▶ 360° Spin'}
          </button>

          {/* Tattoo Reference Sidebar Toggle Button */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-all flex items-center space-x-1 ${
              isSidebarOpen
                ? 'bg-amber-400 text-black font-black shadow-md'
                : 'bg-zinc-900 text-amber-300 border border-amber-500/30 hover:bg-zinc-800'
            }`}
            title="Toggle Tattoo References Sidebar"
          >
            <Flame className="w-3 h-3" />
            <span>{isSidebarOpen ? 'Close Tattoos' : `🎨 ${selectedBodyArea} References (${recommendedTattoos.length || matchingDesigns.length})`}</span>
          </button>
        </div>

        {/* Status Badge & Reset */}
        <div className="flex items-center space-x-1.5">
          <div className="bg-black/85 backdrop-blur-md border border-amber-400/40 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold text-amber-300 flex items-center space-x-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="truncate max-w-[120px] sm:max-w-none">
              {placementConfig?.label || selectedBodyArea}
            </span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 bg-black/85 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 rounded-full shadow-md transition-colors"
            title="Reset view and tattoo position"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. COMPACT FLOATING ZOOM HUD (TOP LEFT/RIGHT) */}
      <div className="absolute left-2.5 top-16 z-30 flex flex-col items-center bg-black/80 backdrop-blur-md border border-white/10 p-1 rounded-xl shadow-lg pointer-events-auto space-y-1">
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

            {/* REALISTIC INKED-ON-SKIN TATTOO WITH 360° ROTATING BOUNDING BOX */}
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
                  transform: `translate3d(-50%, -50%, 0) scaleX(${(frameCoords.scaleX || 1) * tattooScale}) scaleY(${tattooScale}) rotate(${totalTattooRotation}deg) skewY(${frameCoords.skewY || 0}deg)`,
                  opacity: tattooOpacity * (frameCoords.opacity || 1),
                  mixBlendMode: blendMode === 'multiply' ? 'multiply' : 'normal',
                  filter: blendMode === 'multiply' 
                    ? 'contrast(1.2) brightness(0.92) drop-shadow(0 0 1px rgba(0,0,0,0.7))'
                    : 'drop-shadow(0 0 4px rgba(0,0,0,0.5))',
                }}
                title="Drag anywhere to move tattoo • Drag top handle to rotate"
              >
                {/* Visual Rotating Bounding Box Indicator & Direct Rotation Handle */}
                <div className="absolute inset-[-4px] border border-dashed border-amber-400/60 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Top Rotate Handle */}
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
                    className="absolute -top-6 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg pointer-events-auto hover:scale-110 transition-transform"
                    title="Drag to Rotate Tattoo 360°"
                  >
                    <RotateCw className="w-3 h-3" />
                  </div>
                </div>

                {/* Tattoo Artwork Rendering */}
                {selectedDesign.svg ? (
                  <div className="w-full h-full flex items-center justify-center text-zinc-950 font-bold pointer-events-none">
                    {selectedDesign.svg}
                  </div>
                ) : imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={selectedDesign.name}
                    className="w-full h-full object-contain pointer-events-none filter contrast-115"
                  />
                ) : (
                  <div className="text-[10px] text-amber-300 font-bold text-center bg-black/70 px-2 py-1 rounded pointer-events-none">
                    {selectedDesign.name}
                  </div>
                )}
              </div>
            )}

            {/* Clickable Muscle Hotspots (Opens Tattoo Reference Sidebar on click) */}
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
                    setIsSidebarOpen(true); // Open Tattoo Reference Sidebar
                    toast.success(`Selected ${config.name}! Showing tattoo references.`);
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

      {/* 4. IN-STUDIO SLIDE-OVER TATTOO REFERENCE SIDEBAR */}
      {isSidebarOpen && (
        <div className="absolute top-0 right-0 bottom-0 w-72 sm:w-80 md:w-88 max-w-[85%] bg-[#0b0e14]/95 backdrop-blur-xl border-l border-white/10 z-40 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 pointer-events-auto">
          
          {/* Sidebar Header */}
          <div className="p-3 sm:p-3.5 border-b border-white/10 flex items-center justify-between bg-black/60">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <span>{selectedBodyArea} Tattoo References</span>
                </h3>
                <p className="text-[10px] text-zinc-400">
                  {recommendedTattoos.length} tailored for {selectedBodyArea}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 rounded-lg border border-white/10 hover:bg-zinc-800 transition-colors"
              title="Close Sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Style Filter Chips in Sidebar */}
          <div className="p-2 border-b border-white/5 bg-zinc-950/60">
            <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-thin">
              {['All', 'Sacred Devbhoomi', 'Geometric', 'Fine Line', 'Blackwork', 'Japanese'].map(s => (
                <button
                  key={s}
                  onClick={() => setSidebarStyleFilter(s)}
                  className={`shrink-0 px-2 py-0.5 text-[9px] font-bold rounded-md transition-all ${
                    sidebarStyleFilter === s
                      ? 'bg-amber-400 text-black shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Tattoo References List */}
          <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-2.5 scrollbar-thin">
            
            {/* Recommended Artworks */}
            {recommendedTattoos.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[9px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>Top References for {selectedBodyArea}</span>
                </div>
                {recommendedTattoos.map(design => {
                  const isSelected = selectedDesign?._id === design._id || selectedDesign?.name === design.name;
                  const imgSrc = getFullImageUrl(design.previewImage || design.dataUri || design.image);

                  return (
                    <div
                      key={design._id || design.name}
                      onClick={() => {
                        if (onSelectDesign) onSelectDesign(design);
                        toast.success(`Applied "${design.name}" to ${selectedBodyArea}!`);
                      }}
                      className={`flex items-center space-x-2.5 p-2 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 shadow-md ring-1 ring-amber-400'
                          : 'bg-zinc-900/80 border-white/5 hover:border-amber-500/30 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-black p-1 overflow-hidden border border-white/10 shrink-0 flex items-center justify-center">
                        {design.svg ? (
                          design.svg
                        ) : (
                          <img src={imgSrc} alt={design.name} className="w-full h-full object-contain" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-[11px] text-white uppercase truncate">
                            {design.name}
                          </h4>
                          {isSelected && (
                            <span className="text-[8px] bg-amber-400 text-black font-black px-1.5 py-0.2 rounded">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[9px] text-amber-400/90 font-semibold">
                          {design.style}
                        </div>
                        <div className="text-[8px] text-zinc-400 truncate">
                          {design.estTime || '2-3 hrs'} • {design.difficulty || 'Custom'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Other Artworks */}
            {otherTattoos.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-zinc-400" />
                  <span>Other Studio Flash Artworks</span>
                </div>
                {otherTattoos.map(design => {
                  const isSelected = selectedDesign?._id === design._id || selectedDesign?.name === design.name;
                  const imgSrc = getFullImageUrl(design.previewImage || design.dataUri || design.image);

                  return (
                    <div
                      key={design._id || design.name}
                      onClick={() => {
                        if (onSelectDesign) onSelectDesign(design);
                        toast.success(`Applied "${design.name}" to ${selectedBodyArea}!`);
                      }}
                      className={`flex items-center space-x-2.5 p-2 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 shadow-md ring-1 ring-amber-400'
                          : 'bg-zinc-900/80 border-white/5 hover:border-amber-500/30 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-black p-1 overflow-hidden border border-white/10 shrink-0 flex items-center justify-center">
                        {design.svg ? (
                          design.svg
                        ) : (
                          <img src={imgSrc} alt={design.name} className="w-full h-full object-contain" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-[11px] text-white uppercase truncate">
                            {design.name}
                          </h4>
                          {isSelected && (
                            <span className="text-[8px] bg-amber-400 text-black font-black px-1.5 py-0.2 rounded">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[9px] text-amber-400/90 font-semibold">
                          {design.style}
                        </div>
                        <div className="text-[8px] text-zinc-400 truncate">
                          {design.estTime || '2-3 hrs'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* Sidebar Footer Action */}
          <div className="p-2.5 border-t border-white/10 bg-black/70">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="w-full bg-amber-400 hover:bg-amber-300 text-black font-black py-2 px-3 text-[11px] uppercase tracking-wider rounded-xl shadow-md transition-all"
            >
              Done Testing (Close Sidebar)
            </button>
          </div>

        </div>
      )}

      {/* 5. CLEAN BOTTOM STUDIO DOCK */}
      <div className="absolute bottom-2 left-2 right-2 z-30 flex flex-col gap-1.5 pointer-events-auto">
        
        {/* Navigation Tabs for Clean Organization */}
        <div className="flex items-center justify-between bg-black/90 backdrop-blur-md border border-white/10 p-1.5 rounded-xl text-xs text-zinc-300 shadow-xl">
          
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
              Fine Nudge &amp; Skin Ink
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

        {/* Tab Content 1: Tattoo Size & 360° Rotation */}
        {activeTab === 'transform' && (
          <div className="flex flex-wrap items-center justify-between bg-black/95 backdrop-blur-md border border-white/10 p-2 sm:px-3 rounded-xl text-xs text-zinc-300 shadow-xl gap-2">
            
            {/* Tattoo Size */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] uppercase font-bold text-amber-400">Size:</span>
              <button
                type="button"
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
                onChange={(e) => setTattooScale(parseFloat(e.target.value))}
                className="w-20 accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
              />
              <button
                type="button"
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

            {/* Tattoo 360° Rotation */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center space-x-1">
                <RotateCw className="w-3 h-3 text-amber-400 inline" />
                <span>Tattoo Rotate:</span>
              </span>
              <button
                type="button"
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
                onChange={(e) => setTattooRotationOffset(parseInt(e.target.value))}
                className="w-20 accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
              />
              <button
                type="button"
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

        {/* Tab Content 2: Position Nudge & Skin Ink Blend */}
        {activeTab === 'position' && (
          <div className="flex flex-wrap items-center justify-between bg-black/95 backdrop-blur-md border border-white/10 p-2 sm:px-3 rounded-xl text-xs text-zinc-300 shadow-xl gap-2">
            
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

            {/* Ink Blend Mode */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] uppercase font-bold text-zinc-400">Ink Absorption:</span>
              <button
                type="button"
                onClick={() => setBlendMode('multiply')}
                className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold ${blendMode === 'multiply' ? 'bg-amber-400 text-black' : 'text-zinc-400 bg-zinc-900'}`}
              >
                Real Skin
              </button>
              <button
                type="button"
                onClick={() => setBlendMode('normal')}
                className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold ${blendMode === 'normal' ? 'bg-amber-400 text-black' : 'text-zinc-400 bg-zinc-900'}`}
              >
                Direct
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
