import { useState } from 'react'
import './../loginPage.css'

const LoginPage = () => {
  const [registerFormIsVisible, setRegisterFormIsVisible] = useState(true)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const handleRegister = (e) => {
    e.preventDefault()
    console.log(`register with:
    First name: ${firstName}
    Last name: ${lastName}
    Email: ${email}
    Password: ${password}
    Password has no typos: ${password === passwordConfirm}`
    )
  }
  const handleLogin = (e) => {
    e.preventDefault()
    console.log(`login with email ${loginEmail} and password ${loginPassword}`)
  }
  const handleRegisterClick = (e) => {
    e.preventDefault()
    !registerFormIsVisible && setRegisterFormIsVisible( !registerFormIsVisible )
  }
  const handleSignInClick = (e) => {
    e.preventDefault()
    registerFormIsVisible && setRegisterFormIsVisible( !registerFormIsVisible )
  }

  const registerForm = () => (
    <form className="register-form" onSubmit={handleRegister}>
      <input
        type="text"
        value={firstName}
        name="firstName"
        placeholder="First name"
        onChange={({ target }) => setFirstName(target.value)}
      />
      <input
        type="text"
        value={lastName}
        name="lastName"
        placeholder="Last name"
        onChange={({ target }) => setLastName(target.value)}
      />
      <input
        type="text"
        value={email}
        name="email"
        placeholder="Email"
        onChange={({ target }) => setEmail(target.value)}
      />
      <input
        type="password"
        value={password}
        name="password"
        placeholder="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
      <input
        type="password"
        value={passwordConfirm}
        name="passwordConfirm"
        placeholder="Confirm password"
        onChange={({ target }) => setPasswordConfirm(target.value)}
      />
      <button className="submit-button" type="submit">Register</button>
    </form>
  )

  const loginForm = () => (
    <form className="login-form" onSubmit={handleLogin}>
      <input
        type="text"
        value={loginEmail}
        name="loginEmail"
        placeholder="Email"
        onChange={({ target }) => setLoginEmail(target.value)}
      />
      <input
        type="password"
        value={loginPassword}
        name="loginPassword"
        placeholder="Password"
        onChange={({ target }) => setLoginPassword(target.value)}
      />
      <button className="submit-button" type="submit">Sign in</button>
    </form>
  )

  return (
    <div className="login-page">
      
      <h1 className="login-title">Join today.</h1>
      <div className="forms">
        <div className="form-navbar">
          <button className={registerFormIsVisible ? "visible" : "not-visible"}
            onClick={handleRegisterClick}
          >
            Register
          </button>
          <button className={registerFormIsVisible ? "not-visible" : "visible"}
            onClick={handleSignInClick}
          >
            Sign in
          </button>
        </div>
        <div className="form">
          {registerFormIsVisible &&
          registerForm() }
          {!registerFormIsVisible &&
          loginForm() }
        </div>
        
      </div>
      
      <div className="info">
        <h2>ProjectHub:</h2>
        <p>
          The ultimate platform for showcasing your programming projects and resume
        </p>
        Read more..
      </div>
    </div>
  )
}

export default LoginPage