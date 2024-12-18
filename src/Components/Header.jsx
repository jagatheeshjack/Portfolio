import React, { useEffect, useState } from 'react';
import '../styel.css'; // Correct the path to your stylesheet
import penlogo from '../assets/penlogo.png';
import logo from '../assets/Logo.png';
import Logoutholder from './Logoutholder';

export default function Header({ toggleSidebar, showtab }) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [isLogoutOpen, setIsLogoutOpen] = useState(true);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    if (storedUsername) setUsername(storedUsername);
    if (storedRole) setRole(storedRole);
  }, []);

  const toggleLogout = () => {
    setIsLogoutOpen(!isLogoutOpen);
  };

  return (
    <div >
      <section>
        <div className='logcard'>
          <img src={penlogo} onClick={toggleSidebar} />
          <h2>NEMO</h2>
          <div className='UserDtl'>
            <div className='user-info'>
              <span className='username'>{username}</span>
              <span className='role'>{role}</span>
            </div>
            <img src={logo} onClick={toggleLogout} />
          </div>
        </div>
        <Logoutholder ison={isLogoutOpen} />
      </section>
    </div>
  );
}
