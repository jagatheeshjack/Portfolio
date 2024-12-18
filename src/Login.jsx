import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; 
import '../src/styel.css';
import loginPage from './LoginPage.jpg'; 
import Loginsvg from './avatar.svg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      localStorage.setItem('token', response.data.token);
      const decoded = jwtDecode(response.data.token);
      localStorage.setItem('username', decoded.username);
      localStorage.setItem('role', decoded.role);

      console.log(`'Role and user from login:'${decoded.username} ${decoded.role}`)

      const role = decoded.role;

      console.log(role);
      if (role === 'Admin') {
        navigate('/Admin');
      } else if (role === 'User') {
        navigate('/User');
      } else if (role === 'Viewer') {
        navigate('/Viewer');
      } else {
        navigate('/login');
      }}catch (err) {
        console.error('Login error:', err);
        setError('Invalid credentials. Please try again.');
      }
    };

  return (
    <div className="contain">
      <div className="image-contain" id="imghide">
        <img src={loginPage} alt="Vector Image" className="vector-image" />
      </div>
      <div className="form-contain">
        <div className="locard">
          <div className="card">
            <h3>
              <img src={Loginsvg} alt="Login Icon" style={{ height: 'auto', width: '3rem' }} />
            </h3>
            <h3>LOGIN</h3>
            {error && <p className="err">{error}</p>}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="User Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ textAlign: 'right' }}>
                <a href="#">Forgot Password..!</a>
              </div>
              <div className="form-group">
                <center>
                  <button type="submit">LOGIN</button>
                </center>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;