import React, { useState } from 'react';
import Header from '../Components/Header';
import UserTable from '../Admin/UserTable';
import Sidebar from '../Components/Sidebar';
export default function Admin() {
  const [tabno, setTabno] = useState(1); // State to track active tab
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to track sidebar visibility
  const storedRole = localStorage.getItem('role');

  // Function to handle tab changes
  const showtab = (tabnoin) => {
    setTabno(tabnoin); // Update the state with the new tab number
  };

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle the sidebar open/close
    console.log(` Opened ${isSidebarOpen}`)
  };

  return (
    <div className={`Pages ${isSidebarOpen ? 'sidebar-open' : ''}`}> {/* Add class based on sidebar state */}
      {/* Header component to handle sidebar toggle */}
      <div className='header'>
      <Header toggleSidebar={toggleSidebar} showtab={showtab} />

      </div>

      {/* Sidebar component goes here */}
      <Sidebar isOpen={isSidebarOpen} role={storedRole} showtab={showtab} />

      {/* Conditionally render content based on tabno state */}
      {tabno === 1 && (
        <div className='Container' id='userTable'>
          <UserTable />
        </div>
      )}
      {tabno === 2 && (
        <div className='Container'>
        </div>
      )}
      {tabno === 3 && (
        <div className='Container'>
          <h1>Content3</h1>
        </div>
      )}
      {tabno === 4 && (
        <div className='Container'>
          <h1>Content4</h1>
        </div>
      )}
    </div>
  );
}
