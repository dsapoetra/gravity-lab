import { useSphere, useBox, useCompoundBody } from '@react-three/cannon';
import { useDrag } from './DragController';
import { useMemo } from 'react';
import * as THREE from 'three';

// Geometry for Polyhedron (Icosahedron)
const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0);

function Sphere({ position, args, color, materialProps }) {
    const [ref] = useSphere(() => ({
        mass: 1,
        linearDamping: 0.5,
        angularDamping: 0.5,
        position,
        args: args, // Pass array [radius]
        material: materialProps
    }));
    const bind = useDrag();
    return (
        <mesh ref={ref} castShadow receiveShadow {...(bind ? bind(ref) : {})}>
            <sphereGeometry args={args} />
            <meshStandardMaterial color={color || "#22d3ee"} roughness={0.1} metalness={0.1} />
        </mesh>
    );
}

function Box({ position, args, color, materialProps }) {
    const [ref] = useBox(() => ({
        mass: 1,
        linearDamping: 0.5,
        angularDamping: 0.5,
        position,
        args, // [x, y, z]
        material: materialProps
    }));
    const bind = useDrag();
    return (
        <mesh ref={ref} castShadow receiveShadow {...(bind ? bind(ref) : {})}>
            <boxGeometry args={args} />
            <meshStandardMaterial color={color || "#818cf8"} roughness={0.1} metalness={0.1} />
        </mesh>
    );
}

function Polyhedron({ position, args, color, materialProps }) {
    // Cannon needs vertices and faces for custom shapes
    const { vertices, faces } = useMemo(() => {
        const geo = new THREE.IcosahedronGeometry(args[0], 0);
        const positionAttribute = geo.attributes.position;
        const vertices = [];
        for (let i = 0; i < positionAttribute.count; i++) {
            vertices.push(new THREE.Vector3().fromBufferAttribute(positionAttribute, i));
        }
        return { vertices: [], faces: [] };
    }, [args]);

    const [ref] = useSphere(() => ({
        mass: 1,
        linearDamping: 0.5,
        angularDamping: 0.5,
        position,
        args: args, // Pass array [radius]
        material: materialProps
    }));
    const bind = useDrag();

    return (
        <mesh ref={ref} castShadow receiveShadow {...(bind ? bind(ref) : {})}>
            <icosahedronGeometry args={args} />
            <meshStandardMaterial color={color || "#a78bfa"} roughness={0.1} metalness={0.1} />
        </mesh>
    );
}

function Mickey({ position, color, materialProps }) {
    const [ref] = useCompoundBody(() => ({
        mass: 1,
        linearDamping: 0.5,
        angularDamping: 0.5,
        position,
        shapes: [
            { type: 'Sphere', args: [0.6], position: [0, 0, 0] }, // Head
            { type: 'Sphere', args: [0.35], position: [-0.5, 0.5, 0] }, // Left Ear
            { type: 'Sphere', args: [0.35], position: [0.5, 0.5, 0] }  // Right Ear
        ],
        material: materialProps
    }));
    const bind = useDrag();

    // Default mickey is yellow/amber.
    const baseColor = color || "#fcd34d";

    return (
        <group ref={ref} {...(bind ? bind(ref) : {})}>
            {/* Head */}
            <mesh castShadow receiveShadow>
                <sphereGeometry args={[0.6]} />
                <meshStandardMaterial color={baseColor} roughness={0.1} metalness={0.1} />
            </mesh>
            {/* Left Ear */}
            <mesh position={[-0.5, 0.5, 0]} castShadow receiveShadow>
                <sphereGeometry args={[0.35]} />
                <meshStandardMaterial color={baseColor} roughness={0.1} metalness={0.1} />
            </mesh>
            {/* Right Ear */}
            <mesh position={[0.5, 0.5, 0]} castShadow receiveShadow>
                <sphereGeometry args={[0.35]} />
                <meshStandardMaterial color={baseColor} roughness={0.1} metalness={0.1} />
            </mesh>
        </group>
    );
}

export default function SceneObjects({ objects, friction, restitution }) {
    const materialProps = { friction, restitution };

    return (
        <>
            {objects.map(obj => {
                if (obj.type === 'sphere') {
                    return <Sphere key={obj.id} position={obj.position} args={obj.args} color={obj.color} materialProps={materialProps} />;
                } else if (obj.type === 'box') {
                    return <Box key={obj.id} position={obj.position} args={obj.args} color={obj.color} materialProps={materialProps} />;
                } else if (obj.type === 'polyhedron') {
                    return <Polyhedron key={obj.id} position={obj.position} args={obj.args} color={obj.color} materialProps={materialProps} />;
                } else if (obj.type === 'mickey') {
                    return <Mickey key={obj.id} position={obj.position} color={obj.color} materialProps={materialProps} />;
                }
                return null;
            })}
        </>
    );
}
