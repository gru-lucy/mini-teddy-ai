import { LogicalPosition, LogicalSize, appWindow, currentMonitor } from "@tauri-apps/api/window";
import { useState } from "react";

import { ReactComponent as CrossIcon } from "../assets/svg/cross.svg";
import { ReactComponent as LineIcon } from "../assets/svg/line.svg";
import { ReactComponent as MaximizeIcon } from "../assets/svg/maximize.svg";
import { ReactComponent as MinimizeIcon } from "../assets/svg/minimize.svg";
import { onPromise } from "../utils/functions";

export const WindowControls = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const handleCloseWindow = () => appWindow.close();

  const handleMaximizeWindow = async () => {
    const monitor = await currentMonitor();
    const factor = await appWindow.scaleFactor();

    try {
      await appWindow.setSize(new LogicalSize(650, monitor?.size.height ?? 850));

      await appWindow.setPosition(
        new LogicalPosition(
          (monitor?.position.toLogical(factor).x ?? 0) +
            (monitor?.size.toLogical(factor).width ?? 0) -
            650,
          0,
        ),
      );

      setIsMaximized(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleMinimizeWindow = async () => {
    try {
      await appWindow.setSize(new LogicalSize(650, 850));
      await appWindow.center();

      setIsMaximized(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleHideWindow = () => appWindow.minimize();

  return (
    <div data-tauri-drag-region className="w-full pt-5 px-7 cursor-grab bg-background-100">
      <div
        className="flex w-fit gap-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          className="w-3.5 h-3.5 bg-red-100 dark:bg-transparent border border-red-100 rounded-full flex justify-center items-center"
          onClick={onPromise(handleCloseWindow)}
        >
          {isHovered && <CrossIcon className="w-1.5 dark:fill-red-100" />}
        </button>
        <button
          className="w-3.5 h-3.5 bg-yellow-100 dark:bg-transparent border border-yellow-100 rounded-full flex justify-center items-center"
          onClick={onPromise(handleHideWindow)}
        >
          {isHovered && <LineIcon className="w-2 dark:stroke-yellow-100 stroke-black-100" />}
        </button>
        <button
          className="w-3.5 h-3.5 bg-green-100 dark:bg-transparent border border-green-100 rounded-full flex justify-center items-center"
          onClick={onPromise(() => (isMaximized ? handleMinimizeWindow() : handleMaximizeWindow()))}
        >
          {isHovered &&
            (isMaximized ? (
              <MinimizeIcon className="w-2 dark:fill-green-100" />
            ) : (
              <MaximizeIcon className="w-1.5 dark:fill-green-100" />
            ))}
        </button>
      </div>
    </div>
  );
};
