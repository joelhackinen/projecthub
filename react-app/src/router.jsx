import { createBrowserRouter, defer, redirect } from "react-router-dom";
import App from "./App.jsx";
import MainPage from "./components/MainPage.jsx";
import UserDashboard from "./components/UserDashboard.jsx";
import AppError from "./components/errorElements/AppError.jsx";
import GithubError from "./components/errorElements/GithubError.jsx";
import {
  whoAmI,
  login,
  register,
  logout,
  verifyGithubUser,
} from "./services/auth";
import GithubCallback from "./components/GithubCallback.jsx";
import UserEditLayout from "./components/UserEditLayout.jsx";
import PublicPage from "./components/PublicPage.jsx";
import PublicPageProject from "./components/PublicPageProject.jsx";
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

const loginLoader = () => {
  document.body.style.backgroundColor = "#1F2833";
  return {};
};

const enterAction = async ({ request }) => {
  const data = await request.formData();
  const intent = data.get("intent");

  if (intent === "login") {
    try {
      await login(data.get("loginEmail"), data.get("loginPassword"));
    } catch (error) {
      return error.messages;
    }
    return redirect("/dashboard");
  }

  if (intent === "register") {
    try {
      await register(
        data.get("firstName"),
        data.get("lastName"),
        data.get("email"),
        data.get("password"),
      );
    } catch (error) {
      return error.messages;
    }
    return redirect("/dashboard");
  }
  return redirect("/");
};

const logoutAction = async () => {
  try {
    await logout();
  } catch (e) {
    console.error(e);
  }

  return redirect("/");
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
  document.body.style.backgroundColor = "#C3C5C3";
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
        action: enterAction,
      },
      {
        path: "/dashboard",
        element: <UserDashboard />,
        children: [
          {
            path: "/dashboard/edit/:formParam",
            element: <UserEditLayout />,
          },
          {
            path: "/dashboard/edit/:formParam/:projectId",
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
    children: [
      {
        path: ":id",
        element: <PublicPageProject />,
      },
    ],
  },
  {
    path: "/logout",
    action: logoutAction,
  },
]);

export default router;
