"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex w-full justify-start mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-start gap-3.5 max-w-[85%] md:max-w-[70%]">
        {/* REX AI Avatar with pulsating ring */}
        <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-800 border border-blue-400/50 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/25">
          <Sparkles className="w-4 h-4 text-blue-200 animate-spin [animation-duration:3s]" />
          <span className="absolute inset-0 rounded-lg border border-blue-400/40 animate-ping opacity-30" />
        </div>

        {/* Typing bubble */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-slate-300">REX AI</span>
            <span className="text-[11px] text-blue-400/90 animate-pulse font-medium">
              Thinking...
            </span>
          </div>

          <div className="rounded-2xl rounded-tl-sm bg-[#121620] border border-[#1E2433] px-4 py-3.5 text-slate-300 shadow-lg shadow-black/50 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
            </div>
            <span className="text-xs text-slate-400 select-none">
              Synthesizing response...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

