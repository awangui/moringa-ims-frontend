import React, { useState } from "react";
import vendorImage from "../assets/undraw_in-the-zone_07y7.svg";

const ViewVendor = () => {
  const [activeTab, setActiveTab] = useState("all");

  const documents = [
    { name: "Stephanie Mboya", type: "PDF", url: "www.inventorysystems.com" },
    { name: "Stephanie Mboya", type: "PDF", url: "www.inventorysystems.com" }
  ];

  const purchaseOrders = [
    { id: "SN73485948", item: "Chairs", type: "Inventory", quantity: 500, amount: "Kshs 50,345" },
    { id: "SN73485948", item: "Chairs", type: "Inventory", quantity: 500, amount: "Kshs 50,345" },
    { id: "SN73485948", item: "Chairs", type: "Inventory", quantity: 500, amount: "Kshs 50,345" }
  ];

  // Example vendor data (Replace with API data)
  const vendor = {
    name: "Stephanie Mboya",
    email: "johndoe@gmail.com",
    phone: "+254758493036",
    kraPin: "4354564564",
    bio: "Admin cnfdjocnd dnjisdn cnjncde cnsjcnsjiksm cdnjksndosnd",
    category: "Admin",
    address: {
      address1: "5748473839",
      address2: "378346338",
      address3: "433436483",
      city: "Nairobi",
      state: "Nairobi",
      country: "Kenya",
      postalCode: "46837632",
    },
    contactPerson: {
      name: "Stephanie Mboya",
      email: "johndoe@gmail.com",
      phone: "+254758493036",
    },
    paymentDetails: {
      bankName: "Stephanie Mboya",
      mpesaPaybill: "463736829",
      mpesaBuyGoods: "47387328",
      accountNumber: "464838738",
    },
  };

  return (
    <div className="vendor-container">
      <h2 className="vendor-title">Vendors / {vendor.name}</h2>

      <div className="vendor-card">
        {/* Vendor Profile */}
        <div className="vendor-header">
          <img
            src="https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHByb2ZpbGUlMjBwaWN8ZW58MHx8MHx8fDA%3D"
            alt="Vendor"
            className="vendor-image"
          />
          <div className="vendor-info">
            <h3>{vendor.name}</h3>
            <p>Email: {vendor.email}</p>
            <p>Phone: {vendor.phone}</p>
            <p>{vendor.kraPin}</p>
            <p>{vendor.bio}</p>
          </div>
        </div>

        {/* Address, Contact, Payment */}
        <div className="vendor-section">
          <div className="section-box">
            <h4>Vendor Address</h4>
            <p><strong>Address 1:</strong> {vendor.address.address1}</p>
            <p><strong>Address 2:</strong> {vendor.address.address2}</p>
            <p><strong>Address 3:</strong> {vendor.address.address3}</p>
            <p><strong>City:</strong> {vendor.address.city}</p>
            <p><strong>State:</strong> {vendor.address.state}</p>
            <p><strong>Country:</strong> {vendor.address.country}</p>
            <p><strong>Postal Code:</strong> {vendor.address.postalCode}</p>
          </div>

          <div className="section-box">
            <h4>Contact Person</h4>
            <img src={vendorImage} className="vendor-image" alt="Contact Person" />
            <p><strong>Name:</strong> {vendor.contactPerson.name}</p>
            <p><strong>Email:</strong> {vendor.contactPerson.email}</p>
            <p><strong>Phone:</strong> {vendor.contactPerson.phone}</p>
          </div>

          <div className="section-box">
            <h4>Payment Details</h4>
            <p><strong>Bank Name:</strong> {vendor.paymentDetails.bankName}</p>
            <p><strong>MPESA Paybill:</strong> {vendor.paymentDetails.mpesaPaybill}</p>
            <p><strong>MPESA Buy Goods:</strong> {vendor.paymentDetails.mpesaBuyGoods}</p>
            <p><strong>Account Number:</strong> {vendor.paymentDetails.accountNumber}</p>
          </div>
        </div>

        <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "24px", padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Vendor Documents</h2>
          <button style={{ backgroundColor: "#007bff", color: "white", padding: "8px 12px", border: "none", borderRadius: "4px" }}>+ Add Document</button>
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
            {documents.map((doc, index) => (
              <tr key={index}>
                <td>{doc.name}</td>
                <td>{doc.type}</td>
                <td>{doc.url}</td>
                <td>
                  <button style={{ marginRight: "8px" }}>Download</button>
                  <button style={{ color: "red" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>Vendor Purchase Orders</h2>
        <div>
          <button onClick={() => setActiveTab("all")} style={{ marginRight: "8px", padding: "8px 12px", border: "none", borderRadius: "4px", backgroundColor: activeTab === "all" ? "#007bff" : "#ddd", color: activeTab === "all" ? "white" : "black" }}>All (200)</button>
          <button onClick={() => setActiveTab("pending")} style={{ padding: "8px 12px", border: "none", borderRadius: "4px", backgroundColor: activeTab === "pending" ? "#007bff" : "#ddd", color: activeTab === "pending" ? "white" : "black" }}>Pending Balances (3000)</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Item</th>
              <th>Item Type</th>
              <th>Quantity</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map((order, index) => (
              <tr key={index}>
                <td>{order.id}</td>
                <td>{order.item}</td>
                <td>{order.type}</td>
                <td>{order.quantity}</td>
                <td>{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </div>
      </div>
    </div>
  );
};

export default ViewVendor;
