"use client";

import React, { useState } from "react";
import { Conversation, UserProfile } from "@/types/chat";
import { Logo } from "@/components/Logo";
import {
  Plus,
  MessageSquare,
  Settings,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  ExternalLink,
  Shield,
  LogOut,
  Sparkles,
  LogIn,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean; // For mobile drawer
  onClose: () => void; // For mobile drawer
  isCollapsed: boolean; // For desktop rail mode
  onToggleCollapse: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onOpenSettings: () => void;
  user: UserProfile;
  isAuthenticated?: boolean;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onOpenSettings,
  user,
  isAuthenticated = false,
  onOpenAuth,
  onSignOut,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Filter conversations by search query
  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group conversations by timeGroup
  const groups = ["Today", "Previous 7 Days", "Previous 30 Days"] as const;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col bg-[#0D1018] border-r border-[#1E2433] transition-all duration-300 ease-in-out select-none
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed ? "md:w-20" : "w-72 md:w-80"}
        `}
      >
        {/* Top Header / Logo */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#1E2433]">
          {!isCollapsed ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <Logo size="md" />
            </div>
          ) : (
            <div className="mx-auto">
              <Logo size="sm" showBadge={false} />
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#151923] border border-transparent hover:border-[#263147] transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="flex md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#151923]"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action: New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className={`w-full group flex items-center justify-center gap-2 rounded-xl py-3 px-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium text-sm shadow-lg shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] ${
              isCollapsed ? "justify-center px-0" : "justify-between"
            }`}
            title="Start a new chat"
          >
            <div className="flex items-center gap-2.5">
              <Plus className="w-4 h-4 stroke-[2.5]" />
              {!isCollapsed && <span>New Chat</span>}
            </div>
            {!isCollapsed && (
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] uppercase font-mono font-semibold rounded bg-blue-700/60 text-blue-100 border border-blue-400/30">
                ⌘K
              </kbd>
            )}
          </button>
        </div>

        {/* Search bar when expanded */}
        {!isCollapsed && (
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#131722] text-xs text-slate-200 placeholder:text-slate-500 rounded-lg pl-8 pr-3 py-2 border border-[#1E2433] focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Conversation History Area */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-4 custom-scroll">
          {isCollapsed ? (
            /* Collapsed Icon List */
            <div className="space-y-1 py-1">
              {conversations.slice(0, 8).map((c) => {
                const isActive = c.id === activeConversationId;
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelectConversation(c.id)}
                    className={`w-full h-10 rounded-lg flex items-center justify-center transition-colors relative group ${
                      isActive
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-[#151923]"
                    }`}
                    title={c.title}
                  >
                    <MessageSquare className="w-4 h-4" />
                    {/* Tooltip on hover */}
                    <div className="absolute left-full ml-3 px-2 py-1 rounded bg-[#151923] text-xs text-white whitespace-nowrap shadow-xl border border-[#1E2433] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {c.title}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Expanded Grouped List */
            <>
              {groups.map((group) => {
                const groupItems = filteredConversations.filter(
                  (c) => c.timeGroup === group
                );
                if (groupItems.length === 0) return null;

                return (
                  <div key={group} className="space-y-1">
                    <div className="px-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {group}
                    </div>
                    {groupItems.map((c) => {
                      const isActive = c.id === activeConversationId;
                      return (
                        <div
                          key={c.id}
                          className={`group relative flex items-center justify-between rounded-xl px-2.5 py-2 text-xs transition-colors cursor-pointer border ${
                            isActive
                              ? "bg-[#151923] text-white border-blue-500/40 shadow-sm shadow-blue-500/10 font-medium"
                              : "text-slate-400 hover:text-slate-200 hover:bg-[#131722] border-transparent"
                          }`}
                          onClick={() => {
                            onSelectConversation(c.id);
                            onClose();
                          }}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <MessageSquare
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isActive ? "text-blue-400" : "text-slate-500"
                              }`}
                            />
                            <span className="truncate">{c.title}</span>
                          </div>

                          {/* Delete Conversation Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteConversation(c.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/20 hover:text-rose-400 text-slate-500 transition-all shrink-0 ml-1"
                            title="Delete chat"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {filteredConversations.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500">
                  {conversations.length === 0
                    ? "No conversations yet. Start a new chat!"
                    : "No matching conversations found"}
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom Section: Settings & User Profile */}
        <div className="border-t border-[#1E2433] p-2 space-y-1 bg-[#0A0D14]/50">
          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-[#151923] transition-colors ${
              isCollapsed ? "justify-center" : "justify-start"
            }`}
            title="Open Settings"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            {!isCollapsed && <span className="font-medium">Settings</span>}
          </button>

          {/* User Profile / Auth Section */}
          <div className="relative">
            {isAuthenticated ? (
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`w-full flex items-center gap-3 p-2 rounded-xl text-left hover:bg-[#151923] border border-transparent hover:border-[#1E2433] transition-all ${
                  isCollapsed ? "justify-center p-2" : "justify-between"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Avatar with status indicator */}
                  <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shrink-0">
                    <div className="w-full h-full rounded-full bg-[#0D1018] flex items-center justify-center font-bold text-xs text-white uppercase">
                      {user.initials}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0D1018]" />
                  </div>

                  {!isCollapsed && (
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white truncate">
                          {user.name}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          {user.plan}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 truncate block">
                        {user.email}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-300 transition-all ${
                  isCollapsed ? "justify-center" : "justify-between"
                }`}
              >
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4 text-blue-400" />
                  {!isCollapsed && (
                    <div className="text-xs font-semibold">Sign in to sync</div>
                  )}
                </div>
                {!isCollapsed && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-200">
                    Supabase
                  </span>
                )}
              </button>
            )}

            {/* Profile Popover Menu */}
            {showProfileMenu && isAuthenticated && (
              <div
                className={`absolute bottom-full mb-2 bg-[#151923] border border-[#232B3D] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2 ${
                  isCollapsed ? "left-12 w-56" : "left-2 right-2"
                }`}
              >
                <div className="px-2 py-1.5 border-b border-[#1E2433] mb-1">
                  <div className="text-xs font-medium text-white">{user.name}</div>
                  <div className="text-[10px] text-slate-400">{user.email}</div>
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                    <Shield className="w-3 h-3" />
                    Supabase Auth Connected
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-[#1A2130] rounded-lg transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Workspace Preferences</span>
                </button>

                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-between px-2 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-[#1A2130] rounded-lg transition-colors"
                >
                  <span>Supabase Dashboard</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>

                <div className="my-1 border-t border-[#1E2433]" />

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onSignOut?.();
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
