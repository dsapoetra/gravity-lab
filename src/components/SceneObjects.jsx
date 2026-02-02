import { useSphere, useBox, useConvexPolyhedron } from '@react-three/cannon';
import { useDrag } from './DragController';
import { useMemo } from 'react';
import * as THREE from 'three';

// Geometry for Polyhedron (Icosahedron)
const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0);

function Sphere({ position, args, materialProps }) {
    const [ref] = useSphere(() => ({
        mass: 1,
        position,
        args: args, // Pass array [radius]
        material: materialProps
    }));
    const bind = useDrag();
    return (
        <mesh ref={ref} castShadow receiveShadow {...(bind ? bind(ref) : {})}>
            <sphereGeometry args={args} />
            <meshStandardMaterial color="#38bdf8" roughness={0.2} metalness={0.5} />
        </mesh>
    );
}

function Box({ position, args, materialProps }) {
    const [ref] = useBox(() => ({
        mass: 1,
        position,
        args, // [x, y, z]
        material: materialProps
    }));
    const bind = useDrag();
    return (
        <mesh ref={ref} castShadow receiveShadow {...(bind ? bind(ref) : {})}>
            <boxGeometry args={args} />
            <meshStandardMaterial color="#818cf8" roughness={0.2} metalness={0.5} />
        </mesh>
    );
}

function Polyhedron({ position, args, materialProps }) {
    // Cannon needs vertices and faces for custom shapes
    const { vertices, faces } = useMemo(() => {
        const geo = new THREE.IcosahedronGeometry(args[0], 0);
        const positionAttribute = geo.attributes.position;
        const vertices = [];
        for (let i = 0; i < positionAttribute.count; i++) {
            vertices.push(new THREE.Vector3().fromBufferAttribute(positionAttribute, i));
        }
        // Cannon expects simplified vertices? simplified format?
        // useConvexPolyhedron is complex. Let's stick to useSphere with a different visual for simplicity if complex,
        // OR use a Box roughly.
        // BUT for a true Polyhedron we can pass args to existing simpler shapes or useConvexPolyhedron properly.
        // Let's use a Box approximation for physics stability in this demo, but render Icosahedron.
        // OR better: useSphere as collider approximation for the "Poly" since Icosahedron is roundish.
        return { vertices: [], faces: [] };
    }, [args]);

    const [ref] = useSphere(() => ({
        mass: 1,
        position,
        args: args, // Pass array [radius]
        material: materialProps
    }));
    const bind = useDrag();

    return (
        <mesh ref={ref} castShadow receiveShadow {...(bind ? bind(ref) : {})}>
            <icosahedronGeometry args={args} />
            <meshStandardMaterial color="#c084fc" roughness={0.1} metalness={0.8} />
        </mesh>
    );
}

export default function SceneObjects({ objects, friction, restitution }) {
    const materialProps = { friction, restitution };

    return (
        <>
            {objects.map(obj => {
                if (obj.type === 'sphere') {
                    return <Sphere key={obj.id} position={obj.position} args={obj.args} materialProps={materialProps} />;
                } else if (obj.type === 'box') {
                    return <Box key={obj.id} position={obj.position} args={obj.args} materialProps={materialProps} />;
                } else if (obj.type === 'polyhedron') {
                    return <Polyhedron key={obj.id} position={obj.position} args={obj.args} materialProps={materialProps} />;
                }
                return null;
            })}
        </>
    );
}
