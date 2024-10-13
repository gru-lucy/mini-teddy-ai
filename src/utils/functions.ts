import type { SyntheticEvent } from "react";

export function onPromise<T>(promise: (event: SyntheticEvent) => Promise<T>) {
  return (event: SyntheticEvent) => {
    promise(event).catch((error) => {
      console.log("Unexpected error", error);
    });
  };
}

export const updateLastItem =
  <T>(msgFn: (message: T) => T) =>
  (currentMessages: T[]) =>
    currentMessages.map((msg, i) => {
      if (currentMessages.length - 1 === i) {
        return msgFn(msg);
      }
      return msg;
    });

export const formatNumberWithCommas = (number: number) =>
  number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const copyToClipboard = async (text: string) => {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    const body = document.querySelector("body");

    const textarea = document.createElement("textarea");
    body?.appendChild(textarea);

    textarea.value = text;
    textarea.select();
    document.execCommand("copy");

    body?.removeChild(textarea);
  }
};
