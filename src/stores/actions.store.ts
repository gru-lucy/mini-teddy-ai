import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import { add, get, load, remove, sync, update } from "../lib/actions";
import { DEFAULT_STATE } from "../utils/constants";

import type { Action } from "../utils/types";

interface ActionsStore {
  readonly actions: Action[];
}

const useActions = create(
  subscribeWithSelector<ActionsStore>(() => ({
    actions: DEFAULT_STATE.actions,
  })),
);

const addAction = (action: Omit<Action, "id">) =>
  useActions.setState(({ actions }) => ({ actions: add(actions, action) }));

const removeAction = (actionId: string) =>
  useActions.setState(({ actions }) => ({ actions: remove(actions, actionId) }));

const getAction = (actionId: string) => get(useActions.getState().actions, actionId) ?? null;

const editAction = (actionId: string, data: Partial<Omit<Action, "id">>) =>
  useActions.setState(({ actions }) => ({ actions: update(actions, actionId, data) }));

useActions.subscribe(
  ({ actions }) => actions,
  (actions) => void sync(actions),
);

const loadActions = async () => {
  const actions = await load();
  useActions.setState({ actions });
};

void loadActions();

export { useActions, addAction, removeAction, getAction, editAction };
