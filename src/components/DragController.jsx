import { useThree, useFrame } from '@react-three/fiber';
import { usePointToPointConstraint, useSphere } from '@react-three/cannon';
import { useState, useEffect, createContext, useContext } from 'react';
import * as THREE from 'three';

const DragContext = createContext(null);

export const useDrag = () => useContext(DragContext);

export function DragController({ children }) {
    const { camera, gl, controls } = useThree();

    // 1. Cursor Body: A kinematic sphere that follows the mouse
    const [cursorRef, api] = useSphere(() => ({
        type: 'Kinematic',
        args: [0.1],
        position: [0, 0, 0],
        collisionFilterGroup: 0 // Ghost object
    }));

    // 2. State for the object currently being dragged
    const [targetRef, setTargetRef] = useState(null);

    // 3. Constraint: Connects cursor <-> target
    const [, , constraintApi] = usePointToPointConstraint(
        cursorRef,
        targetRef,
        { pivotA: [0, 0, 0], pivotB: [0, 0, 0] },
        [targetRef]
    );

    // 4. Enable/Disable constraint based on target existence
    useEffect(() => {
        if (targetRef) {
            constraintApi.enable();
            if (controls) controls.enabled = false;
        } else {
            constraintApi.disable();
            if (controls) controls.enabled = true;
        }
    }, [targetRef, constraintApi, controls]);

    // 5. Update Cursor Position Loop
    useFrame(({ mouse }) => {
        // Raycasting logic to find intersection with Z=0 plane (or roughly center of scene)
        // We want the object to feel like it's being dragged under the mouse.

        // Create a vector based on mouse position (NDC)
        const vec = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        vec.unproject(camera);

        const dir = vec.sub(camera.position).normalize();

        // Intersection with plane Z=0:
        // P = O + t*D
        // P.z = 0 => O.z + t*D.z = 0 => t = -O.z / D.z
        const distance = -camera.position.z / dir.z;
        const pos = camera.position.clone().add(dir.multiplyScalar(distance));

        // Update cursor body physics position
        api.position.set(pos.x, pos.y, pos.z);
    });

    // 6. Bind function for consumers
    const bind = (ref) => ({
        onPointerDown: (e) => {
            e.stopPropagation(); // Prevent orbit controls from picking this up (if stopPropagation works on R3F level)
            // Also disable orbit controls explicitly if needed, but usually stopPropagation is enough
            // if the controls are set to listen to the domElement correctly.

            // Actually, preventing default might be needed for touch?
            // e.target.setPointerCapture(e.pointerId); // Standard HTML5 pointer capture

            document.body.style.cursor = 'grabbing';
            setTargetRef(ref);
        },
        onPointerUp: (e) => {
            // e.target.releasePointerCapture(e.pointerId);
            document.body.style.cursor = 'auto';
            setTargetRef(null);
        }
    });

    // Global listener to ensure we drop object if mouse goes off-screen or something
    useEffect(() => {
        const handleGlobalUp = () => {
            setTargetRef(null);
            document.body.style.cursor = 'auto';
        }
        window.addEventListener('pointerup', handleGlobalUp);
        return () => window.removeEventListener('pointerup', handleGlobalUp);
    }, []);

    return (
        <DragContext.Provider value={bind}>
            {children}
            {/* Hidden cursor mesh for debug if needed, keeping it invisible for now */}
            <mesh ref={cursorRef} visible={false}>
                <sphereGeometry args={[0.1]} />
                <meshBasicMaterial color="transparent" />
            </mesh>
        </DragContext.Provider>
    );
}
