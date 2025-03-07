
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import Navigation from "../components/Navigation";
import SideBar from "@/components/SideBar";
import { FaEdit, FaTrash } from "react-icons/fa";

const Team = () => {
    const navigate = useNavigate();
    const [teamMembers, setTeamMembers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone_number: "",
        password: "",
        role_id: ""
    });
    const [searchTerm, setSearchTerm] = useState("");

    const API_BASE_URL = "http://172.236.2.18:5000/users";

    // Function to get the JWT token
    const getToken = () => {
        return localStorage.getItem("jwtToken"); // Adjust this if needed
    };

    useEffect(() => {
        fetchTeamMembers();
        fetchRoles();
    }, []);

    const fetchTeamMembers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/all`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${getToken()}`, // Include the token
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Network error");
            }
            const data = await response.json();
            setTeamMembers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await fetch("http://172.236.2.18:5000/roles/all-roles", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${getToken()}`, // Include the token
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) throw new Error("Network error");
            const data = await response.json();
            setRoles(data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}` // Include the token
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error("Error adding user");
            setShowAddModal(false);
            setFormData({ name: "", email: "", phone_number: "", password: "", role_id: "" }); // Reset form
            fetchTeamMembers();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (member) => {
        setSelectedMember(member);
        setShowUpdateModal(true);
        setFormData({
            name: member.name,
            email: member.email,
            phone_number: member.phone_number,
            role_id: member.role ? member.role.id : "",
        });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/update/${selectedMember.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}` // Include the token
                },
                body: JSON.stringify({
                    email: formData.email,
                    name: formData.name,
                    phone_number: formData.phone_number,
                    role_id: formData.role_id, // Ensure this matches your backend expectations
                }),
            });
            if (!response.ok) throw new Error("Error updating user");
            setShowUpdateModal(false);
            setSelectedMember(null);
            setFormData({ name: "", email: "", phone_number: "", password: "", role_id: "" }); // Reset form
            fetchTeamMembers();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteConfirmation = (member) => {
        setSelectedMember(member);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/${selectedMember.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${getToken()}` // Include the token
                }
            });
            if (!response.ok) throw new Error("Error deleting user");
            setShowDeleteModal(false);
            fetchTeamMembers();
        } catch (error) {
            console.error(error);
        }
    };

    const handleManagePermissions = (memberId) => {
        navigate(`/users/${memberId}/permissions`);
    };

    return (
        // <Navigation>
           <>
           <div className="wrapper" style={{ display: "flex", gap: "20px"}}>
           <SideBar/>
            <div className="container mx-auto p-4">
                <div className="flex justify-between mb-4">
                    <h2 className="text-2xl text-orange-500">Team</h2>
                    <button className="bg-[#07013A] text-white px-4 py-2 rounded" onClick={() => setShowAddModal(true)}>
                        Add +
                    </button>
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
                        <tr style={{ color: "#0F013A" }}>
                            <th className="p-2">Name</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Phone</th>
                            <th className="p-2">Role</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teamMembers.map((member) => (
                            <tr key={member.id} className="hover:bg-gray-100">
                                <td className="p-2">{member.name}</td>
                                <td className="p-2">{member.email}</td>
                                <td className="p-2">{member.phone_number}</td>
                                <td className="p-2">{member.role ? member.role.name : "No Role Assigned"}</td>
                                <td className="p-2 flex gap-2">
                                    <button className="text-blue-500" onClick={() => handleEdit(member)}>
                                        <FaEdit />
                                    </button>
                                    <button className="text-[#8B0000]" onClick={() => handleDeleteConfirmation(member)}>
                                        <FaTrash />
                                    </button>
                                    <button
                                        className="bg-[#0F013A] text-white px-2 py-1 rounded"
                                        onClick={() => handleManagePermissions(member.id)}
                                    >
                                        Manage Permissions
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Add User Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-96">
                            <span className="cursor-pointer float-right" onClick={() => setShowAddModal(false)}>&times;</span>
                            <h2 className="text-xl mb-4">Add New User</h2>
                            <form onSubmit={handleAddUser}>
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full p-2 border border-gray-300 rounded mb-2"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full p-2 border border-gray-300 rounded mb-2"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="tel"
                                    name="phone_number"
                                    className="w-full p-2 border border-gray-300 rounded mb-2"
                                    placeholder="Phone"
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="password"
                                    name="password"
                                    className="w-full p-2 border border-gray-300 rounded mb-2"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                                <select
                                    name="role_id"
                                    className="w-full p-2 border border-gray-300 rounded mb-4"
                                    value={formData.role_id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                                <button type="submit" className="bg-[#0F013A] text-white px-4 py-2 rounded">Add</button>
                                <button type="button" className="bg-red-500 text-white px-4 py-2 rounded ml-2" onClick={() => setShowAddModal(false)}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit User Modal */}
                {showUpdateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-96">
                            <span className="cursor-pointer float-right" onClick={() => setShowUpdateModal(false)}>&times;</span>
                            <h2 className="text-xl mb-4">Edit User</h2>
                            <form onSubmit={handleUpdateUser}>
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full p-2 border border-gray-300 rounded mb-2"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full p-2 border border-gray-300 rounded mb-2"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="tel"
                                    name="phone_number"
                                    className="w-full p-2 border border-gray-300 rounded mb-2"
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                    required
                                />
                                <select
                                    name="role_id"
                                    className="w-full p-2 border border-gray-300 rounded mb-4"
                                    value={formData.role_id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                                <button type="submit" className="bg-[#0F013A] text-white px-4 py-2 rounded">Update</button>
                                <button type="button" className="bg-red-500 text-white px-4 py-2 rounded ml-2" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete User Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-96">
                            <span className="cursor-pointer float-right" onClick={() => setShowDeleteModal(false)}>&times;</span>
                            <h2 className="text-xl mb-4">Are you sure you want to delete this user?</h2>
                            <div className="flex justify-end">
                                <button className="bg-[#8B0000] text-white px-4 py-2 rounded mr-2" onClick={handleDelete}>
                                    Delete
                                </button>
                                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setShowDeleteModal(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
           </div>
           </>
        // </Navigation>
    );
};

export default Team;