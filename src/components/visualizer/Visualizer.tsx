import React, { useEffect, useRef } from "react";
import p5 from "p5";
import "p5/lib/addons/p5.sound";

interface Props {
  color: string;
}

const Visualizer: React.FC<Props> = ({ color }) => {
  const app = useRef<any>(null);
  let fft: p5.AudioIn;

  useEffect(() => {
    const newp5 = new p5((p) => {
      p.setup = () => {
        p.createCanvas(500, 500);
        p.background(0);
        fft = new p5.AudioIn();
        fft.start();
      };

      p.draw = () => {
        p.fill(255, 255, 255, 255);
        p.noStroke();
        p.ellipse(fft.getLevel(), 50, 40, 40);
      };
    }, app.current);

    return () => {
      newp5.remove();
    };
  }, []);

  return <div ref={app}></div>;
};

export default Visualizer;
