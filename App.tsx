import React, { useCallback, useEffect, useState } from "react";
import {
  Pin,
  TodoItem,
  Priority,
  UserPreferences,
  FocusTimerState,
} from "./types";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import PinCard from "./PinCard";
import PinDetail from "./PinDetail";
import CommandPalette from "./CommandPalette";
import PreferencesModal from "./PreferencesModal";
import Onboarding from "./Onboarding";
import { GoogleGenAI, Type } from "@google/genai";
import { soundscapeEngine } from "./soundscapeEngine";
import { Plus } from "lucide-react";

const DEFAULT_PREFERENCES: UserPreferences = {
  accentColor: "#6366f1",
  theme: "dark",
  soundscape: "none",
};

const INITIAL_PINS: Pin[] = [
  {
    id: "p1",
    title: "Research Project",
    type: "tabs",
    content: "Deep dive into the architecture of modern LLMs.",
    category: "AI Research",
    isPinned: true,
    isArchived: false,
    focusCount: 8,
    createdAt: Date.now(),
    tabs: [
      {
        id: "t1",
        title: "Example Domain",
        url: "https://example.com",
        isActive: true,
      },
      {
        id: "t2",
        title: "First Website Ever",
        url: "https://info.cern.ch",
        isActive: false,
      },
      {
        id: "t3",
        title: "W3C",
        url: "https://www.w3.org",
        isActive: false,
      },
    ],
  },
  {
    id: "p2",
    title: "Focus Space",
    type: "note",
    content: "Goal: Finish the multi-tab architecture by end of day.",
    isPinned: false,
    isArchived: false,
    focusCount: 3,
    createdAt: Date.now(),
  },
];

type View = "today" | "pins" | "vault";

