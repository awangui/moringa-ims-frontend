import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Confirmation = ({ prevStep, values }) => {
  const [modalShow, setModalShow] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formValues = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        bio: values.bio,
        kra_pin: values.kraPin, 
        is_active: values.status,
        address: values.address,
        city: values.city,
        postal_code: values.postalCode,
        county: values.county,
        country: values.country,
        bank_name: values.bankName,
        account_number: values.accountNumber,
        mpesa_paybill: values.mpesaPaybill,
        buy_goods_till: values.buyGoodsTill,
        contact_person_name: values.contactPersonName,
        contact_person_email: values.contactPersonEmail,
        contact_person_phone: values.contactPersonPhone,
      };
  
      const response = await fetch("http://172.236.2.18:5555/vendors/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });
  
      if (!response.ok) {
        let errorMessage = "Failed to add vendor.";//default error message
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (error) {
          console.error("Error parsing JSON response", error);
        }
        throw new Error(errorMessage);
      }
  
      setModalShow(true);
      setTimeout(() => {
        navigate("/vendors");
      }, 1000);
    } catch (err) {
      console.error("Error:", err.message);
      setError(err.message);
    }
  };
  

  return (
    <div className="confirmation-container">      
      {/* Display the details being submitted */}
      <ul className="confirmation-list">
        {Object.entries(values).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong>{" "}
            {key === "status" ? (value ? "Active" : "Inactive") : value || "N/A"}
          </li>        
        ))}
      </ul>

      {error && <p className="error-message">{error}</p>}

      <div className="button-group">
        <button className="btn btn-secondary" onClick={prevStep}>Back</button>
        <button className="btn btn-primary" onClick={handleFormSubmit}>Submit</button>
      </div>

      {modalShow && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close" onClick={() => navigate("/vendors")}>&times;</span>
            <p>Vendor successfully added!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Confirmation;
