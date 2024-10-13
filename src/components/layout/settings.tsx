import { NavLink, Outlet } from "react-router-dom";

import { SETTINGS_ROUTES } from "../../utils/constants";

export const SettingsLayout = () => {
  return (
    <>
      <nav className="w-full px-7 pb-6 pt-2">
        <ul className="w-full flex justify-stretch items-center gap-2 bg-gray-100 py-1 px-1 rounded-xl">
          {SETTINGS_ROUTES.map(({ route, label }) => (
            <li key={route} className="w-full">
              <NavLink
                to={route}
                className={({ isActive }) =>
                  "flex grow justify-center rounded-xl font-bold py-2 text-[0.9rem]" +
                  (isActive ? " bg-white-100" : "")
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <Outlet />
    </>
  );
};
