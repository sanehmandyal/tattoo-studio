import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Sliders, Check, RefreshCcw, Eye, Layers, Maximize2, Compass } from 'lucide-react';
import { toast } from 'sonner';
import { getFullImageUrl } from '../../utils/imageHelper';

// Anatomical Hotspot Zones with exact 3D Mesh Target mappings
export const BODY_3D_ZONES = [
  { id: 'Chest', name: 'Chest', label: 'Pectoral Chest & Sternum', partKey: 'chest', defaultRotation: 0, camPos: [0, 1.2, 3.2] },
  { id: 'Ribs', name: 'Ribs', label: 'Ribs & Abdomen', partKey: 'abdomen', defaultRotation: 0, camPos: [0, 0.8, 3.0] },
  { id: 'Neck', name: 'Neck', label: 'Neck & Throat', partKey: 'neck', defaultRotation: 0, camPos: [0, 2.0, 2.4] },
  { id: 'Forearm', name: 'Forearm', label: 'Right Forearm', partKey: 'rightForearm', defaultRotation: 25, camPos: [1.2, 0.5, 2.4] },
  { id: 'Upper Arm', name: 'Upper Arm', label: 'Right Bicep / Deltoid', partKey: 'rightBicep', defaultRotation: 35, camPos: [1.3, 1.2, 2.5] },
  { id: 'Shoulder', name: 'Shoulder', label: 'Right Shoulder Deltoid', partKey: 'rightShoulder', defaultRotation: 45, camPos: [1.2, 1.6, 2.5] },
  { id: 'Wrist', name: 'Wrist', label: 'Right Wrist & Hand', partKey: 'rightWrist', defaultRotation: 20, camPos: [1.4, 0.0, 2.2] },
  { id: 'Thigh', name: 'Thigh', label: 'Front Quadricep', partKey: 'rightThigh', defaultRotation: 0, camPos: [0.6, -0.6, 2.8] },
  { id: 'Calf', name: 'Calf', label: 'Front Calf & Shin', partKey: 'rightCalf', defaultRotation: 0, camPos: [0.6, -1.5, 2.6] },
  { id: 'Ankle', name: 'Ankle', label: 'Ankle & Foot', partKey: 'rightAnkle', defaultRotation: 0, camPos: [0.6, -2.1, 2.2] },
  
  // Posterior (Back) Zones
  { id: 'Back', name: 'Back', label: 'Upper Back & Lats', partKey: 'upperBack', defaultRotation: 180, camPos: [0, 1.4, -3.2] },
  { id: 'Spine', name: 'Spine', label: 'Spine Column', partKey: 'spine', defaultRotation: 180, camPos: [0, 1.0, -3.0] },
  { id: 'Back Shoulder', name: 'Shoulder (Back)', label: 'Posterior Scapula', partKey: 'leftBackShoulder', defaultRotation: 160, camPos: [-1.2, 1.5, -2.6] },
  { id: 'Tricep', name: 'Upper Arm (Back)', label: 'Left Tricep', partKey: 'leftTricep', defaultRotation: 200, camPos: [-1.3, 1.2, -2.5] },
  { id: 'Back Forearm', name: 'Forearm (Back)', label: 'Left Posterior Forearm', partKey: 'leftForearm', defaultRotation: 205, camPos: [-1.4, 0.5, -2.4] },
  { id: 'Hamstrings', name: 'Thigh (Back)', label: 'Posterior Hamstring', partKey: 'leftHamstring', defaultRotation: 180, camPos: [-0.6, -0.6, -2.8] },
  { id: 'Back Calf', name: 'Calf (Back)', label: 'Posterior Calf / Soleus', partKey: 'leftBackCalf', defaultRotation: 180, camPos: [-0.6, -1.5, -2.6] }
];

