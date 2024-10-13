import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo } from "react";
import { useForm } from "react-hook-form";

import { ReactComponent as BinIcon } from "../../assets/svg/bin.svg";
import { onPromise } from "../../utils/functions";
import { createActionSchema } from "../../utils/validation/schema";
import { EmojiPicker } from "../common/EmojiPicker";
import { Input } from "../common/Input";
import { Textarea } from "../common/Textarea";

import type { Action, CreateActionInput } from "../../utils/types";

interface ActionFormProps {
  readonly onSubmit: (data: CreateActionInput) => void;
  readonly onDelete?: (id: string) => void;
  readonly defaultValues?: Partial<Action>;
  readonly type?: "add" | "edit";
}

export const ActionForm = memo<ActionFormProps>(
  ({ onSubmit, onDelete, defaultValues, type = "add" }) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
      control,
    } = useForm<CreateActionInput>({
      resolver: zodResolver(createActionSchema),
      defaultValues,
    });

    return (
      <form
        className="flex flex-col justify-start gap-4"
        onSubmit={onPromise(handleSubmit(onSubmit))}
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
            <Input {...register("name")}>
              <span className="text-sm block mb-1.5">Name</span>
            </Input>
            <ErrorMessage
              name="name"
              errors={errors}
              render={({ message }) => <p className="text-red-100 text-xs pl-1 mt-1">{message}</p>}
            />
          </div>
        </div>

        <div>
          <Input {...register("url")}>
            <span className="text-sm block mb-1.5">Webhook url</span>
          </Input>

          <ErrorMessage
            name="url"
            errors={errors}
            render={({ message }) => <p className="text-red-100 text-xs pl-1 mt-1">{message}</p>}
          />
        </div>

        <div>
          <Textarea {...register("description")} className="text-sm" rows={3}>
            <span className="text-sm block mb-1.5">
              Description (will be used during searching)
            </span>
          </Textarea>
          <ErrorMessage
            name="description"
            errors={errors}
            render={({ message }) => <p className="text-red-100 text-xs pl-1 -mt-1">{message}</p>}
          />
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
              <span>Delete action</span>
            </button>
          )}

          <button className="rounded-2xl border-2 p-2.5 bg-gray-100 w-full flex justify-center items-center">
            <span>{type === "add" ? "Add" : "Edit"} action</span>
          </button>
        </div>
      </form>
    );
  },
);

ActionForm.displayName = "ActionForm";
