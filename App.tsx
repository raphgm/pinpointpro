import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  IndicatorStyle,
  WindowState,
  Workspace,
  UserPreferences,
  TabData,
  ColorTheme,
  FocusTimerState,
  TodoItem,
  Priority,
  SoundscapeType,
} from "./types";
import StatusBar from "./StatusBar";
import Desktop from "./Desktop";
import Onboarding from "./Onboarding";
import PreferencesModal from "./PreferencesModal";
import WorkspaceManager from "./WorkspaceManager";
import SmartAssistant from "./SmartAssistant";
import GhostSearch from "./GhostSearch";
import EchoAssistant from "./EchoAssistant";
import { GoogleGenAI, Type } from "@google/genai";
import { soundscapeEngine } from "./soundscapeEngine";

const THEME_ACCENTS: Record<ColorTheme, string> = {
  nebula: "#3b82f6",
  sunrise: "#f97316",
  ocean: "#06b6d4",
  emerald: "#10b981",
};

const DEFAULT_PREFERENCES: UserPreferences = {
  launchAtLogin: false,
  showMenuBarIcon: true,
  indicatorStyle: IndicatorStyle.COLORED_GLOW,
  accentColor: "#3b82f6",
  theme: "dark",
  minOpacity: 0.4,
  zenMode: false,
  ghostingEnabled: true,
  colorTheme: "nebula",
  soundscape: "none",
  snapZonesEnabled: true,
  shortcuts: {
    pin: "p",
    transparency: "t",
    focus: "f",
    workspace: "w",
    zen: "z",
    search: "k",
  },
};

const INITIAL_WINDOWS: WindowState[] = [
  {
    id: "w1",
    title: "Research Project",
    type: "browser",
    x: 350,
    y: 100,
    width: 600,
    height: 450,
    isPinned: true,
    opacity: 1,
    focusCount: 8,
    content: "Deep dive into the architecture of modern LLMs.",
    tabs: [
      {
        id: "t1",
        title: "Gemini Technical Paper",
        url: "deepmind.google/gemini",
        isActive: true,
        category: "AI Research",
        lastAccessed: Date.now(),
      },
      {
        id: "t2",
        title: "React Performance Tips",
        url: "react.dev/learn",
        isActive: false,
        category: "Dev Docs",
        lastAccessed: Date.now() - 10000,
      },
      {
        id: "t3",
        title: "Window Management UX",
        url: "nngroup.com",
        isActive: false,
        category: "Design",
        lastAccessed: Date.now() - 20000,
      },
    ],
  },
  {
    id: "w2",
    title: "Focus Space",
    type: "notes",
    x: 800,
    y: 400,
    width: 300,
    height: 300,
    isPinned: false,
    opacity: 1,
    focusCount: 3,
    content: "Goal: Finish the multi-tab architecture by end of day.",
  },
  {
    id: "w3",
    title: "Creative Canvas",
    type: "canvas",
    x: 100,
    y: 180,
    width: 320,
    height: 380,
    isPinned: false,
    opacity: 1,
    isClosed: true,
    focusCount: 1,
    content: "Generative mood board.",
    canvasData: {
      prompt:
        "A futuristic digital workspace with floating holographic screens in Nebula colors",
      imageUrl: "",
      isGenerating: false,
    },
  },
];

