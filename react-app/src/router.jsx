import { createBrowserRouter, redirect } from "react-router-dom";
import App from "./App.jsx";
import MainPage from "./components/MainPage.jsx";
import UserDashboard from "./components/UserDashboard.jsx";
import AppError from "./components/errorElements/AppError.jsx";

const appLoader = async () => {
  const [res1, res2 /*res3*/] = await Promise.all([
    fetch("/api/"),
    fetch("/api/dbtest"),
    //fetch('/api/whoami'),
  ]);
  return [(await res1.json()).data, await res2.json()];
};

const dashboardLoader = () => {
  document.body.style.backgroundColor  = "#C3C5C3";
  return {};
};

const loginLoader = () => {
  document.body.style.backgroundColor  = "#053929";
  return {};
};

const loginAction = async ({ request }) => {
  const data = await request.formData();
  const email = data.get("loginEmail");
  const password = data.get("loginPassword");

  const res = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    return redirect("/");
  }

  const user = await res.json();
  console.log(user);
  return redirect("/dashboard");
};


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: appLoader,
    id: "root",
    errorElement: <AppError />,
    children: [
      {
        path: "/",
        element: <MainPage />,
        loader: loginLoader
      },
      {
        path: "/dashboard",
        element: <UserDashboard />,
        loader: dashboardLoader,
        children: [
          {
            path: "/dashboard/edit",
            element: <div>todo</div>,
          },
        ],
      },
      {
        path: "/:username",
        loader: ({ params }) => {
          console.log(
            "username whose profile is to be rendered:",
            params.username,
          );
          return null;
        },
        element: <div>todo</div>,
      },
    ],
  },
  {
    path: "/login",
    action: loginAction,
  },
]);

export default router;
