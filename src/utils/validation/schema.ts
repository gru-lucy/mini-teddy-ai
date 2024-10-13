import { z } from "zod";

import { AI_MODEL } from "../types";

export const settingsSchema = z.object({
  ai: z.object({
    model: z.nativeEnum(AI_MODEL),
    apiKey: z.string(),
    max_tokens: z.number(),
    temperature: z.number(),
  }),
  systemPrompt: z.string(),
});

export const createSnippetSchema = z.object({
  title: z.string().nonempty("Title cannot be empty."),
  icon: z.string().nonempty("Icon cannot be empty."),
  prompt: z.string().nonempty("Prompt cannot be empty."),
});

export const snippetSchema = z.object({
  id: z.string(),
  title: z.string(),
  icon: z.string(),
  prompt: z.string(),
  shortcut: z.string().optional(),
  enabled: z.boolean().default(true),
});

export const actionSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  prompt: z.string(),
  url: z.string().url(),
  description: z.string(),
});

export const createActionSchema = z.object({
  name: z.string().nonempty("Title cannot be empty."),
  icon: z.string().nonempty("Icon cannot be empty."),
  prompt: z.string().nonempty("Prompt cannot be empty."),
  description: z.string().nonempty("Description cannot be empty."),
  url: z.string().nonempty("Url cannot be empty.").url("Url must be a valid url."),
});

export const messageSchema = z.object({
  prompt: z.string(),
});

export const stateSchema = z.object({
  settings: settingsSchema,
  snippets: z.array(snippetSchema),
  actions: z.array(actionSchema),
});