const App: React.FC = () => {
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [preferences, setPreferences] =
    useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [pins, setPins] = useState<Pin[]>(INITIAL_PINS);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [view, setView] = useState<View>("today");
  const [openPinId, setOpenPinId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);
  const [isStacking, setIsStacking] = useState(false);

  const [focusTimer, setFocusTimer] = useState<FocusTimerState>({
    isActive: false,
    timeLeft: 25 * 60,
    duration: 25 * 60,
    mode: "focus",
  });

  useEffect(() => {
    if (preferences.soundscape !== "none") {
      soundscapeEngine.start(preferences.soundscape);
    } else {
      soundscapeEngine.stop();
    }
    return () => soundscapeEngine.stop();
  }, [preferences.soundscape]);

  useEffect(() => {
    if (!focusTimer.isActive || focusTimer.timeLeft <= 0) return;
    const id = setInterval(() => {
      setFocusTimer((prev) =>
        prev.timeLeft <= 1
          ? { ...prev, timeLeft: 0, isActive: false }
          : { ...prev, timeLeft: prev.timeLeft - 1 },
      );
    }, 1000);
    return () => clearInterval(id);
  }, [focusTimer.isActive, focusTimer.timeLeft]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const toggleFocusTimer = () =>
    setFocusTimer((prev) => ({ ...prev, isActive: !prev.isActive }));

  const togglePin = useCallback((id: string) => {
    setPins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isPinned: !p.isPinned } : p)),
    );
  }, []);

  const archivePin = useCallback((id: string) => {
    setPins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isArchived: true } : p)),
    );
  }, []);

  const restorePin = useCallback((id: string) => {
    setPins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isArchived: false } : p)),
    );
  }, []);

  const openPin = useCallback((id: string) => {
    setOpenPinId(id);
    setPins((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, focusCount: p.focusCount + 1 } : p,
      ),
    );
  }, []);

  const updatePinContent = useCallback((id: string, content: string) => {
    setPins((prev) => prev.map((p) => (p.id === id ? { ...p, content } : p)));
  }, []);

  const switchTab = useCallback((pinId: string, tabId: string) => {
    setPins((prev) =>
      prev.map((p) => {
        if (p.id !== pinId || !p.tabs) return p;
        return {
          ...p,
          tabs: p.tabs.map((t) => ({ ...t, isActive: t.id === tabId })),
        };
      }),
    );
  }, []);

  const navigateTab = useCallback((pinId: string, tabId: string, url: string) => {
    setPins((prev) =>
      prev.map((p) => {
        if (p.id !== pinId || !p.tabs) return p;
        return {
          ...p,
          tabs: p.tabs.map((t) =>
            t.id === tabId
              ? { ...t, url, title: t.title || url, lastAccessed: Date.now() }
              : t,
          ),
        };
      }),
    );
  }, []);

  const addTab = useCallback((pinId: string, url: string) => {
    setPins((prev) =>
      prev.map((p) => {
        if (p.id !== pinId) return p;
        const newTab = {
          id: `tab-${Date.now()}`,
          title: url.replace(/^https?:\/\//, ""),
          url,
          isActive: true,
          lastAccessed: Date.now(),
        };
        return {
          ...p,
          tabs: [...(p.tabs || []).map((t) => ({ ...t, isActive: false })), newTab],
        };
      }),
    );
  }, []);

  const closeTab = useCallback((pinId: string, tabId: string) => {
    setPins((prev) =>
      prev.map((p) => {
        if (p.id !== pinId || !p.tabs) return p;
        const filtered = p.tabs.filter((t) => t.id !== tabId);
        if (filtered.length > 0 && !filtered.some((t) => t.isActive)) {
          filtered[0].isActive = true;
        }
        return { ...p, tabs: filtered };
      }),
    );
  }, []);

  const addIntention = useCallback((text: string, priority: Priority = "medium") => {
    setTodos((prev) => [
      { id: `t-${Date.now()}`, text, priority, completed: false, createdAt: Date.now() },
      ...prev,
    ]);
  }, []);

  const addNotePin = useCallback(() => {
    const newPin: Pin = {
      id: `p-${Date.now()}`,
      title: "New Note",
      type: "note",
      content: "",
      isPinned: false,
      isArchived: false,
      focusCount: 0,
      createdAt: Date.now(),
    };
    setPins((prev) => [newPin, ...prev]);
    setOpenPinId(newPin.id);
  }, []);

  const addBrowserPin = useCallback(() => {
    const newPin: Pin = {
      id: `p-${Date.now()}`,
      title: "New Tab Group",
      type: "tabs",
      content: "",
      isPinned: false,
      isArchived: false,
      focusCount: 0,
      createdAt: Date.now(),
      tabs: [
        { id: `tab-${Date.now()}`, title: "New Tab", url: "", isActive: true },
      ],
    };
    setPins((prev) => [newPin, ...prev]);
    setOpenPinId(newPin.id);
  }, []);

  const handleSmartStack = useCallback(
    async (pinId: string) => {
      const pin = pins.find((p) => p.id === pinId);
      if (!pin?.tabs || pin.tabs.length < 2) return;
      setIsStacking(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const tabData = pin.tabs.map((t) => ({ id: t.id, title: t.title }));
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
        setPins((prev) =>
          prev.map((p) => {
            if (p.id !== pinId || !p.tabs) return p;
            return {
              ...p,
              tabs: p.tabs.map((t) => {
                const cat = categories.find((c: any) => c.id === t.id);
                return cat ? { ...t, category: cat.category } : t;
              }),
            };
          }),
        );
      } catch (e) {
        console.error("Smart Stack failed:", e);
      } finally {
        setIsStacking(false);
      }
    },
    [pins],
  );

  if (isOnboarding) {
    return <Onboarding onComplete={() => setIsOnboarding(false)} />;
  }

  const visiblePins =
    view === "vault"
      ? pins.filter((p) => p.isArchived)
      : view === "pins"
        ? pins.filter((p) => !p.isArchived)
        : pins.filter((p) => !p.isArchived && p.isPinned);

  const openPinObj = pins.find((p) => p.id === openPinId) || null;

  return (
    <div
      data-theme={preferences.theme}
      className="w-screen h-screen flex overflow-hidden bg-app text-app-primary"
      style={{ "--accent": preferences.accentColor } as React.CSSProperties}
    >
      <Sidebar
        view={view}
        onChangeView={setView}
        pins={pins}
        todos={todos}
        onAddTodo={addIntention}
        onToggleTodo={(id) =>
          setTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
          )
        }
        onDeleteTodo={(id) => setTodos((prev) => prev.filter((t) => t.id !== id))}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          theme={preferences.theme}
          onToggleTheme={() =>
            setPreferences((p) => ({
              ...p,
              theme: p.theme === "dark" ? "light" : "dark",
            }))
          }
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenPrefs={() => setIsPrefsOpen(true)}
          focusTimer={focusTimer}
          onToggleFocusTimer={toggleFocusTimer}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-lg font-semibold tracking-tight capitalize">
              {view === "today" ? "Pinned for today" : view}
            </h1>
            {view !== "vault" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={addBrowserPin}
                  className="flex items-center gap-1.5 text-sm font-medium text-app-secondary hover:bg-app-muted px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus size={14} />
                  New browser
                </button>
                <button
                  onClick={addNotePin}
                  className="flex items-center gap-1.5 text-sm font-medium text-app-secondary hover:bg-app-muted px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus size={14} />
                  New note
                </button>
              </div>
            )}
          </div>

          {visiblePins.length === 0 ? (
            <p className="text-sm text-app-tertiary">
              {view === "vault" ? "Vault is empty." : "Nothing here yet."}
            </p>
          ) : (
            <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
              {visiblePins.map((pin) =>
                view === "vault" ? (
                  <div
                    key={pin.id}
                    className="p-4 rounded-xl border border-app bg-surface flex flex-col gap-2"
                  >
                    <h3 className="text-sm font-medium truncate">{pin.title}</h3>
                    <button
                      onClick={() => restorePin(pin.id)}
                      className="text-xs text-accent self-start"
                    >
                      Restore
                    </button>
                  </div>
                ) : (
                  <PinCard
                    key={pin.id}
                    pin={pin}
                    onOpen={openPin}
                    onTogglePin={togglePin}
                    onArchive={archivePin}
                  />
                ),
              )}
            </div>
          )}
        </main>
      </div>

      {openPinObj && (
        <PinDetail
          pin={openPinObj}
          onClose={() => setOpenPinId(null)}
          onUpdateContent={updatePinContent}
          onSmartStack={handleSmartStack}
          isStacking={isStacking}
          onSwitchTab={switchTab}
          onAddTab={addTab}
          onCloseTab={closeTab}
          onNavigateTab={navigateTab}
        />
      )}
      {isSearchOpen && (
        <CommandPalette
          pins={pins}
          onSelect={(id) => {
            openPin(id);
            setIsSearchOpen(false);
          }}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
      {isPrefsOpen && (
        <PreferencesModal
          preferences={preferences}
          setPreferences={setPreferences}
          onClose={() => setIsPrefsOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
