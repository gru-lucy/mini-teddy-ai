import ReactEmojiPicker from "emoji-picker-react";
import { useRef, useState } from "react";
import { type Control, type FieldValues, type Path, useController } from "react-hook-form";

import { ReactComponent as SmileIcon } from "../../assets/svg/smile.svg";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

interface EmojiPickerProps<T extends FieldValues> {
  readonly name: Path<T>;
  readonly control: Control<T>;
}

export const EmojiPicker = <T extends FieldValues>({ name, control }: EmojiPickerProps<T>) => {
  const [open, setOpen] = useState(false);
  const { field } = useController({
    name,
    control,
  });
  const pickerRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(pickerRef, () => setOpen(false));

  return (
    <div className="relative" ref={pickerRef}>
      <button
        onClick={() => setOpen((p) => !p)}
        type="button"
        className={
          "rounded-xl h-[42px] w-[42px] bg-gray-100 border-gray-100 border flex items-center justify-center"
        }
        aria-label="Open emoji picker"
      >
        {field.value ?? <SmileIcon className="fill-black-300" />}
      </button>
      {open && (
        <div className="absolute top-12 left-0 z-10">
          <ReactEmojiPicker
            onEmojiClick={({ emoji }) => {
              setOpen(false);
              field.onChange(emoji);
            }}
          />
        </div>
      )}
    </div>
  );
};
