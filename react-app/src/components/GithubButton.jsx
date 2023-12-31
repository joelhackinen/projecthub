import { useSubmit } from "react-router-dom";
import { Button } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

const GithubButton = () => {
  const submit = useSubmit();

  return (
    <div>
      <Button
        sx={{
          border: "1px solid white",
          color: "white",
          boxShadow: "1px 1px 2px grey",
        }}
        variant="outlined"
        component="label"
        startIcon={<GitHubIcon />}
        onClick={() => {
          submit(null, { method: "post", action: "/github" });
        }}
      >
        Import projects from your Github!
      </Button>
    </div>
  );
};

export default GithubButton;
