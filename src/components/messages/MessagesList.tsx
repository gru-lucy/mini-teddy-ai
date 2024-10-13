import { memo, useEffect, useRef } from "react";

import { Message } from "./Message";

import type { ChatMessage } from "../../utils/types";

interface MessagesListProps {
  readonly messages: ChatMessage[];
}

export const MessagesList = memo<MessagesListProps>(({ messages }) => {
  const messagesEndRef = useRef<HTMLLIElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <section className="flex grow justify-end flex-col">
      <ul className="flex flex-col grow h-full gap-3 overflow-y-scroll basis-0 pr-1.5">
        {messages.map((message) => {
          return <Message key={message.timestamp} message={message} />;
        })}
        <li ref={messagesEndRef} />
      </ul>
    </section>
  );
});

MessagesList.displayName = "MessagesList";
