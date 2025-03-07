import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import vendorImage from "../assets/vendor.svg";
import locationImage from "../assets/location.svg";
import profileImage from "../assets/profile.svg";
import paymentImage from "../assets/credit-card.svg";
// import Navigation from "../components/Navigation";
import SideBar from "./SideBar";
import { FaTrash, FaDownload } from "react-icons/fa";

const ViewVendor = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://172.236.2.18:5555/vendors/${id}`)
      .then((response) => response.json())
      .then((data) => setVendor(data))
      .catch((error) => console.error("Error fetching vendor data:", error));
  }, [id]);

  useEffect(() => {
    fetch(`http://172.236.2.18:5555/vendors/${id}/orders`)
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching vendor orders:", error));
  }, [id]);

  const viewDocuments = () => {
    navigate(`/vendors/${id}/documents`);
  };

  const downloadDocuments = (doc_id) => {
    fetch(`http://172.236.2.18:5555/vendors/${id}/documents/${doc_id}/download`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `document_${doc_id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => console.error("Failed to download document:", error));
  };

  const deleteDocument = (doc_id) => {
    fetch(`http://172.236.2.18:5555/vendors/${id}/documents/${doc_id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setVendor((prev) => ({
            ...prev,
            documents: prev.documents.filter((doc) => doc.id !== doc_id),
          }));
        }
      })
      .catch((error) => console.error("Failed to delete document:", error));
  };

  if (!vendor) return <p>Loading vendor details...</p>;

  return (
    // <Navigation>
    <div className="wrapper" style={{ display: "flex", gap: "100px"}}>
      <SideBar/>
      <div className="vendor-container" style={{ height: "100vh", overflowY: "auto", scrollbarWidth: "none",  msOverflowStyle: "none", }}>
        <h2 className="vendor-title">Vendors / {vendor.name}</h2>
        <div className="vendor-card">
          {/* Vendor Profile */}
          <div className="vendor-header">
            <img src={vendor.profileImage || vendorImage} alt="Vendor" className="vendor-image" />
            <div className="vendor-info">
              <div className="name-badge">
                <h3 className="label">Name</h3>
                <h3>{vendor.name}</h3>
              </div>
              <div>
                <h3 className="label">Status</h3>
                <span className={`status-badge ${vendor.is_active ? "activated" : "deactivated"}`}>
                  {vendor.is_active ? "Activated" : "Deactivated"}
                </span>
              </div>
              <div>
                <h3 className="label">Email</h3>
                <p>{vendor.email || "N/A"}</p>
              </div>
              <div>
                <h3 className="label">Phone</h3>
                <p>{vendor.phone || "N/A"}</p>
              </div>
              <div>
                <h3 className="label">KRA Pin</h3>
                <p>{vendor.kra_pin || "N/A"}</p>
              </div>
              <div>
                <h3 className="label">Bio</h3>
                <p>{vendor.bio || "No bio available"}</p>
              </div>
            </div>
          </div>

          {/* Address, Contact, Payment Details */}
          <div className="vendor-section">
            <div className="section-box">
              <div className="image-box">
                <h2>Vendor Address</h2>
                <img src={locationImage} alt="Location" className="location-image" />
              </div>
              <p><strong>Address:</strong> {vendor.address || "N/A"}</p>
              <p><strong>City:</strong> {vendor.city || "N/A"}</p>
              <p><strong>State:</strong> {vendor.county || "N/A"}</p>
              <p><strong>Country:</strong> {vendor.country || "N/A"}</p>
              <p><strong>Postal Code:</strong> {vendor.postal_code || "N/A"}</p>
            </div>

            <div className="section-box">
              <div className="image-box">
                <h2>Contact Person</h2>
                <img src={profileImage} alt="Contact" className="profile-image" />
              </div>
              <p><strong>Name:</strong> {vendor.contact_person_name || "N/A"}</p>
              <p><strong>Email:</strong> {vendor.contact_person_email || "N/A"}</p>
              <p><strong>Phone:</strong> {vendor.contact_person_phone || "N/A"}</p>
            </div>

            <div className="section-box">
              <div className="image-box">
                <h2>Payment Details</h2>
                <img src={paymentImage} alt="Payment" className="payment-image" />
              </div>
              <p><strong>Bank Name:</strong> {vendor.bank_name || "N/A"}</p>
              <p><strong>Account Number:</strong> {vendor.account_number || "N/A"}</p>
              <p><strong>MPESA Paybill:</strong> {vendor.mpesa_paybill || "N/A"}</p>
              <p><strong>Buy Goods Till:</strong> {vendor.buy_goods_till || "N/A"}</p>
            </div>
          </div>

          {/* Vendor Documents */}
          <div className="vendor-documents" style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}>
            <h2>Vendor Documents</h2>
            <button className="add-document-btn" onClick={viewDocuments}>+ Add Document</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>URL</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendor.documents?.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.filename}</td>
                    <td>{doc.type}</td>
                    <td>{doc.file_url}</td>
                    <td>
                    <div style={{ display: "flex" }}>
                      <button className="download-btn" onClick={() => downloadDocuments(doc.id)}>
                        <FaDownload /> Download
                      </button>
                      <button className="delete-btn" onClick={() => deleteDocument(doc.id)}>
                        <FaTrash /> Delete
                      </button>
                    </div>
                    </td>
                  </tr>
                )) || <tr><td colSpan="4">No documents available</td></tr>}
              </tbody>
            </table>
       

          {/* Vendor Purchase Orders */}
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
                {orders.map((order) => (
                  <tr key={order["order.id"]}>
                    <td>{order["order.id"]}</td>
                    <td>{order.item}</td>
                    <td>{order.quantity}</td>
                    <td>{order.total_amount}</td>
                  </tr>
                )) || <tr><td colSpan="4">No purchase orders available</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
        // </Navigation>
      );
    };

export default ViewVendor;
