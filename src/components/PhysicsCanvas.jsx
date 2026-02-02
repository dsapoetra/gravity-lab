import { Canvas } from '@react-three/fiber';
import { Physics, usePlane } from '@react-three/cannon';
import { OrbitControls, Stars } from '@react-three/drei';
import { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import SceneObjects from './SceneObjects';
import { DragController } from './DragController';

const PhysicsCanvas = forwardRef(({ gravity, friction, restitution, isAntiGravity }, ref) => {
  const [objects, setObjects] = useState([]);

  // Gravity vector based on Anti-Gravity mode
  // Standard gravity is -9.81 on Y axis. We scale it by the 'gravity' multiplier from controls.
  const gravityVector = [0, (isAntiGravity ? 9.81 : -9.81) * gravity, 0];

  useImperativeHandle(ref, () => ({
    addSphere: () => {
      setObjects(prev => [...prev, {
        id: Math.random(),
        type: 'sphere',
        position: [Math.random() * 4 - 2, 10, Math.random() * 4 - 2],
        args: [0.5 + Math.random() * 0.5] // radius
      }]);
    },
    addBox: () => {
      setObjects(prev => [...prev, {
        id: Math.random(),
        type: 'box',
        position: [Math.random() * 4 - 2, 10, Math.random() * 4 - 2],
        args: [1 + Math.random(), 1 + Math.random(), 1 + Math.random()] // w, h, d
      }]);
    },
    addPolyhedron: () => {
      setObjects(prev => [...prev, {
        id: Math.random(),
        type: 'polyhedron',
        position: [Math.random() * 4 - 2, 10, Math.random() * 4 - 2],
        args: [0.8 + Math.random() * 0.6] // radius/scale
      }]);
    },
    clearWorld: () => {
      setObjects([]);
    }
  }));

  return (
    <Canvas shadows camera={{ position: [0, 5, 12], fov: 50 }} className="absolute inset-0 z-0">
      {/* Visuals */}
      <color attach="background" args={['#0f172a']} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} castShadow intensity={2} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Physics World */}
      <Physics gravity={gravityVector}>
        <DragController>
          <SceneObjects
            objects={objects}
            friction={friction}
            restitution={restitution}
          />

          {/* Floor */}
          <Floor friction={friction} restitution={restitution} />
        </DragController>
      </Physics>

      <OrbitControls makeDefault />
    </Canvas>
  );
});

function Floor({ friction, restitution }) {
  // Using a static plane for the floor
  // We can't import usePlane here because it must be inside <Physics>
  // So we define it as a sub-component or import it from SceneObjects if preferred.
  // Implementation inline for brevity of this file context, but ideally separate.

  // Actually, let's keep it simple and delegate all physics bodies to SceneObjects or separate components
  // But for the floor, we need it here.
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -2, 0],
    material: { friction, restitution }
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <shadowMaterial color="#171717" transparent opacity={0.4} />
      <gridHelper args={[100, 100, '#38bdf8', '#1e293b']} position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} />
    </mesh>
  );
}

// Fix require in component issue by moving it out or using dynamic import if needed, 
// but since we are in module system, we should import at top. 
// However, usePlane is a hook.
// Let's fix the import.

export default PhysicsCanvas;
