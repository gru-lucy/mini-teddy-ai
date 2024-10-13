import { memo, useEffect, useState } from "react";

import { ReactComponent as CheckIcon } from "../../assets/svg/check.svg";
import { ReactComponent as CopyIcon } from "../../assets/svg/copy.svg";
import { copyToClipboard, onPromise } from "../../utils/functions";

interface CopyProps {
  readonly text: string;
}

export const Copy = memo<CopyProps>(({ text }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsCopied(false), 2000);

    return () => clearTimeout(timer);
  }, [isCopied]);

  const handleCopy = async () => {
    await copyToClipboard(text);
    setIsCopied(true);
  };
  return (
    <button onClick={onPromise(handleCopy)}>
      {isCopied ? (
        <>
          <span className="sr-only">Copied!</span>
          <CheckIcon className="fill-green-100 w-4" />
        </>
      ) : (
        <>
          <span className="sr-only">Copy</span>
          <CopyIcon className="stroke-gray-300 w-4 opacity-70 transition-all hover:opacity-100" />
        </>
      )}
    </button>
  );
});

Copy.displayName = "Copy";
