import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { VisualStyle, CameraPreset } from '../types/geometry';
import { buildSolid, BuiltSolidModel } from '../utils/geometryBuilder';
import { CustomGeometryScene } from '../types/customGeometry';
import { buildCustomGeometryModel } from '../utils/customGeometryBuilder';

interface ThreeCanvasProps {
  solidId: string;
  params: Record<string, number>;
  style: VisualStyle;
  isAutoRotating: boolean;
  explodedRatio: number; // 0 to 1
  enableSection: boolean;
  sectionHeight: number; // -2 to 2
  sectionTilt: number; // angle in degrees
  showGrid: boolean;
  showLabels: boolean;
  cameraPreset: CameraPreset;
  onResetPreset?: () => void;
  // Custom prompt geometry mode props
  isCustomMode?: boolean;
  customScene?: CustomGeometryScene | null;
  showDashed?: boolean;
  showFaces?: boolean;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  solidId,
  params,
  style,
  isAutoRotating,
  explodedRatio,
  enableSection,
  sectionHeight,
  sectionTilt,
  showGrid,
  showLabels,
  cameraPreset,
  onResetPreset,
  isCustomMode = false,
  customScene = null,
  showDashed = true,
  showFaces = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const solidModelRef = useRef<BuiltSolidModel | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const slicePlaneMeshRef = useRef<THREE.Mesh | null>(null);
  const clipPlaneRef = useRef<THREE.Plane | null>(null);
  const solidGroupRef = useRef<THREE.Group | null>(null);

  // Smooth damping targets
  const currentExplodeRef = useRef<number>(0);
  const targetCamPosRef = useRef<THREE.Vector3 | null>(null);
  const targetCamLookRef = useRef<THREE.Vector3 | null>(null);

  // 2D label coordinates for HTML overlay
  const [screenLabels, setScreenLabels] = useState<{ id: string; name: string; x: number; y: number; visible: boolean }[]>([]);

  // Track software WebGL
  const isSoftwareGlRef = useRef(false);

