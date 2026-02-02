import { useState, useRef } from 'react'
import PhysicsCanvas from './components/PhysicsCanvas'
import ControlPanel from './components/ControlPanel'

function App() {
  const [gravity, setGravity] = useState(1)
  const [friction, setFriction] = useState(0.5)
  const [restitution, setRestitution] = useState(0.7)
  const [isAntiGravity, setIsAntiGravity] = useState(false)

  const canvasRef = useRef()

  return (
    // Grid Layout: Both children occupy the same cell (row 1, col 1) enabling perfect stacking
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gridTemplateRows: '1fr', width: '100vw', height: '100vh', overflow: 'hidden', background: '#0f172a' }}>

      {/* Layer 1: Physics Canvas (Background) */}
      <div style={{ gridArea: '1 / 1', zIndex: 0, position: 'relative' }}>
        <PhysicsCanvas
          ref={canvasRef}
          gravity={gravity}
          friction={friction}
          restitution={restitution}
          isAntiGravity={isAntiGravity}
        />
      </div>

      {/* Layer 2: UI Overlay (Foreground) */}
      {/* pointer-events-none ensures clicks pass through to canvas where there are no buttons */}
      <div style={{ gridArea: '1 / 1', zIndex: 100, pointerEvents: 'none', position: 'relative', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

        {/* Top Right: Control Panel */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', pointerEvents: 'auto' }}>
          <ControlPanel
            gravity={gravity} setGravity={setGravity}
            friction={friction} setFriction={setFriction}
            restitution={restitution} setRestitution={setRestitution}
            isAntiGravity={isAntiGravity} toggleAntiGravity={() => setIsAntiGravity(!isAntiGravity)}
            onAddCircle={() => canvasRef.current?.addSphere()}
            onAddBox={() => canvasRef.current?.addBox()}
            onAddPolygon={() => canvasRef.current?.addPolyhedron()}
            onClear={() => canvasRef.current?.clearWorld()}
          />
        </div>

        {/* Bottom Left: Footer */}
        <div style={{ pointerEvents: 'none', color: '#64748b', fontSize: '0.875rem', userSelect: 'none' }}>
          <p>Left Click to Rotate • Right Click to Pan • Scroll to Zoom</p>
        </div>

      </div>
    </div>
  )
}

export default App
