import { Circle, Square, Hexagon, Trash2, ArrowUp, Zap } from 'lucide-react';

export default function ControlPanel({
    onAddCircle,
    onAddBox,
    onAddPolygon,
    onClear,
    gravity,
    setGravity,
    friction,
    setFriction,
    restitution,
    setRestitution,
    isAntiGravity,
    toggleAntiGravity
}) {
    return (
        <div className="panel w-80 flex flex-col gap-6 transition-all hover:translate-y-1 select-none bg-slate-800/80 backdrop-blur-md border border-slate-700 shadow-xl">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Gravity Lab 3D
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={toggleAntiGravity}
                        className={`p-2 rounded-lg transition-colors ${isAntiGravity ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : 'bg-slate-800/50 text-slate-400'}`}
                        title="Toggle Anti-Gravity"
                    >
                        {isAntiGravity ? <ArrowUp size={20} /> : <Zap size={20} />}
                    </button>
                    <button
                        onClick={onClear}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                        title="Clear All"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            {/* Physics Parameters */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-400">
                        <span>Gravity Strength</span>
                        <span>{gravity.toFixed(1)}x</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={gravity}
                        onChange={(e) => setGravity(parseFloat(e.target.value))}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-400">
                        <span>Friction</span>
                        <span>{friction.toFixed(2)}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={friction}
                        onChange={(e) => setFriction(parseFloat(e.target.value))}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-400">
                        <span>Bounciness</span>
                        <span>{restitution.toFixed(2)}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1.2"
                        step="0.1"
                        value={restitution}
                        onChange={(e) => setRestitution(parseFloat(e.target.value))}
                    />
                </div>
            </div>

            {/* Spawners */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-700/50">
                <button
                    onClick={onAddCircle}
                    className="flex flex-col items-center gap-2 p-3 hover:bg-cyan-500/10 hover:border-cyan-500/30"
                >
                    <Circle size={24} className="text-cyan-400" />
                    <span className="text-xs font-medium">Sphere</span>
                </button>
                <button
                    onClick={onAddBox}
                    className="flex flex-col items-center gap-2 p-3 hover:bg-indigo-500/10 hover:border-indigo-500/30"
                >
                    <Square size={24} className="text-indigo-400" />
                    <span className="text-xs font-medium">Box</span>
                </button>
                <button
                    onClick={onAddPolygon}
                    className="flex flex-col items-center gap-2 p-3 hover:bg-purple-500/10 hover:border-purple-500/30"
                >
                    <Hexagon size={24} className="text-purple-400" />
                    <span className="text-xs font-medium">Poly</span>
                </button>
            </div>
        </div>
    );
}
