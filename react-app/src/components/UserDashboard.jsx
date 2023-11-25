import { Link, Outlet, useSubmit } from "react-router-dom";
import { useUpdateRepo, useUser } from "../hooks";
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import GithubButton from "./GithubButton"
import { Button, FormControlLabel, Switch  } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import "./../css/UserDashboard.css"

const Line = () => (<div className="thin-line"></div>)

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
    projects.map((project, idx) =>
      (
        <Row key={idx}>
          <Col xs="6" sm="3">
            <Row>
              <FormControlLabel
                checked={ project.visible }
                control={ <Switch onChange={ () => updateRepo({ ...project, visible: !project.visible  }) }/> }
                label={project.visible ? "public" : "private"}
              />
            </Row>
          </Col>
          <Col xs="6" sm="4" className="align-self-center">{project.name}</Col>
          <Col xs="6" sm="3" className="align-self-center">{project.created_at}</Col>
          <Col xs="6" sm="2" className="align-self-center">
            <Link to={`edit/project/${project.id}`} >
              <EditIcon sx={{ color: "black" }} />
            </Link>
          </Col>
          <Line />
        </Row>
      )
    )
  )
  return (
    <>
      <div className="pb-2">
        <GithubButton/>
      </div>

      <h2>Projects</h2>
      <Container className="projects-container">
        <Row>
          <Col xs="6" sm="3">Visibility</Col>
          <Col xs="6" sm="4">Name</Col>
          <Col xs="6" sm="3">Created</Col>
          <Col xs="6" sm="2">Edit</Col>
          <Line />
        </Row>

        { projects.length > 0 ?
          <ProjectList_ /> : <div style={{ color: "red" }}>You dont have any visible projects</div>
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
