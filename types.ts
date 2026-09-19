export type Priority = "critical" | "high" | "medium" | "low";
export type SoundscapeType = "none" | "lofi" | "ambient" | "nature";
export type AppTheme = "light" | "dark";
export type PinType = "link" | "note" | "tabs";

export const ACCENT_PRESETS: { name: string; value: string }[] = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Emerald", value: "#10b981" },
];

export interface TodoItem {
  id: string;
  text: string;
  priority: Priority;
  completed: boolean;
  createdAt: number;
}

export interface TabData {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  category?: string;
  lastAccessed?: number;
}

export interface Pin {
  id: string;
  title: string;
  type: PinType;
  content: string;
  url?: string;
  category?: string;
  tabs?: TabData[];
  isPinned: boolean;
  isArchived: boolean;
  focusCount: number;
  createdAt: number;
}

export interface FocusTimerState {
  isActive: boolean;
  timeLeft: number;
  duration: number;
  mode: "focus" | "break";
}

export interface UserPreferences {
  accentColor: string;
  theme: AppTheme;
  soundscape: SoundscapeType;
}
