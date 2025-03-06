// src/pages/Team.js
import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { FaUserFriends, FaEdit, FaTrash } from 'react-icons/fa';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role_id: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE_URL = 'http://172.236.2.18:5000/users';

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/all`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTeamMembers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await fetch('http://172.236.2.18:5000/roles/all-roles');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchTeamMembers();
    fetchRoles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const { name, email, password, phone, role_id } = formData;
    if (!name || !email || !password || !phone || !role_id) {
      alert('All fields are required');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phone_number: phone,
          role_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from API:', errorData);
        throw new Error(`Error adding user: ${errorData.error || 'Unknown error'}`);
      }

      const newUser = await response.json();
      setTeamMembers((prevMembers) => [...prevMembers, newUser]);
      setShowAddModal(false);
      setFormData({ name: '', email: '', phone: '', password: '', role_id: '' });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setShowUpdateModal(true);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone_number,
      password: '', // Do not show password for editing
      role_id: member.role_id,
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/update/${selectedMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone_number: formData.phone,
          role_id: formData.role_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from API:', errorData);
        throw new Error('Error updating user');
      }

      const updatedUser = await response.json();
      setTeamMembers((prevMembers) =>
        prevMembers.map((member) => (member.id === selectedMember.id ? updatedUser : member))
      );
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteConfirmation = (member) => {
    setSelectedMember(member);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/${selectedMember.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from API:', errorData);
        throw new Error('Error deleting user');
      }
      setTeamMembers((prevMembers) => prevMembers.filter((m) => m.id !== selectedMember.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Navigation>
      <div className="container mx-auto p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl text-orange-500">Team</h2>
          <button className="bg-[#07013A] text-white px-4 py-2 rounded" onClick={() => setShowAddModal(true)}>Add +</button>
        </div>

        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <table className="min-w-full border border-gray-300">
          <thead>
            <tr style={{ color: '#0F013A' }}>
              <th className="border-b-2 border-gray-300 p-2">Name</th>
              <th className="border-b-2 border-gray-300 p-2">Email</th>
              <th className="border-b-2 border-gray-300 p-2">Phone</th>
              <th className="border-b-2 border-gray-300 p-2">Role</th>
              <th className="border-b-2 border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-100">
                <td className="border-b border-gray-300 p-2">{member.name}</td>
                <td className="border-b border-gray-300 p-2">{member.email}</td>
                <td className="border-b border-gray-300 p-2">{member.phone_number}</td>
                <td className="border-b border-gray-300 p-2">{member.role_id}</td>
                <td className="border-b border-gray-300 p-2">
                  <button className="text-red-500 mr-4" onClick={() => handleEdit(member)}>
                    <FaEdit />
                  </button>
                  <button className="text-[#8B0000]" onClick={() => handleDeleteConfirmation(member)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <span className="cursor-pointer float-right" onClick={() => setShowAddModal(false)}>&times;</span>
              <h2 className="text-xl mb-4">Add User</h2>
              <form onSubmit={handleAddUser}>
                <input type="text" name="name" className="w-full p-2 border border-gray-300 rounded mb-2" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
                <input type="email" name="email" className="w-full p-2 border border-gray-300 rounded mb-2" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
                <input type="tel" name="phone" className="w-full p-2 border border-gray-300 rounded mb-2" placeholder="Phone" value={formData.phone} onChange={handleInputChange} required />
                <select name="role_id" className="w-full p-2 border border-gray-300 rounded mb-4" value={formData.role_id} onChange={handleInputChange} required>
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                <input type="password" name="password" className="w-full p-2 border border-gray-300 rounded mb-4" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
                <button type="submit" className="bg-[#0F013A] text-white px-4 py-2 rounded">Save</button>
                <button type="button" className="bg-orange-500 text-white px-4 py-2 rounded ml-2" onClick={() => setShowAddModal(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showUpdateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <span className="cursor-pointer float-right" onClick={() => setShowUpdateModal(false)}>&times;</span>
              <h2 className="text-xl mb-4">Edit User</h2>
              <form onSubmit={handleUpdateUser}>
                <input type="text" name="name" className="w-full p-2 border border-gray-300 rounded mb-2" value={formData.name} onChange={handleInputChange} required />
                <input type="email" name="email" className="w-full p-2 border border-gray-300 rounded mb-2" value={formData.email} onChange={handleInputChange} required />
                <input type="tel" name="phone" className="w-full p-2 border border-gray-300 rounded mb-2" value={formData.phone} onChange={handleInputChange} required />
                <select name="role_id" className="w-full p-2 border border-gray-300 rounded mb-4" value={formData.role_id} onChange={handleInputChange} required>
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                <button type="submit" className="bg-[#0F013A] text-white px-4 py-2 rounded">Update</button>
                <button type="button" className="bg-orange-500 text-white px-4 py-2 rounded ml-2" onClick={() => setShowUpdateModal(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        {/* Delete User Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <span className="cursor-pointer float-right" onClick={() => setShowDeleteModal(false)}>&times;</span>
              <h2 className="text-xl mb-4">Are you sure you want to delete this user?</h2>
              <div className="flex justify-end">
                <button
                  className="bg-[#8B0000] text-white px-4 py-2 rounded mr-2"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  className="bg-orange-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Navigation>
  );
};

export default Team;