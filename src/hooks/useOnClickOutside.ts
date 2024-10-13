import { type RefObject, useEffect } from "react";

type Handler = (event: MouseEvent) => void;

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler,
  mouseEvent: "mousedown" | "mouseup" = "mousedown",
): void {
  const handleClick = (event: MouseEvent) => {
    const el = ref.current;

    if (!el || el.contains(event.target as Node)) {
      return;
    }

    handler(event);
  };

  useEffect(() => {
    window.addEventListener(mouseEvent, handleClick);
    return () => {
      window.removeEventListener(mouseEvent, handleClick);
    };
  }, []);
}
