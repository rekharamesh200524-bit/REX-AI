"use client";

import React, { useRef, useEffect, useState } from "react";
import { ArrowUp, Paperclip, Globe, Sparkles, X } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: (message: string) => void;
  isLoading: boolean;
  selectedModel?: string;
}

export function ChatInput({
  input,
  setInput,
  onSend,
  isLoading,
  selectedModel = "REX-4 Omni",
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [webSearchActive, setWebSearchActive] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  // Auto-resize textarea as text grows
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const nextHeight = Math.min(textarea.scrollHeight, 180);
    textarea.style.height = `${Math.max(nextHeight, 48)}px`;
  }, [input]);

  // Handle Enter to send, Shift + Enter for new line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput("");
    setAttachedFile(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
    }
  };

  const handleMockAttachment = () => {
    if (attachedFile) {
      setAttachedFile(null);
    } else {
      setAttachedFile("architecture-spec.pdf");
    }
  };

  const isSendDisabled = !input.trim() || isLoading;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 pb-4 pt-2">
      {/* Attached file chip if any */}
      {attachedFile && (
        <div className="mb-2 flex items-center gap-2 max-w-fit px-3 py-1 rounded-lg bg-[#151923] border border-blue-500/40 text-xs text-blue-300">
          <Paperclip className="w-3.5 h-3.5 text-blue-400" />
          <span>{attachedFile}</span>
          <button
            onClick={() => setAttachedFile(null)}
            className="hover:text-white p-0.5"
            title="Remove attachment"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Rounded Input Box */}
      <div className="relative rounded-2xl bg-[#151923] border border-[#1E2433] shadow-2xl shadow-black/80 focus-within:border-blue-500/80 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
        {/* Text Area */}
        <div className="pt-3.5 px-4">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask REX AI anything... (Shift + Enter for a new line)"
            rows={1}
            disabled={isLoading}
            className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 text-sm md:text-base resize-none focus:outline-none min-h-[48px] max-h-[180px] leading-relaxed custom-scroll"
          />
        </div>

        {/* Action Toolbar Inside Box */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1 border-t border-[#1C2230]">
          {/* Left tools */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Model Badge */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0E121B] border border-[#202738] text-[11px] font-medium text-slate-400">
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>{selectedModel}</span>
            </div>

            {/* Web Search Toggle */}
            <button
              type="button"
              onClick={() => setWebSearchActive(!webSearchActive)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                webSearchActive
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#1C2333]"
              }`}
              title="Toggle Live Web Grounding"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {webSearchActive ? "Web: On" : "Search"}
              </span>
            </button>

            {/* Attach File Button */}
            <button
              type="button"
              onClick={handleMockAttachment}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                attachedFile
                  ? "text-blue-400 bg-blue-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#1C2333]"
              }`}
              title="Attach File or Context"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </div>

          {/* Right send button & helper */}
          <div className="flex items-center gap-2">
            <span className="hidden lg:inline text-[11px] text-slate-500 select-none">
              Press <kbd className="px-1 py-0.5 rounded bg-[#10141E] border border-[#202738] text-slate-400 font-mono text-[10px]">↵</kbd> to send
            </span>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSendDisabled}
              aria-label="Send message"
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isSendDisabled
                  ? "bg-[#1A202E] text-slate-600 cursor-not-allowed opacity-60"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95"
              }`}
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Legal & Version Disclaimer */}
      <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-slate-500 text-center select-none">
        <span>REX AI can make mistakes. Verify important information.</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline text-slate-600 font-medium">Frontend Demo v2.5</span>
      </div>
    </div>
  );
}

