import { Link, Outlet, useSubmit } from "react-router-dom";
import { useUpdateRepo, useUser } from "../hooks";
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import GithubButton from "./GithubButton"
import { Button, withStyles  } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import "./../css/UserDashboard.css"

const EditButton = ({ to }) => (
  <div className="edit-btn">
    <Link to={to} ><EditIcon sx={{ color: "black" }} /></Link>
  </div>
)

const Header = ({ user }) => {
  const submit = useSubmit();

  return (
    <div className="header" style={{display:"flex", justifyContent: "space-between"}}>
      <Button variant="outlined" onClick={() => submit(null, { method: "post", action: "/logout" }) }>
        Log out
      </Button>
      {user ?
        (
        user.url_name ?
        <Link to={`/user/${user.url_name}`} target="_blank" >
          <Button variant="contained">View your public profile{"->"}</Button>
        </Link> : <p>You can view your public profile once you've set an URL</p>)
      : <></>}
    </div> 
  )
}

const PersonalInformation = ({ user }) => {
  const conditionalInfo = ( field, placeholder ) => (
    <>{(!field || field==='') ? <span style={{ color: "red" }}>{placeholder}</span> : field}</>
  )

  return user ? (
    <>
      <h2>Your information</h2>
      <EditButton to="edit/information"/>
      <Container className="info-container">
        <Row>
          <Col sm={2} md={3}>Email:</Col>
          <Col><span>{user.email}</span> </Col>
        </Row>
        <Row>
          <Col sm={2} md={3}>Name: </Col>
          <Col><span>{user.firstname} {user.lastname}</span> </Col>
        </Row>
        <Row>
          <Col sm={2} md={3}>Url:</Col>
          <Col>{conditionalInfo(user.url_name, `you haven't chosen an url yet`) }</Col>
        </Row>
        <Row>
          <Col sm={2} md={3}>Github:</Col>
          <Col>{conditionalInfo(user.github, "You haven't connected your github account")}</Col>
        </Row>
      </Container>
    </>
  ) : <strong>Loading ...</strong>
}

const Projects = ({ projects }) => {
  const [updateRepo, isUpdateRepoPending] = useUpdateRepo();

  const compareByName = (a, b) => {
    return a.name.localeCompare(b.name);
  };

  projects.sort(compareByName);

  const ProjectList_ = () => (
    projects.map((project, idx) => {
      return (
        <Row key={idx}>
          <Col>{project.name}</Col>
          <Col>created: {project.created_at}</Col>
          <Col>
            <Row>{project.visible ? "public" : "private"}</Row>
            <Row>
              <button onClick={() => updateRepo({ ...project, visible: !project.visible })}>
                {project.visible ? "hide" : "show"}
              </button>
            </Row>
          </Col>
          <Col className="align-self-center">
            <Link to={`edit/project/${project.id}`} ><EditIcon sx={{ color: "black" }} /></Link>
          </Col>
        </Row>
      )
    })
  )
  return (
    <>
      <h2>Projects</h2>
      <Container className="info-container">
        <Row>
          <GithubButton />
        </Row>
        {
        projects ?
          <ProjectList_ /> : <div>You dont have any visible projects</div>
        }
        <Row>
          <Link to="edit/addNewProject" style={{ width: "fit-content" }}>
            <Button sx={{ border: "1px solid black", color: "black" }} variant="outlined" component="label" startIcon={<AddCircleOutlineIcon />}>
              Add new project
            </Button>
          </Link>
        </Row>
      </Container>
    </>
  ) 
}

const UserDashboard = () => {
  const user = useUser();
  return (
    <Container>
      <Row className="pt-3 pb-3">
        <Header user={user}/>
      </Row>
      
      <Row className="p-3">
        <PersonalInformation user={user}/>
      </Row>

      <Row className="p-3">
        <Projects projects={user?.repos}/>
      </Row>
      
      <Outlet />
    </Container>
  );
};

export default UserDashboard;
