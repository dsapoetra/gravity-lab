import { useState, useRef } from 'react'
import PhysicsCanvas from './components/PhysicsCanvas'
import ControlPanel from './components/ControlPanel'

function App() {
  const [gravity, setGravity] = useState(1)
  const [friction, setFriction] = useState(0.5)
  const [restitution, setRestitution] = useState(0.7)
  const [isAntiGravity, setIsAntiGravity] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#22d3ee') // Default Cyan

  const canvasRef = useRef()

  return (
    // Grid Layout: Both children occupy the same cell (row 1, col 1) enabling perfect stacking
    <div className="grid grid-cols-1 grid-rows-1 w-screen h-screen overflow-hidden">

      {/* Layer 1: Physics Canvas (Background) */}
      <div className="col-start-1 row-start-1 z-0 relative">
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
      <div className="col-start-1 row-start-1 z-50 pointer-events-none relative p-6 flex flex-col justify-between">

        {/* Top Right: Control Panel */}
        <div className="flex justify-end pointer-events-auto">
          <ControlPanel
            gravity={gravity} setGravity={setGravity}
            friction={friction} setFriction={setFriction}
            restitution={restitution} setRestitution={setRestitution}
            isAntiGravity={isAntiGravity} toggleAntiGravity={() => setIsAntiGravity(!isAntiGravity)}
            selectedColor={selectedColor} setSelectedColor={setSelectedColor}
            onAddCircle={() => canvasRef.current?.addSphere(selectedColor)}
            onAddBox={() => canvasRef.current?.addBox(selectedColor)}
            onAddPolygon={() => canvasRef.current?.addPolyhedron(selectedColor)}
            onAddMickey={() => canvasRef.current?.addMickey(selectedColor)}
            onClear={() => canvasRef.current?.clearWorld()}
          />
        </div>

        {/* Bottom Left: Footer */}
        <div className="pointer-events-none text-slate-500 font-medium text-sm select-none bg-white/50 backdrop-blur-sm self-start px-4 py-2 rounded-full shadow-sm">
          <p>Left Click to Rotate • Right Click to Pan • Scroll to Zoom</p>
        </div>

      </div>
    </div>
  )
}

export default App
