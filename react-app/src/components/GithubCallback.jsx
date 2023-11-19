import { Suspense, useState } from "react";
import { Await, useAsyncValue, useLoaderData, Link, useNavigate } from "react-router-dom";
import { useAddRepos } from "../hooks";
import GithubSpinner from "./GithubSpinner";


const GithubRepos = () => {
  const repos = useAsyncValue();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const addRepos = useAddRepos();

  const handleClick = (r) => {
    if (selected.includes(r)) {
      setSelected(selected.filter(s => s.full_name !== r.full_name));
      return;
    }
    setSelected(selected.concat(r));
  };

  const applyRepos = async () => {
    if (selected.length !== 0) {
      addRepos(selected);
      return navigate("/dashboard");
    }
  };

  return (
    <div style={{ color: "white" }}>
      <h3>{repos.length} new repos found</h3>
      <h4>Select the repositories you want to import</h4>
      <div style={{display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        {repos.map((r, i) => (
          <div key={i}
            style={{
              borderStyle: "solid",
              borderColor: selected.includes(r) ? "blue" : "white"
            }}
            onClick={() => handleClick(r)}
          >
            owner: {r.owner}<br />
            name: {r.name}<br />
            full_name: {r.full_name}<br />
            created_at: {r.created_at}<br />
            <a href={r.html_url}>Github</a>
          </div>
        ))}
      </div>
      <button onClick={() => setSelected(repos)}>
        select all
      </button>
      <button onClick={() => setSelected([])}>
        deselect all
      </button>
      <button onClick={applyRepos}>
        apply & save
      </button>
    </div>
  );
};

const GithubCallback = () => {
  const { repos } = useLoaderData();
  return (
    <div>
      <Link to="/dashboard">back to dashboard</Link>
      <Suspense fallback={<GithubSpinner />}>
        <Await
          resolve={repos}
          errorElement={<GithubSpinner msg="Error when connecting with Github" color="red" />}
        >
          <GithubRepos />
        </Await>
      </Suspense>
    </div>
  );
};

export default GithubCallback;