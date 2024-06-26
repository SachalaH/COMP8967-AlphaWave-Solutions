import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';


function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login</h1>
        <p>See your growth and get support!</p>
        <form>
          <div className="form-group">
            <input type="email" placeholder="Email" required />
          </div>
          <div className="form-group">
            <input type="password" placeholder="Password" required />
          </div>
          <div className="form-options">
            <div className="checkbox">
              <input type="checkbox" id="remember-me" />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit">Login</button>
          <p className="signup-text">Not registered yet? <a href="/signup">Create a new account</a></p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
