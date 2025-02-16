import React, { useEffect, useState } from "react";
import Sketch, { SketchProps } from "react-p5";
import p5Types from "p5";

let stars: Star[] = [];
let speed = 4;

class Star {
  x: number;
  y: number;
  z: number;
  pz: number;

  constructor(p5: p5Types) {
    this.x = p5.random(-250, 250);
    this.y = p5.random(-250, 250);
    this.z = p5.random(500);
    this.pz = this.z;
  }

  update(p5: p5Types) {
    this.z -= speed;
    if (this.z < 1) {
      this.z = 500;
      this.x = p5.random(-250, 250);
      this.y = p5.random(-250, 250);
      this.pz = this.z;
    }
  }

  show(p5: p5Types) {
    let sx = p5.map(this.x / this.z, 0, 1, 0, 500);
    let sy = p5.map(this.y / this.z, 0, 1, 0, 500);
    let r = p5.map(this.z, 0, 500, 4, 0);
    
    let px = p5.map(this.x / this.pz, 0, 1, 0, 500);
    let py = p5.map(this.y / this.pz, 0, 1, 0, 500);
    this.pz = this.z;

    p5.stroke(255);
    p5.strokeWeight(r);
    p5.line(px, py, sx, sy);
  }
}

const StarfieldBackground: React.FC = () => {
  const [currentText, setCurrentText] = useState("Hello");
  const messages = ["I'm Manish", "A React Developer", "Next.js Enthusiast", "Full Stack Engineer" , "Currently working At" , "Appinventiv"];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setCurrentText(messages[index]);
      index = (index + 1) % messages.length; // Loop through messages
    }, 2000); // Change text every 2 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      stars = []; // Cleanup stars on unmount
    };
  }, []);

  const setup: SketchProps["setup"] = (p5: any, canvasParentRef: any) => {
    p5.createCanvas(800, 500).parent(canvasParentRef!);
    
    stars.length = 0; // Reset stars
    for (let i = 0; i < 1200; i++) {
      stars.push(new Star(p5));
    }
  };

  const draw = (p5: any) => {
    p5.background(0);
    p5.translate(p5.width / 2, p5.height / 2);

    stars.forEach((star) => {
      star.update(p5);
      star.show(p5);
    });
  };

  const windowResized: SketchProps["windowResized"] = (p5: any) => {
    p5.resizeCanvas(800, 500);
    
    stars.length = 0; // Recreate stars on resize
    for (let i = 0; i < 800; i++) {
      stars.push(new Star(p5));
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-black">
      <div className="relative w-[800px] h-[500px]">
        <Sketch setup={setup} draw={draw} windowResized={windowResized} />

        {/* Overlay Box with Animated Text */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-lg">
          <h1 className="text-5xl font-bold animate-fade-in">{currentText}</h1>
        </div>
      </div>
    </div>
  );
};

export default StarfieldBackground;
