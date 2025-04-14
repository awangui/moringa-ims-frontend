import React, { useEffect, useState } from 'react';
import SideBar from '@/components/SideBar';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch all roles and permissions on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesResponse, permissionsResponse] = await Promise.all([
          fetch('http://172.236.2.18:5000/roles/all-roles'),
          fetch('http://172.236.2.18:5000/permissions/all-permissions'),
        ]);
        if (!rolesResponse.ok || !permissionsResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const rolesData = await rolesResponse.json();
        const permissionsData = await permissionsResponse.json();
        setRoles(rolesData);
        setPermissions(permissionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Handle role selection
  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setSelectedPermissions(role.permissions.map((p) => p.id));
    setRoleName(role.name);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Handle permission checkbox change
  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // Handle form submission for creating or updating a role
  const handleSubmit = async (e) => {
    e.preventDefault();
    const roleData = { name: roleName, permissions: selectedPermissions };

    try {
      const url = isEditing
        ? `http://172.236.2.18:5000/roles/update-role/${selectedRole.id}`
        : 'http://172.236.2.18:5000/roles/new-roles';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error || 'Error processing role');
      }

      if (isEditing) {
        setRoles(roles.map((r) => (r.id === selectedRole.id ? responseData.role : r)));
      } else {
        setRoles([...roles, responseData.role]);
      }

      resetForm();
      alert(isEditing ? 'Role updated successfully!' : 'Role created successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to ${isEditing ? 'update' : 'create'} role. Please try again.`);
    }
  };

  // Handle role deletion
  const handleDeleteRole = async (roleId) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;

    try {
      const response = await fetch(`http://172.236.2.18:5000/roles/delete-role/${roleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error deleting role');
      }

      setRoles(roles.filter((role) => role.id !== roleId));
      if (selectedRole?.id === roleId) {
        resetForm();
      }
      alert('Role deleted successfully!');
    } catch (error) {
      console.error('Error deleting role:', error);
      alert('Failed to delete role. Please try again.');
    }
  };

  // Reset form and close modal
  const resetForm = () => {
    setRoleName('');
    setSelectedPermissions([]);
    setSelectedRole(null);
    setIsEditing(false);
    setIsModalOpen(false);
  };

  // Open modal for creating a new role
  const openCreateModal = () => {
    setIsEditing(false);
    setRoleName('');
    setSelectedPermissions([]);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Moringa Inventory Role Management
          </h1>

          {/* Create Role Button */}
          <div className="mb-6">
            <button
              onClick={openCreateModal}
              className="bg-[#0F0A1A] text-white px-6 py-2 rounded-lg hover:bg-[#1a1533]"
            >
              Create New Role
            </button>
          </div>

          {/* Roles Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {role.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {role.permissions.map((p) => p.name).join(', ') || 'None'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleSelectRole(role)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Creating/Editing Role */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                {isEditing ? 'Edit Role' : 'Create Role'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Role Name
                  </label>
                  <input
                    type="text"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Permissions
                  </label>
                  <div className="mt-2 max-h-60 overflow-y-auto">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={`permission-${permission.id}`}
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={() => handlePermissionChange(permission.id)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`permission-${permission.id}`}
                          className="ml-2 text-sm text-gray-600"
                        >
                          {permission.name} {permission.description && `(${permission.description})`}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0F0A1A] text-white rounded hover:bg-[#1a1533]"
                  >
                    {isEditing ? 'Update Role' : 'Create Role'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleManagement;