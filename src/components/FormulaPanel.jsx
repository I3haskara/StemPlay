export default function FormulaPanel({ mass, gravity, height, themeStyles }) {
  const force = (mass * gravity).toFixed(2);
  const potentialEnergy = (mass * gravity * height).toFixed(2);

  return (
    <div className={`${themeStyles.formula} p-8 rounded-xl font-mono space-y-6 w-96`}>
      <h2 className="text-3xl font-bold tracking-wide">Lab Readings</h2>

      <div>
        <p className="opacity-70 text-xl">Force</p>
        <p className="text-2xl font-bold mt-2">F = m × g = {force} N</p>
      </div>

      <div>
        <p className="opacity-70 text-xl">Potential Energy</p>
        <p className="text-2xl font-bold mt-2">PE = {potentialEnergy} J</p>
      </div>

      <div>
        <p className="opacity-70 text-xl">Mass</p>
        <p className="text-2xl font-bold mt-2">{mass} kg</p>
      </div>

      <div>
        <p className="opacity-70 text-xl">Gravity</p>
        <p className="text-2xl font-bold mt-2">{gravity} m/s²</p>
      </div>

      <div>
        <p className="opacity-70 text-xl">Height</p>
        <p className="text-2xl font-bold mt-2">{height.toFixed(2)} m</p>
      </div>
    </div>
  );
}
