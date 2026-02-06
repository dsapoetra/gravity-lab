import { useFrame } from '@react-three/fiber';
import { useState, useEffect, useMemo, useRef, createContext, useContext } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const DragContext = createContext(null);

export const useDrag = () => useContext(DragContext);

export function DragController({ children }) {
    const controlsRef = useRef();

    // State for the object currently being dragged and its physics API
    const [targetRef, setTargetRef] = useState(null);
    const [targetApi, setTargetApi] = useState(null);

    // Raycasting objects for X position mapping
    const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
    const intersection = useMemo(() => new THREE.Vector3(), []);

    // Playpen bounds
    const FLOOR_Y = -2;
    const CEILING_Y = 20;
    const BOUNDS_X = 18;

    // Update target position every frame
    useFrame(({ camera, raycaster, pointer }) => {
        if (!targetRef || !targetApi) return;

        // Use raycasting for X position (natural horizontal movement)
        raycaster.setFromCamera(pointer, camera);
        let worldX = 0;
        if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
            worldX = Math.max(-BOUNDS_X, Math.min(BOUNDS_X, intersection.x));
        }

        // Use direct linear mapping for Y position (guarantees full floor-to-ceiling range)
        // pointer.y: -1 (bottom of screen) to +1 (top of screen)
        // Map to: FLOOR_Y (-2) to CEILING_Y (20)
        const t = (pointer.y + 1) / 2; // normalize to 0-1
        const worldY = FLOOR_Y + t * (CEILING_Y - FLOOR_Y);

        targetApi.position.set(worldX, worldY, 0);
        targetApi.velocity.set(0, 0, 0);
    });

    // Bind function with synchronous OrbitControls toggle
    const bind = (ref, api) => ({
        onPointerDown: (e) => {
            e.stopPropagation();
            // SYNCHRONOUS - disable controls before any async state updates
            if (controlsRef.current) {
                controlsRef.current.enabled = false;
            }
            document.body.style.cursor = 'grabbing';
            setTargetRef(ref);
            setTargetApi(api);
        },
        onPointerUp: () => {
            if (controlsRef.current) {
                controlsRef.current.enabled = true;
            }
            document.body.style.cursor = 'auto';
            setTargetRef(null);
            setTargetApi(null);
        }
    });

    // Global listener for releasing drag
    useEffect(() => {
        const handleGlobalUp = () => {
            if (controlsRef.current) {
                controlsRef.current.enabled = true;
            }
            setTargetRef(null);
            setTargetApi(null);
            document.body.style.cursor = 'auto';
        };
        window.addEventListener('pointerup', handleGlobalUp);
        return () => window.removeEventListener('pointerup', handleGlobalUp);
    }, []);

    return (
        <DragContext.Provider value={bind}>
            {children}
            <OrbitControls ref={controlsRef} makeDefault />
        </DragContext.Provider>
    );
}
