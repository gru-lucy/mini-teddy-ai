import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { ReactComponent as PaperPlaneIcon } from "../../assets/svg/paper-plane.svg";
import { ReactComponent as StopIcon } from "../../assets/svg/stop.svg";
import { Textarea } from "../../components/common/Textarea";
import { MessagesList } from "../../components/messages/MessagesList";
import { SnippetsList } from "../../components/snippets/SnippetsList";
import { abortResponse, resetMessages, submitPrompt, useChat } from "../../stores/chat.store";
import { useSettings } from "../../stores/settings.store";
import { activateSnippet, deactivateSnippet, useSnippets } from "../../stores/snippets.store";
import { MODELS } from "../../utils/constants";
import { formatNumberWithCommas, onPromise } from "../../utils/functions";
import { ROLE } from "../../utils/types";
import { messageSchema } from "../../utils/validation/schema";

import type { SubmitPromptInput } from "../../utils/types";

export const HomeView = () => {
  const settings = useSettings(({ settings }) => settings);
  const { register, handleSubmit, reset, setFocus } = useForm<SubmitPromptInput>({
    resolver: zodResolver(messageSchema),
  });

  const { snippets, activeSnippet } = useSnippets();
  const { messages, tokens, isLoading } = useChat();
  const maxTokens = MODELS.find(({ value }) => value === settings.ai.model)?.tokenLimit ?? 0;

  const onPromptSubmit = ({ prompt }: SubmitPromptInput) => {
    reset();
    return submitPrompt([
      {
        content: prompt,
        role: ROLE.USER,
      },
    ]);
  };

  useEffect(() => {
    if (!isLoading) {
      setFocus("prompt");
    }
  }, [isLoading]);

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(onPromptSubmit)();
    }
  };

  return (
    <main className="px-7 pr-5 h-full flex flex-col justify-between grow">
      <SnippetsList
        snippets={snippets}
        active={activeSnippet}
        onActivate={activateSnippet}
        onDeactivate={deactivateSnippet}
      />
      <MessagesList
        messages={messages.filter(({ content, role }) => content && role !== ROLE.SYSTEM)}
      />

      <div className="w-full flex justify-center items-center shadow-200 relative bg-transparent h-[23px]">
        {isLoading ? (
          <button
            onClick={() => abortResponse()}
            className="flex justify-center items-center gap-2 absolute bottom-2 text-sm left-50% bg-gray-400 hover:border-gray-300 transition-colors border-2 border-gray-200 uppercase py-1.5 px-4 rounded-lg"
          >
            <StopIcon className="grow shrink-0 w-3 fill-gray-300" /> Stop
          </button>
        ) : null}
      </div>

      <form className="relative " onSubmit={onPromise(handleSubmit(onPromptSubmit))}>
        <Textarea
          className="pr-12"
          placeholder="Ask me anything..."
          onKeyDown={handleTextareaKeyDown}
          {...register("prompt")}
          disabled={isLoading}
        />

        <button className="absolute bottom-6 right-6 disabled:opacity-50" disabled={isLoading}>
          <PaperPlaneIcon className="w-4 fill-black-100" />
        </button>
      </form>

      <div className="text-sm px-3.5 flex justify-between mb-3 mt-1">
        <button onClick={() => resetMessages()} className="hover:underline">
          Clear conversation
        </button>

        <span className={twMerge(tokens > maxTokens && "text-red-100")}>
          Tokens: {formatNumberWithCommas(tokens)} / {formatNumberWithCommas(maxTokens)}
        </span>
      </div>
    </main>
  );
};
