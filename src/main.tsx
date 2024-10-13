import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";

import "./styles/globals.css";
import { TOASTER_CONFIG } from "./utils/constants";
import { router } from "./views/router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster
      position="bottom-right"
      containerStyle={{ padding: "20px" }}
      gutter={13}
      toastOptions={TOASTER_CONFIG}
    />
  </React.StrictMode>,
);
