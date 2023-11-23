import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { RecoilRoot } from "recoil";
import { qclient } from "./queryClient";
import router from "./router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={qclient} >
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
    <ReactQueryDevtools />
  </QueryClientProvider>
);
