import "../../css/AppError.css";
import { useEffect } from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import GithubLogo from "../GithubLogo";

const GithubError = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  import.meta.env.MODE === "development" && console.log(error?.message);

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/dashboard");
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="errorElement" style={{ color: "red" }}>
      <GithubLogo color={"#FFFFFF"} className="spin" />
      <div>An error occurred. Redirecting...</div>
    </div>
  );
};

export default GithubError;
