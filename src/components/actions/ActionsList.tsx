import { memo } from "react";

import { Action } from "./Action";

import type { Action as ActionType } from "../../utils/types";

interface ActionsListProps {
  readonly actions: ActionType[];
}

export const ActionsList = memo<ActionsListProps>(({ actions }) => (
  <ul className="w-full flex flex-col gap-2">
    {actions.map((action) => (
      <Action key={action.id} action={action} />
    ))}
  </ul>
));

ActionsList.displayName = "ActionsList";
