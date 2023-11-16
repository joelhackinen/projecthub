import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { qclient } from "./queryClient";
import router from "./router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={qclient} >
    <RouterProvider router={router} />
  </QueryClientProvider>
);
