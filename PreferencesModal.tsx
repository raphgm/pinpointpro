import React from "react";
import { UserPreferences, ACCENT_PRESETS, SoundscapeType } from "./types";
import { X } from "lucide-react";

interface Props {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  onClose: () => void;
}

const SOUNDSCAPES: { id: SoundscapeType; label: string }[] = [
  { id: "none", label: "None" },
  { id: "lofi", label: "Lo-fi" },
  { id: "ambient", label: "Ambient" },
  { id: "nature", label: "Nature" },
];

const PreferencesModal: React.FC<Props> = ({
  preferences,
  setPreferences,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-surface border border-app rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-app">
          <h2 className="text-sm font-semibold">Preferences</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-app-muted text-app-tertiary"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          <div>
            <label className="text-xs font-medium text-app-tertiary uppercase tracking-wide">
              Theme
            </label>
            <div className="flex gap-2 mt-2">
              {(["light", "dark"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setPreferences((p) => ({ ...p, theme: t }))}
                  className={`flex-1 py-2 rounded-lg text-sm capitalize border transition-colors ${
                    preferences.theme === t
                      ? "accent-bg text-white border-transparent"
                      : "border-app text-app-secondary hover:bg-app-muted"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-app-tertiary uppercase tracking-wide">
              Accent color
            </label>
            <div className="flex gap-2 mt-2">
              {ACCENT_PRESETS.map((a) => (
                <button
                  key={a.value}
                  onClick={() =>
                    setPreferences((p) => ({ ...p, accentColor: a.value }))
                  }
                  title={a.name}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: a.value }}
                >
                  {preferences.accentColor === a.value && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-app-tertiary uppercase tracking-wide">
              Soundscape
            </label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {SOUNDSCAPES.map((s) => (
                <button
                  key={s.id}
                  onClick={() =>
                    setPreferences((p) => ({ ...p, soundscape: s.id }))
                  }
                  className={`py-2 rounded-lg text-sm border transition-colors ${
                    preferences.soundscape === s.id
                      ? "accent-bg text-white border-transparent"
                      : "border-app text-app-secondary hover:bg-app-muted"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;
