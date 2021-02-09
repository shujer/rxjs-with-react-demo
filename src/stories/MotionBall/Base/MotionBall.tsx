import React, { useCallback, useEffect, useRef } from "react";
import styles from "../motion-ball.module.css";

const XYFactor = {
  UP: [0, -1],
  DOWN: [0, 1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
};
type Action = keyof typeof XYFactor;

const step = 2;
const MAX_LEN = 300;

export interface MotionBallProps {}

export const MotionBall: React.FC<MotionBallProps> = () => {
  const ballRf = useRef<HTMLDivElement>(null);
  const delRef = useRef<HTMLDListElement>(null);
  const position = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const run = useCallback((action: Action) => {
    console.log("run: ", action);
    const factor = XYFactor[action];
    let x = factor[0] * step + position.current.x;
    let y = factor[1] * step + position.current.y;
    if (x >= 0 && x <= MAX_LEN && y >= 0 && y <= MAX_LEN) {
      ballRf.current!.style.left = `${x}px`;
      ballRf.current!.style.top = `${y}px`;
      position.current.x = x;
      position.current.y = y;
      if (x - y !== 0 && x + y !== MAX_LEN) {
        requestAnimationFrame(() => run(action));
      }
    }
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const action = (e.target as HTMLDivElement)?.dataset?.action as Action;
      if (action) {
        run(action);
      }
    };
    const delegate = delRef.current;
    delegate?.addEventListener("click", move);
    return () => {
      delegate?.removeEventListener("click", move);
    };
  }, [run]);

  return (
    <div className={styles.container}>
      <div className={styles.canvas}>
        <div className={styles.ball} ref={ballRf}></div>
      </div>
      <div className={styles.toolbar} ref={delRef}>
        <button data-action="UP">UP</button>
        <button data-action="DOWN">DOWN</button>
        <button data-action="LEFT">LEFT</button>
        <button data-action="RIGHT">RIGHT</button>
      </div>
    </div>
  );
};
