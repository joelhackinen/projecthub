import "../css/animations/spin.css";
import GithubLogo from "./GithubLogo";

const style = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "fixed",
  gap: "1rem",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
};

const GithubSpinner = ({
  msg = "Waiting for resources from Github...",
  color = "white",
}) => {
  return (
    <div style={style}>
      <GithubLogo className="spin" color={color} />
      <span style={{ color }}>{msg}</span>
    </div>
  );
};

export default GithubSpinner;
