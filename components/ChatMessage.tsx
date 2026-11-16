"use client";

import React, { useState } from "react";
import { Message } from "@/types/chat";
import {
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Sparkles,
  User,
  Terminal,
  Info,
} from "lucide-react";

interface ChatMessageProps {
  message: Message;
  onRegenerate?: () => void;
  onCopySuccess?: () => void;
}

export function ChatMessage({
  message,
  onRegenerate,
  onCopySuccess,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const [copiedText, setCopiedText] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);

  const handleCopyText = async () => {
    try {
      const fullText = message.codeSnippet
        ? `${message.content}\n\n\`\`\`${message.codeSnippet.language}\n${message.codeSnippet.code}\n\`\`\``
        : message.content;
      await navigator.clipboard.writeText(fullText);
      setCopiedText(true);
      onCopySuccess?.();
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // fallback
    }
  };

  if (isUser) {
    return (
      <div className="flex w-full justify-end mb-6 group animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-start gap-3 max-w-[85%] md:max-w-[70%]">
          {/* User Bubble */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-slate-400 font-medium">You</span>
              <span className="text-[11px] text-slate-500">{message.timestamp}</span>
            </div>
            
            <div className="relative rounded-2xl rounded-tr-sm bg-[#151923] border border-[#1E2433] px-4 py-3 text-slate-100 shadow-md shadow-black/40 hover:border-blue-500/40 transition-colors">
              <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap select-text">
                {message.content}
              </p>
            </div>
          </div>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-700 flex items-center justify-center shrink-0 shadow-sm mt-5">
            <User className="w-4 h-4 text-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  // AI Assistant Message
  return (
    <div className="flex w-full justify-start mb-8 group animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-start gap-3.5 max-w-[95%] md:max-w-[88%] lg:max-w-[82%]">
        {/* REX AI Avatar */}
        <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-800 border border-blue-400/40 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 mt-1">
          <Sparkles className="w-4 h-4 text-blue-200 animate-pulse" />
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#090B10]" />
        </div>

        {/* AI Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header Info */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-sm font-semibold text-white tracking-wide flex items-center gap-1.5">
              REX AI
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                Assistant
              </span>
            </span>
            <span className="text-[11px] text-slate-500">{message.timestamp}</span>
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-blue-400/80 bg-blue-950/30 px-2 py-0.5 rounded-full border border-blue-800/30">
              <Info className="w-3 h-3" />
              Frontend Preview
            </div>
          </div>

          {/* AI Bubble / Content Container */}
          <div className="rounded-2xl rounded-tl-sm bg-[#121620] border border-[#1E2433] p-4 md:p-5 text-slate-200 shadow-lg shadow-black/50">
            {/* Main message text */}
            <div className="text-sm md:text-[15px] leading-relaxed text-slate-300 space-y-3 whitespace-pre-wrap select-text">
              {message.content}
            </div>

            {/* Optional Code Snippet */}
            {message.codeSnippet && (
              <div className="mt-4 rounded-xl border border-[#202738] bg-[#0A0D14] overflow-hidden shadow-inner">
                {/* Code Header */}
                <div className="flex items-center justify-between px-3.5 py-2 bg-[#121622] border-b border-[#202738]">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs font-mono text-slate-400 font-medium lowercase">
                      {message.codeSnippet.language}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(message.codeSnippet!.code)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-[#171C2B] hover:bg-[#1E2438] transition-colors"
                    title="Copy code"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Body */}
                <pre className="p-3.5 text-xs md:text-sm font-mono text-blue-200 overflow-x-auto leading-relaxed">
                  <code>{message.codeSnippet.code}</code>
                </pre>
              </div>
            )}

            {/* Actions Toolbar */}
            <div className="mt-4 pt-3 border-t border-[#1C2333] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1">
                {/* Copy Text Button */}
                <button
                  onClick={handleCopyText}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-[#1A2130] transition-colors"
                  title="Copy response"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                {/* Thumbs Up */}
                <button
                  onClick={() => setFeedback(feedback === "like" ? null : "like")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    feedback === "like"
                      ? "text-blue-400 bg-blue-500/15"
                      : "text-slate-400 hover:text-white hover:bg-[#1A2130]"
                  }`}
                  title="Helpful"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>

                {/* Thumbs Down */}
                <button
                  onClick={() => setFeedback(feedback === "dislike" ? null : "dislike")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    feedback === "dislike"
                      ? "text-rose-400 bg-rose-500/15"
                      : "text-slate-400 hover:text-white hover:bg-[#1A2130]"
                  }`}
                  title="Not helpful"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>

                {/* Regenerate */}
                {onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-[#1A2130] transition-colors ml-1"
                    title="Regenerate answer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Regenerate</span>
                  </button>
                )}
              </div>

              {/* Status Note */}
              <div className="text-[11px] text-slate-500 italic">
                Local Frontend Demo
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

