import React, { useContext, useState } from "react";
import { VendorContext } from "../VendorContext";
import { useNavigate } from "react-router-dom";
import "./Vendors.css";

const Vendors = () => {
  const { vendors } = useContext(VendorContext);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // Default to "all"
  const [dropdownOpen, setDropdownOpen] = useState(null); // State to manage dropdown visibility
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleTabChange = (status) => {
    setStatusFilter(status);
  };

  const handleDropdownToggle = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "all" || vendor.status.toString() === statusFilter)
  );
  const handleDeleteVendor = (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      // Delete vendor
    }
  };
  const handleToggleStatus = (id) => {
    // Toggle vendor status
  }
  
  return (
    <div className="vendors">
      <h3 className="page-title">Vendors</h3>
        {/* Search & Add Vendor Button */}
        <div className="filterBar">
          <input
            type="text"
            placeholder="Search vendors..."
            className="search-input"
            value={search}
            onChange={handleSearchChange}
          />
          <button className="add-btn" onClick={() => navigate("/vendors/create-vendor")}>
            + Add Vendor
          </button>
        </div>

        {/* Tabs for Filtering */}
        <div className="filter-tabs">
          <button
            className={`tab-btn ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => handleTabChange("all")}
          >
            All
          </button>
          <button
            className={`tab-btn ${statusFilter === "true" ? "active" : ""}`}
            onClick={() => handleTabChange("true")}
          >
            Activated
          </button>
          <button
            className={`tab-btn ${statusFilter === "false" ? "active" : ""}`}
            onClick={() => handleTabChange("false")}
          >
            Deactivated
          </button>
        </div>

        {/* Vendors Table */}
        <table className="vendors-table">
          <thead>
            <tr>
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
                  <td>{vendor.name}</td>
                  <td>{vendor.email}</td>
                  <td>{vendor.phone}</td>
                  <td>
                    <span className={`status-badge ${vendor.status ? "activated" : "deactivated"}`}>
                      {vendor.status ? "Activated" : "Deactivated"}
                    </span>
                  </td>
                  <td>
                    <p onClick={()=>navigate(`/vendors/view-vendor/`)}>|</p>
                  </td>
                  <td>
                    <div className="dropdown">
                      <button className="action-btn" onClick={() => handleDropdownToggle(index)}>⋮</button>
                      {dropdownOpen === index && (
                        <div className="dropdown-content">
                          <p onClick={() => navigate(`/vendors/edit/${vendor.id}`)}>Edit Vendor</p>
                          <p onClick={() => handleDeleteVendor(vendor.id)}>Delete Vendor</p>
                          <p onClick={() => handleToggleStatus(vendor.id)}>
                            {vendor.status ? "Deactivate Vendor" : "Activate Vendor"}
                          </p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>No vendors available</td>
              </tr>
            )}
          </tbody>
        </table>

    </div>
  );
};

export default Vendors;
