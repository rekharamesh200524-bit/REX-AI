"use client";

import React, { useState } from "react";
import { X, Sparkles, Sliders, Shield, Palette, Trash2, Check } from "lucide-react";
import { AVAILABLE_MODELS } from "@/data/sampleData";
import { ModelOption } from "@/types/chat";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: ModelOption;
  onSelectModel: (model: ModelOption) => void;
  onClearAllConversations: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  selectedModel,
  onSelectModel,
  onClearAllConversations,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"general" | "model" | "shortcuts">("general");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are REX AI, a senior full-stack AI assistant with deep expertise in Next.js, TypeScript, cloud architecture, and UI/UX design. Provide concise, premium-quality answers."
  );
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0D1018] border border-[#1E2433] shadow-2xl shadow-black/90 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2433] bg-[#0A0D14]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">REX AI Settings</h2>
              <p className="text-xs text-slate-400">Customize workspace preferences & models</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#151923] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Nav Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#1E2433] bg-[#0A0D14]/50">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 -mb-[1px] ${
              activeTab === "general"
                ? "text-blue-400 border-blue-500 bg-[#121622]"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            General & Prompt
          </button>
          <button
            onClick={() => setActiveTab("model")}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 -mb-[1px] ${
              activeTab === "model"
                ? "text-blue-400 border-blue-500 bg-[#121622]"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            AI Engine
          </button>
          <button
            onClick={() => setActiveTab("shortcuts")}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 -mb-[1px] ${
              activeTab === "shortcuts"
                ? "text-blue-400 border-blue-500 bg-[#121622]"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            Shortcuts
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scroll text-sm">
          {activeTab === "general" && (
            <>
              {/* Theme specification info */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-blue-400" />
                  Color Palette Theme
                </label>
                <div className="p-3 rounded-xl bg-[#151923] border border-[#1E2433] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-white block">
                      REX Stealth Dark Mode
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Background #090B10 • Sidebar #0D1018 • Cards #151923 • Electric Blue Accent
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                </div>
              </div>

              {/* Custom System Prompt */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Custom System Instructions
                </label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-[#151923] border border-[#1E2433] rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500/80 leading-relaxed custom-scroll"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Instruct REX AI on preferred tone, programming languages, and response length.
                </span>
              </div>

              {/* Data Management */}
              <div className="pt-2 border-t border-[#1E2433]">
                <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-rose-400" />
                  Data & History
                </label>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#151923] border border-[#1E2433]">
                  <div>
                    <span className="text-xs font-medium text-white block">
                      Clear Conversation History
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Delete all cached chats from local state.
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to clear all conversations?")) {
                        onClearAllConversations();
                        onClose();
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-medium transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "model" && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300 block">
                Active Intelligence Model
              </span>
              {AVAILABLE_MODELS.map((model) => (
                <div
                  key={model.id}
                  onClick={() => onSelectModel(model)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedModel.id === model.id
                      ? "bg-blue-600/15 border-blue-500/60 shadow-lg shadow-blue-500/10"
                      : "bg-[#151923] border-[#1E2433] hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-xs">
                        {model.name}
                      </span>
                      {model.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    {selectedModel.id === model.id && (
                      <Check className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{model.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "shortcuts" && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Keyboard Shortcuts
              </span>
              {[
                { label: "Send Message", keys: ["Enter"] },
                { label: "Insert New Line", keys: ["Shift", "Enter"] },
                { label: "Start New Chat", keys: ["⌘ / Ctrl", "K"] },
                { label: "Dismiss Dialogs", keys: ["Esc"] },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#151923] border border-[#1E2433]"
                >
                  <span className="text-xs text-slate-300">{item.label}</span>
                  <div className="flex items-center gap-1">
                    {item.keys.map((k, j) => (
                      <kbd
                        key={j}
                        className="px-2 py-0.5 rounded bg-[#0D1018] border border-[#232B3D] text-[11px] font-mono text-slate-300 font-semibold"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#1E2433] bg-[#0A0D14] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-[#151923] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all"
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved</span>
              </>
            ) : (
              <span>Save & Close</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

