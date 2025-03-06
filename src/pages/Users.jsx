import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';

const Users = () => {
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState({});

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await fetch('http://172.236.2.18:5000/permissions/all-permissions');
                const data = await response.json();
                setPermissions(data);
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
        };

        fetchPermissions();
    }, []);

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setSelectedPermissions((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Selected Permissions:', selectedPermissions);
        // Handle save logic here
    };

    return (
        <Navigation>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-6 rounded-lg shadow-md w-96">
                    <h2 className="text-lg font-semibold mb-4">Manage User Permissions</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            {permissions.map((permission) => (
                                <div key={permission.id} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        name={permission.name}
                                        id={permission.name}
                                        onChange={handleCheckboxChange}
                                        className="mr-2"
                                    />
                                    <label htmlFor={permission.name} className="text-gray-700">
                                        {permission.description}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between">
                            <button type="submit" className="bg-[#0F0A1A] text-white px-4 py-2 rounded">
                                Save
                            </button>
                            <button type="button" style={{ backgroundColor: '#8B0000' }} className="text-white px-4 py-2 rounded">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Navigation>
    );
};

export default Users; // Ensure only this export is present