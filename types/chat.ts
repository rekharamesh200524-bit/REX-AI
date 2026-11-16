export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  isLiked?: boolean;
  isDisliked?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  timeGroup: 'Today' | 'Previous 7 Days' | 'Previous 30 Days';
  messages: Message[];
}

export interface PromptCard {
  id: string;
  title: string;
  subtitle: string;
  prompt: string;
  tag: string;
  iconName: 'Cpu' | 'Layers' | 'Sparkles' | 'ShieldCheck';
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  plan: 'Pro' | 'Enterprise' | 'Free';
  initials: string;
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  badge?: string;
  isPopular?: boolean;
}

