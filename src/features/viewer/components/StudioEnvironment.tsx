import React from 'react';
import { Environment, ContactShadows, Grid } from '@react-three/drei';

interface StudioEnvironmentProps {
  showGrid?: boolean;
}

export const StudioEnvironment: React.FC<StudioEnvironmentProps> = ({ showGrid = true }) => {
  return (
    <>
      {/* Studio HDRI Environment for realistic PBR reflections */}
      <Environment preset="studio" environmentIntensity={0.85} />

      {/* Main Directional Studio Key Light */}
      <directionalLight
        position={[8, 14, 8]}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Secondary Fill Light */}
      <directionalLight position={[-8, 10, -6]} intensity={0.8} />

      {/* Soft Top Down Light */}
      <directionalLight position={[0, 15, 0]} intensity={0.5} />

      {/* Neutral Ambient Light */}
      <ambientLight intensity={0.5} />

      {/* Light Yellow Studio Ground Floor Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.012, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.85} metalness={0.02} />
      </mesh>

      {/* Soft Ground Contact Shadow */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.4}
        scale={22}
        blur={1.6}
        far={8}
        resolution={1024}
        color="#334155"
      />

      {/* Subtle Studio Grid on Light Yellow Floor */}
      {showGrid && (
        <Grid
          position={[0, -0.01, 0]}
          args={[30, 30]}
          cellSize={0.5}
          cellThickness={0.7}
          cellColor="#fde68a"
          sectionSize={2.5}
          sectionThickness={1.1}
          sectionColor="#f59e0b"
          fadeDistance={22}
          fadeStrength={1.2}
        />
      )}
    </>
  );
};
