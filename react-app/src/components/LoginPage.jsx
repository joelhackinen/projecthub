import "./../css/loginPage.css";
import { useState } from "react";
import { useSubmit } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const LoginPage = () => {
  const [registerFormIsVisible, setRegisterFormIsVisible] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const submit = useSubmit();

  const handleRegister = (e) => {
    e.preventDefault();
    if (password === passwordConfirm) {
      window.localStorage.setItem("firstName", firstName);
      window.localStorage.setItem("lastName", lastName);
      window.localStorage.setItem("email", email);

      submit(
        { firstName, lastName, email, password },
        { method: "post", action: "/register" },
      );
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    submit({ loginEmail, loginPassword }, { method: "post", action: "/login" });

    console.log(`login with email ${loginEmail} and password ${loginPassword}`);
  };
  const handleRegisterClick = (e) => {
    e.preventDefault();
    !registerFormIsVisible && setRegisterFormIsVisible(!registerFormIsVisible);
  };
  const handleSignInClick = (e) => {
    e.preventDefault();
    registerFormIsVisible && setRegisterFormIsVisible(!registerFormIsVisible);
  };

  const toggleReadMore = (e) => {
    e.preventDefault();
    setShowMoreInfo(!showMoreInfo);
  };
  const togglePasswordVisibility = (e) => {
    const eye = e.target;
    const password = e.target.previousSibling;
    password.type === "password"
      ? (password.type = "text")
      : (password.type = "password");
    eye.classList.toggle("fa-eye-slash");
  };
  const registerForm = () => (
    <form className="register-form" onSubmit={handleRegister}>
      <div className="input-container">
        <input
          type="text"
          value={firstName}
          name="firstName"
          placeholder="First name"
          onChange={({ target }) => setFirstName(target.value)}
        />
      </div>

      <div className="input-container">
        <input
          type="text"
          value={lastName}
          name="lastName"
          placeholder="Last name"
          onChange={({ target }) => setLastName(target.value)}
        />
      </div>

      <div className="input-container">
        <input
          type="text"
          value={email}
          name="email"
          placeholder="Email"
          onChange={({ target }) => setEmail(target.value)}
        />
      </div>

      <div className="input-container">
        <input
          type="password"
          value={password}
          name="password"
          placeholder="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
        <i
          className="fa fa-eye fa-eye-slash"
          id="eye"
          onClick={(event) => togglePasswordVisibility(event)}
        ></i>
      </div>
      <div className="input-container">
        <input
          type="password"
          value={passwordConfirm}
          name="passwordConfirm"
          placeholder="Confirm password"
          onChange={({ target }) => setPasswordConfirm(target.value)}
        />
        <i
          className="fa-solid fa-eye fa-eye-slash"
          id="eye"
          onClick={(event) => togglePasswordVisibility(event)}
        ></i>
      </div>

      <button className="submit-button" type="submit">
        Register
      </button>
    </form>
  );

  const loginForm = () => (
    <form className="login-form" onSubmit={handleLogin}>
      <div className="input-container">
        <input
          type="text"
          value={loginEmail}
          name="loginEmail"
          placeholder="Email"
          onChange={({ target }) => setLoginEmail(target.value)}
        />
      </div>
      <div className="input-container">
        <input
          type="password"
          value={loginPassword}
          name="loginPassword"
          placeholder="Password"
          onChange={({ target }) => setLoginPassword(target.value)}
        />
        <i
          className="fa-solid fa-eye fa-eye-slash"
          id="eye"
          onClick={(event) => togglePasswordVisibility(event)}
        ></i>
      </div>
      <button className="submit-button" type="submit">
        Sign in
      </button>
    </form>
  );

  const moreInfoParagraph = () => (
    <div className={`more-info-paragraph ${showMoreInfo ? "show" : "hide"}`}>
      <p>
        Here is some extra info on our website!
        <br />
        <br />
        Register to start creating your ProjectHub profile.
      </p>
    </div>
  );

  return (
    <Container className="login-page">
      <Row>
        {" "}
        {/* Outer row */}
        <Col xs={12} md={6}>
          {" "}
          {/* Left side */}
          <h1 className="login-title">Join today.</h1>
          <div className="forms">
            <div className="form-navbar">
              <button
                className={registerFormIsVisible ? "visible" : "not-visible"}
                onClick={handleRegisterClick}
              >
                Register
              </button>
              <button
                className={registerFormIsVisible ? "not-visible" : "visible"}
                onClick={handleSignInClick}
              >
                Sign in
              </button>
            </div>
            <div className="form">
              {registerFormIsVisible && registerForm()}
              {!registerFormIsVisible && loginForm()}
            </div>
          </div>
        </Col>{" "}
        {/* Left side */}
        <Col xs={12} md={6} className="info mt-5 ml-lg-0">
          {" "}
          {/* Right side */}
          <h2 className="info-title">ProjectHub:</h2>
          <p>
            The ultimate platform for showcasing your programming projects and
            resume
          </p>
          <button className="toggle-info-btn" onClick={toggleReadMore}>
            {showMoreInfo ? "See less.." : "Read more.."}
          </button>
          {moreInfoParagraph()}
        </Col>{" "}
        {/* Right side */}
      </Row>
      {/* Outer row */}
    </Container>
  );
};

export default LoginPage;
