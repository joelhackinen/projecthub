// import { useState } from "react";
import "./../css/PublicPage.css";
import { Await, useAsyncValue, useLoaderData } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Suspense } from "react";
import AppError from "./errorElements/AppError";

const Line = () => (<div className="line"></div>)

const Project = ({ data, idx }) => {
  
  const plainLanguageList = (languages) => {
    return languages ? Object.keys(languages).join(', ') : ''
  }
  const languagePercentages = (languages) => {
    const getRepoLanguagePercentage = (languages) => {
      const totalPtsArr = Object.values(languages);
      var sumTotalPts = 0;
      totalPtsArr.forEach((pts) => {
        sumTotalPts += pts;
      });
    
      const languagesPercentage = {};
      Object.keys(languages).forEach((lang) => {
        languagesPercentage[lang] = ((languages[lang] * 100) / sumTotalPts).toFixed(1);
      });
    
      return languagesPercentage;
    }
    const languagesInPercentages = Object.entries(getRepoLanguagePercentage(languages)).sort((b, a) => a[1] - b[1])
    return languagesInPercentages.map(([key, value]) => (
      <div key={key}>
        <strong>{key}:</strong> {value}%
      </div>
    ))
  }

  return (
    <>
      {idx !== 0 ? <Line /> : <></>}
      <Row className="public-project pt-4"> {/* Name + languages + created */}
        <Col sm={12} md={4} lg={4}>
          <div className="mx-auto public-proj-img-placeholder" />
        </Col>
        <Col md={{ order: idx % 2 ? "last" : "first" }}> 
          <h1>{data?.name}</h1>
          <i>{data?.github ? data.html_url : <></>}</i>
          <Row className="pt-3" > {/* Languages */}
            <Col sm={12} md={6} >
              <h5>Languages used:</h5>
            </Col>
            <Col>
              <div>
                {data?.github ? languagePercentages(data.languages) : plainLanguageList(data.languages)}
              </div> 
            </Col>
          </Row>
          <Row className="pt-3 pb-3" > {/* Created */}
            <Col sm={12} md={6} >
              <h5>Created:</h5>
            </Col>
            <Col>
              <div>
                {data.created_at}
              </div> 
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>{/* Description */}
        <p>
          {data?.description}
        </p>
      </Row> 
    </>
  );
};
const Projects = ({ projects }) => {
  return (
    <Container>
      { projects?.map((project, idx) => <Project key={project.id} data={project} idx={idx} />) }
    </Container>
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
        <div className="pb-4">{email}</div>
      </Row>
      <Row>
        <h4>About me:</h4>
        <p>
          A short introduction about who I am and any extra text I want to
          display that is not directly related to the projects.
        </p>
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
          <Projects projects={user.repos}/>
        </Col>
      </Row>
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

export default PublicPage;