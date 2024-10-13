import { create } from "zustand";

import { THEME } from "../utils/types";

interface ThemeStore {
  theme: THEME;
  changeTheme: (theme: THEME) => void;
}

const getCurrentTheme = (): THEME => {
  const localStorageTheme = window.localStorage.getItem("theme");

  if (localStorageTheme === THEME.DARK || localStorageTheme === THEME.LIGHT) {
    return localStorageTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? THEME.DARK : THEME.LIGHT;
};

export const useTheme = create<ThemeStore>((set) => ({
  theme: getCurrentTheme(),
  changeTheme: (theme: THEME) => {
    set({ theme });
    window.localStorage.setItem("theme", theme);
  },
}));

useTheme.subscribe(({ theme }) => {
  const target = document.querySelector("html");

  if (theme === THEME.DARK) {
    target?.classList.add("dark");
  } else {
    target?.classList.remove("dark");
  }
});
