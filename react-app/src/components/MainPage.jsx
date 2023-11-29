import { useActionData } from "react-router-dom";
import LoginPage from "./LoginPage.jsx";
import { useSetInfo } from "../hooks/index.jsx";
import { useEffect } from "react";

const MainPage = () => {
  const errorMessages = useActionData();
  const [setInfo] = useSetInfo();
  
  useEffect(() => {
    if (errorMessages) {
      setInfo({ messages: errorMessages, severity: "error" });
    }
  }, [errorMessages]);

  return (
    <div>
      <LoginPage />
    </div>
  );
};

export default MainPage;
