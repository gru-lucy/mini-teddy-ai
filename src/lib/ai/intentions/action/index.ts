import { fetcher } from "../../../../utils/fetcher";
import { MESSAGE_VARIANT, ROLE } from "../../../../utils/types";
import { getChatCompletion } from "../../openai";

import { ACTION_PROMPT } from "./constants";

import type { Action, FetchRequestOptions } from "../../../../utils/types";
import type { IncomingChunk } from "../../openai";

const getActionPrompt = (actions: Action[], prompt: string) =>
  ACTION_PROMPT.replace("{{message}}", prompt).replace(
    "{{actions}}",
    actions
      .map(
        ({ id, name, description }) => `
      id: ${id}
      name: ${name}
      description: ${description}`,
      )
      .join("\n##N"),
  );

const findAction = async (options: FetchRequestOptions, actions: Action[]) => {
  const actionPrompt = getActionPrompt(actions, options.body.messages.at(-1)?.content ?? "");

  const modifiedOptions = {
    ...options,
    body: { ...options.body, messages: [{ role: ROLE.USER, content: actionPrompt }] },
  };

  const { content } = await getChatCompletion(modifiedOptions);

  return content;
};

const getResponse = async ({
  options,
  handler,
  actions,
}: {
  options: FetchRequestOptions;
  handler: (args: IncomingChunk) => void;
  actions: Action[];
}) => {
  const id = await findAction(options, actions);
  const action = actions.find((action) => action.id === id);

  if (!action) {
    return handler({
      role: ROLE.ASSISTANT,
      content: "Sorry, I didn't understand that.",
      variant: MESSAGE_VARIANT.ERROR,
    });
  }

  const modifiedOptions = {
    ...options,
    body: {
      ...options.body,
      messages: [
        { role: ROLE.SYSTEM, content: action.prompt },
        {
          content: options.body.messages.at(-1)?.content ?? "",
          role: ROLE.USER,
        },
      ],
    },
  };

  const { content } = await getChatCompletion(modifiedOptions);

  const response = await fetcher(action.url, {
    method: "POST",
    body: { content },
  });

  const data = await response.text();

  handler({
    role: ROLE.ASSISTANT,
    content: data.toString(),
  });
};

export const actionIntention = {
  getResponse,
};
