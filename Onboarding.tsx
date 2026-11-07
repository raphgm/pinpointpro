import React from "react";
import { Pin } from "lucide-react";

interface Props {
  onComplete: () => void;
}

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-surface">
      <div className="flex flex-col items-center text-center max-w-sm px-6">
        <div className="w-12 h-12 rounded-2xl accent-bg flex items-center justify-center text-white mb-6">
          <Pin size={22} />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-app-tertiary bg-app-muted px-2.5 py-1 rounded-full mb-4">
          Open Source · v1.0.0
        </span>
        <h1 className="text-2xl font-semibold text-app-primary tracking-tight">
          Welcome to PinPoint Pro
        </h1>
        <p className="text-sm text-app-tertiary mt-2 leading-relaxed">
          Pin what matters, set your intentions, and stay focused — without
          the clutter.
        </p>
        <button
          onClick={onComplete}
          className="mt-6 accent-bg text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
