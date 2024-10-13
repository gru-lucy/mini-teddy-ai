import { readText, writeText } from "@tauri-apps/api/clipboard";
import { isRegistered, register, unregister } from "@tauri-apps/api/globalShortcut";
import { sendNotification } from "@tauri-apps/api/notification";

import { ROLE } from "../utils/types";

import { getChatCompletion, getOpenAiRequestOptions } from "./ai/openai";

import type { Settings } from "../utils/types";

export const registerShortcut = async ({
  shortcut,
  settings,
  prompt,
}: {
  shortcut: string;
  settings: Settings;
  prompt: string;
}) => {
  const alreadyRegistered = await isRegistered(shortcut);
  if (alreadyRegistered) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  await register(shortcut, async () => {
    const clipboardText = (await readText())?.toString()?.trim();

    if (!clipboardText) {
      return;
    }

    const options = getOpenAiRequestOptions(settings.ai, [
      { role: ROLE.SYSTEM, content: prompt },
      { role: ROLE.USER, content: clipboardText },
    ]);

    const { content } = await getChatCompletion(options);

    await writeText(content);

    sendNotification({
      title: `Teddy`,
      body: content,
      icon: "icons/128x128.png",
    });
  });
};

export const unregisterShortcut = async (shortcut: string) => {
  await unregister(shortcut);
};
