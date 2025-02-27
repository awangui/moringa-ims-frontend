import React, { useState } from 'react';
import '../App.css'; // Ensure this imports your CSS
import userImage from '../assets/user.jpg'; // Correct import path to the JPG file

const Users = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'Anita Kahenya',
    email: 'afiyamahenya@gmail.com',
    phone: '+254 712345678',
    password: '',
  });
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowDropdown(false);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(`Are you sure you want to delete ${userInfo.name}?`);
    if (confirmed) {
      setIsDeleting(true);
      console.log('User deleted'); // Replace with actual delete logic
    }
    setShowDropdown(false);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    console.log('User info updated:', userInfo);
    setIsEditing(false);
  };

  const handleConfirmDelete = () => {
    console.log('User deleted');
    setIsDeleting(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsDeleting(false);
  };

  const handleDownload = () => {
    console.log('Downloading report...');
  };

  return (
    <div className="users-container">
      <div className="user-card">
        <div className="profile-header">
          <img className="user-image" src={userImage} alt="Profile" />
          <div className="menu-container">
            <span className="menu-dots" onClick={toggleDropdown}>•••</span>
            {showDropdown && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={handleEdit}>Edit User</button>
                <button className="dropdown-item" onClick={handleDelete}>Delete User</button>
                <button className="dropdown-item" onClick={handleDownload}>Download Report</button>
              </div>
            )}
          </div>
        </div>
        <div className="user-details">
          <h2 className="user-name">{userInfo.name}</h2>
          <p><strong>Department:</strong> IT</p>
          <p><strong>Staff Number:</strong> 1012</p>
          <p><strong>Designation:</strong> TM</p>
        </div>
        <div className="upload-section">
          <input type="file" id="file-upload" style={{ display: 'none' }} />
          <label htmlFor="file-upload" className="upload-button">Upload</label>
        </div>
        <div className="assessment-history">
          <h3>Assessment History</h3>
          <table>
            <thead>
              <tr>
                <th>Assessment ID</th>
                <th>Assessment Date</th>
                <th>Quantity</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>MCXDB856G</td>
                <td>22/09/2022</td>
                <td>50</td>
                <td>Kitchen</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {isEditing && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit User</h2>
            <form onSubmit={handleContinue}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={userInfo.name} onChange={e => setUserInfo({ ...userInfo, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={userInfo.email} onChange={e => setUserInfo({ ...userInfo, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" value={userInfo.phone} onChange={e => setUserInfo({ ...userInfo, phone: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={userInfo.password} onChange={e => setUserInfo({ ...userInfo, password: e.target.value })} />
              </div>
              <button type="submit" className="button continue-button">Save Changes</button>
            </form>
            <button className="button cancel-button" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

      {isDeleting && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Are you sure you want to delete this user?</h2>
            <button className="button delete-btn" onClick={handleConfirmDelete}>Delete</button>
            <button className="button cancel-button" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

      {/* Entries and Pagination Section */}
      <div className="pagination-section">
        <span>Showing 1 to 1 of 1 entries</span>
        <div className="d-flex align-items-center mt-3 justify-content-end">
          <label htmlFor="entriesPerPage" style={{ marginRight: '10px' }}>Entries per page:</label>
          <select
            id="entriesPerPage"
            className="form-control entries-dropdown"
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
        </div>
        <div className="pagination">
          <button className="page-link">&lt;</button>
          <button className="page-link active">1</button>
          <button className="page-link">2</button>
          <button className="page-link">3</button>
          <button className="page-link">4</button>
          <button className="page-link">&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default Users;