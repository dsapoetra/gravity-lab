import { Canvas } from '@react-three/fiber';
import { Physics, usePlane } from '@react-three/cannon';
import { OrbitControls, Environment, Sky } from '@react-three/drei';
import { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import SceneObjects from './SceneObjects';
import { DragController } from './DragController';

const PhysicsCanvas = forwardRef(({ gravity, friction, restitution, isAntiGravity }, ref) => {
  const [objects, setObjects] = useState([]);

  // Gravity vector based on Anti-Gravity mode
  // Standard gravity is -9.81 on Y axis. We scale it by the 'gravity' multiplier from controls.
  const gravityVector = [0, (isAntiGravity ? 9.81 : -9.81) * gravity, 0];

  useImperativeHandle(ref, () => ({
    addSphere: (color) => {
      setObjects(prev => [...prev, {
        id: Math.random(),
        type: 'sphere',
        position: [Math.random() * 4 - 2, 10, Math.random() * 4 - 2],
        args: [0.5 + Math.random() * 0.5], // radius
        color: color
      }]);
    },
    addBox: (color) => {
      setObjects(prev => [...prev, {
        id: Math.random(),
        type: 'box',
        position: [Math.random() * 4 - 2, 10, Math.random() * 4 - 2],
        args: [1 + Math.random(), 1 + Math.random(), 1 + Math.random()], // w, h, d
        color: color
      }]);
    },
    addPolyhedron: (color) => {
      setObjects(prev => [...prev, {
        id: Math.random(),
        type: 'polyhedron',
        position: [Math.random() * 4 - 2, 10, Math.random() * 4 - 2],
        args: [0.8 + Math.random() * 0.6], // radius/scale
        color: color
      }]);
    },
    addMickey: (color) => {
      setObjects(prev => [...prev, {
        id: Math.random(),
        type: 'mickey',
        position: [Math.random() * 4 - 2, 10, Math.random() * 4 - 2],
        args: [],
        color: color
      }]);
    },
    clearWorld: () => {
      setObjects([]);
    }
  }));

  return (
    <Canvas shadows camera={{ position: [0, 5, 12], fov: 50 }} className="absolute inset-0 z-0">
      {/* Visuals */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
      <Sky sunPosition={[100, 20, 100]} turbidity={0.5} rayleigh={0.5} mieCoefficient={0.005} mieDirectionalG={0.8} />
      <Environment preset="city" />

      {/* Physics World */}
      <Physics gravity={gravityVector}>
        <DragController>
          <SceneObjects
            objects={objects}
            friction={friction}
            restitution={restitution}
          />

          {/* Floor & Walls */}
          <Floor friction={friction} restitution={restitution} />
          <Walls friction={friction} restitution={restitution} />
        </DragController>
      </Physics>

      <OrbitControls makeDefault />
    </Canvas>
  );
});

function Floor({ friction, restitution }) {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -2, 0],
    material: { friction, restitution }
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <shadowMaterial color="#0ea5e9" transparent opacity={0.15} />
      <gridHelper args={[40, 40, '#ffffff', '#94a3b8']} position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} />
    </mesh>
  );
}

function Walls({ friction, restitution }) {
  const wallMaterial = { friction, restitution };

  // 4 Walls creating a 40x40 box, centered at 0,0
  // Left Wall (x = -20)
  usePlane(() => ({ position: [-20, 10, 0], rotation: [0, Math.PI / 2, 0], material: wallMaterial }));
  // Right Wall (x = 20)
  usePlane(() => ({ position: [20, 10, 0], rotation: [0, -Math.PI / 2, 0], material: wallMaterial }));
  // Back Wall (z = -20)
  usePlane(() => ({ position: [0, 10, -20], rotation: [0, 0, 0], material: wallMaterial }));
  // Front Wall (z = 20)
  usePlane(() => ({ position: [0, 10, 20], rotation: [0, Math.PI, 0], material: wallMaterial }));

  // Ceiling (y = 20)
  usePlane(() => ({ position: [0, 20, 0], rotation: [Math.PI / 2, 0, 0], material: wallMaterial }));

  // Visuals for boundaries
  return (
    <group position={[0, 10, 0]}>
      {/* Ceiling Visual Guide */}
      <gridHelper args={[40, 40, '#f472b6', '#f472b6']} position={[0, 10, 0]} rotation={[0, 0, 0]} />

      <mesh position={[-20, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[40, 20]} />
        <meshBasicMaterial color="#cbd5e1" transparent opacity={0.1} side={2} />
      </mesh>
      <mesh position={[20, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[40, 20]} />
        <meshBasicMaterial color="#cbd5e1" transparent opacity={0.1} side={2} />
      </mesh>
      <mesh position={[0, 0, -20]}>
        <planeGeometry args={[40, 20]} />
        <meshBasicMaterial color="#cbd5e1" transparent opacity={0.1} side={2} />
      </mesh>
      <mesh position={[0, 0, 20]}>
        <planeGeometry args={[40, 20]} />
        <meshBasicMaterial color="#cbd5e1" transparent opacity={0.05} side={2} />
      </mesh>
    </group>
  )
}

export default PhysicsCanvas;
