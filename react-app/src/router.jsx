import { createBrowserRouter, defer, redirect } from "react-router-dom";
import App from "./App.jsx";
import MainPage from "./components/MainPage.jsx";
import UserDashboard from "./components/UserDashboard.jsx";
import AppError from "./components/errorElements/AppError.jsx";
import GithubError from "./components/errorElements/GithubError.jsx";
import { whoAmI, login, register, logout, verifyGithubUser } from "./services/auth";
import GithubCallback from "./components/GithubCallback.jsx";
import UserEditLayout from "./components/UserEditLayout.jsx";
import PublicPage from "./components/PublicPage.jsx";
import { fetchProfile } from "./services/profiles.js";

let redirectFlag = false;

const appLoader = async () => {
  if (redirectFlag) {
    return null;
  }

  const userData = await whoAmI();

  if (!userData) {
    redirectFlag = true;
    return redirect("/");
  }
  redirectFlag = false;

  return userData;
};

const dashboardLoader = () => {
  document.body.style.backgroundColor = "#C3C5C3";
  return {};
};

const loginLoader = () => {
  document.body.style.backgroundColor = "#053929";
  return {};
};

const loginAction = async ({ request }) => {
  const data = await request.formData();
  const email = data.get("loginEmail");
  const password = data.get("loginPassword");

  try {
    await login(email, password);
  } catch (e) {
    console.error(e);
    return redirect("/");
  }

  return redirect("/dashboard");
};

const logoutAction = async () => {
  try {
    await logout();
  } catch (e) {
    console.error(e);
  }

  return redirect("/");
};

const registerAction = async ({ request }) => {
  const data = await request.formData();
  const firstname = data.get("firstName");
  const lastname = data.get("lastName");
  const email = data.get("email");
  const password = data.get("password");

  try {
    await register(firstname, lastname, email, password);
  } catch (e) {
    console.error(e);
    return redirect("/");
  }

  return redirect("/dashboard");
};

const githubAction = async () => {
  if (!import.meta.env.VITE_GITHUB_CLIENT_ID) {
    throw Error("Github client id missing");
  }

  return redirect(
    `https://github.com/login/oauth/authorize?client_id=${
      import.meta.env.VITE_GITHUB_CLIENT_ID
    }`,
  );
};

const githubCallbackLoader = async ({ request }) => {
  const url = new URL(request.url);
  const codeParam = url.searchParams.get("code");

  return defer({ repos: verifyGithubUser(codeParam) });
};

const profileLoader = ({ params }) => {
  const urlName = params.url_name;
  return defer({ user: fetchProfile(urlName) });
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
        loader: loginLoader,
      },
      {
        path: "/dashboard",
        element: <UserDashboard />,
        loader: dashboardLoader,
        children: [
          {
            path: "/dashboard/edit/:formParam",
            element: <UserEditLayout />,
          },
        ],
      },
      {
        path: "/github",
        action: githubAction,
        errorElement: <GithubError />,
        children: [
          {
            path: "/github/callback",
            loader: githubCallbackLoader,
            element: <GithubCallback />,
          },
        ],
      },
    ],
  },
  {
    path: "/user/:url_name",
    loader: profileLoader,
    element: <PublicPage />,
    error: <AppError />,
  },
  {
    path: "/login",
    action: loginAction,
  },
  {
    path: "/logout",
    action: logoutAction,
  },
  {
    path: "/register",
    action: registerAction,
  },
]);

export default router;
