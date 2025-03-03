import React, { useContext, useState } from "react";
import { VendorContext } from "./VendorContext";
import { useNavigate } from "react-router-dom";
import "./Vendors.css";
import Navigation from "../components/Navigation";
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, vendorName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Delete Vendor</h3>
        <p>Are you sure you want to delete <strong>{vendorName}</strong>?</p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="delete-btn" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};


const Vendors = () => {
  const { vendors } = useContext(VendorContext);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const navigate = useNavigate();

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleTabChange = (status) => setStatusFilter(status);
  const handleDropdownToggle = (index) => setDropdownOpen(dropdownOpen === index ? null : index);

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === "all" || String(vendor.is_active) === statusFilter)
  );

  const handleDeleteVendor = (vendor) => {
    setSelectedVendor(vendor);
    setModalOpen(true);
  };

  const toggleVendorStatus = (vendor) => {
    fetch(`http://172.236.2.18:5555/vendors/${vendor.id}/activate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_active: !vendor.is_active }),
    })
    .then(response => {
      if (response.ok) {
        console.log('Vendor status updated successfully');
        window.location.reload();
      } else {
        console.error('Failed to update vendor status');
      }
    })
    .catch(error => console.error('Error:', error));
  };

  const confirmDelete = () => {
    if (selectedVendor) {
      fetch(`http://172.236.2.18:5555/vendors/${selectedVendor.id}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          console.log('Vendor deleted successfully');
          window.location.reload();
        } else {
          console.error('Failed to delete vendor');
        }
      })
      .catch(error => console.error('Error:', error));

      setModalOpen(false);
      setSelectedVendor(null);
      alert("Vendor deleted successfully");
    }
  };

  return (
    <Navigation>
    <div className="vendors">
      <div className="filterBar">
        <h3 className="page-title">Vendors</h3>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search vendors..."
            className="search-input"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="filter-tabs">
          <button className={`tab-btn ${statusFilter === "all" ? "active" : ""}`} onClick={() => handleTabChange("all")}>All</button>
          <button className={`tab-btn ${statusFilter === "true" ? "active" : ""}`} onClick={() => handleTabChange("true")}>Activated</button>
          <button className={`tab-btn ${statusFilter === "false" ? "active" : ""}`} onClick={() => handleTabChange("false")}>Deactivated</button>
        </div>
        <button className="add-btn" onClick={() => navigate("/vendors/create-vendor")}>+ Add Vendor</button>
      </div>

      <table className="vendors-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVendors.length > 0 ? (
            filteredVendors.map((vendor, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{vendor.name}</td>
                <td>{vendor.email}</td>
                <td>{vendor.phone}</td>
                <td>
                  <span className={`status-badge ${vendor.is_active ? "activated" : "deactivated"}`}>
                    {vendor.is_active ? "Activated" : "Deactivated"}
                  </span>
                </td>
                <td className="actions">
                  <div className="view" onClick={() => navigate(`/vendors/${vendor.id}`)}>View</div>
                  <div className="dropdown">
                    <button className="action-btn" onClick={() => handleDropdownToggle(index)}>⋮</button>
                    {dropdownOpen === index && (
                      <div className="dropdown-content">
                        <p onClick={() => navigate(`/vendors/edit/${vendor.id}`)}>Edit Vendor</p>
                        <p onClick={() => handleDeleteVendor(vendor)}>Delete Vendor</p>
                        <p onClick={() => toggleVendorStatus(vendor)}>{vendor.is_active ? "Deactivate Vendor" : "Activate Vendor"}</p>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>No vendors available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={confirmDelete} 
        vendorName={selectedVendor?.name} 
      />

    </div>
    </Navigation>
  );
};
export default Vendors;