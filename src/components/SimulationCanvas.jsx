import { useEffect, useRef } from "react";
import Matter from "matter-js";

export default function SimulationCanvas() {
  const sceneRef = useRef(null);

  useEffect(() => {
    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 400,
        background: "#f0f4f8",
        wireframes: false
      }
    });

    // Demo: Ball + Ground
    const ball = Matter.Bodies.circle(200, 50, 30, {
      restitution: 0.8,
      render: { fillStyle: "#3b82f6" }
    });

    const ground = Matter.Bodies.rectangle(400, 380, 800, 40, {
      isStatic: true,
      render: { fillStyle: "#1e293b" }
    });

    Matter.World.add(engine.world, [ball, ground]);

    Matter.Engine.run(engine);
    Matter.Render.run(render);

    return () => {
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return <div ref={sceneRef} className="flex justify-center" />;
}
