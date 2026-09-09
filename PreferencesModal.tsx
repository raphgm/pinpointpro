import React, { useState } from "react";
import {
  UserPreferences,
  IndicatorStyle,
  SoundscapeType,
  ColorTheme,
  ACCENT_PRESETS,
  AppTheme,
} from "./types";
import { Pin } from "lucide-react";

// Added isMobile prop to interface to fix TypeScript error in App.tsx
interface Props {
  preferences: UserPreferences;
  setPreferences: (p: UserPreferences) => void;
  onClose: () => void;
  isMobile?: boolean;
}

const PreferencesModal: React.FC<Props> = ({
  preferences,
  setPreferences,
  onClose,
  isMobile,
}) => {
  const [activeTab, setActiveTab] = useState("general");

  const openGitHub = () => {
    window.open("https://github.com", "_blank");
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Adjusted modal dimensions and styling for mobile responsiveness */}
      <div
        className={`bg-slate-900 border border-slate-700 rounded-2xl w-full ${isMobile ? "h-full max-h-screen rounded-none" : "max-w-2xl max-h-[80vh]"} shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col`}
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <span>⚙️</span>
            <span>Preferences</span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white text-xl"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Responsive sidebar width and content */}
          <div
            className={`${isMobile ? "w-20" : "w-48"} border-r border-slate-800 p-4 space-y-2 shrink-0`}
          >
            {["general", "shortcuts", "appearance", "about"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
              >
                {isMobile
                  ? tab.charAt(0).toUpperCase()
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex-1 p-8 overflow-auto">
            {activeTab === "general" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">Focus Soundscapes</h3>
                    <p className="text-xs text-slate-500">
                      Enable procedural ambient noise during work sessions.
                    </p>
                  </div>
                  <select
                    value={preferences.soundscape}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        soundscape: e.target.value as SoundscapeType,
                      })
                    }
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs"
                  >
                    <option value="none">Disabled</option>
                    <option value="ambient">Deep Ambient</option>
                    <option value="lofi">Lofi Beats</option>
                    <option value="nature">Forest Rain & Wind</option>
                  </select>
                </div>

                <div className="h-px bg-slate-800" />

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">Desktop Snap Zones</h3>
                    <p className="text-xs text-slate-500">
                      Show visual snap zones on screen borders when dragging
                      windows near the edges.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setPreferences({
                        ...preferences,
                        snapZonesEnabled: !preferences.snapZonesEnabled,
                      })
                    }
                    className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer ${preferences.snapZonesEnabled ? "bg-blue-600" : "bg-slate-700"}`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${preferences.snapZonesEnabled ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "shortcuts" && (
              <div className="space-y-4">
                {Object.entries(preferences.shortcuts).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300 capitalize">
                      {key}:
                    </span>
                    <div className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center space-x-2 font-mono text-xs">
                      <span className="opacity-50">⌘</span>
                      <span className="uppercase">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="font-bold mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
                    Interface Theme
                  </h3>
                  <div
                    className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-3`}
                  >
                    {(["light", "dark"] as AppTheme[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() =>
                          setPreferences({ ...preferences, theme: mode })
                        }
                        className={`px-4 py-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${preferences.theme === mode ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-slate-700 text-slate-500 hover:border-slate-500"}`}
                      >
                        <span>{mode === "light" ? "☀️ Light" : "🌙 Dark"}</span>
                        {preferences.theme === mode && (
                          <span className="text-blue-400">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-800/60" />

                <div>
                  <h3 className="font-bold mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
                    Accent Color Style
                  </h3>
                  <div
                    className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-3"} gap-3`}
                  >
                    {ACCENT_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() =>
                          setPreferences({
                            ...preferences,
                            accentColor: preset.value,
                          })
                        }
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${preferences.accentColor.toLowerCase() === preset.value.toLowerCase() ? "border-white/40 bg-white/10" : "border-slate-800 bg-slate-900/40 hover:border-slate-600"}`}
                      >
                        <span
                          className="w-7 h-7 rounded-full shadow-inner"
                          style={{
                            backgroundColor: preset.value,
                            boxShadow: `0 0 12px ${preset.value}66`,
                          }}
                        />
                        <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3 bg-slate-900/40 border border-slate-800 rounded-xl p-3">
                    <span className="text-xs text-slate-400">Custom color</span>
                    <input
                      type="color"
                      value={preferences.accentColor}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          accentColor: e.target.value,
                        })
                      }
                      className="w-10 h-8 rounded-lg bg-transparent border border-slate-700 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="h-px bg-slate-800/60" />

                <div>
                  <h3 className="font-bold mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
                    Desktop Color Theme
                  </h3>
                  <div
                    className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-3`}
                  >
                    {[
                      {
                        id: "nebula",
                        label: "Nebula",
                        icon: "🌌",
                        gradient: "from-blue-500 via-indigo-500 to-pink-500",
                        desc: "Deep space blues, purples, and cosmic pinks",
                      },
                      {
                        id: "sunrise",
                        label: "Sunrise",
                        icon: "🌅",
                        gradient: "from-orange-500 via-red-500 to-pink-500",
                        desc: "Warm oranges, radiant reds, and golden embers",
                      },
                      {
                        id: "ocean",
                        label: "Ocean Depth",
                        icon: "🌊",
                        gradient: "from-cyan-500 via-teal-500 to-blue-500",
                        desc: "Cool cyans, deep marine teals, and light blues",
                      },
                      {
                        id: "emerald",
                        label: "Emerald Forest",
                        icon: "🌲",
                        gradient: "from-emerald-500 via-green-500 to-lime-500",
                        desc: "Lush greens, forest emeralds, and lime details",
                      },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() =>
                          setPreferences({
                            ...preferences,
                            colorTheme: theme.id as ColorTheme,
                          })
                        }
                        className={`p-4 rounded-xl border text-left transition-all ${preferences.colorTheme === theme.id ? "border-blue-500 bg-blue-500/10 text-white" : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200"}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-base">{theme.icon}</span>
                            <span className="text-xs font-bold font-sans">
                              {theme.label}
                            </span>
                          </div>
                          <div
                            className={`w-12 h-2.5 rounded-full bg-gradient-to-r ${theme.gradient} opacity-80`}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal">
                          {theme.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-800/60" />

                <div>
                  <h3 className="font-bold mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
                    Pin indicator style
                  </h3>
                  {/* Grid layout adjustment for mobile */}
                  <div
                    className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-3`}
                  >
                    {[
                      {
                        id: IndicatorStyle.SUBTLE_BORDER,
                        label: "Subtle Border",
                      },
                      {
                        id: IndicatorStyle.COLORED_GLOW,
                        label: "Colored Glow",
                      },
                      { id: IndicatorStyle.PIN_ICON, label: "Pin Icon" },
                      { id: IndicatorStyle.NONE, label: "None" },
                    ].map((style) => (
                      <button
                        key={style.id}
                        onClick={() =>
                          setPreferences({
                            ...preferences,
                            indicatorStyle: style.id,
                          })
                        }
                        className={`px-4 py-3 rounded-xl border text-left text-xs font-bold transition-all ${preferences.indicatorStyle === style.id ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-slate-700 text-slate-500 hover:border-slate-500"}`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-6">
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4 animate-bounce">
                    <Pin className="w-6 h-6 rotate-45" />
                  </div>
                  <h3 className="text-xl font-bold">PinPoint Pro</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Version 1.0.0-beta
                  </p>
                </div>

                <div className="glass p-4 rounded-xl border border-white/5 space-y-4">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">
                      Open Source
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      PinPoint Pro is proudly open source. Built for deep work,
                      this tool belongs to the community.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                      License
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      MIT License <br />
                      Copyright (c) 2025 PinPoint Contributors
                    </p>
                  </div>
                  <button
                    onClick={openGitHub}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition-all border border-white/5 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    <span>View Repository & Contribute</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 flex justify-end space-x-3 bg-slate-950/20">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;
