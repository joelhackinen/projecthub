import { Link, Outlet, useSubmit } from "react-router-dom";
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Dropdown from "react-bootstrap/Dropdown"
import GithubButton from "./GithubButton"
import EditIcon from "@mui/icons-material/Edit"
import { useUser } from "../hooks";

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
  const conditionalInput = (field, placeholder) => (
    <>{field ? <span>{field}</span> : <input placeholder={placeholder} />}</>
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
          <Col>{conditionalInput(user.url_name, "Set url")}</Col>
        </Row>
        <Row>
          <Col sm={2} md={3}>Github:</Col>
          <Col>{conditionalInput(user.github, "Github")}</Col>
        </Row>
      </Container>
    </>
  ) : <div>No user</div>
}

const Projects = ({ projects }) => {
  const ProjectList_ = () => (
    projects.map((project, idx) => {
      return <Row key={idx}>Project {project} {idx}</Row>
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

  const visibleProjects = ["Proj", "Filler", "placeholder", "test", "last one"]
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
        <Projects projects={visibleProjects}/>
      </Row>
      <Outlet />
    </Container>
  );
};

export default UserDashboard;
