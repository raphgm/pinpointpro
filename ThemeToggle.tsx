import React from "react";
import { AppTheme } from "./types";
import { Sun, Moon } from "lucide-react";

interface Props {
  theme: AppTheme;
  onToggle: () => void;
  isMobile?: boolean;
}

const ThemeToggle: React.FC<Props> = ({ theme, onToggle, isMobile }) => {
  const isDark = theme === "dark";
  return (
    <button
      onClick={onToggle}
      className="group relative p-1.5 transition-all flex flex-col items-center"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 border ${
          isDark
            ? "bg-white/5 border-white/10 text-amber-300"
            : "bg-slate-900/10 border-slate-300 text-amber-500"
        }`}
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </div>
      {isMobile && (
        <span className="text-[8px] font-bold uppercase mt-1 text-slate-400">
          {isDark ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
