import { encode } from "gpt-tokenizer";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import { getIntention, intentions } from "../lib/ai/intentions";
import { type IncomingChunk, getOpenAiRequestOptions } from "../lib/ai/openai";
import { LOADING_ASSISTANT_MESSAGE, MILISECONDS_PER_SECOND } from "../utils/constants";
import { updateLastItem } from "../utils/functions";
import { type ChatMessage, type ChatMessageParams, MESSAGE_VARIANT, ROLE } from "../utils/types";

import { useActions } from "./actions.store";
import { useSettings } from "./settings.store";

interface ChatStore {
  readonly tokens: number;
  readonly messages: ChatMessage[];
  readonly isLoading: boolean;
  readonly controller: AbortController | null;
}

const createChatMessage = ({
  content,
  role,
  variant,
  ...restOfParams
}: ChatMessageParams): ChatMessage => ({
  content,
  role,
  variant: variant ?? MESSAGE_VARIANT.DEFAULT,
  timestamp: restOfParams.timestamp ?? Date.now(),
  meta: {
    loading: false,
    responseTime: "",
    chunks: [],
    ...restOfParams.meta,
  },
});

const filterMessages = (messages: ChatMessage[]) =>
  messages
    .filter(({ content }) => content.trim().length && content !== LOADING_ASSISTANT_MESSAGE)
    .filter(
      ({ variant }, index, arr) =>
        variant !== MESSAGE_VARIANT.ERROR &&
        (arr[index + 1] ? arr[index + 1].variant !== MESSAGE_VARIANT.ERROR : true),
    );

const useChat = create(
  subscribeWithSelector<ChatStore>(() => ({
    tokens: encode(useSettings.getState().settings.systemPrompt).length,
    messages: [
      createChatMessage({
        role: ROLE.SYSTEM,
        variant: MESSAGE_VARIANT.DEFAULT,
        content: useSettings.getState().settings.systemPrompt,
      }),
    ],
    controller: null,
    isLoading: false,
  })),
);

const setSystemPrompt = (systemPrompt: string) => {
  useChat.setState((prev) => ({
    ...prev,
    messages: [
      createChatMessage({
        role: ROLE.SYSTEM,
        variant: MESSAGE_VARIANT.DEFAULT,
        content: systemPrompt,
      }),
      ...prev.messages.slice(1),
    ],
  }));
};

const closeStream = (beforeTimestamp: number) => {
  const afterTimestamp = Date.now();
  const diffInSeconds = (afterTimestamp - beforeTimestamp) / MILISECONDS_PER_SECOND;
  const formattedDiff = diffInSeconds.toFixed(2) + " sec.";

  useChat.setState(({ messages }) => ({
    messages: updateLastItem<ChatMessage>((msg) => ({
      ...msg,
      timestamp: afterTimestamp,
      meta: {
        ...msg.meta,
        loading: false,
        responseTime: formattedDiff,
      },
    }))(messages),
  }));
};

const abortResponse = () => {
  const controller = useChat.getState().controller;
  if (controller) {
    controller.abort();
    useChat.setState({ controller: null });
  }
};

const setMessages = (newMessages: ChatMessageParams[]) => {
  if (!useChat.getState().isLoading) {
    useChat.setState({ messages: newMessages.map(createChatMessage) });
  }
};

const resetMessages = () => {
  abortResponse();
  useChat.setState(({ messages }) => ({
    messages: messages.filter(({ role }) => role === ROLE.SYSTEM),
  }));
};

const handleNewData = ({ content, role, variant = MESSAGE_VARIANT.DEFAULT }: IncomingChunk) => {
  useChat.setState(({ messages }) => ({
    messages: updateLastItem<ChatMessage>((msg) => ({
      content: `${msg.content.replace(LOADING_ASSISTANT_MESSAGE, "")}${content}`,
      role: msg.role,
      variant,
      timestamp: 0,
      meta: {
        ...msg.meta,
        chunks: [
          ...msg.meta.chunks,
          {
            content,
            role,
            timestamp: Date.now(),
          },
        ],
      },
    }))(messages),
  }));
};

const submitPrompt = async (newMessages: ChatMessageParams[]) => {
  const messages = useChat.getState().messages;
  const settings = useSettings.getState().settings;
  const actions = useActions.getState().actions;
  if (messages[messages.length - 1]?.meta?.loading) {
    return;
  }

  useChat.setState({ isLoading: true });

  const updatedMessages: ChatMessage[] = [
    ...messages,
    ...newMessages.map(createChatMessage),
    createChatMessage({
      content: LOADING_ASSISTANT_MESSAGE,
      role: ROLE.ASSISTANT,
      timestamp: 0,
      meta: { loading: true },
    }),
  ];

  const newController = new AbortController();
  useChat.setState({ messages: updatedMessages, controller: newController });

  const options = getOpenAiRequestOptions(
    settings.ai,
    filterMessages(updatedMessages.slice(0, -1)).map(({ content, role }) => ({
      content,
      role,
    })),
    newController.signal,
  );

  const beforeTimestamp = Date.now();
  try {
    const intention = await getIntention(settings.ai, newMessages[0].content);
    await intentions[intention].getResponse({
      options,
      handler: handleNewData,
      closeStream,
      actions,
    });
  } catch (err) {
    console.error(err);
    if (newController.signal.aborted) {
      handleNewData({
        content: "Request aborted, please try again.",
        role: ROLE.ASSISTANT,
        variant: MESSAGE_VARIANT.ERROR,
      });
    } else {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong during streaming response. Check your settings and try again.";
      handleNewData({
        content: message,
        role: ROLE.ASSISTANT,
        variant: MESSAGE_VARIANT.ERROR,
      });
    }
    closeStream(beforeTimestamp);
  } finally {
    useChat.setState({ controller: null, isLoading: false });
  }
};

useChat.subscribe(
  ({ messages }) => messages,
  (messages) => {
    const filteredMessages = filterMessages(messages);
    useChat.setState({
      tokens: filteredMessages.reduce((acc, { content }) => acc + encode(content).length, 0),
    });
  },
);

export {
  abortResponse,
  resetMessages,
  setMessages,
  submitPrompt,
  useChat,
  createChatMessage,
  filterMessages,
  setSystemPrompt,
};
