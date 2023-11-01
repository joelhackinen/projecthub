import { createBrowserRouter } from "react-router-dom";
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
  return {}
}
const loginLoader = () => {
  document.body.style.backgroundColor  = "#053929";
  return {}
}
//tarvittavat api-kutsut voi tehä tuol routejen loadereissa nii periaattees ei enää tartte tunkee useEffectejä komponentteihin =D
//loader on siis vaa funktio joka suoritetaan ennen ku routen komponentti renderöidää,
//eli tismallee sama ku useEffect tyhjäl dependency arrayl

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
]);

export default router;
