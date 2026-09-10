import React, { useState } from "react";
import { ACCENT_PRESETS } from "./types";
import { Palette } from "lucide-react";

interface Props {
  accentColor: string;
  onChange: (color: string) => void;
  isMobile?: boolean;
}

const ColorStylePicker: React.FC<Props> = ({
  accentColor,
  onChange,
  isMobile,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex flex-col items-center">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="group relative p-1.5 transition-all flex flex-col items-center"
        title="Accent color style"
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 bg-white/5 border border-white/10 group-hover:border-white/20">
          <Palette className="w-4 h-4" style={{ color: accentColor }} />
        </div>
        {isMobile && (
          <span className="text-[8px] font-bold uppercase mt-1 text-slate-400">
            Color
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-64 glass border border-white/10 rounded-2xl shadow-2xl p-4 z-[1000] text-white ${isMobile ? "bottom-full mb-4" : "top-full mt-4"} animate-in zoom-in-95 duration-200`}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Accent Color
            </h3>
            <span
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 0 8px ${accentColor}88`,
              }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {ACCENT_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => onChange(preset.value)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${accentColor.toLowerCase() === preset.value.toLowerCase() ? "border-white/40 bg-white/10" : "border-white/5 hover:border-white/20 hover:bg-white/5"}`}
                title={preset.name}
              >
                <span
                  className="w-6 h-6 rounded-full"
                  style={{
                    backgroundColor: preset.value,
                    boxShadow: `0 0 10px ${preset.value}66`,
                  }}
                />
                <span className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>

          <input
            type="color"
            value={accentColor}
            onChange={(e) => onChange(e.target.value)}
            className="mt-3 w-full h-8 rounded-lg bg-transparent border border-white/10 cursor-pointer"
            title="Custom color"
          />
        </div>
      )}
    </div>
  );
};

export default ColorStylePicker;
