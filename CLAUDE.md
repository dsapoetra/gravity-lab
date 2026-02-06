# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Architecture

Gravity Lab is a kid-friendly 3D physics sandbox built with React, Three.js, and Cannon.js.

### Core Stack
- **React Three Fiber** (@react-three/fiber) - React renderer for Three.js
- **React Three Cannon** (@react-three/cannon) - Physics engine bindings using Cannon.js
- **React Three Drei** (@react-three/drei) - Helper components (OrbitControls, Environment, Sky)
- **Tailwind CSS v4** - Styling with Fredoka font for kid-friendly UI

### Component Structure

**App.jsx** - Root component managing physics parameters (gravity, friction, restitution) and color selection. Uses grid-based layout with canvas as background layer and UI overlay on top.

**PhysicsCanvas.jsx** - Three.js canvas with physics world. Exposes methods via `forwardRef`/`useImperativeHandle` for spawning objects:
- `addSphere(color)`, `addBox(color)`, `addPolyhedron(color)`, `addMickey(color)`
- `clearWorld()`

Contains `Floor` and `Walls` components that create a 40x40 bounded playpen with invisible physics planes.

**SceneObjects.jsx** - Renders physics-enabled shapes (Sphere, Box, Polyhedron, Mickey). Each shape uses the appropriate Cannon hook (`useSphere`, `useBox`, `useCompoundBody`). Mickey is a compound body with 3 spheres (head + 2 ears).

**DragController.jsx** - Implements drag-and-drop for physics objects using a kinematic sphere cursor and point-to-point constraints. Provides `useDrag` hook via React Context.

**ControlPanel.jsx** - UI panel with physics sliders, color picker, and shape spawner buttons. Uses glassmorphism styling.

### Physics Flow
1. User clicks spawner button in ControlPanel
2. App calls method on PhysicsCanvas ref (e.g., `canvasRef.current.addSphere(color)`)
3. PhysicsCanvas adds object to state with random position at y=10
4. SceneObjects renders the physics body which falls under gravity
5. DragController enables picking up and moving objects via mouse
