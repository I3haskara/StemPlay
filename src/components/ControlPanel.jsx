export default function ControlPanel({ mass, setMass, gravity, setGravity, themeStyles }) {
  return (
    <div className={`${themeStyles.panel} p-8 rounded-xl w-96 space-y-8`}>
      <h2 className={`text-3xl font-semibold ${themeStyles.text}`}>Controls</h2>

      <div>
        <label className={`text-2xl ${themeStyles.text} font-medium`}>Mass: {mass} kg</label>
        <input
          type="range"
          min="1"
          max="10"
          step="0.1"
          value={mass}
          onChange={(e) => setMass(parseFloat(e.target.value))}
          className="w-full h-3 mt-3"
        />
      </div>

      <div>
        <label className={`text-2xl ${themeStyles.text} font-medium`}>Gravity: {gravity} g</label>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={gravity}
          onChange={(e) => setGravity(parseFloat(e.target.value))}
          className="w-full h-3 mt-3"
        />
      </div>
    </div>
  );
}
