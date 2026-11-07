import React from "react";
import { Pin, TodoItem } from "./types";
import { Home, Archive, Layers, Plus, Trash2 } from "lucide-react";

type View = "today" | "pins" | "vault";

interface Props {
  view: View;
  onChangeView: (v: View) => void;
  pins: Pin[];
  todos: TodoItem[];
  onAddTodo: (text: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

const NAV: { id: View; label: string; icon: React.FC<any> }[] = [
  { id: "today", label: "Today", icon: Home },
  { id: "pins", label: "All Pins", icon: Layers },
  { id: "vault", label: "Vault", icon: Archive },
];

const Sidebar: React.FC<Props> = ({
  view,
  onChangeView,
  pins,
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
}) => {
  const [draft, setDraft] = React.useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onAddTodo(draft.trim());
    setDraft("");
  };

  return (
    <aside className="w-64 shrink-0 h-full flex flex-col border-r border-app bg-surface">
      <div className="h-14 flex items-center gap-2 px-4 border-b border-app">
        <div className="w-6 h-6 rounded-md accent-bg flex items-center justify-center text-white text-xs font-bold">
          P
        </div>
        <span className="font-semibold text-sm tracking-tight">
          PinPoint
        </span>
      </div>

      <nav className="p-2 flex flex-col gap-0.5">
        {NAV.map((item) => {
          const Icon = item.icon;
          const count =
            item.id === "pins"
              ? pins.filter((p) => !p.isArchived).length
              : item.id === "vault"
                ? pins.filter((p) => p.isArchived).length
                : undefined;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-app-muted text-app-primary font-medium"
                  : "text-app-secondary hover:bg-app-muted"
              }`}
            >
              <Icon size={16} strokeWidth={2} />
              <span className="flex-1 text-left">{item.label}</span>
              {count !== undefined && count > 0 && (
                <span className="text-[11px] text-app-tertiary">{count}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-2 px-4 pt-3 pb-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-app-tertiary">
          Intentions
        </span>
      </div>

      <form onSubmit={submit} className="px-3 pb-2">
        <div className="flex items-center gap-1.5 bg-app-muted rounded-lg px-2 py-1.5">
          <Plus size={14} className="text-app-tertiary shrink-0" />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add intention..."
            className="bg-transparent text-sm outline-none flex-1 min-w-0 placeholder:text-app-tertiary"
          />
        </div>
      </form>

      <div className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-1 no-scrollbar">
        {todos.length === 0 && (
          <p className="text-xs text-app-tertiary px-2 py-1">
            Nothing set for today.
          </p>
        )}
        {todos.map((t) => (
          <div
            key={t.id}
            className="group flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-app-muted"
          >
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => onToggleTodo(t.id)}
              className="w-3.5 h-3.5 rounded accent-app shrink-0"
            />
            <span
              className={`text-sm flex-1 truncate ${t.completed ? "line-through text-app-tertiary" : "text-app-primary"}`}
            >
              {t.text}
            </span>
            <button
              onClick={() => onDeleteTodo(t.id)}
              className="opacity-0 group-hover:opacity-100 text-app-tertiary hover:text-red-500 transition-opacity"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
