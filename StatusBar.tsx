import React, { useState } from "react";
import {
  ColorTheme,
  FocusTimerState,
  TabData,
  SoundscapeType,
  WindowState,
  AppTheme,
} from "./types";
import { Pin } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import ColorStylePicker from "./ColorStylePicker";

interface Props {
  pinnedCount: number;
  focusMode: boolean;
  currentTheme: ColorTheme;
  theme: AppTheme;
  onToggleTheme: () => void;
  accentColor: string;
  onAccentChange: (color: string) => void;
  focusTimer: FocusTimerState;
  archivedTabs?: TabData[];
  onRestoreTab?: (tab: TabData) => void;
  onToggleFocusTimer: () => void;
  onThemeChange: (theme: ColorTheme) => void;
  onOpenPrefs: () => void;
  onOpenWorkspaces: () => void;
  onOpenAssistant: () => void;
  onOpenSearch: () => void;
  onOpenEcho: () => void;
  isMobile: boolean;
  soundscape: SoundscapeType;
  onSoundscapeChange: (sound: SoundscapeType) => void;
  soundscapeVolume: number;
  onSoundscapeVolumeChange: (volume: number) => void;
  closedWindows?: WindowState[];
  onRestoreWindow?: (id: string) => void;
}

const THEMES: ColorTheme[] = ["nebula", "sunrise", "ocean", "emerald"];
const THEME_ICONS: Record<ColorTheme, string> = {
  nebula: "🌌",
  sunrise: "🌅",
  ocean: "🌊",
  emerald: "🌲",
};

