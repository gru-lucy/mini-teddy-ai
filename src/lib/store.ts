import { Store } from "tauri-plugin-store-api";

import { DEFAULT_STATE } from "../utils/constants";
import { isState } from "../utils/validation/validator";

import type { State } from "../utils/types";

const store = new Store(".store.dat");

export const saveState = async (value: State) => {
  try {
    await store.set("state", value);
    await store.save();
  } catch (error) {
    console.error(error);
  }
};

const getState = () => store.get("state");

export const getValidatedState = async () => {
  const state = await getState();

  if (isState(state)) {
    return state;
  }

  console.error("State is invalid. Resetting to default state.");
  await store.set("state", DEFAULT_STATE);

  return DEFAULT_STATE;
};
