import React from "react";
import StarfieldBackground from "./StarfieldBackground.tsx";

const Hero: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center h-[100vh] w-[100%]">
      <StarfieldBackground />
    </div>
  );
};

export default Hero;
