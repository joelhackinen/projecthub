import { useNavigate, useRouteLoaderData, useActionData } from "react-router-dom";
import LoginPage from "./LoginPage.jsx";
import { useSetInfo } from "../hooks/index.jsx";
import { useEffect } from "react";

const MainPage = () => {
  const user = useRouteLoaderData("root");
  const navigate = useNavigate();
  const errorMessages = useActionData();
  const [setInfo] = useSetInfo();
  
  useEffect(() => {
    if (errorMessages) {
      setInfo({ messages: errorMessages, severity: "error" });
    }
  }, [errorMessages]);

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
