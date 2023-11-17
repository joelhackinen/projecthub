import "../../css/AppError.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRouteError } from "react-router-dom";

const AppError = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  import.meta.env.MODE === "development" && console.log(error?.message);

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="errorElement" style={{ color: "red" }}>
      <div>something went wrong, redirecting...</div>
    </div>
  );
};

export default AppError;
