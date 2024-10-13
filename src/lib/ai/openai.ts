import { CHAT_COMPLETIONS_URL } from "../../utils/constants";
import { fetcher } from "../../utils/fetcher";
import { ROLE } from "../../utils/types";

import type {
  FetchRequestOptions,
  MESSAGE_VARIANT,
  OpenAIChatCompletionChunk,
  OpenAIChatMessage,
  OpenAIStreamingParams,
} from "../../utils/types";

export interface IncomingChunk {
  content: string;
  role: ROLE;
  variant?: MESSAGE_VARIANT;
}

const textDecoder = new TextDecoder("utf-8");

export const getOpenAiRequestOptions = (
  { apiKey, ...restOfApiParams }: OpenAIStreamingParams,
  messages: OpenAIChatMessage[],
  signal?: AbortSignal,
): FetchRequestOptions => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  method: "POST",
  body: {
    ...restOfApiParams,
    messages,
    stream: true,
  },
  signal,
});

export const getChatCompletion = async (
  requestOpts: FetchRequestOptions,
  onIncomingChunk?: ({ content, role }: IncomingChunk) => void,
  onCloseStream?: (beforeTimestamp: number) => void,
) => {
  const beforeTimestamp = Date.now();

  const response = await fetcher(CHAT_COMPLETIONS_URL, requestOpts);

  if (!response.body) {
    throw new Error("No body included in POST response object.");
  }

  let content = "";
  let role = "";

  const reader = response.body.getReader();

  while (!requestOpts.signal?.aborted) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }
    const decodedData = textDecoder.decode(value as Buffer);

    const lines = decodedData.split(/(\n){2}/);
    const chunks = lines
      .map((line) => line.replace(/(\n)?^data:\s*/, "").trim())
      .filter((line) => line !== "" && line !== "[DONE]")
      .map((line) => JSON.parse(line) as OpenAIChatCompletionChunk);

    for (const chunk of chunks) {
      const contentChunk = (chunk.choices[0].delta.content ?? "").replace(/^`\s*/, "`");
      const roleChunk: ROLE = chunk.choices[0].delta.role ?? ROLE.ASSISTANT;

      content = `${content}${contentChunk}`;
      role = `${role}${roleChunk}`;

      onIncomingChunk?.({ content: contentChunk, role: roleChunk });
    }
  }

  onCloseStream?.(beforeTimestamp);

  return { content, role } as OpenAIChatMessage;
};
