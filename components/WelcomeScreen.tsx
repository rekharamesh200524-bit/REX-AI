"use client";

import React from "react";
import { SAMPLE_PROMPT_CARDS } from "@/data/sampleData";
import { Cpu, Layers, Sparkles, ShieldCheck, ArrowRight, Zap, Bot } from "lucide-react";
import { PromptCard } from "@/types/chat";

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
}

export function WelcomeScreen({ onSelectPrompt }: WelcomeScreenProps) {
  const getIcon = (iconName: PromptCard["iconName"]) => {
    switch (iconName) {
      case "Cpu":
        return <Cpu className="w-5 h-5 text-blue-400" />;
      case "Layers":
        return <Layers className="w-5 h-5 text-cyan-400" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      default:
        return <Bot className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 max-w-4xl mx-auto w-full select-none">
      {/* Background ambient glow */}
      <div className="relative w-full flex flex-col items-center text-center">
        <div className="absolute -top-24 w-72 h-72 rounded-full bg-blue-600/15 blur-3xl pointer-events-none -z-10 animate-electric-pulse" />
        <div className="absolute -top-12 w-48 h-48 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none -z-10" />

        {/* Futuristic Icon Crest */}
        <div className="mb-6 relative group">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#0D1018] border border-blue-500/40 flex items-center justify-center shadow-2xl shadow-blue-500/20">
            {/* Hex Spark SVG */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 md:w-12 md:h-12 text-blue-400 drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]"
            >
              <path
                d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-70"
              />
              <path
                d="M12 6L17 9V15L12 18L7 15V9L12 6Z"
                fill="url(#crest-grad)"
                stroke="#60A5FA"
                strokeWidth="1.2"
              />
              <circle cx="12" cy="12" r="2.2" fill="#93C5FD" />
              <defs>
                <linearGradient id="crest-grad" x1="7" y1="6" x2="17" y2="18" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3B82F6" stopOpacity="0.4" />
                  <stop offset="1" stopColor="#1E3A8A" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Badge Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-3">
          <Zap className="w-3 h-3 text-blue-400 animate-pulse" />
          Neural Engine v2.5
        </div>

        {/* Large Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
          Meet <span className="bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent">REX AI</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-xl font-normal leading-relaxed mb-8 sm:mb-10">
          Your ideas. Your questions. One intelligent assistant.
        </p>

        {/* Suggested Prompts Section Title */}
        <div className="w-full flex items-center justify-between mb-4 px-1">
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Suggested Prompts
          </span>
          <span className="text-xs text-blue-400/80">Click any card to start</span>
        </div>

        {/* Four Suggested Prompt Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full text-left">
          {SAMPLE_PROMPT_CARDS.map((card) => (
            <button
              key={card.id}
              onClick={() => onSelectPrompt(card.prompt)}
              className="group relative flex flex-col justify-between p-4 rounded-xl bg-[#151923] border border-[#1E2433] hover:border-blue-500/60 hover:bg-[#181D2A] transition-all duration-200 text-left shadow-lg shadow-black/40 hover:shadow-blue-500/10 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {/* Card top */}
              <div className="flex items-start justify-between w-full mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#0E121B] border border-[#212A3D] flex items-center justify-center group-hover:border-blue-500/40 group-hover:bg-blue-950/20 transition-colors">
                  {getIcon(card.iconName)}
                </div>
                <span className="text-[11px] font-medium text-slate-400 px-2 py-0.5 rounded-full bg-[#0D1018] border border-[#1E2433]">
                  {card.tag}
                </span>
              </div>

              {/* Card Title & Content */}
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors mb-1">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {card.subtitle}
                </p>
              </div>

              {/* Card Bottom CTA */}
              <div className="mt-3 pt-2.5 border-t border-[#1D2536] flex items-center justify-between w-full text-xs text-slate-500 group-hover:text-blue-400 transition-colors">
                <span className="font-medium">Populate prompt</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

