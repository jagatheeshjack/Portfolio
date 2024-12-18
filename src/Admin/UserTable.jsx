import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidedrawer from '../Components/Sidedrawer';
import swal from 'sweetalert';
import ViewUserProfile from './ViewUserProfile';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [usersPerPage] = useState(8); // Users to display per page

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users'); 
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Edit user function
  const edituser = async () => {
    try {
      await swal({
        title: "Done!",
        text: "Edit Button Clicked",
        icon: "success",
        button: "ok",
      });
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  // Delete user function
  const deleteuser = async (email) => {
    const confirmation = await swal({
      title: "Are you sure?",
      text: "Disable the user..",
      buttons: true,
      dangerMode: true
    });

    if (confirmation) {
      try {
        await axios.delete(`http://localhost:5000/api/deleteuserAcc/${email}`);
        swal("Deleted!", "The user has been deleted.", "success");
        fetchUsers();
      } catch (error) {
        console.error("Error in deletion", error);
      }
    }
  };
  const ActivateUser = async (email) => {
    const confirmation = await swal({
      title: "Are you sure?",
      text: "Enable the user..",
      buttons: true,
      dangerMode: false
    });

    if (confirmation) {
      try {
        await axios.delete(`http://localhost:5000/api/ActivateUser/${email}`);
        swal("Deleted!", "The user has been Activated.", "success");
        fetchUsers();
      } catch (error) {
        console.error("Error in deletion", error);
      }
    }
  };


  // View user function
  const viewuser = async () => {
    try {
      await swal({
        title: "Done!",
        text: "View Button Clicked",
        icon: "success",
        button: "ok",
      });
    } catch (error) {
      console.error('Error viewing user:', error);
    }
  };

  // Search functionality
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Open and close modal logic
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    fetchUsers();
    setIsModalOpen(false);
  };
  const [isProfilOpen, setIsProfileOpen] = useState(false);
  const openProfile = () => setIsProfileOpen(true);
  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  // Move to the next page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredUsers.length / usersPerPage)) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  // Move to the previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const statusClass = (active) => active ? 'greencolor' : 'redcolor';

  return (
    <div>
      <h2>User List</h2>
      <input
        type="text"
        placeholder="Search by username"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          marginBottom: '20px',
          padding: '5px',
          border: 'none',
          borderBottom: '2px solid #000', // Only bottom border
          outline: 'none',
        }}
      />

      <button className='adduser' onClick={openModal}>
        
        <svg xmlns="http://www.w3.org/2000/svg" onClick={openModal} height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z"/></svg>

      </button>

      {isModalOpen && <Sidedrawer closeModal={closeModal} />}
       {isProfilOpen && <ViewUserProfile closeProfile={closeProfile}/>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Phone Number</th>
            <th>Email ID</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(user => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{user.phone_number}</td>
              <td>{user.email}</td>
              <td className={statusClass(user.active)}>{user.active ? 'Active' : 'Inactive'}</td>
              <td>
                <svg xmlns="http://www.w3.org/2000/svg" onClick={edituser} style={{cursor:'pointer'}} height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                  <path d="M160-400v-80h280v80H160Zm0-160v-80h440v80H160Zm0-160v-80h440v80H160Zm360 560v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Zm263-224 37-39-37-37-38 38 38 38Z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" onClick={openProfile} style={{cursor:'pointer'}} height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-480H200v480Zm280-80q-82 0-146.5-44.5T240-440q29-71 93.5-115.5T480-600q82 0 146.5 44.5T720-440q-29 71-93.5 115.5T480-280Zm0-60q56 0 102-26.5t72-73.5q-26-47-72-73.5T480-540q-56 0-102 26.5T306-440q26 47 72 73.5T480-340Zm0-100Zm0 60q25 0 42.5-17.5T540-440q0-25-17.5-42.5T480-500q-25 0-42.5 17.5T420-440q0 25 17.5 42.5T480-380Z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => ActivateUser(user.email)} style={{cursor:'pointer'}} height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => deleteuser(user.email)} style={{cursor:'pointer'}} height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M791-55 686-160H160v-112q0-34 17.5-62.5T224-378q45-23 91.5-37t94.5-21L55-791l57-57 736 736-57 57ZM240-240h366L486-360h-6q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm496-138q29 14 46 42.5t18 61.5L666-408q18 7 35.5 14t34.5 16ZM568-506l-59-59q23-9 37-29.5t14-45.5q0-33-23.5-56.5T480-720q-25 0-45.5 14T405-669l-59-59q23-34 58-53t76-19q66 0 113 47t47 113q0 41-19 76t-53 58Zm38 266H240h366ZM457-617Z"/></svg>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="pagination">
        <div onClick={prevPage} disabled={currentPage === 1}>
          &lt; {/* Left arrow */}
        </div>
        {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, index) => (
          <div
            key={index + 1}
            onClick={() => paginate(index + 1)}
            style={{
              fontWeight: currentPage === index + 1 ? 'bold' : 'normal', // Bold for active page
              margin: '0 5px',
            }}
          >
            {index + 1}
          </div>
        ))}
        <div onClick={nextPage} disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}>
          &gt; {/* Right arrow */}
        </div>
      </div>
    </div>
  );
};

export default UserTable;
