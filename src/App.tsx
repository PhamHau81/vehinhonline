import React, { useState, useEffect, useCallback } from 'react';
import { SOLIDS, VisualStyle, CameraPreset } from './types/geometry';
import { CustomGeometryScene } from './types/customGeometry';
import { SAMPLE_PROBLEMS, getStoredApiKey } from './services/geminiGeometryService';
import { ThreeCanvas } from './components/ThreeCanvas';
import { Header } from './components/Header';
import { FormulaCard } from './components/FormulaCard';
import { ControlDock } from './components/ControlDock';
import { GuideModal } from './components/GuideModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { PromptGeometryDrawer } from './components/PromptGeometryDrawer';
import { CustomViewToolbar } from './components/CustomViewToolbar';

export default function App() {
  // Mode: Custom Prompt Geometry vs Standard 11 Solids
  const [isCustomMode, setIsCustomMode] = useState<boolean>(true);
  const [customScene, setCustomScene] = useState<CustomGeometryScene>(SAMPLE_PROBLEMS[0].scene);
  const [isPromptDrawerOpen, setIsPromptDrawerOpen] = useState<boolean>(true);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  // Custom view toggles
  const [showDashed, setShowDashed] = useState<boolean>(true);
  const [showFaces, setShowFaces] = useState<boolean>(true);

  // Standard Solids State
  const [currentSolidId, setCurrentSolidId] = useState<string>('cube_platonic');
  const currentSolid = SOLIDS[currentSolidId] || SOLIDS.cube_platonic;

  const [params, setParams] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    currentSolid.params.forEach((p) => {
      initial[p.key] = p.default;
    });
    return initial;
  });

  // Display & 3D camera state
  const [style, setStyle] = useState<VisualStyle>('pbr');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [explodedRatio, setExplodedRatio] = useState<number>(0);
  const [enableSection, setEnableSection] = useState<boolean>(false);
  const [sectionHeight, setSectionHeight] = useState<number>(0);
  const [sectionTilt, setSectionTilt] = useState<number>(0);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('perspective');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // On first load, check if user has set Gemini API key per AI_INSTRUCTIONS
  useEffect(() => {
    const key = getStoredApiKey();
    if (!key) {
      // Auto open modal to guide the user to input API key
      const timer = setTimeout(() => {
        setIsApiKeyModalOpen(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, []);

  // When changing solid, load default parameters for the newly selected solid
  const handleSelectSolid = useCallback((id: string) => {
    if (!SOLIDS[id]) return;
    setIsCustomMode(false);
    setCurrentSolidId(id);
    const newParams: Record<string, number> = {};
    SOLIDS[id].params.forEach((p) => {
      newParams[p.key] = p.default;
    });
    setParams(newParams);
    setExplodedRatio(0);
  }, []);

  const handleParamChange = useCallback((key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleResetAll = useCallback(() => {
    const initial: Record<string, number> = {};
    currentSolid.params.forEach((p) => {
      initial[p.key] = p.default;
    });
    setParams(initial);
    setStyle('pbr');
    setIsAutoRotating(false);
    setExplodedRatio(0);
    setEnableSection(false);
    setSectionHeight(0);
    setSectionTilt(0);
    setShowGrid(true);
    setShowLabels(true);
    setCameraPreset('perspective');
  }, [currentSolid]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsAutoRotating((prev) => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        setCameraPreset('perspective');
      } else if (e.key === 'l' || e.key === 'L') {
        setShowLabels((prev) => !prev);
      } else if (e.key === 'g' || e.key === 'G') {
        setShowGrid((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Header */}
      <Header
        currentSolidId={currentSolidId}
        onSelectSolid={handleSelectSolid}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onTogglePromptDrawer={() => setIsPromptDrawerOpen(!isPromptDrawerOpen)}
        isPromptDrawerOpen={isPromptDrawerOpen}
        isCustomMode={isCustomMode}
        onToggleMode={(custom) => setIsCustomMode(custom)}
      />

      {/* Main 3D Viewport */}
      <main className="absolute inset-0 pt-16">
        <ThreeCanvas
          solidId={currentSolidId}
          params={params}
          style={style}
          isAutoRotating={isAutoRotating}
          explodedRatio={explodedRatio}
          enableSection={enableSection}
          sectionHeight={sectionHeight}
          sectionTilt={sectionTilt}
          showGrid={showGrid}
          showLabels={showLabels}
          cameraPreset={cameraPreset}
          onResetPreset={() => setCameraPreset('perspective')}
          isCustomMode={isCustomMode}
          customScene={customScene}
          showDashed={showDashed}
          showFaces={showFaces}
        />
      </main>

      {/* Mode 1: Custom Prompt Geometry View */}
      {isCustomMode && (
        <>
          <PromptGeometryDrawer
            isOpen={isPromptDrawerOpen}
            onToggle={() => setIsPromptDrawerOpen(!isPromptDrawerOpen)}
            currentScene={customScene}
            onSceneGenerated={(newScene) => setCustomScene(newScene)}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            showDashed={showDashed}
            onToggleDashed={() => setShowDashed(!showDashed)}
            showFaces={showFaces}
            onToggleFaces={() => setShowFaces(!showFaces)}
          />

          <CustomViewToolbar
            isAutoRotating={isAutoRotating}
            onToggleAutoRotate={() => setIsAutoRotating(!isAutoRotating)}
            showLabels={showLabels}
            onToggleLabels={() => setShowLabels(!showLabels)}
            showGrid={showGrid}
            onToggleGrid={() => setShowGrid(!showGrid)}
            showDashed={showDashed}
            onToggleDashed={() => setShowDashed(!showDashed)}
            showFaces={showFaces}
            onToggleFaces={() => setShowFaces(!showFaces)}
            cameraPreset={cameraPreset}
            onSelectCameraPreset={setCameraPreset}
            onResetView={() => setCameraPreset('perspective')}
            onOpenPromptDrawer={() => setIsPromptDrawerOpen(true)}
          />
        </>
      )}

      {/* Mode 2: Standard Solid Exploration */}
      {!isCustomMode && (
        <>
          <FormulaCard solid={currentSolid} params={params} />

          <ControlDock
            solid={currentSolid}
            params={params}
            onParamChange={handleParamChange}
            style={style}
            onStyleChange={setStyle}
            isAutoRotating={isAutoRotating}
            onToggleAutoRotate={() => setIsAutoRotating(!isAutoRotating)}
            explodedRatio={explodedRatio}
            onExplodedRatioChange={setExplodedRatio}
            enableSection={enableSection}
            onToggleSection={() => setEnableSection(!enableSection)}
            sectionHeight={sectionHeight}
            onSectionHeightChange={setSectionHeight}
            sectionTilt={sectionTilt}
            onSectionTiltChange={setSectionTilt}
            showGrid={showGrid}
            onToggleGrid={() => setShowGrid(!showGrid)}
            showLabels={showLabels}
            onToggleLabels={() => setShowLabels(!showLabels)}
            cameraPreset={cameraPreset}
            onSelectCameraPreset={setCameraPreset}
            onResetAll={handleResetAll}
          />
        </>
      )}

      {/* API Key & Model Configuration Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      {/* Educational Guide Modal */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* Keyboard Shortcuts Hint at Bottom Right */}
      <div className="fixed bottom-4 right-4 z-20 hidden 2xl:flex items-center gap-2 text-[11px] text-slate-500 bg-slate-950/70 border border-slate-800/80 px-2.5 py-1 rounded-lg backdrop-blur-sm pointer-events-none">
        <span>Phím tắt:</span>
        <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono text-[10px]">Space</kbd>
        <span>Xoay</span>
        <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono text-[10px]">L</kbd>
        <span>Đỉnh</span>
        <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono text-[10px]">R</kbd>
        <span>Reset góc nhìn</span>
      </div>
    </div>
  );
}
