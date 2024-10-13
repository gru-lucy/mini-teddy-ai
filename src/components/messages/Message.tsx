import { marked } from "marked";
import { memo } from "react";
import { twMerge } from "tailwind-merge";

import { MESSAGE_VARIANT, ROLE } from "../../utils/types";
import { Copy } from "../common/Copy";

import type { ChatMessage } from "../../utils/types";

const handleCodeBackticks = (message: string) => {
  let count = 0;
  return message.replace(/```/g, (match) => {
    count++;
    return count % 2 === 0 ? "\n```\n" : match;
  });
};

interface MessageProps {
  readonly message: ChatMessage;
}

export const Message = memo<MessageProps>(({ message }) => (
  <li className={twMerge("group flex first:pt-4", message.role === ROLE.USER && "justify-end")}>
    <div
      className={twMerge(
        "relative bg-white-100 rounded-2xl p-3 px-5 pt-1 max-w-[80%] mb-1 rounded-br-none",
        message.role === ROLE.ASSISTANT && "bg-gray-100 rounded-br-2xl rounded-bl-none",
        message.variant === MESSAGE_VARIANT.ERROR && "text-red-100 bg-red-200",
      )}
    >
      <p
        className="content"
        dangerouslySetInnerHTML={{
          __html: marked.parse(handleCodeBackticks(message.content), {
            headerIds: false,
            mangle: false,
          }),
        }}
      ></p>
      {message.role === ROLE.ASSISTANT && message.variant !== MESSAGE_VARIANT.ERROR ? (
        <div className="absolute top-3 -right-7 group-hover:block hidden">
          <Copy text={message.content} />
        </div>
      ) : null}
    </div>
  </li>
));

Message.displayName = "Message";
