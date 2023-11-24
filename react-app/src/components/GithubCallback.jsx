import { Suspense, useState } from "react";
import { Await, useAsyncValue, useLoaderData, Link, useNavigate } from "react-router-dom";
import { useAddRepos } from "../hooks";
import GithubSpinner from "./GithubSpinner";
import { Container, List, ListItem, ListItemButton, ListItemText, Checkbox, Button } from "@mui/material";

const GithubRepos = () => {
  const repos = useAsyncValue();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [addRepos, isAddReposPending] = useAddRepos();

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
    <div style={{ color: "white", textAlign: "center", paddingBottom:"10em" }}>
      <h3>{repos.length} new repos found</h3>
      <h4>Select the repositories you want to import</h4>
      
      <div style={{ marginInline:"auto", width:"max(390px, 50%)", display:"flex", justifyContent:"space-around" }}>
        <Button color="info" size="medium" variant="contained" onClick={() => setSelected(repos)}>
          select all
        </Button>
        <Button color="info" size="medium" variant="outlined" onClick={() => setSelected([])}>
          deselect all
        </Button>
        <Button size="large" color="success" variant="contained" onClick={applyRepos}>
          apply & save
        </Button>
      </div>
      
      {
      repos.length === 0 ? <div style={{padding:"2em"}}>No new repositories found!</div>
      :
      <List
        sx={{
          marginInline: "auto",
          justifyContent:"center",
          width:"max(390px, 50%)",
          padding:"0"
        }} >
        {repos.map((repo, i) => {
          return(
          <ListItem key={i}
            style={{
              border:"1px solid",
              borderColor: selected.includes(repo) ? "#66FCF1" : "white",
              margin:"0.3em 0",
              borderRadius:"1em"
            }}>
            <ListItemButton role={undefined} onClick={() => handleClick(repo)} sx={{padding: "0"}}>
              <Checkbox
                edge="start"
                sx={{ color:"white" }}
                checked={selected.includes(repo)}
              />
              <div >
                owner: {repo.owner}<br />
                name: {repo.name}<br />
                full_name: {repo.full_name}<br />
                created_at: {repo.created_at}<br />
              </div>
              <div><a href={repo.html_url}>Github</a></div>

            </ListItemButton>
          </ListItem>
          )}
        )}
      </List>
      }
      <Button size="large" color="success" variant="contained" onClick={applyRepos}>
        apply & save
      </Button>
    </div>
    
  );
};

const GithubCallback = () => {
  const { repos } = useLoaderData();
  return (
    <Container>
      <Link to="/dashboard">back to dashboard</Link>
      <Suspense fallback={<GithubSpinner />}>
        <Await
          resolve={repos}
          errorElement={<GithubSpinner msg="Error when connecting with Github" color="red" />}
        >
          <GithubRepos />
        </Await>
      </Suspense>
    </Container>
  );
};

export default GithubCallback;