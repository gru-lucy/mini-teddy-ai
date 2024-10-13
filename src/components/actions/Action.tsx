import { memo } from "react";
import { Link } from "react-router-dom";

import type { Action as ActionType } from "../../utils/types";

interface ActionProps {
  readonly action: ActionType;
}

export const Action = memo<ActionProps>(({ action }) => (
  <li className="flex w-full">
    <Link
      to={`/actions/edit/${action.id}`}
      className="group flex w-full justify-center items-center border-2 border-blue-100 rounded-2xl p-[9px] gap-3.5 overflow-hidden transition-opacity "
    >
      {action.icon}
      <span className="truncate max-w-[85%] text-sm group-hover:underline">{action.name}</span>
    </Link>
  </li>
));

Action.displayName = "Action";
