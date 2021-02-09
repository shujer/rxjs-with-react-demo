import React, { useCallback, useEffect, useRef } from "react";
import { animationFrameScheduler, fromEvent, of } from "rxjs";
import { concatMap, filter, repeat, takeWhile, map } from "rxjs/operators";
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
  const delRef = useRef<HTMLDivElement>(null);
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
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    let sub = fromEvent(delRef.current!, "click")
      .pipe(
        concatMap((e) =>
          of(
            (e.target as HTMLDivElement).dataset.action as Action,
            animationFrameScheduler
          ).pipe(
            filter((action) => !!action),
            map(run),
            repeat(MAX_LEN),
            takeWhile((r) => r)
          )
        )
      )
      .subscribe();
    return () => sub.unsubscribe();
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
