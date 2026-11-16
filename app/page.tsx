"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Conversation, Message, ModelOption, UserProfile } from "@/types/chat";
import {
  AVAILABLE_MODELS,
  CURRENT_USER,
} from "@/data/sampleData";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ChatMessage } from "@/components/ChatMessage";
import { TypingIndicator } from "@/components/TypingIndicator";
import { ChatInput } from "@/components/ChatInput";
import { SettingsModal } from "@/components/SettingsModal";
import { AuthModal } from "@/components/AuthModal";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";
import { generateRexResponse } from "@/lib/services/rexAiService";

function calculateTimeGroup(
  dateString: string
): "Today" | "Previous 7 Days" | "Previous 30 Days" {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays <= 0) return "Today";
    if (diffDays <= 7) return "Previous 7 Days";
    return "Previous 30 Days";
  } catch {
    return "Today";
  }
}

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    null
  );
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(
    AVAILABLE_MODELS[0]
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, isLoading]);

  // Fetch conversations from Supabase via API route
  const loadUserConversations = useCallback(async () => {
    try {
      setIsHistoryLoading(true);
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        if (data.conversations && Array.isArray(data.conversations)) {
          const formatted: Conversation[] = data.conversations.map(
            (c: {
              id: string;
              title: string;
              updated_at: string;
              created_at: string;
            }) => ({
              id: c.id,
              title: c.title,
              updatedAt: new Date(c.updated_at).toLocaleDateString(),
              timeGroup: calculateTimeGroup(c.updated_at),
              messages: [],
            })
          );
          setConversations(formatted);
        }
      }
    } catch {
      // Ignored if unauthenticated or network error
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  // Listen to Supabase Auth State
  useEffect(() => {
    const supabase = getBrowserSupabaseClient();

    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setIsAuthenticated(true);
          const email = user.email || "user@rex.ai";
          const initials = email.slice(0, 2).toUpperCase();
          setCurrentUser({
            name: email.split("@")[0],
            email,
            plan: "Pro",
            initials,
          });
          loadUserConversations();
        } else {
          setIsAuthenticated(false);
          setConversations([]);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        const email = session.user.email || "user@rex.ai";
        const initials = email.slice(0, 2).toUpperCase();
        setCurrentUser({
          name: email.split("@")[0],
          email,
          plan: "Pro",
          initials,
        });
        loadUserConversations();
      } else {
        setIsAuthenticated(false);
        setConversations([]);
        setActiveConversationId(null);
        setActiveMessages([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUserConversations]);

  // Keyboard shortcut: Cmd+K / Ctrl+K for New Chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Switch conversation and load its messages
  const handleSelectConversation = async (id: string) => {
    if (activeConversationId === id) return;

    setActiveConversationId(id);
    setActiveMessages([]);

    if (isAuthenticated) {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/conversations/${id}/messages`);
        if (res.ok) {
          const data = await res.json();
          if (data.messages && Array.isArray(data.messages)) {
            const loadedMessages: Message[] = data.messages.map(
              (m: {
                id: string;
                role: string;
                content: string;
                created_at: string;
              }) => ({
                id: m.id,
                role: m.role as "user" | "assistant",
                content: m.content,
                timestamp: new Date(m.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              })
            );
            setActiveMessages(loadedMessages);
          }
        } else {
          showToast("Failed to load conversation history.");
        }
      } catch {
        showToast("Error connecting to database.");
      } finally {
        setIsLoading(false);
      }
    } else {
      const found = conversations.find((c) => c.id === id);
      if (found) {
        setActiveMessages(found.messages);
      }
    }
  };

  // Start a new chat without deleting previous conversations
  const handleNewChat = () => {
    setActiveConversationId(null);
    setActiveMessages([]);
    setInput("");
    showToast("Started a new chat");
  };

  // Clear current active conversation messages
  const handleClearChat = () => {
    setActiveMessages([]);
    showToast("Current chat cleared");
  };

  // Delete a conversation from Supabase and UI
  const handleDeleteConversation = async (id: string) => {
    if (isAuthenticated) {
      try {
        const res = await fetch(`/api/conversations/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setConversations((prev) => prev.filter((c) => c.id !== id));
          if (activeConversationId === id) {
            handleNewChat();
          }
          showToast("Conversation deleted from Supabase");
        } else {
          showToast("Failed to delete conversation.");
        }
      } catch {
        showToast("Error deleting conversation.");
      }
    } else {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) {
        handleNewChat();
      }
      showToast("Chat removed");
    }
  };

  // Clear all conversations
  const handleClearAllConversations = async () => {
    if (isAuthenticated) {
      for (const conv of conversations) {
        await fetch(`/api/conversations/${conv.id}`, { method: "DELETE" }).catch(
          () => {}
        );
      }
      setConversations([]);
      handleNewChat();
      showToast("All conversations deleted from Supabase");
    } else {
      setConversations([]);
      handleNewChat();
      showToast("All conversations deleted");
    }
  };

  // Suggested prompt click: Populates the input
  const handleSelectPrompt = (promptText: string) => {
    setInput(promptText);
    showToast("Prompt copied to input");
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      const supabase = getBrowserSupabaseClient();
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      showToast("Signed out successfully");
    } catch {
      showToast("Error signing out");
    }
  };

  // Send message
  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userTimestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      timestamp: userTimestamp,
    };

    // 1. Immediately display user message in the chat interface
    const updatedMessages = [...activeMessages, tempUserMessage];
    setActiveMessages(updatedMessages);
    setIsLoading(true);

    if (isAuthenticated) {
      try {
        let convId = activeConversationId;

        // If no active conversation exists, create one in Supabase first
        if (!convId) {
          const title =
            content.length > 32 ? `${content.slice(0, 32)}...` : content;
          const convRes = await fetch("/api/conversations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
          });

          if (!convRes.ok) {
            throw new Error("Failed to create conversation in Supabase.");
          }

          const convData = await convRes.json();
          convId = convData.conversation.id;
          setActiveConversationId(convId);

          const newConv: Conversation = {
            id: convId!,
            title,
            updatedAt: "Just now",
            timeGroup: "Today",
            messages: updatedMessages,
          };
          setConversations((prev) => [newConv, ...prev]);
        }

        // Send and save message in Supabase (returns user + assistant messages)
        const msgRes = await fetch(`/api/conversations/${convId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content,
            model: selectedModel.name,
          }),
        });

        if (!msgRes.ok) {
          throw new Error("Failed to save message in Supabase.");
        }

        const msgData = await msgRes.json();

        const realUserMessage: Message = {
          id: msgData.userMessage.id,
          role: "user",
          content: msgData.userMessage.content,
          timestamp: new Date(msgData.userMessage.created_at).toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          ),
        };

        const realAiMessage: Message = {
          id: msgData.assistantMessage.id,
          role: "assistant",
          content: msgData.assistantMessage.content,
          timestamp: new Date(
            msgData.assistantMessage.created_at
          ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          codeSnippet: msgData.codeSnippet,
        };

        const finalizedMessages = [
          ...activeMessages.filter((m) => m.id !== tempUserMessage.id),
          realUserMessage,
          realAiMessage,
        ];

        setActiveMessages(finalizedMessages);

        // Update sidebar conversations list order and timestamp
        setConversations((prev) => {
          const target = prev.find((c) => c.id === convId);
          if (!target) return prev;
          const rest = prev.filter((c) => c.id !== convId);
          return [
            {
              ...target,
              updatedAt: "Just now",
              timeGroup: "Today",
              messages: finalizedMessages,
            },
            ...rest,
          ];
        });
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : "Error sending message";
        showToast(errorMsg);

        // Fallback: Show local assistant response
        const fallbackResponse = await generateRexResponse(
          content,
          selectedModel.name
        );
        const fallbackAiMessage: Message = {
          id: `fallback-${Date.now()}`,
          role: "assistant",
          content: fallbackResponse.content,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          codeSnippet: fallbackResponse.codeSnippet,
        };
        setActiveMessages([...updatedMessages, fallbackAiMessage]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Unauthenticated demo flow
      showToast("Sign in to save this chat to Supabase!");
      const aiResponse = await generateRexResponse(content, selectedModel.name);
      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: aiResponse.content,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        codeSnippet: aiResponse.codeSnippet,
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setActiveMessages(finalMessages);
      setIsLoading(false);

      let currentId = activeConversationId;
      if (!currentId) {
        currentId = `conv-${Date.now()}`;
        const newTitle =
          content.length > 30 ? `${content.slice(0, 30)}...` : content;
        const newConv: Conversation = {
          id: currentId,
          title: newTitle,
          updatedAt: "Just now",
          timeGroup: "Today",
          messages: finalMessages,
        };
        setActiveConversationId(currentId);
        setConversations((prev) => [newConv, ...prev]);
      }
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090B10] text-slate-100 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-[#151923] border border-blue-500/40 text-blue-200 text-xs font-medium shadow-2xl shadow-blue-500/10 animate-in fade-in slide-in-from-top-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* 1. LEFT SIDEBAR */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onOpenSettings={() => setIsSettingsOpen(true)}
        user={currentUser}
        isAuthenticated={isAuthenticated}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* 2. MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-[#090B10] relative">
        {/* Top Navigation */}
        <TopNav
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          onNewChat={handleNewChat}
          onClearChat={handleClearChat}
          onOpenSettings={() => setIsSettingsOpen(true)}
          hasMessages={activeMessages.length > 0}
          isSidebarCollapsed={isSidebarCollapsed}
          isAuthenticated={isAuthenticated}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        {/* Scrollable Center Area: Welcome Screen OR Chat Messages */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 custom-scroll flex flex-col">
          {isHistoryLoading ? (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-500 animate-pulse">
              Loading conversation history from Supabase...
            </div>
          ) : activeMessages.length === 0 ? (
            <WelcomeScreen onSelectPrompt={handleSelectPrompt} />
          ) : (
            <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col justify-start">
              {activeMessages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onCopySuccess={() => showToast("Copied to clipboard")}
                />
              ))}

              {/* Typing / Loading Indicator */}
              {isLoading && <TypingIndicator />}

              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </main>

        {/* 3. MESSAGE INPUT */}
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={handleSend}
          isLoading={isLoading}
          selectedModel={selectedModel.name}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        onClearAllConversations={handleClearAllConversations}
      />

      {/* Supabase Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(email) => {
          showToast(`Logged in as ${email}`);
          loadUserConversations();
        }}
      />
    </div>
  );
}
