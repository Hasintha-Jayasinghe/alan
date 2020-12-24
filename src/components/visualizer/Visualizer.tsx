import React, { useEffect, useRef } from "react";
import p5 from "p5";
import "p5/lib/addons/p5.sound";

interface Props {
  on: boolean;
}

const Visualizer: React.FC<Props> = ({ on }) => {
  const app = useRef<any>(null);
  let mic: p5.AudioIn;

  useEffect(() => {
    const newp5 = new p5((p: p5) => {
      p.setup = () => {
        p.createCanvas(500, 500);
        mic = new p5.AudioIn();
        if (on) {
          mic.start();
        } else {
          mic.stop();
        }
      };

      p.draw = () => {
        p.background(255);
        const vol = mic.getLevel();
        p.noStroke();
        p.ellipse(250, 250, vol * 200, vol * 200);
        p.fill(96, 96, 252);
      };
    }, app.current);

    return () => {
      newp5.remove();
    };
  }, [on]);

  return <div ref={app}></div>;
};

export default Visualizer;
