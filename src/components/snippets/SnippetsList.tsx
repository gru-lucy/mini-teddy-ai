import { memo } from "react";

import { Snippet } from "./Snippet";

import type { Snippet as SnippetType } from "../../utils/types";

interface SnippetsListProps {
  readonly snippets: SnippetType[];
  readonly active: SnippetType | null;
  readonly onActivate: (snippetId: string) => void;
  readonly onDeactivate: (snippetId: string) => void;
}

export const SnippetsList = memo<SnippetsListProps>(
  ({ snippets, active, onActivate, onDeactivate }) => (
    <section className="shadow-300 z-10">
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(105px,1fr))] justify-center pr-1.5 items-center w-full flex-wrap gap-3 max-h-[82px] overflow-y-scroll">
        {snippets.map((snippet) => (
          <Snippet
            key={snippet.id}
            snippet={snippet}
            isActive={active?.id === snippet.id}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
          />
        ))}
      </ul>
    </section>
  ),
);

SnippetsList.displayName = "SnippetsList";
