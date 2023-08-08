import { useMemo, useState, useEffect } from "react";
import "./Waves.scss";

function rand(y: number, dy: number): number {
  return y + (Math.random() * 2 - 1) * dy;
}

function Wave() {
  const offset = useMemo(() => rand(90, 5), []);
  const phase = useMemo(() => [rand(0, 100), rand(0, 100), rand(0, 100), rand(0, 100), rand(0, 100)], []);
  const speed = useMemo(() => [rand(0, 1), rand(0, 1), rand(0, 1), rand(0, 1), rand(0, 1)], []);
  const scale = useMemo(() => [rand(0, 5), rand(0, 10), rand(0, 5), rand(0, 10), rand(0, 5)], []);
  const [points, setPoints] = useState([50, 50, 50, 50, 50]);

  const path = useMemo(() => {
    let d = "M -30," + points[0] + " S ";
    const l = points.length;
    const dx = 160 / (l - 1);
    for (let i = 0; i < l; ++i) {
      d += dx * i - 30 + "," + points[i] + " ";
    }

    d += "130," + points[l - 1];
    return d;
  }, [points]);

  useEffect(() => {
    const f = () => {
      const t = new Date().getTime() / 100000;
      const o: number[] = [];
      const l = phase.length;
      for (let i = 0; i < l; ++i) {
        o[i] = offset + Math.sin(t * speed[i] + phase[i]) * scale[1];
      }
      setPoints(o);

      setTimeout(() => {
        requestAnimationFrame(f);
      }, 200);
    };
    requestAnimationFrame(f);
  }, [offset, phase, scale, speed]);

  const p = (offset: number, opacity: number) => (
    <g transform={`translate(0, ${offset})`}>
      <path d={path} stroke="currentColor" strokeWidth={1} strokeOpacity={opacity} fill="none" />
    </g>
  );

  return (
    <svg width="100%" viewBox="0 0 100 100">
      {p(0, 0.2)}
      {p(1, 0.16)}
      {p(2, 0.13)}
      {p(3, 0.1)}
      {p(4, 0.06)}
      {p(5, 0.03)}
    </svg>
  );
}

function Waves() {
  return (
    <div className="waves">
      <Wave />
      <Wave />
      <Wave />
    </div>
  );
}

export default Waves;
