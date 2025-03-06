import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";

const EditVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
    city: "",
    country: "",
    county: "",
    postal_code: "",
    kra_pin: "",
    bank_name: "",
    account_number: "",
    mpesa_paybill: "",
    buy_goods_till: "",
    contact_person_name: "",
    contact_person_email: "",
    contact_person_phone: "",
    is_active: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await fetch(`http://172.236.2.18:5555/vendors/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch vendor data");
        }
        const data = await response.json();
        setFormData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [id]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

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
    <Navigation>
      <div className="vendor-card">
        <h3 className="page-title" style={{ padding: "40px" }}>
          Edit Vendor {formData.name}
        </h3>
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
            <label htmlFor="county" className="form-label">County</label>
            <input type="text" className="form-control" id="county" value={formData.county} onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label htmlFor="postal_code" className="form-label">Postal Code</label>
            <input type="text" className="form-control" id="postal_code" value={formData.postal_code} onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label htmlFor="kra_pin" className="form-label">KRA PIN</label>
            <input type="text" className="form-control" id="kra_pin" value={formData.kra_pin} onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label htmlFor="bank_name" className="form-label">Bank Name</label>
            <input type="text" className="form-control" id="bank_name" value={formData.bank_name} onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label htmlFor="account_number" className="form-label">Account Number</label>
            <input type="text" className="form-control" id="account_number" value={formData.account_number} onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label htmlFor="mpesa_paybill" className="form-label">Mpesa Paybill</label>
            <input type="text" className="form-control" id="mpesa_paybill" value={formData.mpesa_paybill} onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label htmlFor="buy_goods_till" className="form-label">Buy Goods Till</label>
            <input type="text" className="form-control" id="buy_goods_till" value={formData.buy_goods_till} onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label htmlFor="contact_person_name" className="form-label">Contact Person Name</label>
            <input type="text" className="form-control" id="contact_person_name" value={formData.contact_person_name} onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label htmlFor="contact_person_email" className="form-label">Contact Person Email</label>
            <input type="email" className="form-control" id="contact_person_email" value={formData.contact_person_email} onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label htmlFor="contact_person_phone" className="form-label">Contact Person Phone</label>
            <input type="text" className="form-control" id="contact_person_phone" value={formData.contact_person_phone} onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label htmlFor="is_active" className="form-label">Active</label>
            <input type="checkbox" className="form-check-input" id="is_active" checked={formData.is_active} onChange={handleChange} />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">Update Vendor</button>
          </div>
        </form>
        <button type="button" onClick={() => navigate("/vendors")}>Cancel</button>
      </div>
    </Navigation>
  );
};

export default EditVendor;
