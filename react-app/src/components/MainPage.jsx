import { useNavigate, useRouteLoaderData } from "react-router-dom";
import LoginPage from "./LoginPage.jsx";

const MainPage = () => {
  const user = useRouteLoaderData("root");
  const navigate = useNavigate();
  console.log(user);

  return (
    <div>
      {user ? (
        <div style={{ color: "white" }}>
          käyttäjä kirjautunut {"-->"} kirjautumislomaketta ei näytetä
          <br />
          jos haluu kirjautuu ulos ni pitää poistaa selaimesta keksi
        </div>
      ) : (
        <LoginPage />
      )}
      <button onClick={() => navigate("/dashboard")}>Dashboard</button>
    </div>
  );
};

export default MainPage;
