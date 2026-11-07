import React from "react";
import { Pin } from "./types";
import { Link2, StickyNote, Layers, Pin as PinIcon, Archive } from "lucide-react";

interface Props {
  pin: Pin;
  onOpen: (id: string) => void;
  onTogglePin: (id: string) => void;
  onArchive: (id: string) => void;
}

const TYPE_ICON: Record<Pin["type"], React.FC<any>> = {
  link: Link2,
  note: StickyNote,
  tabs: Layers,
};

const PinCard: React.FC<Props> = ({ pin, onOpen, onTogglePin, onArchive }) => {
  const Icon = TYPE_ICON[pin.type];

  return (
    <div
      onClick={() => onOpen(pin.id)}
      className="group relative flex flex-col gap-3 p-4 rounded-xl border border-app bg-surface hover:border-app-strong hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="w-8 h-8 rounded-lg bg-app-muted flex items-center justify-center text-app-secondary">
          <Icon size={15} />
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(pin.id);
            }}
            className={`w-7 h-7 flex items-center justify-center rounded-md hover:bg-app-muted ${pin.isPinned ? "text-accent" : "text-app-tertiary"}`}
            title={pin.isPinned ? "Unpin" : "Pin"}
          >
            <PinIcon size={13} fill={pin.isPinned ? "currentColor" : "none"} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchive(pin.id);
            }}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-app-muted text-app-tertiary"
            title="Archive"
          >
            <Archive size={13} />
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-app-primary line-clamp-1">
          {pin.title}
        </h3>
        <p className="text-xs text-app-tertiary mt-1 line-clamp-2 leading-relaxed">
          {pin.type === "tabs"
            ? `${pin.tabs?.length || 0} tabs`
            : pin.content}
        </p>
      </div>

      {pin.type === "tabs" && pin.tabs && pin.tabs.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {pin.tabs.slice(0, 3).map((t) => (
            <span
              key={t.id}
              className="text-[10px] px-1.5 py-0.5 rounded bg-app-muted text-app-tertiary truncate max-w-[90px]"
            >
              {t.title}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-1">
        {pin.category ? (
          <span className="text-[10px] font-medium text-accent bg-accent-soft px-1.5 py-0.5 rounded">
            {pin.category}
          </span>
        ) : (
          <span />
        )}
        {pin.focusCount > 0 && (
          <span className="text-[10px] text-app-tertiary">
            {pin.focusCount} focus{pin.focusCount === 1 ? "" : "es"}
          </span>
        )}
      </div>
    </div>
  );
};

export default PinCard;
