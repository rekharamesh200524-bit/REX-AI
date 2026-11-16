"use client";

import React, { useState } from "react";
import { Logo } from "@/components/Logo";
import { AVAILABLE_MODELS } from "@/data/sampleData";
import { ModelOption } from "@/types/chat";
import {
  Menu,
  ChevronDown,
  Sparkles,
  Share2,
  Trash2,
  Settings,
  Plus,
  Check,
  LogIn,
} from "lucide-react";

interface TopNavProps {
  onOpenMobileSidebar: () => void;
  selectedModel: ModelOption;
  onSelectModel: (model: ModelOption) => void;
  onNewChat: () => void;
  onClearChat: () => void;
  onOpenSettings: () => void;
  hasMessages: boolean;
  isSidebarCollapsed: boolean;
  isAuthenticated?: boolean;
  onOpenAuth?: () => void;
}

export function TopNav({
  onOpenMobileSidebar,
  selectedModel,
  onSelectModel,
  onNewChat,
  onClearChat,
  onOpenSettings,
  hasMessages,
  isSidebarCollapsed,
  isAuthenticated = false,
  onOpenAuth,
}: TopNavProps) {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch {
      // fallback
    }
  };

  return (
    <header className="h-16 px-3 sm:px-6 bg-[#090B10]/80 backdrop-blur-md border-b border-[#1E2433] flex items-center justify-between select-none z-30">
      {/* Left: Mobile hamburger & Brand */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#151923] border border-[#1E2433]"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand logo (visible when sidebar is collapsed or on mobile) */}
        <div className={`transition-opacity duration-200 ${isSidebarCollapsed ? "opacity-100" : "md:hidden"}`}>
          <Logo size="sm" />
        </div>

        {/* Model Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131722] hover:bg-[#181E2C] border border-[#1E2433] hover:border-blue-500/40 text-slate-200 text-xs font-medium transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold">{selectedModel.name}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                modelDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Model options dropdown menu */}
          {modelDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setModelDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-72 rounded-xl bg-[#151923] border border-[#232B3D] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-[#1E2433] mb-1">
                  Select Intelligence Engine
                </div>
                {AVAILABLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onSelectModel(model);
                      setModelDropdownOpen(false);
                    }}
                    className={`w-full flex flex-col items-start p-2.5 rounded-lg text-left transition-colors ${
                      selectedModel.id === model.id
                        ? "bg-blue-600/15 border border-blue-500/30 text-white"
                        : "hover:bg-[#1A2130] text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-semibold">{model.name}</span>
                      {model.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {model.description}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Status / Sign in Indicator */}
        {isAuthenticated ? (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">Supabase Connected</span>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-medium transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}

        {/* Clear Messages (if has messages) */}
        {hasMessages && (
          <button
            onClick={onClearChat}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-[#181D2A] border border-transparent hover:border-[#1E2433] transition-colors"
            title="Clear current messages"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-[#131722] hover:bg-[#181E2C] border border-[#1E2433] hover:border-blue-500/30 transition-all shadow-sm"
          title="Share conversation"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Share</span>
            </>
          )}
        </button>

        {/* New Chat icon shortcut */}
        <button
          onClick={onNewChat}
          className="p-2 rounded-xl text-slate-300 hover:text-white bg-[#131722] hover:bg-[#181E2C] border border-[#1E2433] transition-colors"
          title="New Chat"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#151923] border border-transparent hover:border-[#1E2433] transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
