import React from "react";
import { FocusTimerState, AppTheme } from "./types";
import { Search, Sun, Moon, Settings, Play, Pause, Timer } from "lucide-react";

interface Props {
  theme: AppTheme;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onOpenPrefs: () => void;
  focusTimer: FocusTimerState;
  onToggleFocusTimer: () => void;
}

const formatTime = (s: number) => {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

const TopBar: React.FC<Props> = ({
  theme,
  onToggleTheme,
  onOpenSearch,
  onOpenPrefs,
  focusTimer,
  onToggleFocusTimer,
}) => {
  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-5 border-b border-app bg-surface/80 backdrop-blur-sm">
      <button
        onClick={onOpenSearch}
        className="flex items-center gap-2 text-sm text-app-tertiary bg-app-muted hover:bg-app-muted-hover rounded-lg px-3 py-1.5 w-72 transition-colors"
      >
        <Search size={14} />
        <span className="flex-1 text-left">Search pins, tabs...</span>
        <kbd className="text-[10px] font-mono bg-app-elevated px-1.5 py-0.5 rounded border border-app">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleFocusTimer}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            focusTimer.isActive
              ? "accent-bg text-white"
              : "bg-app-muted text-app-secondary hover:bg-app-muted-hover"
          }`}
        >
          {focusTimer.isActive ? <Pause size={14} /> : <Timer size={14} />}
          <span className="font-mono tabular-nums">
            {formatTime(focusTimer.timeLeft)}
          </span>
        </button>

        <button
          onClick={onToggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-app-secondary hover:bg-app-muted transition-colors"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          onClick={onOpenPrefs}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-app-secondary hover:bg-app-muted transition-colors"
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
