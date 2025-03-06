
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { FaEdit, FaTrash } from "react-icons/fa";

const Team = () => {
    const navigate = useNavigate();
    const [teamMembers, setTeamMembers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", phone_number: "", password: "", role_id: "" });
    const [searchTerm, setSearchTerm] = useState("");

    const API_BASE_URL = "http://172.236.2.18:5000/users";

    useEffect(() => {
        fetchTeamMembers();
        fetchRoles();
    }, []);

    const fetchTeamMembers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/all`);
            if (!response.ok) throw new Error("Network error");
            const data = await response.json();
            setTeamMembers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await fetch("http://172.236.2.18:5000/roles/all-roles");
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
            const response = await fetch(API_BASE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error("Error adding user");
            setShowAddModal(false);
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
            password: "",
            role_id: member.role ? member.role.id : "",
        });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/update/${selectedMember.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error("Error updating user");
            setShowUpdateModal(false);
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
            const response = await fetch(`${API_BASE_URL}/${selectedMember.id}`, { method: "DELETE" });
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
        <Navigation>
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
            </div>
        </Navigation>
    );
};

export default Team;
