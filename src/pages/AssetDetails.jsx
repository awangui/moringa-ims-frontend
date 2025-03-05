import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import myStyles from "../styles/AssetDetails.module.css";

const AssetDetails = () => {
  const { assetId } = useParams();
  const [assetData, setAssetData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Adjust as needed

  useEffect(() => {
    const fetchAssetDetails = async () => {
      try {
        const response = await fetch(`http://172.236.2.18:5050/assets/${assetId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch asset details");
        }
        const data = await response.json();
        setAssetData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssetDetails();
  }, [assetId]);

  // Once assetData is available, fetch assignments and filter those with a matching asset_id
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch("http://172.236.2.18:5050/assignments/");
        if (!response.ok) {
          throw new Error("Failed to fetch assignments");
        }
        const data = await response.json();
        // Filter assignments that match the current asset's id.
        // Note: Ensure that assetData.id and assignment.asset_id are of the same type.
        const filtered = data.filter(
          (assignment) => assignment.asset_id === assetData.id
        );
        setAssignments(filtered);
      } catch (err) {
        console.error("Error fetching assignments:", err);
      }
    };

    if (assetData) {
      fetchAssignments();
    }
  }, [assetData]);

  if (loading) return <p>Loading asset details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!assetData) return <p>No asset data found.</p>;

  // Calculate pagination indexes and determine the paginated data
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedData = assignments.slice(indexOfFirstRow, indexOfLastRow);

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

  const handleLogout = () => {
    localStorage.removeItem("access_token"); // Remove token from local storage
    navigate("/login"); // Redirect to login page
  };
  return (
    <div className={myStyles["asset-details-container"]}>
      <div className={myStyles["container"]}>
        <aside className={myStyles["sidebar"]}>
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
            <div className="profile">
              <img src="/images/no-image.jpg" alt="User Profile" width="60" />
            </div>
          </nav>
        </aside>
        <main className={myStyles["content"]}>
          <header>
            <h2>Asset Details</h2>
          </header>
          <section className={myStyles["asset-details"]}>
            <div className={myStyles["asset-info"]}>
              <img
                src="/images/no-image2.png"
                alt="Asset"
                width="200"
                className={myStyles["rounded-image"]}
              />
              <div className={myStyles["myDiv"]}>
                <div>
                  <p>
                    <strong>Serial No. :</strong> {assetData["serial_no"]}
                  </p>
                  <p>
                    <strong>Name:</strong> {assetData["item"]}
                  </p>
                  <p>
                    <strong>Class Code:</strong> {assetData["class_code"]}
                  </p>
                  <p>
                    <strong>Depreciation Rate:</strong> {assetData["depreciation_rate"]}
                  </p>
                </div>
              </div>
            </div>
            <div className={myStyles["asset-locations"]}>
              <h3>Assets at Different Locations</h3>
              {/* You can render location data here if available */}
            </div>
          </section>
          {/* Optionally, add the assignment history table */}
          {/* Assignment History Section */}
          <section className={myStyles["assignment-history"]}>
            <h2>Assignment History</h2>
            <table>
              <thead>
                <tr>
                  <th>Assignment Id</th>
                  <th>Assigned To</th>
                  <th>Location Id</th>
                  <th>Assigned Date</th>
                  <th>Return Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((entry, index) => (
                    <tr key={index}>
                        <td>{entry["id"]}</td>
                        <td>{entry["assigned_to"]}</td>
                        <td>{entry["location_id"]}</td>
                        <td>{entry["assigned_date"]}</td>
                        <td>{entry["return_date"]}</td>
                      {/* <td>{entry.assignedId}</td>
                      <td>{entry.assignedBy}</td>
                      <td>{entry.assignedTo}</td>
                      <td>{entry.assignedLocation}</td>
                      <td>{entry.status}</td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No assignments found for this asset.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className={myStyles["pagination"]}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {Math.ceil(assignments.length / rowsPerPage)}
              </span>
              <button
                disabled={currentPage >= Math.ceil(assignments.length / rowsPerPage)}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AssetDetails;
