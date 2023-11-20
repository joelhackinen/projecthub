import { Link, Outlet, useSubmit } from "react-router-dom";
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Dropdown from "react-bootstrap/Dropdown"
import GithubButton from "./GithubButton"
import EditIcon from "@mui/icons-material/Edit"
import { useDeleteRepo, useUpdateRepo, useUser } from "../hooks";

import "./../css/UserDashboard.css"

const EditButton = ({ to }) => (
  <div className="edit-btn">
    <Link to={to} ><EditIcon sx={{ color: "black" }} /></Link>
  </div>
)

const Header = () => {
  const submit = useSubmit();

  const settings = () => (
    <Dropdown>
      <Dropdown.Toggle className="header-dropdown">Options</Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item
          onClick={() =>
            submit(null, { method: "post", action: "/logout" })
          }
        >
          Log out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
  return (
    <>
      <Col xs={3} >
        {settings()}
      </Col>
      <Col xs={{span:9, end:0}} className="text-end">
        <a className="btn btn-light" onClick={() => console.log('view profile!')}>View your public profile{"->"}</a>
      </Col>
    </>   
  )
}

const PersonalInformation = ({ user }) => {
  const conditionalInfo = ( field, placeholder ) => (
    <>{(!field || field==='') ? <span style={{ color: "red" }}>{placeholder}</span> : field}</>
  )

  return user ? (
    <>
      <h2>Your information</h2>
      <EditButton to="/dashboard/edit/information"/>
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
          <Col>{conditionalInfo(user.url_name, `you haven't chosen url yet`) }</Col>
        </Row>
        <Row>
          <Col sm={2} md={3}>Github:</Col>
          <Col>{conditionalInfo(user.github, "You haven't connected your github account")}</Col>
        </Row>
      </Container>
    </>
  ) : <div>No user</div>
}

const Projects = ({ projects }) => {
  const deleteRepo = useDeleteRepo();
  const updateRepo = useUpdateRepo();
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
          <Col>
            <button onClick={() => deleteRepo(project.id)}>
              Delete
            </button>
          </Col>
        </Row>
      )
    })
  )
  return (
    <>
      <h2>Projects</h2>
      <EditButton to="/dashboard/edit/projects" />
      <Container className="projects-container">
        {projects
        ?
          <ProjectList_ />
        :
          <div>You dont have any visible projects</div>}
      </Container>
    </>
  ) 
}

const UserDashboard = () => {
  const user = useUser();

  return (
    <Container>
      <Row className="pt-3 pb-3">
        <Header />
      </Row>
      
      <Row className="p-3">
        <PersonalInformation user={user}/>
      </Row>

      <GithubButton />
      <Row className="p-3">
        <Projects projects={user?.repos}/>
      </Row>
      <Outlet />
    </Container>
  );
};

export default UserDashboard;
