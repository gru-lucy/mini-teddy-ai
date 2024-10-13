import { INTENTION, ROLE } from "../../../utils/types";
import { getChatCompletion, getOpenAiRequestOptions } from "../openai";

import { actionIntention } from "./action";
import { INTENTION_PROMPT } from "./constants";
import { queryIntention } from "./query";

import type { Action, FetchRequestOptions, OpenAIStreamingParams } from "../../../utils/types";
import type { IncomingChunk } from "../openai";

interface IntentionStrategy {
  getResponse: ({
    options,
    handler,
    closeStream,
    actions,
  }: {
    options: FetchRequestOptions;
    handler: (chunk: IncomingChunk) => void;
    actions: Action[];
    closeStream?: (beforeTimestamp: number) => void;
  }) => Promise<void>;
}

export const intentions: Record<INTENTION, IntentionStrategy> = {
  [INTENTION.QUERY]: queryIntention,
  [INTENTION.ACTION]: actionIntention,
  [INTENTION.MEMORY]: queryIntention,
};

export const getIntention = async (params: OpenAIStreamingParams, prompt: string) => {
  const options = getOpenAiRequestOptions(params, [
    {
      content: INTENTION_PROMPT + prompt,
      role: ROLE.USER,
    },
  ]);

  const { content } = await getChatCompletion(options);

  if (Object.values<string>(INTENTION).includes(content)) {
    return content as INTENTION;
  }

  return INTENTION.QUERY;
};
