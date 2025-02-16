import React, { createContext, useContext, useState } from "react";

type Theme = {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
};

const themes: Record<string, Theme> = {
  purple: {
    primary: "#6366F1",
    secondary: "#4F46E5",
    background: "#1E1B4B",
    text: "#E0E7FF",
    accent: "#818CF8",
  },
  blue: {
    primary: "#3B82F6",
    secondary: "#2563EB",
    background: "#1E3A8A",
    text: "#DBEAFE",
    accent: "#60A5FA",
  },
  green: {
    primary: "#10B981",
    secondary: "#059669",
    background: "#064E3B",
    text: "#D1FAE5",
    accent: "#34D399",
  },
  red: {
    primary: "#EF4444",
    secondary: "#DC2626",
    background: "#7F1D1D",
    text: "#FEE2E2",
    accent: "#F87171",
  },
  orange: {
    primary: "#F97316",
    secondary: "#EA580C",
    background: "#7C2D12",
    text: "#FFEDD5",
    accent: "#FB923C",
  },
};

type ThemeContextType = {
    currentTheme: Theme;
    setTheme: (themeName: string) => void;
    themeNames: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentTheme , setCurrentTheme] = useState<Theme>(themes.purple);

    const setTheme = (themeName: string) => {
        setCurrentTheme(themes[themeName])
    }

    return (
        <ThemeContext.Provider value={{ currentTheme, setTheme , themeNames: Object.keys(themes)}}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if(!context){
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context;
}