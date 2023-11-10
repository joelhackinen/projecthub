import { useState } from "react";
import "./../css/UserDashboard.css";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import GithubButton from "./GithubButton";

const Header = ({ firstName, lastName, handleMockLogout }) => {
  return (
    <Row className="header-container">
      <Col xs={12} sm={8}>
        <div className="header-text">
          Logged in as {firstName} {lastName}
        </div>
      </Col>

      <Col xs={12} sm={{ span: 2, offset: 2 }}>
        <Dropdown>
          <Dropdown.Toggle className="header-dropdown">...</Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item onClick={() => handleMockLogout()}>
              Log out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  );
};

const Project = ({ idx }) => {
  return (
    <Row className="project pt-4">
      <Col className="text-center" sm={12} md={4} lg={3}>
        <div className="proj-img-placeholder"></div>
      </Col>
      <Col md={{ order: idx % 2 ? "last" : "first" }}>
        <h4>Project {idx}</h4>
        <p>
          Longer description of the project. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </p>
      </Col>
    </Row>
  );
};
const Projects = ({ projects }) => {
  return (
    <Container>
      <Project idx={1} />
      <Project idx={2} />
      <Project idx={3} />
      <Project idx={4} />
    </Container>
  );
};

const UserDashboard = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");

  const firstName = window.localStorage.getItem("firstName");
  const lastName = window.localStorage.getItem("lastName");
  const email = window.localStorage.getItem("email");
  const navigate = useNavigate();

  const handleMockLogout = () => {
    window.localStorage.clear();
    navigate("/");
  };

  const mainInfo = (
    <>
      <Row className="text-center">
        <h2>
          {firstName} {lastName}
        </h2>
      </Row>
      <Row>
        <div className="image-placeholder"></div>
      </Row>
      <Row className="text-center">
        <span>{email}</span>
        {phoneNumber !== "" ? (
          <span>{phoneNumber}</span>
        ) : (
          <input placeholder="phone number" />
        )}
        {location !== "" ? (
          <span>{location}</span>
        ) : (
          <input placeholder="location" />
        )}
        {link !== "" ? <span>{link}</span> : <input placeholder="link" />}
      </Row>
      <Row>
        <h5>About me:</h5>
        <p>
          A short introduction about who I am and any extra text I want to
          display that is not directly related to the projects.
        </p>
        <GithubButton />
      </Row>
    </>
  );

  return (
    <Container className="user-dashboard">
      <Header
        firstName={firstName}
        lastName={lastName}
        handleMockLogout={handleMockLogout}
      />
      <Row>
        <Col className="p-3 main-info-container" xs={12} sm={4} md={3}>
          {mainInfo}
        </Col>
        <Col className="projects-container">
          <Projects></Projects>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;
