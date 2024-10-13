import { isRegistered } from "@tauri-apps/api/globalShortcut";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import { registerShortcut, unregisterShortcut } from "../lib/shortcuts";
import { add, get, load, remove, sync, update } from "../lib/snippets";
import { DEFAULT_STATE } from "../utils/constants";

import { setSystemPrompt } from "./chat.store";
import { useSettings } from "./settings.store";

import type { Snippet } from "../utils/types";

interface SnippetsStore {
  readonly activeSnippet: Snippet | null;
  readonly snippets: Snippet[];
}

const useSnippets = create(
  subscribeWithSelector<SnippetsStore>(() => ({
    snippets: DEFAULT_STATE.snippets,
    activeSnippet: null,
  })),
);

const getSnippet = (snippetId: string) => get(useSnippets.getState().snippets, snippetId) ?? null;

const activateSnippet = (snippetId: string) =>
  useSnippets.setState({ activeSnippet: getSnippet(snippetId) });

const deactivateSnippet = () => useSnippets.setState({ activeSnippet: null });

const addSnippet = (snippet: Omit<Snippet, "id" | "enabled">) =>
  useSnippets.setState(({ snippets }) => ({ snippets: add(snippets, snippet) }));

const removeSnippet = (snippetId: string) =>
  useSnippets.setState(({ snippets }) => ({ snippets: remove(snippets, snippetId) }));

const editSnippet = (snippetId: string, data: Partial<Omit<Snippet, "id">>) =>
  useSnippets.setState(({ snippets }) => ({ snippets: update(snippets, snippetId, data) }));

const changeSnippetShortcut = async (snippetId: string, shortcut: string) => {
  const snippet = getSnippet(snippetId);

  if (!snippet) {
    return Promise.resolve();
  }

  if (snippet.shortcut) {
    const prevShortcut = snippet.shortcut;
    const isShortcutRegistered = await isRegistered(prevShortcut);
    isShortcutRegistered && (await unregisterShortcut(prevShortcut));
  }

  await registerShortcut({
    settings: useSettings.getState().settings,
    prompt: snippet.prompt,
    shortcut,
  });

  return editSnippet(snippetId, { shortcut });
};

const toggleSnippet = (snippetId: string) => {
  const snippet = getSnippet(snippetId);
  if (!snippet) {
    return null;
  }
  useSnippets.setState(({ snippets }) => ({
    snippets: update(snippets, snippetId, { enabled: !snippet.enabled }),
  }));

  const shortcut = snippet.shortcut;

  if (!shortcut) {
    return null;
  }

  return snippet.enabled
    ? unregisterShortcut(shortcut)
    : registerShortcut({ settings: useSettings.getState().settings, ...snippet, shortcut });
};

useSnippets.subscribe(
  ({ activeSnippet }) => activeSnippet,
  (activeSnippet) => {
    if (activeSnippet) {
      setSystemPrompt(activeSnippet.prompt);
    } else {
      setSystemPrompt(useSettings.getState().settings.systemPrompt);
    }
  },
);

useSnippets.subscribe(
  ({ snippets }) => snippets,
  (snippets) => void sync(snippets),
);

const loadSnippets = async () => {
  const snippets = await load();

  if (snippets) {
    useSnippets.setState((prev) => ({ ...prev, snippets }));
  }
};

void loadSnippets();

export {
  useSnippets,
  getSnippet,
  activateSnippet,
  deactivateSnippet,
  addSnippet,
  removeSnippet,
  editSnippet,
  changeSnippetShortcut,
  toggleSnippet,
};
