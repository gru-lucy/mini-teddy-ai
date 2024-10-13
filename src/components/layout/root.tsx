import { Outlet } from "react-router-dom";

import { Header } from "../Header";
import { WindowControls } from "../WindowControls";

export const RootLayout = () => {
  return (
    <>
      <WindowControls />
      <Header />
      <Outlet />
    </>
  );
};
