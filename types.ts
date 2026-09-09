export enum IndicatorStyle {
  SUBTLE_BORDER = "subtle_border",
  COLORED_GLOW = "colored_glow",
  PIN_ICON = "pin_icon",
  NONE = "none",
}

export type ColorTheme = "nebula" | "sunrise" | "ocean" | "emerald";
export type Priority = "critical" | "high" | "medium" | "low";
export type SoundscapeType = "none" | "lofi" | "ambient" | "nature";
export type AppTheme = "light" | "dark";

export const ACCENT_PRESETS: { name: string; value: string }[] = [
  { name: "Azure", value: "#3b82f6" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Emerald", value: "#10b981" },
  { name: "Cyan", value: "#06b6d4" },
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

export interface WindowState {
  id: string;
  title: string;
  type:
    | "browser"
    | "code"
    | "chat"
    | "media"
    | "pdf"
    | "notes"
    | "folder"
    | "canvas";
  x: number;
  y: number;
  width: number;
  height: number;
  isPinned: boolean;
  opacity: number;
  isClosed?: boolean;
  isCollapsed?: boolean;
  focusCount?: number;
  preSnapDimensions?: { x: number; y: number; width: number; height: number };
  timerTotal?: number;
  timerRemaining?: number;
  content: string;
  isGhosted?: boolean;
  tabs?: TabData[];
  aiGlance?: string;
  containedWindowIds?: string[];
  parentId?: string;
  canvasData?: {
    prompt?: string;
    imageUrl?: string;
    isGenerating?: boolean;
  };
}

export interface Workspace {
  id: string;
  name: string;
  windows: WindowState[];
}

export interface FocusTimerState {
  isActive: boolean;
  timeLeft: number;
  mode: "focus" | "break";
}

export interface UserPreferences {
  launchAtLogin: boolean;
  showMenuBarIcon: boolean;
  indicatorStyle: IndicatorStyle;
  accentColor: string;
  theme: AppTheme;
  minOpacity: number;
  zenMode: boolean;
  ghostingEnabled: boolean;
  colorTheme: ColorTheme;
  soundscape: SoundscapeType;
  snapZonesEnabled?: boolean;
  shortcuts: {
    pin: string;
    transparency: string;
    focus: string;
    workspace: string;
    zen: string;
    search: string;
  };
}
