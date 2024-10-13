import { getChatCompletion } from "../../openai";

import type { FetchRequestOptions } from "../../../../utils/types";
import type { IncomingChunk } from "../../openai";

const getResponse = async ({
  options,
  handler,
  closeStream,
}: {
  options: FetchRequestOptions;
  handler: (chunk: IncomingChunk) => void;
  closeStream?: (beforeTimestamp: number) => void;
}) => {
  await getChatCompletion(options, handler, closeStream);
};

export const queryIntention = {
  getResponse,
};