const StatusBar: React.FC<Props> = ({
  pinnedCount,
  focusMode,
  currentTheme,
  theme,
  onToggleTheme,
  accentColor,
  onAccentChange,
  focusTimer,
  archivedTabs = [],
  onRestoreTab,
  onToggleFocusTimer,
  onThemeChange,
  onOpenPrefs,
  onOpenWorkspaces,
  onOpenAssistant,
  onOpenSearch,
  onOpenEcho,
  isMobile,
  soundscape,
  onSoundscapeChange,
  soundscapeVolume,
  onSoundscapeVolumeChange,
  closedWindows = [],
  onRestoreWindow,
}) => {
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isSoundscapeMenuOpen, setIsSoundscapeMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const cycleTheme = () => {
    const currentIndex = THEMES.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    onThemeChange(THEMES[nextIndex]);
  };

  const containerClasses = isMobile
    ? "fixed bottom-0 left-0 right-0 z-[100] flex items-center justify-around px-2 py-4 glass border-t border-white/10"
    : "fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center space-x-2 px-3 py-1.5 glass rounded-full shadow-2xl transition-all duration-500 hover:py-2";

  return (
    <div className={containerClasses}>
      {!isMobile && (
        <>
          <div className="flex items-center space-x-2 px-2">
            <Pin className="w-3.5 h-3.5 text-blue-400 rotate-45" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              PinPoint
            </span>
          </div>
          <div className="h-4 w-px bg-white/10 mx-2" />
        </>
      )}

      <ThemeToggle theme={theme} onToggle={onToggleTheme} isMobile={isMobile} />
      <ColorStylePicker
        accentColor={accentColor}
        onChange={onAccentChange}
        isMobile={isMobile}
      />

      {/* Theme Selector Control */}
      <div className="relative flex flex-col items-center">
        <button
          onClick={() => {
            setIsThemeMenuOpen(!isThemeMenuOpen);
            setIsSoundscapeMenuOpen(false);
          }}
          className={`group relative p-1.5 transition-all flex flex-col items-center ${isMobile ? "order-first" : ""}`}
          title="Change Theme"
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 bg-white/5 border border-white/10 group-hover:border-white/20`}
            style={{ boxShadow: `0 0 15px var(--accent-1)40` }}
          >
            <span className="text-sm">{THEME_ICONS[currentTheme]}</span>
          </div>
          {isMobile && (
            <span className="text-[8px] font-bold uppercase mt-1 text-slate-400">
              Theme
            </span>
          )}
        </button>

        {isThemeMenuOpen && (
          <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-64 glass border border-white/10 rounded-2xl shadow-2xl p-4 overflow-hidden animate-in slide-in-from-bottom-2 duration-300 z-[1000] text-white">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Aesthetic Themes
              </h3>
              <span className="text-[8px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold">
                Ambient
              </span>
            </div>

            <div className="space-y-2">
              {THEMES.map((theme) => {
                const isActive = currentTheme === theme;
                let gradientClass = "";
                if (theme === "nebula")
                  gradientClass = "from-blue-500 via-indigo-500 to-pink-500";
                else if (theme === "sunrise")
                  gradientClass = "from-orange-500 via-red-500 to-pink-500";
                else if (theme === "ocean")
                  gradientClass = "from-cyan-500 via-teal-500 to-blue-500";
                else if (theme === "emerald")
                  gradientClass = "from-emerald-500 via-green-500 to-lime-500";

                return (
                  <button
                    key={theme}
                    onClick={() => {
                      onThemeChange(theme);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-[11px] font-bold transition-all text-left ${isActive ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-white/5 text-slate-400 hover:border-white/10 hover:text-white hover:bg-white/5"}`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-sm">{THEME_ICONS[theme]}</span>
                      <span className="capitalize font-semibold tracking-wide">
                        {theme}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-12 h-2 rounded-full bg-gradient-to-r ${gradientClass} opacity-85`}
                      />
                      {isActive && (
                        <span className="text-blue-400 text-[10px]">✓</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Soundscape Control */}
      <div className="relative flex flex-col items-center">
        <button
          onClick={() => {
            setIsSoundscapeMenuOpen(!isSoundscapeMenuOpen);
            setIsThemeMenuOpen(false);
          }}
          className={`group relative p-1.5 transition-all flex flex-col items-center`}
          title="Focus Soundscapes"
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 bg-white/5 border border-white/10 group-hover:border-white/20 ${soundscape !== "none" ? "text-blue-400 border-blue-500/30" : "text-slate-500"}`}
            style={{
              boxShadow:
                soundscape !== "none" ? `0 0 15px var(--accent-1)40` : "none",
            }}
          >
            <span className="text-sm">
              {soundscape === "none" ? "🔇" : "🔊"}
            </span>
          </div>
          {isMobile && (
            <span className="text-[8px] font-bold uppercase mt-1 text-slate-400">
              Audio
            </span>
          )}
        </button>

        {isSoundscapeMenuOpen && (
          <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-64 glass border border-white/10 rounded-2xl shadow-2xl p-4 overflow-hidden animate-in slide-in-from-top-2 duration-300 z-[1000] text-white">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Soundscape
              </h3>
              {soundscape !== "none" && (
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                  <span className="text-[8px] font-bold text-green-400 uppercase">
                    Playing
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Type Selection */}
              <div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "none", label: "Mute", icon: "🔇" },
                    { id: "ambient", label: "Ambient", icon: "🌌" },
                    { id: "lofi", label: "Lofi Keys", icon: "☕" },
                    { id: "nature", label: "Rain/Wind", icon: "🌲" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSoundscapeChange(item.id as SoundscapeType);
                      }}
                      className={`flex items-center space-x-2 p-2 rounded-xl border text-[10px] font-bold transition-all text-left ${soundscape === item.id ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-white/5 text-slate-400 hover:border-white/10 hover:text-white"}`}
                    >
                      <span>{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume Slider */}
              {soundscape !== "none" && (
                <div className="space-y-1 bg-white/5 p-2 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <span>Volume</span>
                    <span>{Math.round(soundscapeVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={soundscapeVolume}
                    onChange={(e) =>
                      onSoundscapeVolumeChange(parseFloat(e.target.value))
                    }
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {!isMobile && <div className="h-4 w-px bg-white/10 mx-2" />}

      {/* The Vault Button */}
      <div className="relative group">
        <button
          onClick={() => setIsVaultOpen(!isVaultOpen)}
          className={`px-3 py-1 rounded-full transition-all flex flex-col items-center ${isVaultOpen ? "text-blue-400" : "text-slate-500 hover:text-blue-300"}`}
        >
          <span className="text-lg md:text-xs">📜</span>
          <span className="text-[8px] font-bold uppercase mt-1">Vault</span>
          {(archivedTabs.length > 0 || closedWindows.length > 0) && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border border-slate-900 animate-pulse" />
          )}
        </button>

        {isVaultOpen && (
          <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-64 glass border border-white/10 rounded-2xl shadow-2xl p-4 overflow-hidden animate-in slide-in-from-top-2 duration-300 z-[1000] text-white">
            {/* Section 1: Closed Windows / App Launcher */}
            {closedWindows.length > 0 && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Launch Apps
                  </h3>
                  <span className="text-[8px] font-bold text-slate-600">
                    {closedWindows.length} Idle
                  </span>
                </div>
                <div className="space-y-1.5 max-h-40 overflow-auto no-scrollbar">
                  {closedWindows.map((win) => (
                    <div
                      key={win.id}
                      className="group/item flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5"
                    >
                      <div className="flex items-center space-x-2 min-w-0 pr-2">
                        <span className="text-xs">
                          {win.type === "canvas"
                            ? "🎨"
                            : win.type === "notes"
                              ? "📝"
                              : "📑"}
                        </span>
                        <p className="text-[10px] font-bold text-slate-300 truncate">
                          {win.title}
                        </p>
                      </div>
                      <button
                        onClick={() => onRestoreWindow?.(win.id)}
                        className="text-[9px] font-black uppercase tracking-tighter text-blue-400 hover:text-blue-300 transition-all shrink-0 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-0.5 rounded"
                      >
                        Launch
                      </button>
                    </div>
                  ))}
                </div>
                {archivedTabs.length > 0 && (
                  <div className="h-px bg-white/10 my-3" />
                )}
              </div>
            )}

            {/* Section 2: Archived Tabs */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Surface Archive
                </h3>
                <span className="text-[8px] font-bold text-slate-600">
                  {archivedTabs.length} Resting
                </span>
              </div>

              <div className="space-y-2 max-h-44 overflow-auto no-scrollbar">
                {archivedTabs.length === 0 && closedWindows.length === 0 ? (
                  <p className="text-[9px] text-slate-600 italic text-center py-4">
                    The vault is currently empty.
                  </p>
                ) : archivedTabs.length === 0 ? (
                  <p className="text-[9px] text-slate-600 italic text-center py-2">
                    No archived browser tabs.
                  </p>
                ) : (
                  archivedTabs.map((tab) => (
                    <div
                      key={tab.id}
                      className="group/item flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-[10px] font-bold text-slate-300 truncate">
                          {tab.title}
                        </p>
                        <p className="text-[8px] text-slate-600 truncate">
                          {tab.url}
                        </p>
                      </div>
                      <button
                        onClick={() => onRestoreTab?.(tab)}
                        className="opacity-0 group-hover/item:opacity-100 text-[9px] font-black uppercase tracking-tighter text-blue-400 hover:text-white transition-all shrink-0"
                      >
                        Resurrect
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onOpenEcho}
        className="px-3 py-1 rounded-full text-slate-500 hover:text-indigo-400 transition-all flex flex-col items-center relative group"
      >
        <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 rounded-full transition-all blur-md" />
        <span className="text-lg md:text-xs relative z-10">🎙️</span>
        <span className="text-[8px] font-bold uppercase mt-1 relative z-10">
          Echo
        </span>
      </button>

      <button
        onClick={onOpenSearch}
        className="p-1.5 text-slate-500 hover:text-blue-400 transition-all flex flex-col items-center"
        title="Search (⌘K)"
      >
        <span className="text-lg md:text-xs">🔍</span>
        {isMobile && (
          <span className="text-[8px] font-bold uppercase mt-1">Search</span>
        )}
      </button>

      <button
        onClick={onToggleFocusTimer}
        className={`flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${focusTimer.isActive ? "bg-indigo-500/20 text-indigo-400" : "text-slate-500 hover:text-slate-300"} ${isMobile ? "flex-col space-x-0" : ""}`}
      >
        <span className="text-lg md:text-base">
          {focusTimer.mode === "focus" ? "🎯" : "☕"}
        </span>
        <span className="font-mono text-[9px] md:text-[10px]">
          {formatTime(focusTimer.timeLeft)}
        </span>
      </button>

      <button
        onClick={onOpenAssistant}
        className="px-3 py-1 rounded-full text-slate-500 hover:text-blue-400 transition-all flex flex-col items-center"
      >
        <span className="text-lg md:text-xs">✨</span>
        <span className="text-[8px] font-bold uppercase mt-1">AI</span>
      </button>

      {!isMobile && (
        <button
          onClick={onOpenWorkspaces}
          className="px-3 py-1 rounded-full text-slate-500 hover:text-slate-300 transition-all flex flex-col items-center"
        >
          <span className="text-lg md:text-xs">☁️</span>
          <span className="text-[8px] font-bold uppercase mt-1 text-slate-500">
            Cloud
          </span>
        </button>
      )}

      <button
        onClick={onOpenPrefs}
        className="p-1.5 text-slate-500 hover:text-white transition-all flex flex-col items-center"
      >
        <span className="text-lg md:text-xs">⚙️</span>
        {isMobile && (
          <span className="text-[8px] font-bold uppercase mt-1">Prefs</span>
        )}
      </button>

      {pinnedCount > 0 && (
        <div className="bg-blue-600 text-[8px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-white font-black ml-1 absolute -top-1 right-2 md:relative md:top-0 md:right-0 shadow-[0_0_10px_rgba(37,99,235,0.5)]">
          {pinnedCount}
        </div>
      )}
    </div>
  );
};

export default StatusBar;
