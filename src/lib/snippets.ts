import { registerShortcut } from "./shortcuts";
import { getValidatedState, saveState } from "./store";

import type { Snippet } from "../utils/types";

export const add = (snippets: Snippet[], snippet: Omit<Snippet, "id" | "enabled">) => {
  const id = crypto.randomUUID();

  return [...snippets, { ...snippet, id, enabled: true }];
};

export const remove = (snippets: Snippet[], id: string) => snippets.filter((s) => s.id !== id);

export const get = (snippets: Snippet[], id: string) => snippets.find((s) => s.id === id);

export const update = (snippets: Snippet[], id: string, data: Partial<Snippet>) =>
  snippets.map((s) => {
    if (s.id === id) {
      return { ...s, ...data };
    }

    return s;
  });

export const load = async () => {
  try {
    const { snippets, settings } = await getValidatedState();

    await Promise.all(
      snippets
        .filter((s): s is Snippet & { shortcut: string } => !!s.shortcut)
        .map(({ shortcut, prompt }) =>
          registerShortcut({
            shortcut,
            prompt,
            settings,
          }),
        ),
    );

    return snippets;
  } catch (err) {
    console.error(err);
  }
};

export const sync = async (snippets: Snippet[]) => {
  const prev = await getValidatedState();
  await saveState({ ...prev, snippets });
};
