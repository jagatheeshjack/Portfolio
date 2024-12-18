import React, { useState } from 'react';
import swal from 'sweetalert';

const Sidedrawer = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    phoneNo: '',
    role: 'User'  // Added default role
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const addUser = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await fetch('http://localhost:5000/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Something went wrong');
      } else {
        setFormData({
          firstName: '',
          lastName: '',
          emailId: '',
          phoneNo: '',
          role: 'User'  // Reset role to default
        });
        await swal({
          title: "Done!",
          text: "User Created Successfully!",
          icon: "success",
          button: "OK",
        });
        closeModal();
      }
    } catch (error) {
      setError('Error while creating User: ' + error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-btn" onClick={closeModal}>&times;</span>
        <h4>User Details</h4>
        <form onSubmit={addUser}>
          <div className='row'>
            <div className='col-4'>
              <label htmlFor="firstName">First name:</label>
            </div>
            <div className='col-8'>
              <input
                type="text"
                name="firstName"
                id="firstName"
                className='custom-input'
                value={formData.firstName}
                onChange={handleChange}
                placeholder='First Name'
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-4'>
              <label htmlFor="lastName">Last name:</label>
            </div>
            <div className='col-8'>
              <input
                type="text"
                name="lastName"
                id="lastName"
                className='custom-input'
                value={formData.lastName}
                onChange={handleChange}
                placeholder='Last Name'
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-4'>
              <label htmlFor="emailId">Email ID:</label>
            </div>
            <div className='col-8'>
              <input
                type="email"
                name="emailId"
                id="emailId"
                value={formData.emailId}
                onChange={handleChange}
                placeholder='example@gmail.com'
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-4'>
              <label htmlFor="phoneNo">Phone No:</label>
            </div>
            <div className='col-8'>
              <input
                type="text"
                name="phoneNo"
                id="phoneNo"
                className='custom-input'
                value={formData.phoneNo}
                onChange={handleChange}
                placeholder='845166498'
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-4'>
              <label htmlFor="role">Role:</label>
            </div>
            <div className='col-8'>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-4" id='adduser'>
            </div>
            <div className='col-4'>
              <button type="submit">Save</button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              {message && <p className="success-message">{message}</p>}
              {error && <p className="error-message">{error}</p>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Sidedrawer;