export const Interactive3DStudio = ({
  selectedBodyArea = 'Forearm',
  onSelectBodyArea,
  selectedDesign,
  onSelectDesign,
  designs = [],
  compact = false,
}) => {
  const mountRef = useRef(null);
  const canvasContainerRef = useRef(null);

  // Studio State
  const [rotationDeg, setRotationDeg] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredZoneName, setHoveredZoneName] = useState(null);
  const [isHoveringCanvas, setIsHoveringCanvas] = useState(false);

  // Tattoo Tuning
  const [tattooScale, setTattooScale] = useState(1.0);
  const [tattooOpacity, setTattooOpacity] = useState(0.95);
  const [blendMode, setBlendMode] = useState('multiply');
  const [showControlsModal, setShowControlsModal] = useState(false);
  const [modelMaterialType, setModelMaterialType] = useState('bronze'); // 'bronze' | 'obsidian' | 'marble' | 'cyber'

  // Three.js Scene References
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const mannequinGroupRef = useRef(null);
  const tattooMeshRef = useRef(null);
  const tattooTextureRef = useRef(null);
  const bodyPartsMapRef = useRef(new Map());
  const raycasterRef = useRef(new THREE.Raycaster());
  const mousePosRef = useRef(new THREE.Vector2());

  // Interaction State
  const isDraggingRef = useRef(false);
  const previousPointerPosRef = useRef({ x: 0, y: 0 });
  const targetRotationYRef = useRef(0);
  const currentRotationYRef = useRef(0);
  const targetCameraYRef = useRef(0.2);
  const currentCameraYRef = useRef(0.2);
  const targetCameraDistRef = useRef(4.6);
  const currentCameraDistRef = useRef(4.6);

  // 1. Initialize Three.js 3D WebGL Studio
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.2, 4.6);
    cameraRef.current = camera;

    // WebGL Renderer with High Quality Antialiasing & PBR ToneMapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // Mannequin Master Pivot Group
    const mannequinGroup = new THREE.Group();
    mannequinGroup.position.set(0, -0.4, 0);
    scene.add(mannequinGroup);
    mannequinGroupRef.current = mannequinGroup;

    // --- Materials Studio Finish ---
    const createMannequinMaterial = (type) => {
      switch (type) {
        case 'obsidian':
          return new THREE.MeshStandardMaterial({
            color: 0x18181b,
            roughness: 0.22,
            metalness: 0.85,
            flatShading: false,
          });
        case 'marble':
          return new THREE.MeshStandardMaterial({
            color: 0xd4d4d8,
            roughness: 0.35,
            metalness: 0.15,
            flatShading: false,
          });
        case 'cyber':
          return new THREE.MeshStandardMaterial({
            color: 0x090d16,
            roughness: 0.15,
            metalness: 0.95,
            emissive: 0x06b6d4,
            emissiveIntensity: 0.08,
            flatShading: false,
          });
        case 'bronze':
        default:
          return new THREE.MeshStandardMaterial({
            color: 0x3a2c20,
            roughness: 0.38,
            metalness: 0.72,
            flatShading: false,
          });
      }
    };

    const baseMaterial = createMannequinMaterial(modelMaterialType);

    // --- Build Detailed Sculpted Anatomical Human Mannequin ---
    const partMap = new Map();

    const registerPart = (mesh, zoneId) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { zoneId };
      mannequinGroup.add(mesh);
      if (zoneId) {
        partMap.set(zoneId, mesh);
      }
      return mesh;
    };

    // 1. Head & Cranium (Sculpted Head with Chin & Jaw)
    const headGeo = new THREE.SphereGeometry(0.24, 32, 28);
    headGeo.scale(1, 1.28, 1.08);
    const headMesh = registerPart(new THREE.Mesh(headGeo, baseMaterial), 'Neck');
    headMesh.position.set(0, 2.1, 0);

    // Brow & Jaw accents
    const jawGeo = new THREE.CylinderGeometry(0.12, 0.08, 0.2, 16);
    jawGeo.scale(1.1, 1, 0.9);
    const jawMesh = registerPart(new THREE.Mesh(jawGeo, baseMaterial), 'Neck');
    jawMesh.position.set(0, 1.88, 0.06);

    // 2. Neck & Sternocleidomastoid
    const neckGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.32, 32);
    const neckMesh = registerPart(new THREE.Mesh(neckGeo, baseMaterial), 'Neck');
    neckMesh.position.set(0, 1.74, 0);

    // 3. Torso - Chest (Pectorals)
    const chestGroup = new THREE.Group();
    chestGroup.position.set(0, 1.42, 0);

    // Left Pectoral
    const leftPecGeo = new THREE.BoxGeometry(0.32, 0.24, 0.18, 12, 12, 12);
    leftPecGeo.scale(1, 1, 1.2);
    const leftPec = registerPart(new THREE.Mesh(leftPecGeo, baseMaterial), 'Chest');
    leftPec.position.set(-0.18, 0, 0.09);
    leftPec.rotation.set(0, 0.12, 0.05);
    chestGroup.add(leftPec);

    // Right Pectoral
    const rightPecGeo = new THREE.BoxGeometry(0.32, 0.24, 0.18, 12, 12, 12);
    rightPecGeo.scale(1, 1, 1.2);
    const rightPec = registerPart(new THREE.Mesh(rightPecGeo, baseMaterial), 'Chest');
    rightPec.position.set(0.18, 0, 0.09);
    rightPec.rotation.set(0, -0.12, -0.05);
    chestGroup.add(rightPec);

    mannequinGroup.add(chestGroup);
    partMap.set('Chest', rightPec);

    // 4. Upper Back & Lats (Trapezius & Latissimus Dorsi)
    const upperBackGeo = new THREE.BoxGeometry(0.68, 0.42, 0.22, 12, 12, 12);
    upperBackGeo.scale(1.05, 1, 0.9);
    const upperBackMesh = registerPart(new THREE.Mesh(upperBackGeo, baseMaterial), 'Back');
    upperBackMesh.position.set(0, 1.38, -0.06);
    partMap.set('Back', upperBackMesh);

    // 5. Spine Vertebral Column (Posterior Ridge)
    const spineGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.62, 16);
    const spineMesh = registerPart(new THREE.Mesh(spineGeo, baseMaterial), 'Spine');
    spineMesh.position.set(0, 1.15, -0.16);
    partMap.set('Spine', spineMesh);

    // 6. Abdomen & Ribs (6-Pack Rectus Abdominis)
    const abdomenGeo = new THREE.CylinderGeometry(0.31, 0.26, 0.48, 32);
    abdomenGeo.scale(1.18, 1, 0.82);
    const abdomenMesh = registerPart(new THREE.Mesh(abdomenGeo, baseMaterial), 'Ribs');
    abdomenMesh.position.set(0, 1.05, 0.01);
    partMap.set('Ribs', abdomenMesh);

    // 7. Shoulders (Deltoids)
    // Left Shoulder
    const leftShoulderGeo = new THREE.SphereGeometry(0.16, 24, 24);
    leftShoulderGeo.scale(1.1, 1.3, 1.1);
    const leftShoulder = registerPart(new THREE.Mesh(leftShoulderGeo, baseMaterial), 'Back Shoulder');
    leftShoulder.position.set(-0.52, 1.48, 0);
    partMap.set('Back Shoulder', leftShoulder);

    // Right Shoulder
    const rightShoulderGeo = new THREE.SphereGeometry(0.16, 24, 24);
    rightShoulderGeo.scale(1.1, 1.3, 1.1);
    const rightShoulder = registerPart(new THREE.Mesh(rightShoulderGeo, baseMaterial), 'Shoulder');
    rightShoulder.position.set(0.52, 1.48, 0);
    partMap.set('Shoulder', rightShoulder);

    // 8. Upper Arms (Biceps & Triceps)
    // Left Upper Arm
    const leftArmGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.52, 24);
    const leftArm = registerPart(new THREE.Mesh(leftArmGeo, baseMaterial), 'Tricep');
    leftArm.position.set(-0.58, 1.08, 0);
    leftArm.rotation.set(0, 0, -0.14);
    partMap.set('Tricep', leftArm);

    // Right Upper Arm
    const rightArmGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.52, 24);
    const rightArm = registerPart(new THREE.Mesh(rightArmGeo, baseMaterial), 'Upper Arm');
    rightArm.position.set(0.58, 1.08, 0);
    rightArm.rotation.set(0, 0, 0.14);
    partMap.set('Upper Arm', rightArm);

    // 9. Forearms & Wrists
    // Left Forearm
    const leftForearmGeo = new THREE.CylinderGeometry(0.095, 0.07, 0.54, 24);
    const leftForearm = registerPart(new THREE.Mesh(leftForearmGeo, baseMaterial), 'Back Forearm');
    leftForearm.position.set(-0.68, 0.56, 0.08);
    leftForearm.rotation.set(0.15, 0, -0.22);
    partMap.set('Back Forearm', leftForearm);

    // Right Forearm
    const rightForearmGeo = new THREE.CylinderGeometry(0.095, 0.07, 0.54, 24);
    const rightForearm = registerPart(new THREE.Mesh(rightForearmGeo, baseMaterial), 'Forearm');
    rightForearm.position.set(0.68, 0.56, 0.08);
    rightForearm.rotation.set(0.15, 0, 0.22);
    partMap.set('Forearm', rightForearm);

    // Hands & Wrists
    const rightHandGeo = new THREE.BoxGeometry(0.09, 0.16, 0.05);
    const rightHand = registerPart(new THREE.Mesh(rightHandGeo, baseMaterial), 'Wrist');
    rightHand.position.set(0.78, 0.22, 0.12);
    rightHand.rotation.set(0.2, 0, 0.25);
    partMap.set('Wrist', rightHand);

    // 10. Pelvis & Glutes
    const pelvisGeo = new THREE.CylinderGeometry(0.27, 0.29, 0.36, 32);
    pelvisGeo.scale(1.15, 1, 0.9);
    const pelvis = registerPart(new THREE.Mesh(pelvisGeo, baseMaterial), 'Ribs');
    pelvis.position.set(0, 0.64, 0);

    // 11. Thighs & Quadriceps
    // Left Thigh
    const leftThighGeo = new THREE.CylinderGeometry(0.18, 0.13, 0.78, 28);
    const leftThigh = registerPart(new THREE.Mesh(leftThighGeo, baseMaterial), 'Hamstrings');
    leftThigh.position.set(-0.21, 0.14, 0);
    leftThigh.rotation.set(0, 0, 0.05);
    partMap.set('Hamstrings', leftThigh);

    // Right Thigh
    const rightThighGeo = new THREE.CylinderGeometry(0.18, 0.13, 0.78, 28);
    const rightThigh = registerPart(new THREE.Mesh(rightThighGeo, baseMaterial), 'Thigh');
    rightThigh.position.set(0.21, 0.14, 0);
    rightThigh.rotation.set(0, 0, -0.05);
    partMap.set('Thigh', rightThigh);

    // 12. Calves & Shins
    // Left Calf
    const leftCalfGeo = new THREE.CylinderGeometry(0.13, 0.08, 0.74, 28);
    const leftCalf = registerPart(new THREE.Mesh(leftCalfGeo, baseMaterial), 'Back Calf');
    leftCalf.position.set(-0.23, -0.62, 0);
    partMap.set('Back Calf', leftCalf);

    // Right Calf
    const rightCalfGeo = new THREE.CylinderGeometry(0.13, 0.08, 0.74, 28);
    const rightCalf = registerPart(new THREE.Mesh(rightCalfGeo, baseMaterial), 'Calf');
    rightCalf.position.set(0.23, -0.62, 0);
    partMap.set('Calf', rightCalf);

    // Feet & Ankles
    const rightFootGeo = new THREE.BoxGeometry(0.11, 0.08, 0.26);
    const rightFoot = registerPart(new THREE.Mesh(rightFootGeo, baseMaterial), 'Ankle');
    rightFoot.position.set(0.24, -1.04, 0.06);
    partMap.set('Ankle', rightFoot);

    const leftFootGeo = new THREE.BoxGeometry(0.11, 0.08, 0.26);
    const leftFoot = registerPart(new THREE.Mesh(leftFootGeo, baseMaterial), null);
    leftFoot.position.set(-0.24, -1.04, 0.06);

    bodyPartsMapRef.current = partMap;

    // --- Illuminated Turntable Studio Pedestal ---
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, -1.08, 0);

    // Dark Stone Base
    const baseDiskGeo = new THREE.CylinderGeometry(1.3, 1.45, 0.14, 64);
    const baseDiskMat = new THREE.MeshStandardMaterial({
      color: 0x121214,
      roughness: 0.4,
      metalness: 0.8,
    });
    const baseDisk = new THREE.Mesh(baseDiskGeo, baseDiskMat);
    baseDisk.receiveShadow = true;
    pedestalGroup.add(baseDisk);

    // Glowing Concentric Arc Rings
    const ringGeo = new THREE.RingGeometry(1.05, 1.2, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.075;
    pedestalGroup.add(ringMesh);

    // Inner Cyan Accent Ring
    const innerRingGeo = new THREE.RingGeometry(0.7, 0.75, 48);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = 0.076;
    pedestalGroup.add(innerRing);

    mannequinGroup.add(pedestalGroup);

    // --- Studio Atelier Lighting (Triple-Point Cinematic Lighting) ---
    const ambientLight = new THREE.HemisphereLight(0xfff5ea, 0x0d1117, 1.2);
    scene.add(ambientLight);

    // 1. Key Light (Warm Bronze Highlight)
    const keyLight = new THREE.DirectionalLight(0xffecd2, 3.2);
    keyLight.position.set(3.5, 4.5, 4.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    scene.add(keyLight);

    // 2. Rim Light (Electric Cyan Edge glow defining muscles)
    const rimLight = new THREE.DirectionalLight(0x00f2fe, 4.5);
    rimLight.position.set(-3.5, 3.0, -4.0);
    scene.add(rimLight);

    // 3. Fill Light (Amber Glow)
    const fillLight = new THREE.DirectionalLight(0xf59e0b, 1.8);
    fillLight.position.set(-3.0, 1.5, 3.0);
    scene.add(fillLight);

    // 4. Subtle Top Down Studio Spot
    const topSpot = new THREE.SpotLight(0xffffff, 2.0, 12, Math.PI / 4, 0.4);
    topSpot.position.set(0, 5.5, 0);
    scene.add(topSpot);

    // --- Dedicated 3D Tattoo Surface Projection Mesh ---
    const tattooGeo = new THREE.PlaneGeometry(0.42, 0.42, 1, 1);
    const tattooMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: tattooOpacity,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
      side: THREE.DoubleSide,
    });
    const tattooMesh = new THREE.Mesh(tattooGeo, tattooMat);
    tattooMesh.visible = false;
    mannequinGroup.add(tattooMesh);
    tattooMeshRef.current = tattooMesh;

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth Model Rotation Interpolation
      currentRotationYRef.current = THREE.MathUtils.lerp(
        currentRotationYRef.current,
        targetRotationYRef.current,
        delta * 9
      );
      mannequinGroup.rotation.y = currentRotationYRef.current;

      // Smooth Camera Height & Zoom Interpolation
      currentCameraYRef.current = THREE.MathUtils.lerp(
        currentCameraYRef.current,
        targetCameraYRef.current,
        delta * 6
      );
      currentCameraDistRef.current = THREE.MathUtils.lerp(
        currentCameraDistRef.current,
        targetCameraDistRef.current,
        delta * 6
      );

      camera.position.y = currentCameraYRef.current;
      camera.position.z = currentCameraDistRef.current;
      camera.lookAt(0, currentCameraYRef.current * 0.7, 0);

      // Rotating Pedestal Rings
      ringMesh.rotation.z += delta * 0.15;
      innerRing.rotation.z -= delta * 0.25;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
      scene.clear();
    };
  }, [modelMaterialType]);

  // 2. Load and Apply 3D Tattoo Texture onto the Mannequin Body Mesh
  useEffect(() => {
    if (!selectedDesign || !tattooMeshRef.current) return;

    const imgUrl = getFullImageUrl(selectedDesign.dataUri || selectedDesign.previewImage || selectedDesign.image);
    if (!imgUrl) return;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    textureLoader.load(
      imgUrl,
      (texture) => {
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        textureRef.current = texture;

        const mat = tattooMeshRef.current.material;
        mat.map = texture;
        mat.needsUpdate = true;
        tattooMeshRef.current.visible = true;
      },
      undefined,
      (err) => {
        console.warn('Tattoo texture load issue:', err);
      }
    );
  }, [selectedDesign]);

  const textureRef = useRef(null);

  // 3. Position the 3D Tattoo Decal exactly onto the Selected Anatomical Zone
  const updateTattooPlacementIn3D = useCallback(() => {
    const tattooMesh = tattooMeshRef.current;
    if (!tattooMesh) return;

    const area = (selectedBodyArea || 'Forearm').toLowerCase();

    // Exact 3D Coordinate Mapping on the Muscular Sculpted Mannequin
    let pos = [0, 1.42, 0.18];
    let rot = [0, 0, 0];
    let scale = [0.38, 0.38, 1];

    if (area.includes('chest') || area.includes('pec')) {
      pos = [0.16, 1.42, 0.18];
      rot = [0, -0.15, -0.05];
      scale = [0.42 * tattooScale, 0.42 * tattooScale, 1];
    } else if (area.includes('rib')) {
      pos = [0.18, 1.05, 0.17];
      rot = [0, -0.25, 0];
      scale = [0.34 * tattooScale, 0.34 * tattooScale, 1];
    } else if (area.includes('neck')) {
      pos = [0, 1.76, 0.14];
      rot = [0, 0, 0];
      scale = [0.22 * tattooScale, 0.22 * tattooScale, 1];
    } else if (area.includes('forearm')) {
      pos = [0.68, 0.56, 0.16];
      rot = [0.15, -0.3, 0.22];
      scale = [0.26 * tattooScale, 0.44 * tattooScale, 1];
    } else if (area.includes('upper arm') || area.includes('bicep')) {
      pos = [0.58, 1.08, 0.12];
      rot = [0, -0.4, 0.14];
      scale = [0.3 * tattooScale, 0.36 * tattooScale, 1];
    } else if (area.includes('shoulder')) {
      pos = [0.52, 1.48, 0.12];
      rot = [-0.1, -0.5, 0.1];
      scale = [0.32 * tattooScale, 0.32 * tattooScale, 1];
    } else if (area.includes('wrist')) {
      pos = [0.78, 0.24, 0.15];
      rot = [0.2, -0.35, 0.25];
      scale = [0.18 * tattooScale, 0.18 * tattooScale, 1];
    } else if (area.includes('thigh')) {
      pos = [0.21, 0.16, 0.18];
      rot = [0, 0, -0.05];
      scale = [0.36 * tattooScale, 0.48 * tattooScale, 1];
    } else if (area.includes('calf')) {
      pos = [0.23, -0.62, 0.14];
      rot = [0, 0, 0];
      scale = [0.28 * tattooScale, 0.42 * tattooScale, 1];
    } else if (area.includes('ankle')) {
      pos = [0.24, -1.02, 0.12];
      rot = [0, 0, 0];
      scale = [0.18 * tattooScale, 0.18 * tattooScale, 1];
    }
    // Posterior / Back mappings
    else if (area.includes('back')) {
      pos = [0, 1.38, -0.18];
      rot = [0, Math.PI, 0];
      scale = [0.52 * tattooScale, 0.48 * tattooScale, 1];
    } else if (area.includes('spine')) {
      pos = [0, 1.15, -0.18];
      rot = [0, Math.PI, 0];
      scale = [0.22 * tattooScale, 0.68 * tattooScale, 1];
    } else if (area.includes('tricep')) {
      pos = [-0.58, 1.08, -0.12];
      rot = [0, Math.PI + 0.3, -0.14];
      scale = [0.3 * tattooScale, 0.36 * tattooScale, 1];
    } else if (area.includes('hamstring')) {
      pos = [-0.21, 0.14, -0.18];
      rot = [0, Math.PI, 0.05];
      scale = [0.36 * tattooScale, 0.48 * tattooScale, 1];
    }

    tattooMesh.position.set(pos[0], pos[1], pos[2]);
    tattooMesh.rotation.set(rot[0], rot[1], rot[2]);
    tattooMesh.scale.set(scale[0], scale[1], scale[2]);
    tattooMesh.visible = Boolean(selectedDesign);
  }, [selectedBodyArea, selectedDesign, tattooScale]);

  useEffect(() => {
    updateTattooPlacementIn3D();
  }, [updateTattooPlacementIn3D, tattooScale]);

  // Update Tattoo Opacity & Blending
  useEffect(() => {
    if (!tattooMeshRef.current) return;
    const mat = tattooMeshRef.current.material;
    mat.opacity = tattooOpacity;
    mat.needsUpdate = true;
  }, [tattooOpacity]);

  // 4. Auto Orbit 360 Spin Loop
  useEffect(() => {
    if (!isAutoRotating) return;
    let animId;
    const spin = () => {
      targetRotationYRef.current += 0.008;
      const deg = ((targetRotationYRef.current * 180) / Math.PI + 3600) % 360;
      setRotationDeg(Math.round(deg));
      animId = requestAnimationFrame(spin);
    };
    animId = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(animId);
  }, [isAutoRotating]);

  // 5. Automatic Camera & Rotation alignment when user clicks body area
  useEffect(() => {
    if (!selectedBodyArea) return;
    const match = BODY_3D_ZONES.find((z) => z.id.toLowerCase() === selectedBodyArea.toLowerCase());
    if (match) {
      // Set model target angle
      targetRotationYRef.current = (match.defaultRotation * Math.PI) / 180;
      setRotationDeg(match.defaultRotation);

      // Focus camera height and distance smoothly
      if (match.camPos) {
        targetCameraYRef.current = match.camPos[1] * 0.6;
        targetCameraDistRef.current = match.camPos[2] * 1.1;
      }
    }
  }, [selectedBodyArea]);

  // 6. Interactive 3D Orbit Dragging Handlers
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    setIsAutoRotating(false);
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
    previousPointerPosRef.current = { x: clientX, y: clientY };
  };

  const handlePointerMove = (e) => {
    const container = canvasContainerRef.current;
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;

    // Raycast detection for 3D body part hovering
    if (container && cameraRef.current && sceneRef.current) {
      const rect = container.getBoundingClientRect();
      mousePosRef.current.x = ((clientX - rect.left) / container.clientWidth) * 2 - 1;
      mousePosRef.current.y = -((clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycasterRef.current.setFromCamera(mousePosRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(mannequinGroupRef.current.children, true);

      let foundZone = null;
      for (const hit of intersects) {
        if (hit.object?.userData?.zoneId) {
          foundZone = hit.object.userData.zoneId;
          break;
        }
      }
      setHoveredZoneName(foundZone);
    }

    if (!isDraggingRef.current) return;

    const deltaX = clientX - previousPointerPosRef.current.x;
    const deltaY = clientY - previousPointerPosRef.current.y;

    targetRotationYRef.current += deltaX * 0.0085;
    targetCameraYRef.current = Math.max(-0.6, Math.min(1.4, targetCameraYRef.current - deltaY * 0.004));

    const deg = ((targetRotationYRef.current * 180) / Math.PI + 36000) % 360;
    setRotationDeg(Math.round(deg));

    previousPointerPosRef.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Click Raycast to select body part directly in 3D
  const handleCanvasClick = (e) => {
    if (hoveredZoneName && onSelectBodyArea) {
      onSelectBodyArea(hoveredZoneName);
      toast.success(`Selected 3D Anatomical Zone: ${hoveredZoneName}`);
    }
  };

  const handleZoomIn = () => {
    targetCameraDistRef.current = Math.max(2.4, targetCameraDistRef.current - 0.5);
    setZoomLevel((prev) => Math.min(prev + 0.2, 1.8));
  };

  const handleZoomOut = () => {
    targetCameraDistRef.current = Math.min(6.5, targetCameraDistRef.current + 0.5);
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.7));
  };

  const handleSetPresetAngle = (deg) => {
    targetRotationYRef.current = (deg * Math.PI) / 180;
    setRotationDeg(deg);
    targetCameraYRef.current = 0.2;
    targetCameraDistRef.current = 4.6;
  };

  const normalizedAngle = ((rotationDeg % 360) + 360) % 360;

  return (
    <div
      ref={mountRef}
      className={`relative w-full ${compact ? 'h-[520px] sm:h-[580px] md:h-[640px]' : 'h-[620px] sm:h-[700px] md:h-[820px]'} flex flex-col items-center justify-between select-none overflow-hidden rounded-3xl bg-[#090b10] border border-studio-border/70 shadow-2xl transition-all`}
      onMouseEnter={() => setIsHoveringCanvas(true)}
      onMouseLeave={() => {
        setIsHoveringCanvas(false);
        setHoveredZoneName(null);
      }}
    >
      {/* 3D WebGL Canvas Layer */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClick={handleCanvasClick}
      />

      {/* Atmospheric Studio Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06)_0%,rgba(245,158,11,0.04)_40%,transparent_75%)] pointer-events-none z-1" />

      {/* --- TOP 3D HUD CONTROLS --- */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-auto">
        
        {/* Left: 360° Angle Turn & Auto-Orbit */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 bg-black/80 backdrop-blur-md border border-amber-500/30 p-1 sm:p-1.5 rounded-full shadow-2xl">
          <button
            type="button"
            onClick={() => handleSetPresetAngle((rotationDeg + 90) % 360)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 hover:text-amber-200 bg-amber-950/70 border border-amber-500/40 rounded-full transition-all active:scale-95"
            title="Rotate +90° around 3D Mannequin"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>{Math.round(normalizedAngle)}° 3D</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full transition-all ${
              isAutoRotating
                ? 'bg-amber-400 text-black shadow-[0_0_15px_#f59e0b]'
                : 'text-zinc-300 hover:text-white bg-zinc-900 border border-white/10'
            }`}
            title="Continuous 360° Auto Orbit"
          >
            {isAutoRotating ? '⏸ Orbit' : '▶ 360° Orbit'}
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full transition-colors hidden sm:inline-block"
            title="Zoom In 3D Camera"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full transition-colors hidden sm:inline-block"
            title="Zoom Out 3D Camera"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Center/Right: Material Finish Selector & Active Anatomical Zone Badge */}
        <div className="flex items-center space-x-2">
          {/* Material Finish Toggle */}
          <div className="hidden sm:flex items-center space-x-1 bg-black/80 backdrop-blur-md border border-white/10 px-2 py-1 rounded-full text-[10px] text-zinc-300">
            <span className="text-zinc-500 uppercase font-bold text-[9px] mr-1">Finish:</span>
            {['bronze', 'obsidian', 'marble', 'cyber'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setModelMaterialType(m)}
                className={`px-2 py-0.5 rounded uppercase font-bold text-[9px] transition-all ${
                  modelMaterialType === m
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Active 3D Body Zone Badge */}
          <div className="bg-black/85 backdrop-blur-md border border-cyan-400/60 px-3.5 py-1.5 rounded-full text-xs font-black text-cyan-300 flex items-center space-x-2 shadow-[0_0_16px_rgba(6,182,212,0.3)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <span className="uppercase tracking-wider">
              {hoveredZoneName ? `Hover: ${hoveredZoneName}` : `${selectedBodyArea} Zone`}
            </span>
          </div>
        </div>
      </div>

      {/* --- PRESET 3D ROTATION ANGLES BAR --- */}
      <div className="absolute top-14 left-1/2 transform -translate-x-1/2 z-25 flex items-center space-x-1.5 bg-black/80 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-[10px] text-zinc-300 pointer-events-auto shadow-xl">
        <button
          type="button"
          onClick={() => handleSetPresetAngle(0)}
          className={`px-2 py-0.5 rounded transition-all ${normalizedAngle < 45 || normalizedAngle >= 315 ? 'text-amber-300 font-black bg-amber-500/20' : 'hover:text-white'}`}
        >
          0° Front
        </button>
        <span className="text-zinc-600">|</span>
        <button
          type="button"
          onClick={() => handleSetPresetAngle(90)}
          className={`px-2 py-0.5 rounded transition-all ${normalizedAngle >= 45 && normalizedAngle < 135 ? 'text-amber-300 font-black bg-amber-500/20' : 'hover:text-white'}`}
        >
          90° Right
        </button>
        <span className="text-zinc-600">|</span>
        <button
          type="button"
          onClick={() => handleSetPresetAngle(180)}
          className={`px-2 py-0.5 rounded transition-all ${normalizedAngle >= 135 && normalizedAngle < 225 ? 'text-amber-300 font-black bg-amber-500/20' : 'hover:text-white'}`}
        >
          180° Back
        </button>
        <span className="text-zinc-600">|</span>
        <button
          type="button"
          onClick={() => handleSetPresetAngle(270)}
          className={`px-2 py-0.5 rounded transition-all ${normalizedAngle >= 225 && normalizedAngle < 315 ? 'text-amber-300 font-black bg-amber-500/20' : 'hover:text-white'}`}
        >
          270° Left
        </button>
      </div>

      {/* Floating 3D Interaction Hint */}
      <div className="absolute top-24 left-4 z-20 pointer-events-none hidden md:block">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-[10px] text-zinc-400 space-y-0.5">
          <p className="text-amber-300/90 font-bold flex items-center space-x-1">
            <span>✦ 3D WebGL Anatomical Model</span>
          </p>
          <p>• Drag mouse/finger to orbit 360°</p>
          <p>• Click body part to inspect &amp; place tattoo</p>
        </div>
      </div>

      {/* --- BOTTOM IN-VIEWPORT TATTOO CONTROLS DOCK --- */}
      <div className="absolute bottom-3 left-3 right-3 z-30 flex flex-col gap-2 pointer-events-auto">
        
        {/* Fine-Tuning Slider Bar */}
        <div className="flex items-center justify-between bg-black/85 backdrop-blur-md border border-studio-border/70 p-2 sm:px-4 rounded-xl text-xs text-zinc-300 shadow-2xl">
          
          {/* Scale Slider */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400">Scale</span>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={tattooScale}
              onChange={(e) => setTattooScale(parseFloat(e.target.value))}
              className="w-20 sm:w-28 accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
            <span className="text-[10px] font-mono text-zinc-400">{tattooScale.toFixed(2)}x</span>
          </div>

          {/* Opacity Slider */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-400">Ink Density</span>
            <input
              type="range"
              min="0.3"
              max="1.0"
              step="0.05"
              value={tattooOpacity}
              onChange={(e) => setTattooOpacity(parseFloat(e.target.value))}
              className="w-20 sm:w-28 accent-cyan-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
            <span className="text-[10px] font-mono text-zinc-400">{Math.round(tattooOpacity * 100)}%</span>
          </div>

          {/* Quick Reset */}
          <button
            type="button"
            onClick={() => {
              setTattooScale(1.0);
              setTattooOpacity(0.95);
              handleSetPresetAngle(0);
            }}
            className="p-1 text-zinc-400 hover:text-white bg-zinc-900 border border-white/10 rounded-md transition-all text-[10px] px-2 flex items-center space-x-1"
            title="Reset 3D View & Scale"
          >
            <RefreshCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* In-Viewport Tattoo Design Quick Carousel */}
        {designs && designs.length > 0 && (
          <div className="bg-black/90 backdrop-blur-xl border border-studio-border/70 p-2 rounded-2xl shadow-2xl">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
              <span className="text-[9px] uppercase tracking-widest font-black text-studio-glowCyan px-2 shrink-0">
                Select Tattoo:
              </span>
              {designs.slice(0, 10).map((design) => {
                const isSelected = selectedDesign?._id === design._id || selectedDesign?.name === design.name;
                const imgSrc = getFullImageUrl(design.previewImage || design.dataUri || design.image);

                return (
                  <button
                    key={design._id || design.name}
                    type="button"
                    onClick={() => {
                      if (onSelectDesign) onSelectDesign(design);
                      toast.success(`Projecting "${design.name}" onto 3D ${selectedBodyArea}!`);
                    }}
                    className={`relative shrink-0 flex items-center space-x-2 px-2 py-1 rounded-xl transition-all border ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.35)] scale-105'
                        : 'bg-zinc-900/80 border-white/10 hover:border-amber-500/40 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-black/70 p-0.5 overflow-hidden flex items-center justify-center border border-white/10">
                      {design.svg ? (
                        design.svg
                      ) : (
                        <img
                          src={imgSrc}
                          alt={design.name}
                          className="w-full h-full object-contain filter invert dark:invert-0"
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
