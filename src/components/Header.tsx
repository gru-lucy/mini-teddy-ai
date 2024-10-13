import { Link } from "react-router-dom";

import { ReactComponent as MoonIcon } from "../assets/svg/moon.svg";
import { ReactComponent as SettingsIcon } from "../assets/svg/settings.svg";
import { ReactComponent as SunIcon } from "../assets/svg/sun.svg";
import { useTheme } from "../stores/theme.store";
import { THEME } from "../utils/types";

export const Header = () => {
  const { theme, changeTheme } = useTheme();
  return (
    <header className="flex w-full justify-between items-center py-5 px-7 h-20">
      <Link to="/" className="flex gap-3 items-center justify-start">
        <img src="/logo.png" alt="bear's head but it's half robotic" width="44" height="44" />
        <div className="flex flex-col pt-0.5">
          <span className="text-sm opacity-50">AI Assistant</span>
          <h1 className="leading-tight">Teddy</h1>
        </div>
      </Link>

      <nav className="flex gap-5 items-center">
        <button onClick={() => changeTheme(theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT)}>
          {theme === THEME.LIGHT ? (
            <SunIcon className="w-6 fill-black-100" />
          ) : (
            <MoonIcon className="w-5 fill-black-100" />
          )}
        </button>
        <Link to="/settings">
          <SettingsIcon className="w-5 stroke-black-100" />
        </Link>
      </nav>
    </header>
  );
};
