
import React, { useEffect, useState } from 'react';
// import Navigation from '../components/Navigation';
import SideBar from '@/components/SideBar';

const Users = () => {
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState({});

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await fetch('http://172.236.2.18:5000/permissions/all-permissions');
                if (!response.ok) throw new Error('Network response was not ok');
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const permissionsToSave = Object.entries(selectedPermissions)
            .filter(([_, checked]) => checked)
            .map(([name, _]) => ({ name }));

        try {
            const response = await fetch('http://172.236.2.18:5000/permissions/create-permissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(permissionsToSave),
            });

            const responseData = await response.json();
            if (!response.ok) {
                console.error('Error response:', responseData);
                throw new Error('Error adding permissions');
            }

            alert('Permissions added successfully!');
            setSelectedPermissions({}); // Reset selected permissions after saving
        } catch (error) {
            console.error('Error saving permissions:', error);
            alert('Failed to add permissions. Please try again.');
        }
    };

    return (
        // <Navigation>
        <>
         <div className="wrapper" style={{ display: "flex", gap: "40px" }}>
         <SideBar/>
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
         </div>
        </>
        // </Navigation>
    );
};

export default Users;