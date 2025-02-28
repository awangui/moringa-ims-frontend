import React, { useState, useRef } from 'react';
import '../App.css';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([
    {
      name: 'Stephanie Mwoya',
      email: 'stephaniemwoya@gmail.com',
      phone: '+254712598987',
      role: 'superAdmin',
    },
    { name: 'John Doe', email: 'john@example.com', phone: '+254712123456', role: 'Admin' },
    { name: 'Jane Smith', email: 'jane@example.com', phone: '+254712654321', role: 'User' },
    { name: 'Alice Johnson', email: 'alice@example.com', phone: '+254712789012', role: 'User' },
    { name: 'Bob Brown', email: 'bob@example.com', phone: '+254712345678', role: 'User' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const menuRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddUser = () => {
    setTeamMembers([...teamMembers, { ...formData, role: 'User' }]);
    setMessage('User Added');
    setShowAddModal(false);
    setFormData({ name: '', email: '', phone: '', password: '' });
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setShowUpdateModal(true);
    setFormData(member);
  };

  const handleUpdateUser = () => {
    setTeamMembers(teamMembers.map((member) => (member === selectedMember ? formData : member)));
    setMessage('User Updated');
    setShowUpdateModal(false);
    setFormData({ name: '', email: '', phone: '', password: '' });
  };

  const handleDeleteConfirmation = (member) => {
    setSelectedMember(member);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    setTeamMembers(teamMembers.filter(m => m !== selectedMember));
    setMessage('User Deleted');
    setShowDeleteModal(false);
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="full-screen-container">
      <div className="container mt-4">
        <div className="d-flex justify-content-between mb-3">
          <h2 style={{ color: '#FF885E' }}>Team</h2>
          <button className="btn btn-custom" onClick={() => setShowAddModal(true)}>Add +</button>
        </div>

        <div className="search-container mb-3">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {message && (
          <div className="alert alert-success">
            {message}
            <button className="close" onClick={() => setMessage('')}>&times;</button>
          </div>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member, index) => (
              <tr key={index}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>{member.role}</td>
                <td ref={menuRef}>
                  <button className="btn btn-edit" onClick={() => handleEdit(member)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDeleteConfirmation(member)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="entries-info" style={{ color: 'black' }}>
            Showing 1 to {Math.min(entriesPerPage, filteredMembers.length)} of {filteredMembers.length} entries
          </span>
          <div className="pagination">
            <button className="page-link">&lt;</button>
            <button className="page-link active">1</button>
            <button className="page-link">2</button>
            <button className="page-link">3</button>
            <button className="page-link">4</button>
            <button className="page-link">&gt;</button>
          </div>
        </div>

        <div className="d-flex align-items-center mt-3 justify-content-start">
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

        {/* Add User Modal */}
        {showAddModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowAddModal(false)}>&times;</span>
              <h2>Add New User</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Eg. John Doe" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Eg. johndoe@gmail.com" required />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Eg. +254712345678" required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Enter password" required />
                </div>
                <button type="submit" className="btn btn-custom btn-small">Continue</button>
                <button type="button" className="btn btn-orange" onClick={() => setShowAddModal(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showUpdateModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowUpdateModal(false)}>&times;</span>
              <h2>Edit User</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(); }}>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
                </div>
                <button type="submit" className="btn btn-custom btn-small">Continue</button>
                <button type="button" className="btn btn-orange" onClick={() => setShowUpdateModal(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        {/* Delete User Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowDeleteModal(false)}>&times;</span>
              <h2>Are you sure you want to delete this user?</h2>
              <div className="button-group">
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                <button className="btn btn-orange" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;