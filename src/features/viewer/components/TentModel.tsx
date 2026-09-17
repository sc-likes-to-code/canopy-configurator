import React, { useLayoutEffect, useMemo, useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useConfiguratorStore } from '@/core/state/useConfiguratorStore';
import { TextureGenerator } from '@/features/branding/services/TextureGenerator';

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
  const activeProduct = useConfiguratorStore((s) => s.getActiveProduct());
  const panelDesigns = useConfiguratorStore((s) => s.panelDesigns);

  const prevTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const generatorRef = useRef<TextureGenerator | null>(null);

  if (!generatorRef.current) {
    generatorRef.current = new TextureGenerator(2048, 2048);
  }

  // Clone scene so material modifications are isolated per instance
  const clonedScene = useMemo(() => {
    return scene.clone(true);
  }, [scene]);

  // Calculate base offset so tent ground legs rest at y=0
  const yOffset = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    return -box.min.y;
  }, [clonedScene]);

  // Apply frame finish & inner fabric materials
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
          pbrMat.side = THREE.DoubleSide;

          if (pbrMat.name === 'Inner_fabric') {
            pbrMat.color.setStyle(canopyColorHex);
            pbrMat.roughness = 0.85;
            pbrMat.metalness = 0.0;
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

  // Generate & update dynamic 2D canvas texture on outer canopy fabric_Mat
  useEffect(() => {
    let isCancelled = false;

    async function updateCanopyTexture() {
      if (!generatorRef.current) return;

      await generatorRef.current.generateTextureCanvas(
        panelDesigns,
        canopyColorHex,
        activeProduct
      );

      if (isCancelled) return;

      // Dispose previous texture to prevent memory leaks
      if (prevTextureRef.current) {
        prevTextureRef.current.dispose();
      }

      const newTexture = generatorRef.current.createThreeTexture();

      // Unified texture coordinate convention matching GLTF UV V-coordinate
      newTexture.colorSpace = THREE.SRGBColorSpace;
      newTexture.flipY = false;
      newTexture.needsUpdate = true;

      prevTextureRef.current = newTexture;

      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

          materials.forEach((mat) => {
            if (!mat) return;
            const pbrMat = mat as THREE.MeshStandardMaterial;

            if (pbrMat.name === 'fabric_Mat' || pbrMat.name.toLowerCase().includes('fabric')) {
              pbrMat.map = newTexture;
              pbrMat.color.setStyle('#ffffff'); // Pure white base so 2D colors display with 100% exact hex shade
              pbrMat.roughness = 0.95; // Matte fabric finish to prevent PBR reflections from distorting 2D color shades
              pbrMat.metalness = 0.0;
              pbrMat.needsUpdate = true;
            }
          });
        }
      });
    }

    updateCanopyTexture();

    return () => {
      isCancelled = true;
    };
  }, [clonedScene, panelDesigns, canopyColorHex, activeProduct]);

  // Clean up texture on unmount
  useEffect(() => {
    return () => {
      if (prevTextureRef.current) {
        prevTextureRef.current.dispose();
      }
    };
  }, []);

  return (
    <group position={[0, yOffset * scale[1], 0]} scale={scale}>
      <primitive object={clonedScene} castShadow receiveShadow />
    </group>
  );
};

// Preload compressed models with Draco decoder for instant product switching
useGLTF.preload('/models/Tent_5_5.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
useGLTF.preload('/models/Tent_6.5_6.5.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
useGLTF.preload('/models/Tent_8_8.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

