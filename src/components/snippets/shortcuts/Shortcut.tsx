import { type } from "@tauri-apps/api/os";
import { capitalize, debounce } from "lodash";
import { memo, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import { changeSnippetShortcut, toggleSnippet } from "../../../stores/snippets.store";
import { onPromise } from "../../../utils/functions";
import { Input } from "../../common/Input";
import { Toggle } from "../../common/Toggle";

import type { Snippet } from "../../../utils/types";
import type { OsType } from "@tauri-apps/api/os";
import type { KeyboardEvent } from "react";

interface ShortcutProps {
  readonly snippet: Snippet;
}

const replaceHyperKey = (shortcut: string[]) => {
  const macHyperKey = ["⌘", "Alt", "Ctrl", "Shift"];
  const winHyperKey = ["🪟", "Alt", "Ctrl", "Shift"];

  const isMacHyperKey = macHyperKey.every((key) => shortcut.includes(key));
  const isWinHyperKey = winHyperKey.every((key) => shortcut.includes(key));

  const shortcutWithoutHyperKey = shortcut.filter(
    (key) => !macHyperKey.includes(key) && !winHyperKey.includes(key),
  );

  return isMacHyperKey || isWinHyperKey ? ["🚀", ...shortcutWithoutHyperKey] : shortcut;
};

export const Shortcut = memo<ShortcutProps>(({ snippet }) => {
  const [os, setOs] = useState<OsType>();
  const [isFinished, setIsFinished] = useState(!!snippet.shortcut);
  const [isError, setIsError] = useState(false);
  const [shortcut, setShortcut] = useState<string[]>(
    snippet.shortcut?.split("+").filter(Boolean).length
      ? snippet.shortcut.trim().split("+").filter(Boolean)
      : [],
  );

  const debouncedKeyUp = useCallback(
    debounce(async () => {
      setIsFinished(true);
      try {
        await changeSnippetShortcut(snippet.id, shortcut.join("+").replace("Meta", "CmdOrControl"));
        setIsError(false);
      } catch (err) {
        console.error(err);
        setIsError(true);
      }
    }, 100),
    [shortcut],
  );

  useEffect(() => {
    const checkPlatform = async () => {
      const osType = await type();
      setOs(osType);
    };

    void checkPlatform();
  }, []);

  const replaceSpecialCharacters = (key: string) => {
    switch (key) {
      case " ":
        return "Space";
      case "ArrowLeft":
        return "←";
      case "ArrowRight":
        return "→";
      case "ArrowUp":
        return "↑";
      case "ArrowDown":
        return "↓";
      case "Control":
        return "Ctrl";
      case "Meta":
        return os === "Darwin" ? "⌘" : "🪟";
      case "CmdOrControl":
        return os === "Darwin" ? "⌘" : "Ctrl";
      default:
        return key;
    }
  };

  const handleKeyDownCapture = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isFinished) {
      setIsFinished(false);
      setShortcut([e.key]);
    } else {
      return setShortcut((prev) => (prev.includes(e.key) ? prev : [...prev, e.key]));
    }
  };

  return (
    <li className="grid grid-cols-[50px_1fr_1fr] gap-2 items-stretch justify-items-center">
      <div className="w-full flex justify-center items-center">
        <Toggle
          checked={snippet.enabled}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onChange={() => toggleSnippet(snippet.id)}
        />
      </div>
      <Link
        to={`/snippets/edit/${snippet.id}`}
        className={twMerge(
          "group flex w-full text-sm justify-center items-center border-2 border-solid border-yellow-100 rounded-2xl p-2.5 gap-3.5 overflow-hidden transition-opacity",
          !snippet.enabled && "opacity-40 cursor-default",
        )}
      >
        {snippet.icon}
        <span
          className={twMerge("truncate  max-w-[70%] ", snippet.enabled && "group-hover:underline")}
        >
          {snippet.title}
        </span>
      </Link>
      <Input
        className="h-full text-center"
        onKeyDownCapture={handleKeyDownCapture}
        onKeyUp={onPromise(async () => debouncedKeyUp())}
        value={replaceHyperKey(shortcut.map(replaceSpecialCharacters).map(capitalize)).join(" + ")}
        readOnly
        isError={isError}
        disabled={!snippet.enabled}
      >
        <span className="sr-only">Shortcut</span>
      </Input>
    </li>
  );
});

Shortcut.displayName = "Shortcut";
