import React, { useState } from 'react';
import '../App.css'; // Ensure this imports your CSS
import userImage from '../assets/user.jpg'; // Correct import path to the JPG file

const Users = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isManagingPermissions, setIsManagingPermissions] = useState(false);
  
  const [userInfo, setUserInfo] = useState({
    name: 'Anita Kahenya',
    email: 'afiyamahenya@gmail.com',
    phone: '+254 712345678',
    password: '',
  });

  const [permissions, setPermissions] = useState({
    addUsers: false,
    deleteUsers: false,
    editUsers: false,
    addVendors: false,
    editVendors: false,
    deleteVendors: false,
    activateVendors: false,
    addInventoryItem: false,
  });

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowDropdown(false);
  };

  const handleDelete = () => {
    setIsDeleting(true);
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
    setIsManagingPermissions(false);
  };

  const handleSavePermissions = () => {
    console.log('Permissions saved:', permissions);
    setIsManagingPermissions(false);
  };

  return (
    <div className="users-container">
      <h1 className="page-title">Users</h1>
      <div className="user-card">
        <div className="profile-header">
          <img className="user-image" src={userImage} alt="Profile" />
          <div className="menu-container">
            <span className="menu-dots" onClick={toggleDropdown}>•••</span>
            {showDropdown && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={handleEdit}>Edit User</button>
                <button className="dropdown-item" onClick={() => { setIsManagingPermissions(true); toggleDropdown(); }}>Manage Permissions</button>
                <button className="dropdown-item" onClick={handleDelete}>Delete User</button>
                <button className="dropdown-item" onClick={() => console.log('Downloading report...')}>Download Report</button>
              </div>
            )}
          </div>
        </div>

        <div className="user-details">
          <p><strong>Name:</strong> {userInfo.name}</p>
          <p><strong>Department:</strong> IT</p>
          <p><strong>Designation:</strong> TM</p>
          <p><strong>Staff Number:</strong> 1012</p>
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

      {/* Edit User Modal */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Edit User</h2>
            <form onSubmit={handleContinue}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={userInfo.name} onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={userInfo.email} onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" value={userInfo.phone} onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={userInfo.password} onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })} />
              </div>
              <div className="button-group">
                <button type="submit" className="continue-button">Continue</button>
                <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {isDeleting && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Are you sure you want to delete this user?</h2>
            <div className="button-group">
              <button className="button delete-btn" onClick={handleConfirmDelete} style={{ backgroundColor: 'red', color: 'white' }}>Delete</button>
              <button className="button cancel-button" onClick={handleCancel} style={{ backgroundColor: 'orange', color: 'white' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Permissions Modal */}
      {isManagingPermissions && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="permissions-title">Manage User Permissions</h2>
            <div className="permissions-list">
              <label className="permission-label">
                <input
                  type="checkbox"
                  checked={permissions.addUsers}
                  onChange={() => setPermissions({ ...permissions, addUsers: !permissions.addUsers })}
                />
                Add Users
              </label>
              <label className="permission-label">
                <input
                  type="checkbox"
                  checked={permissions.deleteUsers}
                  onChange={() => setPermissions({ ...permissions, deleteUsers: !permissions.deleteUsers })}
                />
                Delete Users
              </label>
              <label className="permission-label">
                <input
                  type="checkbox"
                  checked={permissions.editUsers}
                  onChange={() => setPermissions({ ...permissions, editUsers: !permissions.editUsers })}
                />
                Edit Users
              </label>
              <label className="permission-label">
                <input
                  type="checkbox"
                  checked={permissions.addVendors}
                  onChange={() => setPermissions({ ...permissions, addVendors: !permissions.addVendors })}
                />
                Add Vendors
              </label>
              <label className="permission-label">
                <input
                  type="checkbox"
                  checked={permissions.deleteVendors}
                  onChange={() => setPermissions({ ...permissions, deleteVendors: !permissions.deleteVendors })}
                />
                Delete Vendors
              </label>
              <label className="permission-label">
                <input
                  type="checkbox"
                  checked={permissions.activateVendors}
                  onChange={() => setPermissions({ ...permissions, activateVendors: !permissions.activateVendors })}
                />
                Activate Vendors
              </label>
              <label className="permission-label">
                <input
                  type="checkbox"
                  checked={permissions.addInventoryItem}
                  onChange={() => setPermissions({ ...permissions, addInventoryItem: !permissions.addInventoryItem })}
                />
                Add Inventory Item
              </label>
            </div>
            <div className="button-group">
              <button onClick={handleSavePermissions} className="continue-button">Save</button>
              <button onClick={handleCancel} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;