const App: React.FC = () => {
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [preferences, setPreferences] =
    useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [archivedTabs, setArchivedTabs] = useState<TabData[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isWorkspaceManagerOpen, setIsWorkspaceManagerOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isEchoOpen, setIsEchoOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [globalWallpaper, setGlobalWallpaper] = useState<string | null>(null);

  const [focusTimer, setFocusTimer] = useState<FocusTimerState>({
    isActive: false,
    timeLeft: 25 * 60,
    mode: "focus",
  });

  const [soundscapeVolume, setSoundscapeVolume] = useState(0.5);

  // Soundscape audio controller
  useEffect(() => {
    if (preferences.soundscape && preferences.soundscape !== "none") {
      soundscapeEngine.start(preferences.soundscape);
    } else {
      soundscapeEngine.stop();
    }
    return () => {
      soundscapeEngine.stop();
    };
  }, [preferences.soundscape]);

  // Sync volume changes
  useEffect(() => {
    soundscapeEngine.setVolume(soundscapeVolume);
  }, [soundscapeVolume]);

  // Timer Tick
  useEffect(() => {
    let interval: any;
    if (focusTimer.isActive && focusTimer.timeLeft > 0) {
      interval = setInterval(() => {
        setFocusTimer((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (focusTimer.timeLeft === 0) {
      setFocusTimer((prev) => ({ ...prev, isActive: false }));
    }
    return () => clearInterval(interval);
  }, [focusTimer.isActive, focusTimer.timeLeft]);

  // Handle Responsiveness
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleFocusTimer = () =>
    setFocusTimer((prev) => ({ ...prev, isActive: !prev.isActive }));

  const updateWindowPosition = useCallback(
    (id: string, x: number, y: number) => {
      if (isMobile) return;
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== id) return w;
          if (w.preSnapDimensions) {
            const pre = w.preSnapDimensions;
            return {
              ...w,
              x: x + (w.width - pre.width) / 2,
              y,
              width: pre.width,
              height: pre.height,
              preSnapDimensions: undefined,
            };
          }
          return { ...w, x, y };
        }),
      );
    },
    [isMobile],
  );

  const handleSnapWindow = useCallback(
    (id: string, snapType: "left" | "right" | "top" | "bottom" | "none") => {
      if (isMobile) return;
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== id) return w;

          const width = window.innerWidth;
          const height = window.innerHeight;
          const statusBarHeight = 32; // pt-8 is 32px
          const desktopHeight = height - statusBarHeight;

          if (snapType === "none") return w;

          const preSnapDimensions = w.preSnapDimensions || {
            x: w.x,
            y: w.y,
            width: w.width,
            height: w.height,
          };

          if (snapType === "left") {
            return {
              ...w,
              x: 0,
              y: statusBarHeight,
              width: width / 2,
              height: desktopHeight,
              isPinned: true,
              preSnapDimensions,
            };
          } else if (snapType === "right") {
            return {
              ...w,
              x: width / 2,
              y: statusBarHeight,
              width: width / 2,
              height: desktopHeight,
              isPinned: true,
              preSnapDimensions,
            };
          } else if (snapType === "top") {
            return {
              ...w,
              x: 0,
              y: statusBarHeight,
              width: width,
              height: desktopHeight,
              isPinned: true,
              preSnapDimensions,
            };
          } else if (snapType === "bottom") {
            return {
              ...w,
              x: 0,
              y: statusBarHeight + desktopHeight / 2,
              width: width,
              height: desktopHeight / 2,
              isPinned: true,
              preSnapDimensions,
            };
          }
          return w;
        }),
      );
    },
    [isMobile],
  );

  const togglePin = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isPinned: !w.isPinned } : w)),
    );
  }, []);

  const handleGenerateCanvas = useCallback(
    async (id: string, prompt: string) => {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id
            ? {
                ...w,
                canvasData: { ...w.canvasData, isGenerating: true, prompt },
              }
            : w,
        ),
      );

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: { parts: [{ text: prompt }] },
          config: { imageConfig: { aspectRatio: "1:1" } },
        });

        let imageUrl = "";
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }

        setWindows((prev) =>
          prev.map((w) =>
            w.id === id
              ? {
                  ...w,
                  canvasData: {
                    ...w.canvasData,
                    isGenerating: false,
                    imageUrl,
                    prompt,
                  },
                }
              : w,
          ),
        );
      } catch (e) {
        console.error("Canvas Generation Failed:", e);
        setWindows((prev) =>
          prev.map((w) =>
            w.id === id
              ? { ...w, canvasData: { ...w.canvasData, isGenerating: false } }
              : w,
          ),
        );
      }
    },
    [],
  );

  const handleApplyWallpaper = useCallback((imageUrl: string) => {
    setGlobalWallpaper(imageUrl);
  }, []);

  const handleSmartStack = useCallback(
    async (windowId: string) => {
      const targetWindow = windows.find((w) => w.id === windowId);
      if (!targetWindow || !targetWindow.tabs || targetWindow.tabs.length < 2)
        return;

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const tabData = targetWindow.tabs.map((t) => ({
          id: t.id,
          title: t.title,
        }));

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Categorize these browser tabs into logical groups. Return a JSON array of objects with "id" and "category" (max 2 words). Tabs: ${JSON.stringify(tabData)}`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING },
                },
                required: ["id", "category"],
              },
            },
          },
        });

        const categories = JSON.parse(response.text || "[]");

        setWindows((prev) =>
          prev.map((w) => {
            if (w.id !== windowId || !w.tabs) return w;
            return {
              ...w,
              tabs: w.tabs.map((t) => {
                const cat = categories.find((c: any) => c.id === t.id);
                return cat ? { ...t, category: cat.category } : t;
              }),
            };
          }),
        );
      } catch (e) {
        console.error("Smart Stack Failed:", e);
      }
    },
    [windows],
  );

  const handleSwitchTab = useCallback((windowId: string, tabId: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== windowId || !w.tabs) return w;
        return {
          ...w,
          tabs: w.tabs.map((t) => ({
            ...t,
            isActive: t.id === tabId,
            lastAccessed: t.id === tabId ? Date.now() : t.lastAccessed,
          })),
        };
      }),
    );
  }, []);

  const handleUpdateTabCategory = useCallback(
    (windowId: string, tabId: string, category: string) => {
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== windowId || !w.tabs) return w;
          return {
            ...w,
            tabs: w.tabs.map((t) => (t.id === tabId ? { ...t, category } : t)),
          };
        }),
      );
    },
    [],
  );

  const handleAddTab = useCallback((windowId: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== windowId) return w;
        const newTab: TabData = {
          id: `tab-${Date.now()}`,
          title: "New Surface",
          url: "pinpoint.internal/new",
          isActive: true,
          lastAccessed: Date.now(),
        };
        return {
          ...w,
          tabs: [
            ...(w.tabs || []).map((t) => ({ ...t, isActive: false })),
            newTab,
          ],
        };
      }),
    );
  }, []);

  const handleCloseTab = useCallback((windowId: string, tabId: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== windowId || !w.tabs) return w;
        const tabToArchive = w.tabs.find((t) => t.id === tabId);
        if (tabToArchive) {
          setArchivedTabs((prevArchive) => [
            tabToArchive,
            ...prevArchive.slice(0, 19),
          ]);
        }
        const filteredTabs = w.tabs.filter((t) => t.id !== tabId);
        if (filteredTabs.length > 0 && !filteredTabs.some((t) => t.isActive)) {
          filteredTabs[0].isActive = true;
        }
        return { ...w, tabs: filteredTabs };
      }),
    );
  }, []);

  const handleCloseWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isClosed: true } : w)),
    );
  }, []);

  const handleRestoreWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isClosed: false } : w)),
    );
  }, []);

  const handleToggleCollapseWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isCollapsed: !w.isCollapsed } : w,
      ),
    );
  }, []);

  const handleSetActiveWindowId = useCallback((id: string | null) => {
    setActiveWindowId(id);
    if (id) {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id ? { ...w, focusCount: (w.focusCount || 0) + 1 } : w,
        ),
      );
    }
  }, []);

  const handleDesktopTidy = useCallback(() => {
    setWindows((prev) => {
      const visibleWindows = prev.filter((w) => !w.isClosed);
      if (visibleWindows.length === 0) return prev;

      // Sort by focusCount (usage frequency) descending
      const sorted = [...visibleWindows].sort((a, b) => {
        const countA = a.focusCount || 0;
        const countB = b.focusCount || 0;
        if (countB !== countA) return countB - countA;
        return a.id.localeCompare(b.id);
      });

      const screenWidth = window.innerWidth || 1200;
      const screenHeight = window.innerHeight || 800;

      const centerWidth = Math.max(500, Math.min(680, screenWidth * 0.55));
      const centerHeight = Math.max(380, Math.min(500, screenHeight * 0.6));
      const centerX = (screenWidth - centerWidth) / 2;
      const centerY = (screenHeight - centerHeight) / 2 + 10;

      const mostActive = sorted[0];
      const others = sorted.slice(1);

      return prev.map((w) => {
        if (w.isClosed) return w;

        if (w.id === mostActive.id) {
          return {
            ...w,
            x: centerX,
            y: centerY,
            width: centerWidth,
            height: centerHeight,
            isPinned: true,
            isCollapsed: false,
          };
        }

        const index = others.findIndex((o) => o.id === w.id);
        if (index === -1) return w;

        const isLeft = index % 2 === 0;
        const sideIndex = Math.floor(index / 2);
        const totalOnSide = Math.ceil(others.length / 2);

        const sideWidth = Math.max(
          280,
          Math.min(320, (screenWidth - centerWidth) / 2 - 30),
        );
        const sideX = isLeft
          ? Math.max(20, (centerX - sideWidth) / 2)
          : Math.min(
              screenWidth - sideWidth - 20,
              centerX +
                centerWidth +
                (screenWidth - (centerX + centerWidth) - sideWidth) / 2,
            );

        const availableHeight = screenHeight - 120;
        const sideHeight = Math.min(260, availableHeight / totalOnSide - 20);
        const startY = 70;
        const sideY = startY + sideIndex * (sideHeight + 15);

        return {
          ...w,
          x: sideX,
          y: sideY,
          width: sideWidth,
          height: sideHeight,
          isPinned: false,
          isCollapsed: false,
        };
      });
    });

    setWindows((prev) => {
      const visibleWindows = prev.filter((w) => !w.isClosed);
      if (visibleWindows.length > 0) {
        const sorted = [...visibleWindows].sort((a, b) => {
          const countA = a.focusCount || 0;
          const countB = b.focusCount || 0;
          if (countB !== countA) return countB - countA;
          return a.id.localeCompare(b.id);
        });
        setActiveWindowId(sorted[0].id);
      }
      return prev;
    });
  }, []);

  const handleRestoreTab = useCallback(
    (tab: TabData) => {
      // Restore to currently active window or first browser window
      setWindows((prev) => {
        let targetId =
          activeWindowId || prev.find((w) => w.type === "browser")?.id;
        if (!targetId) return prev;

        return prev.map((w) => {
          if (w.id !== targetId) return w;
          return {
            ...w,
            tabs: [
              ...(w.tabs || []).map((t) => ({ ...t, isActive: false })),
              { ...tab, isActive: true, lastAccessed: Date.now() },
            ],
          };
        });
      });
      setArchivedTabs((prev) => prev.filter((t) => t.id !== tab.id));
    },
    [activeWindowId],
  );

  const addIntention = useCallback(
    (text: string, priority: Priority = "medium") => {
      setTodos((prev) => [
        {
          id: `t-${Date.now()}`,
          text,
          priority,
          completed: false,
          createdAt: Date.now(),
        },
        ...prev,
      ]);
    },
    [],
  );

  if (isOnboarding) {
    return (
      <Onboarding
        onComplete={() => setIsOnboarding(false)}
        preferences={preferences}
        setPreferences={setPreferences}
      />
    );
  }

  return (
    <div
      data-theme={preferences.theme}
      className={`relative w-screen h-screen overflow-hidden select-none theme-${preferences.colorTheme} ${preferences.theme === "light" ? "bg-slate-100 text-slate-900" : "bg-slate-900 text-white"} ${isMobile ? "is-mobile" : ""} ${focusTimer.isActive ? "focus-mode-active" : ""}`}
      style={{ "--accent": preferences.accentColor } as React.CSSProperties}
    >
      <StatusBar
        pinnedCount={windows.filter((w) => w.isPinned).length}
        focusMode={preferences.zenMode}
        currentTheme={preferences.colorTheme}
        theme={preferences.theme}
        onToggleTheme={() =>
          setPreferences((p) => ({
            ...p,
            theme: p.theme === "dark" ? "light" : "dark",
          }))
        }
        accentColor={preferences.accentColor}
        onAccentChange={(color) =>
          setPreferences((p) => ({ ...p, accentColor: color }))
        }
        focusTimer={focusTimer}
        archivedTabs={archivedTabs}
        onRestoreTab={handleRestoreTab}
        onToggleFocusTimer={toggleFocusTimer}
        onThemeChange={(theme) =>
          setPreferences((p) => ({ ...p, colorTheme: theme }))
        }
        onOpenPrefs={() => setIsPreferencesOpen(true)}
        onOpenWorkspaces={() => setIsWorkspaceManagerOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenEcho={() => setIsEchoOpen(true)}
        isMobile={isMobile}
        soundscape={preferences.soundscape}
        onSoundscapeChange={(sound) =>
          setPreferences((p) => ({ ...p, soundscape: sound }))
        }
        soundscapeVolume={soundscapeVolume}
        onSoundscapeVolumeChange={(vol) => setSoundscapeVolume(vol)}
        closedWindows={windows.filter((w) => w.isClosed)}
        onRestoreWindow={handleRestoreWindow}
      />

      <Desktop
        windows={windows}
        todos={todos}
        activeWindowId={activeWindowId}
        focusMode={preferences.zenMode}
        preferences={preferences}
        focusTimerActive={focusTimer.isActive}
        setActiveWindowId={handleSetActiveWindowId}
        updateWindowPosition={updateWindowPosition}
        togglePin={togglePin}
        updateWindowOpacity={(id, opacity) =>
          setWindows((prev) =>
            prev.map((w) => (w.id === id ? { ...w, opacity } : w)),
          )
        }
        onDetachTab={handleCloseTab}
        onSwitchTab={handleSwitchTab}
        onUpdateTabCategory={handleUpdateTabCategory}
        onAddTab={handleAddTab}
        onCloseTab={handleCloseTab}
        onGenerateGlance={() => {}}
        onGenerateCanvas={handleGenerateCanvas}
        onApplyWallpaper={handleApplyWallpaper}
        onSmartStack={handleSmartStack}
        onToggleTodo={(id) =>
          setTodos((prev) =>
            prev.map((t) =>
              t.id === id ? { ...t, completed: !t.completed } : t,
            ),
          )
        }
        onAddTodo={addIntention}
        onDeleteTodo={(id) =>
          setTodos((prev) => prev.filter((t) => t.id !== id))
        }
        onGroupWindows={() => {}}
        onRemoveFromFolder={() => {}}
        isMobile={isMobile}
        globalWallpaper={globalWallpaper}
        onCloseWindow={handleCloseWindow}
        onSnapWindow={handleSnapWindow}
        onToggleCollapseWindow={handleToggleCollapseWindow}
      />

      {isEchoOpen && (
        <EchoAssistant
          windows={windows}
          onClose={() => setIsEchoOpen(false)}
          commands={{
            setTimer: (mins) =>
              setFocusTimer({
                mode: "focus",
                timeLeft: mins * 60,
                isActive: true,
              }),
            setTheme: (theme) =>
              setPreferences((p) => ({
                ...p,
                colorTheme: theme as ColorTheme,
              })),
            pinWindow: (id) => togglePin(id),
            addIntention: (text) => addIntention(text),
            toggleZen: () =>
              setPreferences((p) => ({ ...p, zenMode: !p.zenMode })),
            desktopTidy: handleDesktopTidy,
          }}
        />
      )}

      {isAssistantOpen && (
        <SmartAssistant
          windows={windows}
          onApplyLayout={() => {}}
          onCategorize={() => {}}
          onSyncTabs={() => {}}
          onCleanDesktop={handleDesktopTidy}
          onClose={() => setIsAssistantOpen(false)}
          isMobile={isMobile}
        />
      )}

      {isSearchOpen && (
        <GhostSearch
          windows={windows}
          onSelect={(id) => {
            handleSetActiveWindowId(id);
            setIsSearchOpen(false);
          }}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
      {isPreferencesOpen && (
        <PreferencesModal
          preferences={preferences}
          setPreferences={setPreferences}
          onClose={() => setIsPreferencesOpen(false)}
          isMobile={isMobile}
        />
      )}
      {isWorkspaceManagerOpen && (
        <WorkspaceManager
          workspaces={workspaces}
          onSave={() => {}}
          onRestore={() => {}}
          onClose={() => setIsWorkspaceManagerOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
