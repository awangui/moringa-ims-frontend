import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const Confirmation = ({ prevStep, values }) => {
  const [modalShow, setModalShow] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const vendorData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        postal_code: values.postalCode,
        county: values.county,
        country: values.country,
        kra_pin: values.kraPin,
        bank_name: values.bankName,
        account_number: values.accountNumber,
        mpesa_number: values.mpesaPaybill || "",
        is_active: values.status === "active",
      };
  
      const response = await fetch("http://172.236.2.18:5555/vendors/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vendorData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add vendor");
      }
  
      setModalShow(true);
      setTimeout(() => {
        navigate("/vendors");
        window.location.reload();
      }, 1000);
    } catch (error) {
      setError(error.message);
    }
  };
  

  return (
    <div>
      <h3>Confirm Vendor Details</h3>
      <ul className="confirmation-list">
        <li><strong>Name:</strong> {values.name}</li>
        <li><strong>Email:</strong> {values.email}</li>
        <li><strong>Phone:</strong> {values.phone}</li>
        <li><strong>Address:</strong> {values.address}</li>
        {/* <li>Contact Person Name: {values.contactPersonName}</li>
        <li>Contact Person Email: {values.contactPersonEmail}</li>
        <li>Contact Person Phone: {values.contactPersonPhone}</li>
        <li><strong>Postal Code:</strong> {values.postalCode}</li> */}
        <li><strong>County:</strong> {values.county}</li>
        <li><strong>Country:</strong> {values.country}</li>
        <li><strong>KRA Pin:</strong> {values.kraPin}</li>
        <li><strong>Bank Name:</strong> {values.bankName}</li>
        <li><strong>Account Number:</strong> {values.accountNumber}</li>
        <li><strong>MPESA Paybill:</strong> {values.mpesaPaybill || "N/A"}</li>
        <li><strong>Status:</strong> {values.status}</li>
      </ul>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <button onClick={prevStep}>Back</button>
      <button onClick={handleSubmit}>Submit</button>

      {modalShow && (
        <div className="modal">
          <p>Vendor successfully added!</p>
        </div>
      )}
    </div>
  );
};

export default Confirmation;
