import { isPermissionGranted, requestPermission } from "@tauri-apps/api/notification";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Input } from "../../components/common/Input";
import { Radio } from "../../components/common/Radio";
import { Textarea } from "../../components/common/Textarea";
import { updateSettings, useSettings } from "../../stores/settings.store";
import { DEFAULT_STATE, MODELS } from "../../utils/constants";
import { onPromise } from "../../utils/functions";

export const SettingsView = () => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const settings = useSettings(({ settings }) => settings);
  const { register, control, getValues, setValue } = useForm({
    defaultValues: {
      ai: settings.ai,
      systemPrompt: settings.systemPrompt,
    },
  });

  const values = useWatch({
    name: ["ai.model", "ai.apiKey", "systemPrompt"],
    control,
  });

  useEffect(() => {
    updateSettings(getValues());
  }, values);

  useEffect(() => {
    const checkNotificationPermission = async () => {
      const permissionGranted = await isPermissionGranted();
      setIsNotificationEnabled(permissionGranted);
    };

    void checkNotificationPermission();
  }, []);

  return (
    <main className="px-7 flex flex-col justify-start gap-1 h-full grow">
      <div className="flex pt-1.5 mb-1.5 justify-between items-center">
        <span className="text-sm block ">Notifications</span>
        <div className="flex items-center justify-center gap-5">
          <span className="text-sm">{isNotificationEnabled ? "✅ Enabled" : "❌ Disabled"}</span>
          {isNotificationEnabled ? null : (
            <button
              className="text-sm rounded-2xl bg-gray-100 p-2 px-6"
              onClick={onPromise(() => requestPermission())}
            >
              Enable
            </button>
          )}
        </div>
      </div>

      <form
        className="flex flex-col justify-start gap-5 mt-1.5"
        onSubmit={(e) => e.preventDefault()}
      >
        <Input {...register("ai.apiKey")}>
          <span className="text-sm block mb-1.5">
            API key, you could receive it from your{" "}
            <a
              href="https://platform.openai.com/account/api-keys"
              className="text-blue-200"
              rel="noreferrer"
            >
              account
            </a>
          </span>
        </Input>

        <div>
          <span className="text-sm block mb-1.5">
            API model, details available{" "}
            <a
              href="https://platform.openai.com/docs/models"
              className="text-blue-200"
              rel="noreferrer"
            >
              here
            </a>
          </span>
          <div className="flex justify-center gap-2">
            {MODELS.map((model) => (
              <Radio
                value={model.value}
                {...register("ai.model")}
                key={model.id}
                disabled={!model.isAvailable}
              >
                {model.label}
              </Radio>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between">
            <span className="text-sm block mb-1.5">
              System prompt - customize your assistant! ✨
            </span>
            <button
              className="text-sm hover:underline"
              onClick={() => setValue("systemPrompt", DEFAULT_STATE.settings.systemPrompt)}
            >
              Reset
            </button>
          </div>
          <Textarea {...register("systemPrompt")} className="text-sm" rows={8} />
        </div>
      </form>
    </main>
  );
};
