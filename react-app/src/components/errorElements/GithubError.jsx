import "../../css/AppError.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GithubError = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/dashboard");
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="errorElement">
      GitHub authentication failed, redirecting...
    </div>
  );
};

export default GithubError;
