import React from 'react';
import './Login.css';

function Login() {
  return (
    <div className='card'>
         <div className="container">
      <div className="login-box">
        <h2>Portal S4RAS</h2>
        <form action="/login" method="POST">
          <label htmlFor="username">Username</label>
          <input type="username" id="username" name="username" required />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />

          <button type="submit">Login</button>
        </form>
        <p className="forgot-password">
          <a href="#">Lupa Password?</a>
        </p>
      </div>
    </div>
    </div>
   
  );
}

export default Login;