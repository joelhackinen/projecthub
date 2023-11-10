import { useSubmit } from "react-router-dom";

const GithubButton = () => {
  const submit = useSubmit();

  return (
    <div>
      <button
        onClick={() => {
          submit(null, { method: "post", action: "/github" });
        }}
      >
        Link your GitHub!
      </button>
    </div>
  );
};

export default GithubButton;
