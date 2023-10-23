// import { useState } from 'react'
import "./../css/UserDashboard.css";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";

const UserDashboard = () => {
  const firstName = window.localStorage.getItem("firstName");
  const lasName = window.localStorage.getItem("lastName");
  const email = window.localStorage.getItem("email");
  const navigate = useNavigate();

  const handleMockLogout = () => {
    window.localStorage.clear();
    navigate("/");
  };

  const header = (
    <>
      <Col xs={12} sm={8}>
        <div className="header-text">
          Logged in as {firstName} {lasName}
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
    </>
  );
  const mainInfo = (
    <>
      <Row>
        <h1>
          {firstName} {lasName}
        </h1>
        <input className="main-info-input" placeholder="+ Add title"></input>
      </Row>
      <Row className="main-info-grid">
        <Col>
          <Row>{email}</Row>
          <Row>
            <input
              className="main-info-input"
              placeholder="+ Add a phone number"
            ></input>
          </Row>
          <Row>
            <input
              className="main-info-input"
              placeholder="+ Add a link"
            ></input>
          </Row>
          <Row>
            <input className="main-info-input" placeholder="..."></input>
          </Row>
        </Col>
        <Col>
          <Row>Toinen column :-D</Row>
          <Row>Toinen column, toinen lisätietokenttä :-D</Row>
        </Col>
      </Row>
    </>
  );

  return (
    <Container>
      <Row className="header-container">{header}</Row>
      <Row className="p-4 main-info-container">{mainInfo}</Row>
    </Container>
  );
};

export default UserDashboard;
