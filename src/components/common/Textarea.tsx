import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const Textarea = forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements["textarea"]>(
  ({ children, ...props }, ref) => (
    <label>
      {children}
      <textarea
        ref={ref}
        {...props}
        className={twMerge(
          "rounded-2xl resize-none h-auto pl-5 py-3 pr-12 bg-gray-400 w-full outline-none border-gray-100 border placeholder-gray-300 focus:border-gray-300 disabled:opacity-70 disabled:border-gray-100",
          props.className,
        )}
      ></textarea>
    </label>
  ),
);

Textarea.displayName = "Textarea";
