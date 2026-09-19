import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pin } from "./types";
import { Search, Link2, StickyNote, Layers } from "lucide-react";

interface Props {
  pins: Pin[];
  onSelect: (id: string) => void;
  onClose: () => void;
}

const TYPE_ICON: Record<Pin["type"], React.FC<any>> = {
  link: Link2,
  note: StickyNote,
  tabs: Layers,
};

const CommandPalette: React.FC<Props> = ({ pins, onSelect, onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const visible = pins.filter((p) => !p.isArchived);
    if (!q) return visible.slice(0, 8);
    return visible.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.tabs?.some((t) => t.title.toLowerCase().includes(q)),
    );
  }, [pins, query]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-[15vh] p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-surface border border-app rounded-xl shadow-xl overflow-hidden"
      >
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-app">
          <Search size={15} className="text-app-tertiary" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pins..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-app-tertiary"
          />
          <kbd className="text-[10px] font-mono text-app-tertiary border border-app rounded px-1.5 py-0.5">
            esc
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && (
            <p className="text-sm text-app-tertiary text-center py-6">
              No results
            </p>
          )}
          {results.map((p) => {
            const Icon = TYPE_ICON[p.type];
            return (
              <button
                key={p.id}
                onClick={() => onSelect(p.id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-app-muted text-left"
              >
                <Icon size={14} className="text-app-tertiary shrink-0" />
                <span className="text-sm text-app-primary truncate flex-1">
                  {p.title}
                </span>
                {p.category && (
                  <span className="text-[10px] text-app-tertiary shrink-0">
                    {p.category}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
