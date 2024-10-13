import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo } from "react";
import { useForm } from "react-hook-form";

import { ReactComponent as BinIcon } from "../../assets/svg/bin.svg";
import { createSnippetSchema } from "../../utils/validation/schema";
import { EmojiPicker } from "../common/EmojiPicker";
import { Input } from "../common/Input";
import { Textarea } from "../common/Textarea";

import type { CreateSnippetInput, Snippet } from "../../utils/types";

interface SnippetFormProps {
  readonly onSubmit: (data: CreateSnippetInput) => void;
  readonly onDelete?: (id: string) => void;
  readonly defaultValues?: Partial<Snippet>;
  readonly type?: "add" | "edit";
}

export const SnippetForm = memo<SnippetFormProps>(
  ({ onSubmit, onDelete, defaultValues, type = "add" }) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
      control,
    } = useForm<CreateSnippetInput>({
      resolver: zodResolver(createSnippetSchema),
      defaultValues,
    });

    return (
      <form
        className="flex flex-col justify-start gap-4"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex gap-5">
          <div>
            <span className="text-sm block mb-1.5">Icon</span>
            <EmojiPicker name="icon" control={control} />
            <ErrorMessage
              name="icon"
              errors={errors}
              render={({ message }) => <p className="text-red-100 text-xs pl-1 mt-1">{message}</p>}
            />
          </div>

          <div className="flex-1">
            <Input {...register("title")}>
              <span className="text-sm block mb-1.5">Title</span>
            </Input>
            <ErrorMessage
              name="title"
              errors={errors}
              render={({ message }) => <p className="text-red-100 text-xs pl-1 mt-1">{message}</p>}
            />
          </div>
        </div>

        <div>
          <Textarea {...register("prompt")} className="text-sm" rows={4}>
            <span className="text-sm block mb-1.5">Prompt</span>
          </Textarea>
          <ErrorMessage
            name="prompt"
            errors={errors}
            render={({ message }) => <p className="text-red-100 text-xs pl-1 -mt-1">{message}</p>}
          />
        </div>

        <div className="mt-2 text-sm w-full flex gap-3">
          {type === "edit" && (
            <button
              type="button"
              onClick={() => defaultValues?.id && onDelete?.(defaultValues.id)}
              className="rounded-2xl border-2 p-2.5 text-white-200 bg-red-100 w-full flex gap-3 justify-center items-center"
            >
              <BinIcon className="w-4 stroke-white-200" />
              <span>Delete snippet</span>
            </button>
          )}

          <button className="rounded-2xl border-2 p-2.5 bg-gray-100 w-full flex justify-center items-center">
            <span>{type === "add" ? "Add" : "Edit"} snippet</span>
          </button>
        </div>
      </form>
    );
  },
);

SnippetForm.displayName = "SnippetForm";
