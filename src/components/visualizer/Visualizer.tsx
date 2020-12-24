import React, { useEffect, useRef } from "react";
import p5 from "p5";
import "p5/lib/addons/p5.sound";
import "./Visualizer.css";

interface Props {
  on: boolean;
}

const Visualizer: React.FC<Props> = ({ on }) => {
  const app = useRef<any>(null);
  const mic = useRef<any>(null);

  useEffect(() => {
    const newp5 = new p5((p: p5) => {
      p.touchStarted = () => {
        new AudioContext().resume().then(() => console.log("Done..."));
      };

      p.setup = () => {
        p.createCanvas(500, 500);
        mic.current = new p5.AudioIn();
        if (on) {
          mic.current.start();
        } else {
          mic.current.stop();
        }
      };

      p.draw = () => {
        p.background(255);
        const vol = mic.current.getLevel();
        p.noStroke();
        p.ellipse(250, 250, vol * 200, vol * 200);
        p.fill(96, 96, 252);
      };
    }, app.current);

    return () => {
      newp5.remove();
    };
  }, [on]);

  return <>{on ? <div ref={app} /> : null}</>;
};

export default Visualizer;
