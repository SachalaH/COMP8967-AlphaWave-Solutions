import React, { useState } from 'react';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Email:', email, 'Password:', password);
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="remember-me">
                    <input type="checkbox" id="rememberMe" />
                    <label htmlFor="rememberMe">Remember me</label>
                </div>
                <button type="submit">Login</button>
                <div className="footer">
                    <a href="#">Forgot password?</a>
                    <a href="#">Not registered yet? Create a new account</a>
                </div>
            </form>
        </div>
    );
}

export default Login;
