import type {
  actionSchema,
  createActionSchema,
  createSnippetSchema,
  messageSchema,
  settingsSchema,
  snippetSchema,
  stateSchema,
} from "./schema";
import type { z } from "zod";

export type State = z.infer<typeof stateSchema>;

export type Settings = z.infer<typeof settingsSchema>;
export type CreateSnippetInput = z.infer<typeof createSnippetSchema>;
export type Snippet = z.infer<typeof snippetSchema>;
export type SubmitPromptInput = z.infer<typeof messageSchema>;
export type Action = z.infer<typeof actionSchema>;
export type CreateActionInput = z.infer<typeof createActionSchema>;
