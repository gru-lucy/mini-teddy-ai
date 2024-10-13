import { getValidatedState, saveState } from "./store";

import type { Action } from "../utils/types";

export const add = (actions: Action[], action: Omit<Action, "id">) => [
  ...actions,
  { ...action, id: crypto.randomUUID() },
];

export const remove = (actions: Action[], id: string) => actions.filter((a) => a.id !== id);

export const get = (actions: Action[], id: string) => actions.find((a) => a.id === id);

export const update = (actions: Action[], id: string, data: Partial<Action>) =>
  actions.map((a) => {
    if (a.id === id) {
      return { ...a, ...data };
    }

    return a;
  });

export const load = async () => {
  try {
    const { actions } = await getValidatedState();
    return actions;
  } catch (err) {
    console.error(err);
  }
};

export const sync = async (actions: Action[]) => {
  const prev = await getValidatedState();
  await saveState({ ...prev, actions });
};
