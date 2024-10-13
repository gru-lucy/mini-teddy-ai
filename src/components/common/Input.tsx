import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const Input = forwardRef<
  HTMLInputElement,
  JSX.IntrinsicElements["input"] & { isError?: boolean }
>(({ isError, children, ...props }, ref) => (
  <label className="relative w-full">
    {children}
    <input
      ref={ref}
      {...props}
      className={twMerge(
        "rounded-2xl px-4 py-2.5 text-sm bg-gray-400 w-full outline-none border-gray-100 border focus:border-gray-300 transition-opacity disabled:opacity-40",
        isError && "border-red-100",
        props.className,
      )}
      type={props.type ?? "text"}
    />
  </label>
));

Input.displayName = "Input";
