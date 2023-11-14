import { createBrowserRouter, redirect } from "react-router-dom";
import App from "./App.jsx";
import MainPage from "./components/MainPage.jsx";
import UserDashboard from "./components/UserDashboard.jsx";
import AppError from "./components/errorElements/AppError.jsx";
import GithubError from "./components/errorElements/GithubError.jsx";

let redirectFlag = false;

const appLoader = async () => {
  if (redirectFlag) {
    return null;
  }

  const res = await fetch("/api/whoami");

  if (!res.ok) {
    redirectFlag = true;
    return redirect("/");
  }
  redirectFlag = false;

  const { firstname, lastname, email, github, url_name } = await res.json();

  localStorage.setItem("firstName", firstname);
  localStorage.setItem("lastName", lastname);
  localStorage.setItem("email", email);

  return {
    firstName: firstname,
    lastName: lastname,
    email,
    github,
    url_name,
  };
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

const logoutAction = async () => {
  await fetch("/api/logout", {
    method: "POST",
  });
  return redirect("/");
};

const registerAction = async ({ request }) => {
  const data = await request.formData();
  const firstname = data.get("firstName");
  const lastname = data.get("lastName");
  const email = data.get("email");
  const password = data.get("password");

  const res = await fetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      firstname,
      lastname,
      email,
      password,
    }),
  });

  const resObject = await res.json();

  if (!res.ok) {
    resObject.errors.forEach((error) => {
      console.log(error);
    });
    return redirect("/");
  }

  console.log(resObject);
  return redirect("/dashboard");
};

const githubAction = async () => {
  if (import.meta.env.VITE_GITHUB_CLIENT_ID) {
    return redirect(
      `https://github.com/login/oauth/authorize?client_id=${
        import.meta.env.VITE_GITHUB_CLIENT_ID
      }`,
    );
  }
  alert("ei toimi ihan vielä :D");
  return redirect("/dashboard");
};

const githubCallbackLoader = async ({ request }) => {
  const url = new URL(request.url);
  const codeParam = url.searchParams.get("code");

  const res = await fetch("/api/github/verifyUser", {
    method: "POST",
    body: JSON.stringify({ code: codeParam }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error);
  }

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
        loader: loginLoader,
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
        path: "/user/:username",
        loader: ({ params }) => {
          console.log(
            "username whose profile is to be rendered:",
            params.username,
          );
          return null;
        },
        element: <div>todo</div>,
      },
      {
        path: "/github",
        action: githubAction,
        errorElement: <GithubError />,
        children: [
          {
            path: "/github/callback/*",
            loader: githubCallbackLoader,
          },
        ],
      },
    ],
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
