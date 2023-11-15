import "../../css/AppError.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AppError = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="errorElement" style={{ color: "red" }}>
      <div>something went wrong, redirecting...</div>
      <div>{import.meta.env.MODE === "development" && error?.message}</div>
    </div>
  );
};

export default AppError;
