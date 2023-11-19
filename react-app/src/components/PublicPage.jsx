// import { useState } from "react";
import "./../css/PublicPage.css";
import { Await, useAsyncValue, useLoaderData, useSubmit } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import GithubButton from "./GithubButton";
import { Suspense } from "react";
import AppError from "./errorElements/AppError";



const Project = ({ idx }) => {
  return (
    <Row className="public-project pt-4">
      <Col className="text-center" sm={12} md={4} lg={3}>
        <div className="public-proj-img-placeholder"></div>
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

const PublicPage = () => {
  const data = useLoaderData();

  return (
    <Suspense fallback={<h2 style={{ color: "white" }}>Loading...</h2>}>
      <Await resolve={data.user} errorElement={<AppError message="page not found" />}>
        <PublicPageContent />
      </Await>
    </Suspense>
  );
};


const PublicPageContent = () => {
  const user = useAsyncValue();

  const firstName = user.firstname;
  const lastName = user.lastname
  const email = user.email;

  const mainInfo = (
    <>
      <Row className="text-center">
        <h2>
          {firstName} {lastName}
        </h2>
      </Row>
      <Row>
        <div className="public-image-placeholder"></div>
      </Row>
      <Row className="text-center">
        <span>{email}</span>
        
        
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
    <Container className="public-user-dashboard">
      <Row>
        <Col className="p-3 public-main-info-container" xs={12} sm={4} md={3}>
          {mainInfo}
        </Col>
        <Col className="public-projects-container">
          <Projects></Projects>
        </Col>
      </Row>
    </Container>
  );
};

export default PublicPage;