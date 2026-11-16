import { Conversation, PromptCard, ModelOption, UserProfile } from "@/types/chat";

export const SAMPLE_PROMPT_CARDS: PromptCard[] = [
  {
    id: "card-1",
    tag: "Science & Concepts",
    title: "Quantum Computing Analogy",
    subtitle: "Explain quantum computing in simple terms with a real-world analogy",
    prompt: "Explain quantum computing in simple terms with a real-world analogy that anyone can easily understand.",
    iconName: "Cpu",
  },
  {
    id: "card-2",
    tag: "Architecture",
    title: "Next.js 16 Caching Strategy",
    subtitle: "Design a high-performance Next.js 16 caching strategy",
    prompt: "Design a high-performance Next.js 16 caching strategy leveraging partial pre-rendering and server actions.",
    iconName: "Layers",
  },
  {
    id: "card-3",
    tag: "Copywriting",
    title: "Futuristic Launch Email",
    subtitle: "Draft a compelling launch email for a futuristic AI product",
    prompt: "Draft a compelling launch email for a futuristic AI product named REX AI that excites developers and creators.",
    iconName: "Sparkles",
  },
  {
    id: "card-4",
    tag: "Security",
    title: "Authentication Security Audit",
    subtitle: "Audit a smart contract or authentication flow for vulnerabilities",
    prompt: "Audit an authentication flow using JWTs, refresh token rotation, and HttpOnly cookies for potential vulnerabilities.",
    iconName: "ShieldCheck",
  },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    title: "Next.js Caching Architecture",
    updatedAt: "10m ago",
    timeGroup: "Today",
    messages: [
      {
        id: "m-1",
        role: "user",
        content: "What are the core pillars of Next.js caching architecture?",
        timestamp: "10:15 AM",
      },
      {
        id: "m-2",
        role: "assistant",
        content: `Next.js provides a multi-layer caching mechanism designed for ultra-low latency and minimal re-computation:

1. **Request Memoization**: Deduplicates identical \`fetch\` requests within a single React Server Component render tree.
2. **Data Cache**: Persists HTTP fetch responses across user requests and server deployments.
3. **Full Route Cache**: Automatically stores rendered HTML and RSC payload at build time or revalidation.
4. **Router Cache**: In-memory client-side cache storing RSC payloads per session.

Here is a quick pattern for controlling revalidation:`,
        timestamp: "10:15 AM",
        codeSnippet: {
          language: "typescript",
          code: `// Next.js Route Revalidation Pattern
export async function getREXTelemetry() {
  const res = await fetch("https://api.rex.ai/v1/metrics", {
    next: { revalidate: 60, tags: ["telemetry"] },
  });
  return res.json();
}`,
        },
      },
    ],
  },
  {
    id: "conv-2",
    title: "Cyberpunk Dark Theme Specs",
    updatedAt: "2h ago",
    timeGroup: "Today",
    messages: [
      {
        id: "m-3",
        role: "user",
        content: "Provide a sleek, futuristic dark-mode palette for an AI dashboard.",
        timestamp: "8:30 AM",
      },
      {
        id: "m-4",
        role: "assistant",
        content: `Here is the recommended premium cyberpunk dark-mode palette:

- **Deep Void Background**: \`#090B10\`
- **Stealth Sidebar**: \`#0D1018\`
- **Elevated Card Surface**: \`#151923\`
- **Electric Blue Accent**: \`#3B82F6\`
- **Cyan Secondary Glow**: \`#38BDF8\`
- **Crisp Typography**: \`#FFFFFF\` headers with soft \`#94A3B8\` subtext.`,
        timestamp: "8:31 AM",
      },
    ],
  },
  {
    id: "conv-3",
    title: "TypeScript Generics Deep Dive",
    updatedAt: "3 days ago",
    timeGroup: "Previous 7 Days",
    messages: [
      {
        id: "m-5",
        role: "user",
        content: "How do conditional types work in TypeScript?",
        timestamp: "Nov 13",
      },
      {
        id: "m-6",
        role: "assistant",
        content: "Conditional types take the form `T extends U ? X : Y`, allowing types to resolve dynamically based on relation checks.",
        timestamp: "Nov 13",
      },
    ],
  },
  {
    id: "conv-4",
    title: "Full-Stack Security Hardening",
    updatedAt: "2 weeks ago",
    timeGroup: "Previous 30 Days",
    messages: [
      {
        id: "m-7",
        role: "user",
        content: "What are the most common OWASP pitfalls in modern web apps?",
        timestamp: "Nov 02",
      },
      {
        id: "m-8",
        role: "assistant",
        content: "Key focus areas include Broken Object Level Authorization (BOLA), sensitive data exposure, and SSRF in serverless environments.",
        timestamp: "Nov 02",
      },
    ],
  },
];

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: "rex-4-omni",
    name: "REX-4 Omni",
    description: "Flagship multimodal engine. Lightning-fast with high precision.",
    badge: "Default",
    isPopular: true,
  },
  {
    id: "rex-reasoning-pro",
    name: "REX Reasoning Pro",
    description: "Deep thinking chain-of-thought for complex logic & math.",
    badge: "Heavy Logic",
  },
  {
    id: "rex-code-turbo",
    name: "REX Code Turbo",
    description: "Optimized for syntax, architecture, and code debugging.",
    badge: "Fast Dev",
  },
];

export const CURRENT_USER: UserProfile = {
  name: "Alex Mercer",
  email: "alex.mercer@rex.ai",
  plan: "Pro",
  initials: "AM",
};

