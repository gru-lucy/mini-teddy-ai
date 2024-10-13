import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { SnippetForm } from "../../../components/snippets/SnippetForm";
import { editSnippet, getSnippet, removeSnippet } from "../../../stores/snippets.store";

import type { CreateSnippetInput } from "../../../utils/types";

export const EditSnippetView = () => {
  const { reset } = useForm<CreateSnippetInput>();
  const params = useParams();
  const navigate = useNavigate();

  if (!params.id) {
    return null;
  }

  const snippet = getSnippet(params.id);

  const updateSnippet = (data: CreateSnippetInput) => {
    editSnippet(params.id!, data);
    reset();
    return navigate(-1);
  };

  const deleteSnippet = (snippetId: string) => {
    removeSnippet(snippetId);
    reset();
    return navigate(-1);
  };

  if (!snippet) {
    return null;
  }

  return (
    <main className="px-7 flex flex-col justify-start gap-4 h-full grow">
      <SnippetForm
        onSubmit={updateSnippet}
        defaultValues={snippet}
        onDelete={deleteSnippet}
        type="edit"
      />
    </main>
  );
};
