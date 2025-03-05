import React, { useState, useEffect } from "react";
import styles from "../styles/FixedAssets.module.css";
import { Link, useNavigate } from "react-router-dom";
import DateInput from "../components/DateInput";

const FixedAssets = () => {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Track search input
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const recordsPerPage = 8;
  const navigate = useNavigate();

  // Fetch assets from the endpoint when the component mounts
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch("http://172.236.2.18:5050/assets");
        if (!response.ok) {
          throw new Error("Failed to fetch assets");
        }
        const data = await response.json();
        setTableData(data);
      } catch (error) {
        console.error("Error fetching assets:", error);
        alert("Error: " + error.message);
      }
    };

    fetchAssets();
  }, []);

  // Filter table data based on search term
  const filteredData = tableData.filter((record) =>
    record.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = filteredData.slice(startIndex, startIndex + recordsPerPage);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const links = [
    { icon: "dashboard", dataTooltip: "Dashboard", path: "/" },
    { icon: "people", dataTooltip: "Vendors", path: "/vendors" },
    { icon: "description", dataTooltip: "Orders", path: "/orders" },
    { icon: "content_paste", dataTooltip: "Items", path: "/items" },
    { icon: "mark_unread_chat_alt", dataTooltip: "Requests", path: "/requests" },
    { icon: "person", dataTooltip: "Users", path: "/users" },
    { icon: "undo", dataTooltip: "Returns", path: "/returns" },
    { icon: "apartment", dataTooltip: "Spaces", path: "/spaces" },
    { icon: "settings", dataTooltip: "Settings", path: "/settings" },
    { icon: "logout", dataTooltip: "Logout", path: "/logout" },
  ];

  const operations = [
    { icon: "add", dataTooltip: "Add Asset" },
    { icon: "delete", dataTooltip: "Delete Asset" },
    { icon: "assignment_turned_in", dataTooltip: "Assign Asset" },
    { icon: "filter_alt", dataTooltip: "Filter" },
    { icon: "notifications", dataTooltip: "Notifications" },
  ];

  const addItem = async (e) => {
    e.preventDefault();

    // Construct the asset object from the form fields
    const form = e.target;
    const asset = {
      "item": form["item-name"].value,
      "class_code": form["class-code"].value,
      "purchase_date": form["purchase-date"] ? form["purchase-date"].value : "",
      "serial_no": form["serial-number"].value,
      "specifications": form["specifications-model"].value,
      "depreciation_rate": form["depreciation-rate"].value,
      "vendor": form["vendor"].value,
      "purchase_price": form["purchase-price"].value,
      "condition": form["condition"].value,
      // itemName: form["item-name"].value,
      // classCode: form["class-code"].value,
      // purchaseDate: form["purchase-date"] ? form["purchase-date"].value : "",
      // serialNumber: form["serial-number"].value,
      // specificationsModel: form["specifications-model"].value,
      // depreciationRate: form["depreciation-rate"].value,
      // vendor: form["vendor"].value,
      // purchasePrice: form["purchase-price"].value,
      // condition: form["condition"].value,
    };

    try {
      const response = await fetch("http://172.236.2.18:5050/assets/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(asset),
        mode:"cors"
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "An error occurred");
      } else {
        alert("Item added successfully");
        // Optionally, close the modal and refresh the table data
        setIsAddModalOpen(false);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // New function to handle asset assignment
  const assignAsset = async (e) => {
    e.preventDefault();

    const form = e.target;
    const assignment = {
      "asset_id": parseInt(form["asset-id"].value, 10),
      "location_id": parseInt(form["location-id"].value, 10),
      "assigned_to": form["assigned-to"].value,
      "assigned_date": form["assigned_date"].value, // ensure DateInput returns a proper value
      "return_date": form["return_date"].value,  
      // asset_id: parseInt(form["asset-id"].value, 10),
      // location_id: parseInt(form["location-id"].value, 10),
      // assigned_to: form["assigned-to"].value,
      // assigned_date: form["assigned_date"].value, // ensure DateInput returns a proper value
      // return_date: form["return_date"].value,     // ensure DateInput returns a proper value
    };

    try {
      const response = await fetch("http://172.236.2.18:5050/assignments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignment),
        mode: "cors",
      });

      if (!response.ok) {
        const errorData = await response.json();
        // alert(errorData.message || "An error occurred");
        alert(errorData["error"] || "An error occurred");
      } else {
        alert("Asset assigned successfully");
        setIsAssignModalOpen(false);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // New function to handle asset deletion
  const deleteItem = async (e) => {
    e.preventDefault();

    const form = e.target;
    const assetId = form["asset-id"].value;

    try {
      const response = await fetch(`http://172.236.2.18:5050/assets/${assetId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Error deleting asset");
      } else {
        alert("Asset deleted successfully");
        // Optionally update the state to remove the deleted asset:
        setTableData((prevData) => prevData.filter((asset) => asset.id !== parseInt(assetId, 10)));
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token"); // Remove token from local storage
    navigate("/login"); // Redirect to login page
  };
  return (
    <>
      <div className={styles["dashboard-container"]}>
        <div className={styles["sidebar"]}>
          <div className="logo">
            <img src="/images/moringa.png" alt="Moringa Logo" width="60" />
          </div>
          <nav>
          <ul>
            {links.map((link, index) => {
              if (link.dataTooltip === "Logout") {
                return (
                  <li
                    key={index}
                    data-tooltip="Logout"
                    onClick={handleLogout}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="material-icons">{link.icon}</span>
                  </li>
                );
              } else {
                return (
                  <Link to={link.path} key={index}>
                    <li data-tooltip={link.dataTooltip}>
                      <span className="material-icons">{link.icon}</span>
                    </li>
                  </Link>
                );
              }
            })}
          </ul>
            {/* <ul>
              {links.map((link, index) => (
                <Link to={link.path} key={index}>
                  <li data-tooltip={link.dataTooltip}>
                    <span className="material-icons">{link.icon}</span>
                  </li>
                </Link>
              ))}
            </ul> */}
          </nav>
          <div className="profile">
            <img
              src="/images/no-image.jpg"
              alt="User Profile"
              width="60"
              className="profile-img"
            />
          </div>
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
                    setIsAssignModalOpen(true);
                  } else if (operation.icon === "delete") {
                    setIsDeleteModalOpen(true);
                  } else if (operation.icon === "add") {
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
                  <th>Id</th>
                  <th>Serial No.</th>
                  <th>Item</th>
                  <th>Class Code</th>
                  <th>Depreciation Rate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id={styles["table-body"]}>
                {currentRecords.map((record, index) => (
                  <tr 
                    key={index}
                    onClick={() => navigate(`/asset-details/${record.id}`)}
                    style={{ cursor: "pointer"}}
                  >
                    <td>{record["id"]}</td>
                    <td>{record["serial_no"]}</td>
                    <td>{record["item"]}</td>
                    <td>{record["class_code"]}</td>
                    <td>{record["depreciation_rate"]}</td>
                    <td>{record["status"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredData.length === 0 && <p>No matching records found.</p>}

            <div className={styles["pagination"]}>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                Previous
              </button>
              <span>{`Page ${currentPage} of ${totalPages}`}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                Next
              </button>
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
            <form onSubmit={addItem} autoComplete="off">
              <input type="text" name="item-name" id="item-name" placeholder="Item Name" />
              <input type="text" name="class-code" id="class-code" placeholder="Class Code" />
              {/* Ensure your DateInput component passes the value as needed */}
              <DateInput name="purchase-date" placeholder="Purchase Date" />
              <input type="text" name="serial-number" id="serial-number" placeholder="Serial Number" />
              <input type="text" name="specifications-model" id="specifications-model" placeholder="Specifications/Model" />
              <input type="number" id="depreciation-rate" name="depreciation-rate" min="1" placeholder="Depreciation Rate" />
              <input type="text" name="vendor" id="vendor" placeholder="Vendor/Supplier" />
              <input type="number" id="purchase-price" name="purchase-price" min="1" placeholder="Purchase Price" />
              <input type="text" name="condition" id="condition" placeholder="Condition" />
              <button type="submit" className={styles["save-btn"]}>Save</button>
            </form>
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
            <form onSubmit={deleteItem} autoComplete="off">
                <input type="number" name="asset-id" id="asset-id" placeholder="Enter Id" style={{ marginTop: "50px" }} />
                <button className={styles["save-btn"]} style={{ marginTop: "50px" }}>Delete</button>
            </form>
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
            <form onSubmit={assignAsset} autoComplete="off">
              <input type="number" id="asset-id" name="asset-id" min="1" placeholder="Asset Id" />
              <input type="number" id="location-id" name="location-id" min="1" placeholder="Location Id" />
              <input type="text" name="assigned-to" id="assigned-to" placeholder="Assigned To" />
              <DateInput name="assigned_date" placeholder="Assigned Date" />
              <DateInput name="return_date" placeholder="Return Date" style={{ marginBottom: "20px" }} />
              <button type="submit" className={styles["save-btn"]}>Save</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FixedAssets;