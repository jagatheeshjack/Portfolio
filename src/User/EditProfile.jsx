import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styel.css';

export default function EditProfile({ closeEditProfileForm }) {
    const username = localStorage.getItem('username');

    console.log(username);

    const [formData, setFormData] = useState({
    profileSummary: '',
    role: '',
    roleDescription: '',
    dateOfBirth: '',
    age: '',
    website: '',
    degree: '',
    phoneNumber: '',
    email: '',
    city: '',
    freelance: '',
    note: ''
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        console.log('Fetching profile for:', username);
        // Use template literals to insert `username` dynamically in the URL
        const response = await axios.get(`/api/profile/${username}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    if (username) {
      fetchProfileData();
    }
  }, [username]); 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/profile/${username}`, formData);
      alert('Profile updated successfully');
      closeEditProfileForm(); 
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  return (
    <div>
      <div className="modal-overlay">
        <div className="modal-content-Editprofile">
          <span className="close-btn" onClick={closeEditProfileForm}>&times;</span>
          <h4>About</h4>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-6">
                <div className="form-label">Profile Summary</div>
              </div>
              <div className="col-6">
                <textarea
                  className='custom-input'
                  name='profileSummary'
                  value={formData.profileSummary}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="form-label">Role</div>
              </div>
              <div className="col-6">
                <input
                  type="text"
                  className='custom-input'
                  name='role'
                  value={formData.role}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="form-label">Role Description</div>
              </div>
              <div className="col-6">
                <textarea
                  className='custom-input'
                  name='roleDescription'
                  value={formData.roleDescription}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="form-label">Date Of Birth</div>
              </div>
              <div className="col-6">
                <input
                  type="date"
                  className='custom-input'
                  name='dateOfBirth'
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="form-label">Age</div>
              </div>
              <div className="col-6">
                <input
                  type="number"
                  className='custom-input'
                  name='age'
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="form-label">Website</div>
              </div>
              <div className="col-6">
                <input
                  type="url"
                  className='custom-input'
                  name='website'
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="form-label">Degree</div>
              </div>
              <div className="col-6">
                <input
                  type="text"
                  className='custom-input'
                  name='degree'
                  value={formData.degree}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="form-label">Phone Number</div>
              </div>
              <div className="col-6">
                <input
                  type="tel"
                  className='custom-input'
                  name='phoneNumber'
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="form-label">Email ID</div>
              </div>
              <div className="col-6">
                <input
                  type="email"
                  className='custom-input'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="form-label">City</div>
              </div>
              <div className="col-6">
                <input
                  type="text"
                  className='custom-input'
                  name='city'
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="form-label">Freelance</div>
              </div>
              <div className="col-6">
                <select
                  className='custom-input'
                  name='freelance'
                  value={formData.freelance}
                  onChange={handleChange}
                >
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="form-label">Note</div>
              </div>
              <div className="col-6">
                <input
                  type="text"
                  className='custom-input'
                  name='note'
                  value={formData.note}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <input type="submit" value="Submit" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
