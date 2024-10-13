import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { ActionForm } from "../../../components/actions/ActionForm";
import { addAction } from "../../../stores/actions.store";
import { DEFAULT_ACTION_ICON } from "../../../utils/constants";

import type { CreateActionInput } from "../../../utils/types";

export const AddActionView = () => {
  const navigate = useNavigate();
  const { reset } = useForm<CreateActionInput>();

  const createAction = (data: CreateActionInput) => {
    addAction(data);
    reset();
    return navigate(-1);
  };

  return (
    <main className="px-7 flex flex-col justify-start gap-4 h-full grow">
      <ActionForm onSubmit={createAction} defaultValues={{ icon: DEFAULT_ACTION_ICON }} />
    </main>
  );
};
