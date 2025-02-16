import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext"; // Adjust the import path

const cols = 4;
const rows = 4;
const labels = [
  "HTML", "CSS", "JS", "React",
  "Node.js", "GitHub", "Git", "GitLab",
  "MongoDB", "WebSockets", "Express", "Next.js",
  "Redux", "Tailwind", "Vite", "-"
];

const SlidingPuzzle = () => {
  const { currentTheme } = useTheme(); // Get theme colors from context
  const [board, setBoard] = useState<any>([]);

  useEffect(() => {
    let initialBoard = Array.from({ length: 16 }, (_, i) => i);
    initialBoard = shuffle(initialBoard);
    setBoard(initialBoard);
  }, []);

  const shuffle = (arr:any) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const moveTile = (index:any) => {
    const blankIndex = board.indexOf(15); // Empty tile index
    const [i, j] = [Math.floor(index / cols), index % cols];
    const [blankI, blankJ] = [Math.floor(blankIndex / cols), blankIndex % cols];

    if ((Math.abs(i - blankI) === 1 && j === blankJ) || (Math.abs(j - blankJ) === 1 && i === blankI)) {
      const newBoard = [...board];
      [newBoard[index], newBoard[blankIndex]] = [newBoard[blankIndex], newBoard[index]];
      setBoard(newBoard);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: "", color: currentTheme.text }}>
      <div
        className="grid gap-1 p-2 rounded-lg shadow-xl"
        style={{
          gridTemplateColumns: `repeat(${cols}, 100px)`,
          backgroundColor: currentTheme.background,
          border: `2px solid ${currentTheme.primary}`,
        }}
      >
        {board.map((tileIndex:any, idx:any) => (
          <div
            key={idx}
            onClick={() => moveTile(idx)}
            className="flex items-center justify-center w-[100px] h-[100px] rounded-lg shadow-md border cursor-pointer 
              hover:scale-105 transition-all"
            style={{
              backgroundColor: tileIndex === 15 ? currentTheme.accent : currentTheme.secondary,
              color: currentTheme.text,
              borderColor: currentTheme.text,
            }}
          >
            {tileIndex === 15 ? "" : labels[tileIndex]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlidingPuzzle;
