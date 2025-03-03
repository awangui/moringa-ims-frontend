import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { VendorContext } from "../pages/VendorContext";
import vendorImage from "../assets/undraw_in-the-zone_07y7.svg";
import { useNavigate } from "react-router-dom";
import  Navigation  from "../components/Navigation";

const ViewVendor = () => {
  const { id } = useParams();
  const { vendors } = useContext(VendorContext);
  const [vendor, setVendor] = useState(null);
  const navigate = useNavigate();
  const viewDocuments = () => {
    navigate(`/vendors/${id}/documents`);
  }
  // const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const foundVendor = vendors.find((v) => v.id === parseInt(id));
    setVendor(foundVendor);
    console.log(foundVendor);
  }, [id, vendors]);

  if (!vendor) return <p>Loading vendor details...</p>;

  return (
    <Navigation>
    <div className="vendor-container">
      <h2 className="vendor-title">Vendors / {vendor.name}</h2>
      <div className="vendor-card">
        {/* Vendor Profile */}
        <div className="vendor-header">
          <img src={vendor.profileImage || vendorImage} alt="Vendor" className="vendor-image" />
          <div className="vendor-info">
            <h3>{vendor.name}</h3>
            <span className={`status-badge ${vendor.is_active ? "activated" : "deactivated"}`}>
                    {vendor.is_active ? "Activated" : "Deactivated"}
                  </span> 
            <p>Email: {vendor.email}</p>
            <p>Phone: {vendor.phone}</p>
            <p>KRA Pin: {vendor.kra_pin}</p>
            <p>Bio: {vendor.bio}</p>
          </div>
        </div>

        {/* Address, Contact, Payment */}
        <div className="vendor-section">
          <div className="section-box">
            <h4>Vendor Address</h4>
            <p><strong>Address:</strong>{vendor.address}</p>
            <p><strong>City:</strong> {vendor.city}</p>
            <p><strong>State:</strong> {vendor.county}</p>
            <p><strong>Country:</strong> {vendor.country}</p>
            <p><strong>Postal Code:</strong> {vendor.postal_code}</p>
          </div>
          <div className="section-box">
            <h4>Contact Person</h4>
            {/* <p><strong>Name:</strong> {vendor.contactPerson.name}</p>
            <p><strong>Email:</strong> {vendor.contactPerson.email}</p>
            <p><strong>Phone:</strong> {vendor.contactPerson.phone}</p> */}
            </div>
            <div className="section-box">
              <h4>Payment Details</h4>
              <p><strong>Bank Name:</strong> {vendor.bank_name}</p>
              <p><strong>MPESA Number/Paybill:</strong> {vendor.mpesa_number}</p>
            </div>
            </div>

            <div style={{ padding: "24px" }}>
            </div>
            <div style={{ marginBottom: "24px", padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Vendor Documents</h2>
                <button onClick={viewDocuments} style={{ backgroundColor: "#ff6600", color: "white", padding: "8px 12px", border: "none", borderRadius: "4px" }}>+ Add Document</button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>URL</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendor.documents.map((doc, index) => (
                    <tr key={index}>
                      <td>{doc.filename}</td>
                      <td>{doc.type}</td>
                      <td>{doc.file_url}</td>
                      <td>
                        <button style={{ marginRight: "8px" }}>Download</button>
                        <button style={{ color: "red" }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        <div className="purchase-orders-section">
          <h2>Vendor Purchase Orders</h2>
          <div>
            <button onClick={() => setActiveTab("all")}>All</button>
            <button onClick={() => setActiveTab("pending")}>Pending</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* {vendor.purchaseOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order.id}</td>
                  <td>{order.item}</td>
                  <td>{order.quantity}</td>
                  <td>{order.amount}</td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </Navigation>
  );
}

export default ViewVendor;
