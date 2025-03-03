import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditVendor = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    email: "",
    bio: "",
    phone: "",
    status: false,
    kraPin: "",
    address: "",
    city: "",
    country: "",
    county: "",
    postalCode: "",
    bankName: "",
    accountNumber: "",
    mpesaPaybill: "",
    buyGoodsTill: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vendor details when the component mounts
  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await fetch(`http://172.236.2.18:5555/vendors/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch vendor data");
        }
        const data = await response.json();
        setFormData(data); // Set fetched data to form
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit updated vendor data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://172.236.2.18:5555/vendors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update vendor data");
      }

      alert("Vendor updated successfully!");
    navigate("/vendors"); 
    window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="editVendor">
      <h3>Edit Vendor Details</h3>
      <form onSubmit={handleSubmit} className="vendorForm row g-3">
        <div className="col-md-6">
          <label htmlFor="name" className="form-label">Vendor Name</label>
          <input type="text" className="form-control" id="name" value={formData.name} onChange={handleChange} />
        </div>

        <div className="col-md-6">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} />
        </div>

        <div className="col-md-6">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input type="text" className="form-control" id="phone" value={formData.phone} onChange={handleChange} />
        </div>

        <div className="col-md-12">
          <label htmlFor="bio" className="form-label">Bio</label>
          <textarea className="form-control" id="bio" rows="3" value={formData.bio} onChange={handleChange}></textarea>
        </div>

        <div className="col-md-12">
          <label htmlFor="address" className="form-label">Address</label>
          <input type="text" className="form-control" id="address" value={formData.address} onChange={handleChange} />
        </div>

        <div className="col-md-6">
          <label htmlFor="city" className="form-label">City</label>
          <input type="text" className="form-control" id="city" value={formData.city} onChange={handleChange} />
        </div>

        <div className="col-md-6">
          <label htmlFor="country" className="form-label">Country</label>
          <input type="text" className="form-control" id="country" value={formData.country} onChange={handleChange} />
        </div>

        <div className="col-md-6">
          <label htmlFor="postalCode" className="form-label">Postal Code</label>
          <input type="text" className="form-control" id="postalCode" value={formData.postalCode} onChange={handleChange} />
        </div>

        <div className="col-md-6">
          <label htmlFor="kraPin" className="form-label">KRA PIN</label>
          <input type="text" className="form-control" id="kraPin" value={formData.kraPin} onChange={handleChange} />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">Update Vendor</button>
          <button type="button" className="btn btn-secondary mx-2" onClick={() => navigate("/vendors")}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditVendor;
