import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface TentModelProps {
  modelUrl: string;
  canopyColorHex: string;
  frameFinishHex: string;
  scale?: [number, number, number];
}

export const TentModel: React.FC<TentModelProps> = ({
  modelUrl,
  canopyColorHex,
  frameFinishHex,
  scale = [1, 1, 1],
}) => {
  const { scene } = useGLTF(modelUrl);

  // Clone scene so material modifications are isolated per instance
  const clonedScene = useMemo(() => {
    return scene.clone(true);
  }, [scene]);

  // Calculate base offset so tent ground legs rest at y=0
  const yOffset = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    return -box.min.y;
  }, [clonedScene]);

  // Update materials when color props change
  useLayoutEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

        materials.forEach((mat) => {
          if (!mat) return;
          const pbrMat = mat as THREE.MeshStandardMaterial;

          // Enable double-sided rendering so underside of canopy and interior frame are fully solid
          pbrMat.side = THREE.DoubleSide;

          if (pbrMat.name === 'fabric_Mat' || pbrMat.name.toLowerCase().includes('fabric')) {
            pbrMat.map = null;
            pbrMat.color.setStyle(canopyColorHex);
            pbrMat.roughness = 0.45;
            pbrMat.metalness = 0.02;
            pbrMat.needsUpdate = true;
          } else if (pbrMat.name === 'Inner_fabric') {
            pbrMat.map = null;
            pbrMat.color.setStyle(canopyColorHex);
            pbrMat.roughness = 0.65;
            pbrMat.metalness = 0.01;
            pbrMat.needsUpdate = true;
          } else if (pbrMat.name === 'Metal_mat' || pbrMat.name.toLowerCase().includes('metal')) {
            pbrMat.map = null;
            pbrMat.color.setStyle(frameFinishHex);
            const isDark = frameFinishHex === '#1e293b' || frameFinishHex === '#18181b';
            pbrMat.roughness = isDark ? 0.35 : 0.2;
            pbrMat.metalness = isDark ? 0.65 : 0.85;
            pbrMat.needsUpdate = true;
          }
        });
      }
    });
  }, [clonedScene, canopyColorHex, frameFinishHex]);

  return (
    <group position={[0, yOffset * scale[1], 0]} scale={scale}>
      <primitive object={clonedScene} castShadow receiveShadow />
    </group>
  );
};

// Preload models for instant product switching
useGLTF.preload('/models/Tent_5_5.glb');
useGLTF.preload('/models/Tent_6.5_6.5.glb');
useGLTF.preload('/models/Tent_8_8.glb');
