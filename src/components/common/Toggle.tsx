import { forwardRef } from "react";

export const Toggle = forwardRef<HTMLInputElement, JSX.IntrinsicElements["input"]>(
  ({ ...props }, ref) => (
    <label className="relative h-5 w-9">
      <input
        ref={ref}
        {...props}
        className="peer absolute w-0 h-0 cursor-pointer opacity-0"
        type="checkbox"
      />

      <span className="peer-checked:bg-yellow-100 border border-gray-200 peer-checked:before:translate-x-4 transition-colors before:transition-transform absolute cursor-pointer inset-0 bg-gray-100 rounded-xl before:absolute before:h-4 before:w-4 before:left-[1px] before:top-[1px] before:bg-white-200 before:rounded-full"></span>
    </label>
  ),
);

Toggle.displayName = "Toggle";
