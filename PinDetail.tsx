import React, { useState } from "react";
import { Pin } from "./types";
import { X, Sparkles, Plus, ArrowLeft, ArrowRight, RotateCw } from "lucide-react";

interface Props {
  pin: Pin;
  onClose: () => void;
  onUpdateContent: (id: string, content: string) => void;
  onSmartStack: (id: string) => void;
  isStacking: boolean;
  onSwitchTab: (pinId: string, tabId: string) => void;
  onAddTab: (pinId: string, url: string) => void;
  onCloseTab: (pinId: string, tabId: string) => void;
  onNavigateTab: (pinId: string, tabId: string, url: string) => void;
}

const normalizeUrl = (raw: string) => {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const PinDetail: React.FC<Props> = ({
  pin,
  onClose,
  onUpdateContent,
  onSmartStack,
  isStacking,
  onSwitchTab,
  onAddTab,
  onCloseTab,
  onNavigateTab,
}) => {
  const activeTab = pin.tabs?.find((t) => t.isActive) || pin.tabs?.[0];
  const [addressValue, setAddressValue] = useState(activeTab?.url || "");
  const [newTabUrl, setNewTabUrl] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  React.useEffect(() => {
    setAddressValue(activeTab?.url || "");
  }, [activeTab?.id, activeTab?.url]);

  const isBrowser = pin.type === "tabs";

  const submitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTab) return;
    onNavigateTab(pin.id, activeTab.id, normalizeUrl(addressValue));
  };

  const submitNewTab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTabUrl.trim()) return;
    onAddTab(pin.id, normalizeUrl(newTabUrl));
    setNewTabUrl("");
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full flex flex-col bg-surface border border-app rounded-2xl shadow-xl overflow-hidden ${
          isBrowser ? "max-w-4xl h-[85vh]" : "max-w-lg max-h-[80vh]"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-app shrink-0">
          <h2 className="text-sm font-semibold text-app-primary truncate">
            {pin.title}
          </h2>
          <div className="flex items-center gap-2 shrink-0">
            {isBrowser && (
              <button
                onClick={() => onSmartStack(pin.id)}
                disabled={isStacking}
                className="flex items-center gap-1.5 text-xs font-medium text-accent bg-accent-soft px-2.5 py-1.5 rounded-lg disabled:opacity-50"
              >
                <Sparkles size={13} />
                {isStacking ? "Categorizing..." : "AI Smart Stack"}
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-app-muted text-app-tertiary"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {isBrowser && pin.tabs ? (
          <>
            <div className="flex items-stretch gap-1 px-3 pt-2 border-b border-app bg-app-muted overflow-x-auto no-scrollbar shrink-0">
              {pin.tabs.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onSwitchTab(pin.id, t.id)}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-t-lg text-xs cursor-pointer max-w-[160px] shrink-0 ${
                    t.isActive
                      ? "bg-surface text-app-primary font-medium"
                      : "text-app-tertiary hover:bg-app-muted-hover"
                  }`}
                >
                  <span className="truncate">{t.title || t.url || "New Tab"}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(pin.id, t.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-500"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
              <form onSubmit={submitNewTab} className="flex items-center shrink-0 pl-1">
                <input
                  value={newTabUrl}
                  onChange={(e) => setNewTabUrl(e.target.value)}
                  placeholder="+ new tab url"
                  className="text-xs bg-transparent outline-none placeholder:text-app-tertiary w-28 py-2"
                />
              </form>
            </div>

            <form
              onSubmit={submitAddress}
              className="flex items-center gap-2 px-3 py-2 border-b border-app shrink-0"
            >
              <ArrowLeft size={14} className="text-app-tertiary" />
              <ArrowRight size={14} className="text-app-tertiary" />
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="text-app-tertiary"
              >
                <RotateCw size={13} />
              </button>
              <input
                value={addressValue}
                onChange={(e) => setAddressValue(e.target.value)}
                placeholder="Enter a URL..."
                className="flex-1 text-xs bg-app-muted rounded-md px-2.5 py-1.5 outline-none"
              />
            </form>

            <div className="flex-1 min-h-0 bg-white">
              {activeTab?.url ? (
                <iframe
                  key={`${activeTab.id}-${reloadKey}`}
                  src={activeTab.url}
                  title={activeTab.title}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-app-tertiary">
                  Enter a URL above to load a page.
                </div>
              )}
            </div>
            <p className="px-3 py-1.5 text-[10px] text-app-tertiary border-t border-app shrink-0">
              Some sites block embedding (X-Frame-Options) and won't load here.
            </p>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-5">
            <textarea
              value={pin.content}
              onChange={(e) => onUpdateContent(pin.id, e.target.value)}
              className="w-full h-48 bg-transparent text-sm text-app-primary outline-none resize-none leading-relaxed"
              placeholder="Write something..."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PinDetail;
