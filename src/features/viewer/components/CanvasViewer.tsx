import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useConfiguratorStore } from '@/core/state/useConfiguratorStore';
import { StudioEnvironment } from './StudioEnvironment';
import { TentModel } from './TentModel';
import { LoadingFallback } from './LoadingFallback';
import { ErrorFallback } from './ErrorFallback';
import { ViewerControls } from './ViewerControls';
import { CameraPreset } from '@/core/state/types';

interface CameraRigProps {
  preset: CameraPreset;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

const TARGET_POSITIONS: Record<CameraPreset, { pos: THREE.Vector3; target: THREE.Vector3 }> = {
  default: {
    pos: new THREE.Vector3(6, 4.2, 7.5),
    target: new THREE.Vector3(0, 1.4, 0),
  },
  front: {
    pos: new THREE.Vector3(0, 1.8, 7.5),
    target: new THREE.Vector3(0, 1.4, 0),
  },
  side: {
    pos: new THREE.Vector3(7.5, 1.8, 0),
    target: new THREE.Vector3(0, 1.4, 0),
  },
  top: {
    pos: new THREE.Vector3(0, 9.5, 0.001),
    target: new THREE.Vector3(0, 0, 0),
  },
};

const CameraRig: React.FC<CameraRigProps> = ({ preset, controlsRef }) => {
  const isAnimating = useRef(false);
  const targetConfig = TARGET_POSITIONS[preset];

  useEffect(() => {
    isAnimating.current = true;
  }, [preset]);

  useFrame((state, delta) => {
    if (!controlsRef.current || !isAnimating.current) return;
    const controls = controlsRef.current;

    const lerpSpeed = Math.min(1, delta * 6);
    state.camera.position.lerp(targetConfig.pos, lerpSpeed);
    controls.target.lerp(targetConfig.target, lerpSpeed);
    controls.update();

    if (
      state.camera.position.distanceTo(targetConfig.pos) < 0.02 &&
      controls.target.distanceTo(targetConfig.target) < 0.02
    ) {
      isAnimating.current = false;
    }
  });

  return null;
};

export const CanvasViewer: React.FC = () => {
  const activeProduct = useConfiguratorStore((s) => s.getActiveProduct());
  const activeColor = useConfiguratorStore((s) => s.getActiveCanopyColor());
  const activeFinish = useConfiguratorStore((s) => s.getActiveFrameFinish());
  const autoRotate = useConfiguratorStore((s) => s.autoRotate);
  const showGrid = useConfiguratorStore((s) => s.showGrid);
  const cameraPreset = useConfiguratorStore((s) => s.cameraPreset);
  const setCameraPreset = useConfiguratorStore((s) => s.setCameraPreset);

  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [hasError, setHasError] = React.useState(false);

  const handleResetCamera = () => {
    setCameraPreset('default');
  };

  return (
    <div className="relative h-full w-full bg-amber-50 overflow-hidden select-none">
      {hasError ? (
        <ErrorFallback onRetry={() => setHasError(false)} />
      ) : (
        <>
          <Canvas
            shadows
            camera={{ position: [6, 4.2, 7.5], fov: 42 }}
            gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true, powerPreference: 'high-performance', toneMapping: THREE.NoToneMapping }}
            onCreated={({ gl }) => {
              gl.setClearColor('#fef3c7');
              gl.toneMapping = THREE.NoToneMapping;
            }}
          >
            <CameraRig preset={cameraPreset} controlsRef={controlsRef} />

            <OrbitControls
              ref={controlsRef}
              makeDefault
              enableDamping
              dampingFactor={0.08}
              minDistance={1.8}
              maxDistance={22}
              minPolarAngle={0}
              maxPolarAngle={Math.PI * 0.72}
              autoRotate={autoRotate}
              autoRotateSpeed={1.5}
            />

            <StudioEnvironment showGrid={showGrid} />

            <Suspense fallback={<LoadingFallback />}>
              <TentModel
                key={activeProduct.id}
                modelUrl={activeProduct.modelUrl}
                canopyColorHex={activeColor.colorHex}
                frameFinishHex={activeFinish.colorHex}
                scale={activeProduct.scale}
              />
            </Suspense>
          </Canvas>

          {/* Floating controls toolbar overlay */}
          <ViewerControls onResetCamera={handleResetCamera} />
        </>
      )}
    </div>
  );
};
