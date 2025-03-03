import React, { useState } from "react";
import styles from "../styles/FixedAssets.module.css";
import { useLocation, Link } from 'react-router-dom';

const tableData = [
  { serial: "SN73485948", item: "Tables", code: "654M76", rate: "50", status: "Assigned" },
  { serial: "SN73485949", item: "Chairs", code: "321F23", rate: "30", status: "Available" },
  { serial: "SN73485950", item: "Desks", code: "654M77", rate: "40", status: "Assigned" },
  { serial: "SN73485951", item: "Cabinet", code: "321F24", rate: "25", status: "Available" },
  { serial: "SN73485952", item: "Laptop", code: "654M78", rate: "70", status: "In Use" },
  { serial: "SN73485953", item: "Monitor", code: "321F25", rate: "20", status: "Available" },
  { serial: "SN73485954", item: "Projector", code: "654M79", rate: "60", status: "Assigned" },
  { serial: "SN73485955", item: "Whiteboard", code: "321F26", rate: "15", status: "Available" },
  { serial: "SN73485956", item: "Mouse", code: "654M80", rate: "10", status: "In Use" },
  { serial: "SN73485957", item: "Keyboard", code: "321F27", rate: "15", status: "Available" }
];

const FixedAssets = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Track search input
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const recordsPerPage = 8;

  // Filter table data based on search term
  const filteredData = tableData.filter((record) =>
    record.item.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(tableData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  //   const currentRecords = tableData.slice(startIndex, startIndex + recordsPerPage);
  const currentRecords = filteredData.slice(startIndex, startIndex + recordsPerPage);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const links= [
    {icon: "dashboard", dataTooltip: "Dashboard", path: "/dashboard"},
    {icon: "people", dataTooltip: "Vendors", path: "/vendors"},
    // {icon: "shopping_cart", dataTooltip: "Inventory", path: "/"}, apartment
    {icon: "description", dataTooltip: "Orders", path: "/orders"},
    {icon: "content_paste", dataTooltip: "Items", path: "/items"},
    {icon: "mark_unread_chat_alt", dataTooltip: "Requests", path: "/requests"},
    {icon: "person", dataTooltip: "Users", path: "/users"},
    {icon: "apartment", dataTooltip: "Spaces", path: "/spaces"},
    {icon: "settings", dataTooltip: "Settings", path: "/settings"},
    {icon: "logout", dataTooltip: "Logout", path: "/logout"}
  ];

  const operations= [
    {icon: "add", dataTooltip:"Add Asset"},
    {icon: "delete", dataTooltip:"Delete Asset"},
    {icon: "assignment_turned_in", dataTooltip:"Assign Asset"},
    {icon: "filter_alt", dataTooltip:"Filter"},
    {icon: "notifications", dataTooltip:"Notifications"}
  ];
  return (
    <>
      <div className={styles["dashboard-container"]}>
        <div className={styles["sidebar"]}>
            <div className="logo"><img src="/images/moringa.png" alt="Moringa Logo" width="60" /></div>
            <nav>
            <ul>
                {links.map((link, index) => (
                    <Link to={link.path} key={index}>
                        <li data-tooltip={link.dataTooltip}><span className="material-icons">{link.icon}</span></li>
                    </Link>
                // <li key={index} data-tooltip={link.dataTooltip}><span className="material-icons">{link.icon}</span></li>
                ))}
            </ul>
            </nav>
            <div className="profile"><img src="/images/no-image.jpg" alt="User Profile" width="60" className="profile-img" /></div>
        </div>

        <main className={styles["main-content"]}>
            <header>
            <h1>Fixed Assets</h1>
            <div className={styles["search-bar"]}>
                <span className="material-icons">search</span>
                <input
                    type="text"
                    placeholder="Enter Item Name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            {operations.map((operation, index) => (
                <div 
                  key={index} 
                  className={styles["has-tooltip"]}
                  onClick={() => {
                    if (operation.icon === "assignment_turned_in") {
                      // setIsModalOpen(true);
                      setIsAssignModalOpen(true);
                    }else if(operation.icon === "delete"){
                      setIsDeleteModalOpen(true);
                    }else if(operation.icon === "add"){
                      setIsAddModalOpen(true);
                    }
                  }}
                >
                <span className="material-icons">{operation.icon}</span>
                <div className={styles["tooltip"]}>{operation.dataTooltip}</div>
                </div>
            ))}
            </header>

            <div className={styles["table-container"]}>
            <table>
                <thead>
                <tr>
                    <th>Serial No.</th>
                    <th>Item</th>
                    <th>Class Code</th>
                    <th>Depreciation Rate</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody id="table-body">
                {currentRecords.map((record, index) => (
                    <tr key={index}>
                    <td>{record.serial}</td>
                    <td>{record.item}</td>
                    <td>{record.code}</td>
                    <td>{record.rate}</td>
                    <td>{record.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {filteredData.length === 0 && <p>No matching records found.</p>}

            <div className={styles["pagination"]}>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            </div>
            </div>
        </main>
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <div className={styles["modal"]} onClick={() => setIsAddModalOpen(false)}>
          <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
            <span className={styles["close-btn"]} onClick={() => setIsAddModalOpen(false)}>
              &times;
            </span>
            <h1>Add New Asset</h1>
            <input type="text" name="asset-name" id="asset-name" placeholder="Asset Name"/>
            <input type="date" name="date-of-purchase" id="date-of-purchase" placeholder="Date of Purchase"/>
            <input type="text" name="serial-number" id="serial-number" placeholder="Serial Number"/>
            <input type="text" name="specifications-model" id="specifications-model" placeholder="Specifications/Model"/>
            <input type="text" name="depreciation-rate" id="depreciation-rate" placeholder="Depreciation Rate"/>
            <input type="text" name="vendor" id="vendor" placeholder="Vendor/Supplier"/>
            <input type="text" name="purchase-price" id="purchase-price" placeholder="Purchase Price"/>
            <input type="text" name="condition" id="condition" placeholder="Condition"/>
            <button className={styles["save-btn"]}>Save</button>
          </div>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className={styles["modal"]} onClick={() => setIsDeleteModalOpen(false)}>
          <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
            <span className={styles["close-btn"]} onClick={() => setIsDeleteModalOpen(false)}>
              &times;
            </span>
            <h1>Delete Asset</h1>
            <input type="text" name="asset-name" id="asset-name" placeholder="Asset Name" style={{marginTop: "50px"}}/>
            <input type="text" name="serial-number" id="serial-number" placeholder="Serial Number" style={{marginTop: "50px"}}/>
            <button className={styles["save-btn"]} style={{marginTop: "50px"}}>Delete</button>
          </div>
        </div>
      )}
      {isAssignModalOpen && (
        <div className={styles["modal"]} onClick={() => setIsAssignModalOpen(false)}>
          <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
            <span className={styles["close-btn"]} onClick={() => setIsAssignModalOpen(false)}>
              &times;
            </span>

            <h1>Assign Fixed Asset</h1>
            <input type="text" name="quantity" id="quantity" placeholder="Quantity"/>
            <input type="text" name="location" id="location" placeholder="Location"/>
            <input type="date" name="assignment-date" id="assignment-date" placeholder="Assignment Date"/>
            <input type="text" name="assigned-to" id="assigned-to" placeholder="Assigned To"/>
            <button className={styles["save-btn"]} onClick={() => { /* Action button functionality */ }}>Save</button>
          </div>
        </div>
      )}
    </>
  );
};

export default FixedAssets;