  // Setup Three.js scene once
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Detect software WebGL
    const gl = document.createElement('canvas').getContext('webgl2');
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      isSoftwareGlRef.current = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } else {
      isSoftwareGlRef.current = true;
    }

    const isSoftwareGl = isSoftwareGlRef.current;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1120);
    scene.fog = new THREE.FogExp2(0x0b1120, 0.035);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(4.5, 3.8, 5.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 25;
    controls.minDistance = 1.5;
    controlsRef.current = controls;

    // Stop animated camera transition when user manually drags
    controls.addEventListener('start', () => {
      targetCamPosRef.current = null;
      targetCamLookRef.current = null;
    });

    // 5. Studio Environment Map (RoomEnvironment)
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // 6. Lighting
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 1.2);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
    dirLight.position.set(7, 12, 8);
    dirLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 30;
      dirLight.shadow.bias = -0.0005;
      dirLight.shadow.normalBias = 0.02;
      const d = 4.5;
      dirLight.shadow.camera.left = -d;
      dirLight.shadow.camera.right = d;
      dirLight.shadow.camera.top = d;
      dirLight.shadow.camera.bottom = -d;
    }
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    rimLight.position.set(-6, -2, -6);
    scene.add(rimLight);

    // 7. Ground Grid & Contact Shadow Plane
    const grid = new THREE.GridHelper(16, 16, 0x3b82f6, 0x1e293b);
    grid.position.y = -2.4;
    scene.add(grid);
    gridHelperRef.current = grid;

    // Soft Contact Shadow Plane beneath the object
    const shadowGeo = new THREE.PlaneGeometry(7, 7);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(canvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.38;
    scene.add(shadowPlane);

    // 8. Clipping Plane setup
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
    clipPlaneRef.current = clipPlane;

    // Visual plane mesh representing the section
    const planeGeo = new THREE.PlaneGeometry(6, 6);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    const planeEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(planeGeo),
      new THREE.LineBasicMaterial({ color: 0x22d3ee, linewidth: 2 })
    );
    planeMesh.add(planeEdges);
    planeMesh.rotation.x = Math.PI / 2;
    planeMesh.visible = false;
    scene.add(planeMesh);
    slicePlaneMeshRef.current = planeMesh;

    // Solid container group
    const solidGroup = new THREE.Group();
    scene.add(solidGroup);
    solidGroupRef.current = solidGroup;

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation loop with exponential damping and label projection
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth camera preset interpolation
      if (targetCamPosRef.current && cameraRef.current && controlsRef.current) {
        cameraRef.current.position.lerp(targetCamPosRef.current, 0.08);
        if (targetCamLookRef.current) {
          controlsRef.current.target.lerp(targetCamLookRef.current, 0.08);
        }
        if (cameraRef.current.position.distanceTo(targetCamPosRef.current) < 0.04) {
          targetCamPosRef.current = null;
          targetCamLookRef.current = null;
        }
      }

      // Auto rotation
      if (controlsRef.current) {
        controlsRef.current.autoRotate = isAutoRotating;
        controlsRef.current.autoRotateSpeed = 1.2;
        controlsRef.current.update();
      }

      // Smooth explode separation
      const model = solidModelRef.current;
      if (model && model.faceMeshes.length > 0) {
        const curExp = currentExplodeRef.current;
        const targetExp = explodedRatio;
        currentExplodeRef.current = THREE.MathUtils.damp(curExp, targetExp, 8, delta);
        const expDist = currentExplodeRef.current * 1.5;

        for (let i = 0; i < model.faceMeshes.length; i++) {
          const mesh = model.faceMeshes[i];
          const norm = model.normalVectors[i];
          if (norm) {
            mesh.position.set(norm.x * expDist, norm.y * expDist, norm.z * expDist);
          }
        }
      }

      // Render
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      // Compute vertex 2D projection for HTML labels
      if (showLabels && model && cameraRef.current && mountRef.current) {
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        const labels = model.vertices.map((v) => {
          const p = v.position.clone();
          if (solidGroupRef.current) {
            p.applyMatrix4(solidGroupRef.current.matrixWorld);
          }
          p.project(cameraRef.current!);
          const isFront = p.z < 1;
          const sx = (p.x * 0.5 + 0.5) * w;
          const sy = (-(p.y * 0.5) + 0.5) * h;
          return {
            id: v.id,
            name: v.name,
            x: sx,
            y: sy,
            visible: isFront && sx >= 0 && sx <= w && sy >= 0 && sy <= h
          };
        });
        setScreenLabels(labels);
      } else {
        setScreenLabels([]);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Grid visibility
  useEffect(() => {
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = showGrid;
    }
  }, [showGrid]);

  // Update Clipping Plane parameters
  useEffect(() => {
    if (!clipPlaneRef.current || !slicePlaneMeshRef.current) return;

    if (enableSection) {
      const tiltRad = (sectionTilt * Math.PI) / 180;
      // Normal vector tilted around X axis
      const normal = new THREE.Vector3(0, -Math.cos(tiltRad), -Math.sin(tiltRad)).normalize();
      clipPlaneRef.current.set(normal, sectionHeight);

      // Align visual plane mesh
      slicePlaneMeshRef.current.visible = true;
      slicePlaneMeshRef.current.position.set(0, sectionHeight, 0);
      slicePlaneMeshRef.current.rotation.set(Math.PI / 2 + tiltRad, 0, 0);
    } else {
      // Move clip plane out of the way
      clipPlaneRef.current.set(new THREE.Vector3(0, -1, 0), 9999);
      slicePlaneMeshRef.current.visible = false;
    }
  }, [enableSection, sectionHeight, sectionTilt]);

  // Rebuild 3D Solid Model when solidId, params, or style changes
  useEffect(() => {
    if (!sceneRef.current || !solidGroupRef.current) return;

    // Clear previous model from solidGroup
    const group = solidGroupRef.current;
    while (group.children.length > 0) {
      const child = group.children[0] as THREE.Mesh;
      group.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    }

    let builtModel: BuiltSolidModel;
    if (isCustomMode && customScene) {
      builtModel = buildCustomGeometryModel(customScene, showDashed, showFaces, style);
    } else {
      const clippingPlanes = enableSection && clipPlaneRef.current ? [clipPlaneRef.current] : [];
      builtModel = buildSolid(solidId, params, style, clippingPlanes);
    }
    solidModelRef.current = builtModel;
    group.add(builtModel.group);

    // Reset explode damp state
    currentExplodeRef.current = 0;
  }, [solidId, params, style, enableSection, isCustomMode, customScene, showDashed, showFaces]);

  // Handle Camera Presets
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const radius = 6.2;
    const target = new THREE.Vector3(0, 0, 0);
    let newPos = new THREE.Vector3(4.5, 3.8, 5.5);

    switch (cameraPreset) {
      case 'perspective':
        newPos.set(4.5, 3.8, 5.5);
        break;
      case 'top':
        newPos.set(0, radius, 0.001); // Top projection (Chiếu bằng)
        break;
      case 'front':
        newPos.set(0, 0, radius); // Front projection (Chiếu đứng)
        break;
      case 'side':
        newPos.set(radius, 0, 0); // Side projection (Chiếu cạnh)
        break;
      case 'isometric':
        newPos.set(radius * 0.577, radius * 0.577, radius * 0.577);
        break;
    }

    targetCamPosRef.current = newPos;
    targetCamLookRef.current = target;
  }, [cameraPreset]);

  // Expose screenshot capture utility
  const captureScreenshot = useCallback(() => {
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `hinh_hoc_3d_${solidId}.png`;
      a.click();
    }
  }, [solidId]);

  // Expose capture method via custom event or DOM property if needed
  useEffect(() => {
    (window as any).__capture3DScreenshot = captureScreenshot;
    return () => {
      delete (window as any).__capture3DScreenshot;
    };
  }, [captureScreenshot]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 2D Projected Vertex Labels (High precision markers) */}
      {showLabels && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {screenLabels.map((lbl) =>
            lbl.visible ? (
              <div
                key={lbl.id}
                className="absolute flex items-center justify-center transition-transform duration-75"
                style={{
                  transform: `translate(${lbl.x}px, ${lbl.y}px) translate(-50%, -50%)`,
                }}
              >
                <div className="flex items-center gap-1 bg-slate-900/90 text-amber-300 border border-amber-400/50 text-[11px] font-bold px-1.5 py-0.5 rounded shadow-lg backdrop-blur-sm pointer-events-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{lbl.name}</span>
                </div>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};
