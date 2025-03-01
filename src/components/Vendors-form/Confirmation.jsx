import React, { useState, useContext } from "react";
import { VendorContext } from "../../VendorContext";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

const Confirmation = ({ prevStep, values }) => {
  const [modalShow, setModalShow] = useState(false);
  const { addVendor } = useContext(VendorContext);
  const navigate = useNavigate();

  const handleSubmit = () => {
    addVendor(values);
    setModalShow(true);
    setTimeout(() => {
      navigate("/vendors"); 
    }, 1000);
  };

  return (
    <div>
      <h3 className="page-title">Confirm Details</h3>
      <ul>
        <li>Name: {values.name}</li>
        <li>Email: {values.email}</li>
        <li>Phone: {values.phone}</li>
        <li>Bio: {values.bio}</li>
        <li>Kra Pin: {values.kraPin}</li>
        <li>Status: {values.status}</li>
        <li>Contact Person Name: {values.contactPersonName}</li>
        <li>Contact Person Email: {values.contactPersonEmail}</li>
        <li>Contact Person Phone: {values.contactPersonPhone}</li>
        <li>Address: {values.address}</li>
        <li>Country: {values.country}</li>
        <li>County: {values.county}</li>
        <li>City: {values.city}</li>
        <li>Postal Code: {values.postalCode}</li>
        <li>Bank Name: {values.bankName}</li>
        <li>Account Number: {values.accountNumber}</li>
        <li>MPESA Paybill: {values.mpesaPaybill}</li>
        <li>Buy Goods Till: {values.buyGoodsTill}</li>
        <li>Vendor Document Name: {values.vendorDocumentName}</li>
        <li>Vendor Document Type: {values.vendorDocumentType}</li>
        <li>Vendor Document URL: {values.vendorDocumentURL}</li>
      </ul>
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
