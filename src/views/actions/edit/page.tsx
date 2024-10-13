import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { ActionForm } from "../../../components/actions/ActionForm";
import { editAction, getAction, removeAction } from "../../../stores/actions.store";

import type { CreateActionInput } from "../../../utils/types";

export const EditActionView = () => {
  const { reset } = useForm<CreateActionInput>();
  const params = useParams();
  const navigate = useNavigate();

  if (!params.id) {
    return null;
  }

  const action = getAction(params.id);

  const updateAction = (data: CreateActionInput) => {
    editAction(params.id!, data);
    reset();
    return navigate(-1);
  };

  const deleteAction = (actionId: string) => {
    removeAction(actionId);
    reset();
    return navigate(-1);
  };

  if (!action) {
    return null;
  }

  return (
    <main className="px-7 flex flex-col justify-start gap-4 h-full grow">
      <ActionForm
        onSubmit={updateAction}
        onDelete={deleteAction}
        defaultValues={action}
        type="edit"
      />
    </main>
  );
};
