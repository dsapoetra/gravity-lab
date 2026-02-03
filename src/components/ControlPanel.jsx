import { Circle, Square, Hexagon, Trash2, ArrowUp, Zap, Smile } from 'lucide-react';

export default function ControlPanel({
    onAddCircle, onAddBox, onAddPolygon, onAddMickey, onClear,
    gravity, setGravity,
    selectedColor, setSelectedColor,
    friction, setFriction,
    restitution, setRestitution,
    isAntiGravity, toggleAntiGravity
}) {
    return (
        <div className="w-[28rem] flex flex-col gap-5 select-none bg-white/90 backdrop-blur-xl border-4 border-white shadow-2xl rounded-3xl p-5 transition-all">
            <PanelHeader
                isAntiGravity={isAntiGravity}
                toggleAntiGravity={toggleAntiGravity}
                onClear={onClear}
            />

            <div className="space-y-4 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <PhysicsSlider
                    label="Gravity"
                    value={gravity}
                    setValue={setGravity}
                    max={2}
                    step={0.1}
                    color="blue"
                    iconColor="bg-blue-400"
                />
                <PhysicsSlider
                    label="Friction"
                    value={friction}
                    setValue={setFriction}
                    max={1}
                    step={0.05}
                    color="indigo"
                    iconColor="bg-indigo-400"
                    style={{ '--primary': '#818cf8', '--secondary': '#6366f1' }}
                />
                <PhysicsSlider
                    label="Bounciness"
                    value={restitution}
                    setValue={setRestitution}
                    max={1.2}
                    step={0.1}
                    color="pink"
                    iconColor="bg-pink-400"
                    style={{ '--primary': '#ec4899', '--secondary': '#db2777' }}
                />
            </div>

            <ColorPicker
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
            />

            <SpawnerGrid
                onAddCircle={onAddCircle}
                onAddBox={onAddBox}
                onAddPolygon={onAddPolygon}
                onAddMickey={onAddMickey}
            />
        </div>
    );
}

function PanelHeader({ isAntiGravity, toggleAntiGravity, onClear }) {
    return (
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-700 tracking-tight">
                Gravity Lab
            </h2>
            <div className="flex gap-2">
                <HeaderButton
                    onClick={toggleAntiGravity}
                    active={isAntiGravity}
                    activeClass="bg-amber-400 border-amber-600 text-white shadow-amber-200"
                    inactiveClass="bg-slate-100 border-slate-300 text-slate-400"
                    title="Toggle Anti-Gravity"
                >
                    {isAntiGravity ? <ArrowUp size={22} strokeWidth={3} /> : <Zap size={22} strokeWidth={3} />}
                </HeaderButton>
                <HeaderButton
                    onClick={onClear}
                    active={true}
                    activeClass="bg-rose-400 border-rose-600 text-white shadow-rose-200 hover:bg-rose-500"
                    inactiveClass=""
                    title="Clear All"
                >
                    <Trash2 size={22} strokeWidth={3} />
                </HeaderButton>
            </div>
        </div>
    );
}

function HeaderButton({ onClick, active, activeClass, inactiveClass, children, title }) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`p-2.5 rounded-xl transition-all border-b-4 active:border-b-0 active:translate-y-1 shadow-lg ${active ? activeClass : inactiveClass}`}
        >
            {children}
        </button>
    );
}

function PhysicsSlider({ label, value, setValue, max, step, color, iconColor, style }) {
    const textColor = `text-${color}-500`;
    const borderColor = `border-${color}-100`;

    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${iconColor}`}></span>
                    {label}
                </div>
                <span className={`bg-white px-2 py-0.5 rounded-lg ${textColor} shadow-sm border ${borderColor} min-w-[3rem] text-center`}>
                    {value.toFixed(step < 0.1 ? 2 : 1)}
                </span>
            </div>
            <input
                type="range"
                min="0"
                max={max}
                step={step}
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value))}
                style={style}
            />
        </div>
    );
}

function SpawnerGrid({ onAddCircle, onAddBox, onAddPolygon, onAddMickey }) {
    return (
        <div className="grid grid-cols-3 gap-3">
            <SpawnerButton
                onClick={onAddCircle}
                icon={Circle}
                label="Ball"
                colorClass="bg-cyan-400 border-cyan-600 shadow-cyan-200 hover:bg-cyan-500"
            />
            <SpawnerButton
                onClick={onAddBox}
                icon={Square}
                label="Box"
                colorClass="bg-indigo-400 border-indigo-600 shadow-indigo-200 hover:bg-indigo-500"
            />
            <SpawnerButton
                onClick={onAddPolygon}
                icon={Hexagon}
                label="Poly"
                colorClass="bg-violet-400 border-violet-600 shadow-violet-200 hover:bg-violet-500"
            />
            <SpawnerButton
                onClick={onAddMickey}
                icon={Smile}
                label="Mickey"
                colorClass="bg-amber-400 border-amber-600 shadow-amber-200 hover:bg-amber-500"
            />
        </div>
    );
}

function SpawnerButton({ onClick, icon: Icon, label, colorClass }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-1.5 p-3 text-white rounded-2xl border-b-4 shadow-lg active:border-b-0 active:translate-y-1 transition-all ${colorClass}`}
        >
            <Icon size={28} strokeWidth={3} className="drop-shadow-md" />
            <span className="text-xs font-bold leading-none">{label}</span>
        </button>
    );
}

function ColorPicker({ selectedColor, setSelectedColor }) {
    const colors = [
        '#ef4444', // Red
        '#f97316', // Orange
        '#f59e0b', // Amber
        '#84cc16', // Lime
        '#22d3ee', // Cyan
        '#3b82f6', // Blue
        '#8b5cf6', // Violet
        '#ec4899'  // Pink
    ];

    return (
        <div className="w-full min-h-[6rem] bg-white/50 py-4 px-4 rounded-3xl border border-white/50 flex justify-center items-center gap-4 overflow-x-auto shadow-inner no-scrollbar">
            {colors.map(color => (
                <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-full flex-shrink-0 transition-transform hover:scale-110 ${selectedColor === color ? 'ring-4 ring-white shadow-xl scale-110' : 'opacity-80 hover:opacity-100'}`}
                    style={{
                        backgroundColor: color,
                        width: '3.5rem',
                        height: '3.5rem',
                        minWidth: '3.5rem',
                        minHeight: '3.5rem'
                    }}
                    title={color}
                    aria-label={`Select color ${color}`}
                />
            ))}
        </div>
    );
}
