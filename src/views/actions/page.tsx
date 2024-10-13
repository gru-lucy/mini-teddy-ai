import { Link } from "react-router-dom";

import { ReactComponent as PlusIcon } from "../../assets/svg/plus.svg";
import { ActionsList } from "../../components/actions/ActionsList";
import { useActions } from "../../stores/actions.store";

export const ActionsView = () => {
  const actions = useActions(({ actions }) => actions);

  return (
    <main className="px-7 flex flex-col justify-start gap-4 h-full grow">
      <Link to="add">
        <span className="text-sm rounded-xl border-2 p-2.5 border-gray-100 bg-gray-100 w-full flex justify-center gap-3 items-center">
          <PlusIcon className="w-3 fill-black-100" />
          Add action
        </span>
      </Link>

      <ActionsList actions={actions} />
    </main>
  );
};
