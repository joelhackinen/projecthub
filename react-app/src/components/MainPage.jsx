import { useNavigate, useRouteLoaderData } from "react-router-dom";
import LoginPage from "./LoginPage.jsx";

const MainPage = () => {
  const user = useRouteLoaderData("root");
  const navigate = useNavigate();

  return (
    <div>
      {user ? (
        <div>
          <span style={{ color: "white" }}>
            käyttäjä kirjautunut {"-->"} kirjautumislomaketta ei näytetä
          </span>
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        </div>
      ) : (
        <LoginPage />
      )}
    </div>
  );
};

export default MainPage;
