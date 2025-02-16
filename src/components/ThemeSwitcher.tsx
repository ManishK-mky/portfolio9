import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { Palette, Clock } from "lucide-react";

const ThemeSwitcher: React.FC = () => {
  const { setTheme, themeNames } = useTheme();
  const [currentTime, setCurrentTime] = useState(getFormattedDateTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getFormattedDateTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function getFormattedDateTime() {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: "long" };
    const dayName = new Intl.DateTimeFormat("en-US", options).format(date);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours() % 12 || 12;
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";

    return `${dayName}, ${day}/${month}/${year} - ${hours}:${minutes} ${ampm}`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-4 z-50 bg-white/10 backdrop-blur-md rounded-lg p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <Palette className="w-5 h-5 text-white" />
        <span className="text-white text-sm">Theme</span>
      </div>
      <div className="flex gap-2 mb-2">
        {themeNames.map((themeName) => (
          <motion.button
            key={themeName}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(themeName)}
            className="w-8 h-8 rounded-full capitalize text-xs text-white"
            style={{ backgroundColor: `var(--${themeName}-primary)` }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 text-white text-sm">
        <Clock className="w-5 h-5" />
        <span>{currentTime}</span>
      </div>
    </motion.div>
  );
};

export default ThemeSwitcher;
