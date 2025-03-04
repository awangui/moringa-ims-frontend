import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import vendorImage from "../assets/vendor.svg";
import locationImage from "../assets/location.svg";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { FaTrash } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";

const ViewVendor = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const navigate = useNavigate();

  const viewDocuments = () => {
    navigate(`/vendors/${id}/documents`);
  };

  useEffect(() => {
    fetch(`http://172.236.2.18:5555/vendors/${id}`)
      .then((response) => response.json())
      .then((data) => setVendor(data))
      .catch((error) => console.error("Error fetching vendor data:", error));
  }, [id]);

  if (!vendor) return <p>Loading vendor details...</p>;

  return (
    <Navigation>
      <div className="vendor-container">
        <h2 className="vendor-title">Vendors / {vendor.name}</h2>
        <div className="vendor-card">
          {/* Vendor Profile */}
          <div className="vendor-header">
            <img
              src={vendor.profileImage || vendorImage}
              alt="Vendor"
              className="vendor-image"
            />
            <div className="vendor-info">
              <div className="name-badge">
                <h3 className="label">name</h3>
                <h3>{vendor.name}</h3>
              </div>
              <div>
                <span
                  className={`status-badge ${
                    vendor.is_active ? "activated" : "deactivated"
                  }`}
                >
                  {vendor.is_active ? "Activated" : "Deactivated"}
                </span>
              </div>
              <div>
                <h3 className="label">Email</h3>
                <p>{vendor.email}</p>
              </div>
              <div>
                <h3 className="label">Phone</h3>
                <p>{vendor.phone}</p>
              </div>
              <div>
                <h3 className="label">KRA pin</h3>
                <p>{vendor.kra_pin}</p>
              </div>
              <div>
                <h3 className="label">Bio</h3>
                <p>{vendor.bio}</p>
              </div>
            </div>
          </div>

          {/* Address, Contact, Payment */}
          <div className="row vendor-section">
            <div className="location-section-box col col-lg-4">
              <div>
                <h3>Vendor Address</h3>
                <img
                  src={locationImage}
                  alt="Location"
                  className="location-image"
                />
              </div>
              <p>
                <strong>Address</strong>
                {vendor.address}
              </p>
              <p>
                <strong>City</strong> {vendor.city}
              </p>
              <p>
                <strong>State</strong> {vendor.county}
              </p>
              <p>
                <strong>Country</strong> {vendor.country}
              </p>
              <p>
                <strong>Postal Code</strong> {vendor.postal_code}
              </p>
            </div>
            <div className="section-box col-md-auto">
              <h4>Contact Person</h4>
              <p><strong>Name:</strong> {vendor.contact_person_name}</p>
              <p><strong>Email:</strong> {vendor.contact_person_email}</p>
              <p><strong>Phone:</strong> {vendor.contact_person_phone}</p>
            </div>
            <div className="section-box col col-lg-2">
              <h4>Payment Details</h4>
              <p>
                <strong>Bank Name:</strong> {vendor.bank_name}
              </p>
              <p>
                <strong>Account Number:</strong> {vendor.account_number}
              </p>
              <p>
                <strong>MPESAPaybill:</strong> {vendor.mpesa_paybill}
              </p>
              <p>
                <strong>Buy Goods Till:</strong> {vendor.buy_goods_till}
              </p>
            </div>
          </div>

          <div style={{ padding: "24px" }}></div>
          <div
            style={{
              marginBottom: "24px",
              padding: "16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                Vendor Documents
              </h2>
              <button className="add-document-btn" onClick={viewDocuments}>
                + Add Document
              </button>
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
                      <div style={{ display: "flex" }}>
                        <button className="download-btn">
                          <FaDownload /> Download
                        </button>
                        <button className="delete-btn">
                          <FaTrash />
                        </button>
                      </div>
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
};

export default ViewVendor;
