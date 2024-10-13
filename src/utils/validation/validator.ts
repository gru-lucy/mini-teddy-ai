import { actionSchema, settingsSchema, snippetSchema, stateSchema } from "./schema";

import type { Action, Settings, Snippet, State } from "./types";

export const isSettings = (maybeSettings: unknown): maybeSettings is Settings =>
  settingsSchema.safeParse(maybeSettings).success;

export const isSnippet = (maybeSnippet: unknown): maybeSnippet is Snippet =>
  snippetSchema.safeParse(maybeSnippet).success;

export const isAction = (maybeAction: unknown): maybeAction is Action =>
  actionSchema.safeParse(maybeAction).success;

export const isState = (maybeState: unknown): maybeState is State =>
  stateSchema.safeParse(maybeState).success;
