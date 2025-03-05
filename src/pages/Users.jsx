import React, { useState, useEffect } from 'react';
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

  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [itemFilter, setItemFilter] = useState('');
  const [approvalFilter, setApprovalFilter] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Fetch assignments on component mount
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('http://172.236.2.18:5050/assignments');
        if (!response.ok) {
          throw new Error('Failed to fetch assignments');
        }
        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };
    fetchAssignments();
  }, []);

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
    setShowDropdown(false);
  };

  const handleSavePermissions = () => {
    console.log('Permissions saved:', permissions);
    setIsManagingPermissions(false);
  };

  const handleFilter = async () => {
    const url = `http://172.236.2.18:5050/assets/filter?item=${itemFilter}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to filter data');
      }
      const data = await response.json();
      setFilteredAssignments(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error filtering data:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Users</h1>
      <div className="bg-gray-100 rounded-lg shadow-md p-5 text-center relative">
        <div className="flex justify-center items-center">
          <img
            className="rounded-full w-20 h-20 object-cover mb-2"
            src={userImage}
            alt="Profile"
          />
          <div className="absolute top-2 right-2">
            <span className="cursor-pointer" onClick={toggleDropdown}>•••</span>
            {showDropdown && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-300 shadow-lg z-10">
                <button className="block px-4 py-2 text-left hover:bg-gray-200" onClick={handleEdit}>Edit User</button>
                <button className="block px-4 py-2 text-left hover:bg-gray-200" onClick={() => { setIsManagingPermissions(true); toggleDropdown(); }}>Manage Permissions</button>
                <button className="block px-4 py-2 text-left hover:bg-gray-200" onClick={handleDelete}>Delete User</button>
                <button className="block px-4 py-2 text-left hover:bg-gray-200" onClick={() => console.log('Downloading report...')}>Download Report</button>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mb-5">
          <p><strong>Name:</strong> {userInfo.name}</p>
          <p><strong>Department:</strong> IT</p>
          <p><strong>Designation:</strong> TM</p>
          <p><strong>Staff Number:</strong> 1012</p>
        </div>

        <div className="mb-5">
          <input type="file" id="file-upload" className="hidden" />
          <label htmlFor="file-upload" className="inline-block bg-[#0F013A] text-white px-4 py-2 rounded cursor-pointer">Upload</label>
        </div>

        <div className="mt-5">
          <h3 className="text-lg font-semibold">Assignment History</h3>
          <table className="min-w-full border-collapse border border-gray-300 mt-3">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Assignment ID</th>
                <th className="border border-gray-300 p-2">Assigned Date</th>
                <th className="border border-gray-300 p-2">Location</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td className="border border-gray-300 p-2">{assignment.id}</td>
                    <td className="border border-gray-300 p-2">{assignment.assignedDate}</td>
                    <td className="border border-gray-300 p-2">{assignment.location}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="border border-gray-300 p-2 text-center">No assignments found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Filter Section */}
        <div className="mb-5">
          <h3 className="text-lg font-semibold">Filter Assignments</h3>
          <input
            type="text"
            placeholder="Item Filter"
            value={itemFilter}
            onChange={(e) => setItemFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="Location Filter"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full mb-2"
          />
          <select
            value={approvalFilter}
            onChange={(e) => setApprovalFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full mb-2"
          >
            <option value="">Select Approval Status</option>
            <option value="approved">Approved</option>
            <option value="notApproved">Not Approved</option>
          </select>
          <button
            className="bg-[#0F013A] text-white px-4 py-2 rounded"
            onClick={handleFilter}
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleContinue}>
              <div className="mb-3">
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  required
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                  required
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Phone</label>
                <input
                  type="tel"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  required
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  value={userInfo.password}
                  onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <div className="flex justify-between">
                <button type="submit" className="bg-[#0F013A] text-white px-4 py-2 rounded">Continue</button>
                <button type="button" className="bg-orange-500 text-white px-4 py-2 rounded" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 text-center">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this user?</h2>
            <div className="flex justify-around">
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleConfirmDelete}>Delete</button>
              <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Permissions Modal */}
      {isManagingPermissions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Manage User Permissions</h2>
            <div className="mb-4">
              {Object.keys(permissions).map((perm) => (
                <label key={perm} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={permissions[perm]}
                    onChange={() => setPermissions({ ...permissions, [perm]: !permissions[perm] })}
                    className="mr-2"
                  />
                  {perm.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </label>
              ))}
            </div>
            <div className="flex justify-between">
              <button onClick={handleSavePermissions} className="bg-[#0F013A] text-white px-4 py-2 rounded">Save</button>
              <button onClick={handleCancel} className="bg-orange-500 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;