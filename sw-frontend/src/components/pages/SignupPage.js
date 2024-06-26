import React from 'react';
import './SignupPage.css';

function SignupPage() {
  return (
    <div className="register-container">
      <div className="register-form">
        <h1>Register</h1>
        <p>Manage all your inventory efficiently</p>
        <form>
          <div className="form-group">
            <input type="text" placeholder="First name" required />
          </div>
          <div className="form-group">
            <input type="text" placeholder="Last name" required />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Email" required />
          </div>
          <div className="form-group">
            <input type="password" placeholder="Password" required />
          </div>
          <div className="form-checkbox">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">I agree to all terms, privacy policies, and fees</label>
          </div>
          <button type="submit">Sign up</button>
          <p className="login-text">Already have an account? <a href="/login">Log in</a></p>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
