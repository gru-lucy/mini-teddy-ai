import { AI_MODEL } from "./types";

import type { Action, Settings, Snippet } from "./types";

export const MILISECONDS_PER_SECOND = 1000;

export const CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";

export const LOADING_ASSISTANT_MESSAGE = "I'm thinking...";

export const DEFAULT_SNIPPET_ICON = "🪄";
export const DEFAULT_ACTION_ICON = "☎️";

export const SETTINGS_ROUTES = [
  {
    route: "/settings",
    label: "Settings",
  },
  {
    route: "/snippets",
    label: "Snippets",
  },
  {
    route: "/actions",
    label: "Actions",
  },
] as const;

export const TOASTER_CONFIG = {
  style: {
    padding: "14px 25px",
    minWidth: "250px",
    gap: "10px",
  },
  error: {
    iconTheme: {
      primary: "var(--red-100)",
      secondary: "var(--white-200)",
    },
    style: {
      backgroundColor: "var(--red-200)",
      color: "var(--red-100)",
    },
  },
  success: {
    iconTheme: {
      primary: "var(--green-100)",
      secondary: "var(--white-200)",
    },
    style: {
      backgroundColor: "var(--green-200)",
      color: "var(--green-100)",
    },
  },
};

export const MODELS = [
  {
    id: AI_MODEL.GPT_3_5,
    value: AI_MODEL.GPT_3_5,
    label: "GPT-3.5 Turbo",
    isAvailable: true,
    tokenLimit: 16_385,
  },
  {
    id: AI_MODEL.GPT_4,
    value: AI_MODEL.GPT_4,
    label: "GPT-4",
    isAvailable: true,
    tokenLimit: 8192,
  },
] as const;

const DEFAULT_SYSTEM_PROMPT = `I'm a Teddy - superanimal, helpful assistant.
I'm strictly following these rules "to the word":
  - I always speak truthfully and gramatically correct
  - my responses are natural, friendly, easygoing and concise
  - I avoid repeating myself and my limitations
  - when I don't know the answer I say "I don't know"
  - when I don't understand the question I ask for clarification
  - when I asked I return detailed explanations
  - when I asked I return specific formats without any comments
  - I always return the requested format right away
  - I always speak in a language of the user's message down below`;

const DEFAULT_SETTINGS: Settings = {
  ai: {
    model: AI_MODEL.GPT_3_5,
    apiKey: "",
    max_tokens: 1500,
    temperature: 0.8,
  },
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
};

const DEFAULT_SNIPPETS: Snippet[] = [
  {
    id: crypto.randomUUID(),
    title: "Translate",
    icon: "🌍",
    prompt: `Translate user's message as shown in examples. If source language is English then translate to Polish. Otherwise, translate every other language to English.
Return only translated message without any comments or notes. \n\n\n Examples:
Question: What is your name? \n Answer: Jak masz na imię? \n
Question: Jak się masz? \n Answer: How are you? \n
Question: Quelle heure est-il? \n Answer: What time is it?`,
    enabled: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Fix grammar",
    icon: "📜",
    prompt:
      "Act as a Senior Copywriter. Your role is to fix all typos and grammar in user's message. Your response should be concise and user-friendly. Return only fixed message without any comments or notes.",
    enabled: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Explain step-by-step",
    icon: "💬",
    prompt: "Explain step-by-step how to achieve provided goal.",
    enabled: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Critique",
    icon: "🔥",
    prompt:
      "Now act as if you were a rocket scientist investigating provided solution to a problem. Your job is to find all flaws and faulty in logic in a given approach and provide me with the simplest way to achieve the results. Let’s work this out in a step by step way to be sure we have all the errors. ",
    enabled: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Summarize",
    icon: "🖋️",
    prompt: "Summarize the provided content. Your response should as concise as possible.",
    enabled: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Fix code",
    icon: "💿",
    prompt:
      "Act as a Senior Software Engineer. Fix all bugs in provided code. Follow best practices about writing code such as naming variables, comments, etc. Return only fixed code without any comments or notes.",
    enabled: true,
  },
  {
    id: crypto.randomUUID(),
    title: "Autocomplete",
    icon: "🔮",
    prompt:
      "Autocomplete user's message. Try to do your best with prediction what should go next in provided sentence. Return only completed message without any comments or notes.",
    enabled: true,
  },
];

const DEFAULT_ACTIONS: Action[] = [];

export const DEFAULT_STATE = {
  settings: DEFAULT_SETTINGS,
  snippets: DEFAULT_SNIPPETS,
  actions: DEFAULT_ACTIONS,
};
