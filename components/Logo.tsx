import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
}

export function Logo({ size = "md", showBadge = true }: LogoProps) {
  const iconSize = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-14 h-14",
  }[size];

  const textSize = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  }[size];

  return (
    <div className="flex items-center gap-2.5 select-none group">
      {/* Crystalline Futuristic Emblem */}
      <div className={`relative ${iconSize} flex items-center justify-center`}>
        {/* Glowing aura */}
        <div className="absolute inset-0 rounded-xl bg-blue-500/25 blur-md group-hover:bg-blue-500/40 transition-all duration-300" />
        
        {/* Outer Hexagon / Shield Frame */}
        <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 p-[1px] shadow-lg shadow-blue-500/20">
          <div className="w-full h-full rounded-[11px] bg-[#090B10] flex items-center justify-center overflow-hidden">
            {/* Tech grid reflection */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-transparent to-transparent pointer-events-none" />
            
            {/* Geometric REX Monogram / Cyber Spark */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5/6 h-5/6 text-blue-400 group-hover:text-blue-300 transition-colors drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
            >
              {/* Futuristic REX stylized emblem */}
              <path
                d="M5 4H14.5C16.9853 4 19 6.01472 19 8.5C19 10.9853 16.9853 13 14.5 13H5V4Z"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.5 13L19 20"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 13V20"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="11.5" cy="8.5" r="1.5" fill="#60A5FA" />
            </svg>
          </div>
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-wider text-white ${textSize} drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]`}>
            REX<span className="text-blue-500">.</span>AI
          </span>
          {showBadge && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
              v2.5
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

