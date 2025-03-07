import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Sidebar.module.css"; // Ensure you have styles for sidebar

const SideBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token"); // Remove token from local storage
    navigate("/login"); // Redirect to login page
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
    { icon: "settings", dataTooltip: "Settings", path: "#" },
    { icon: "logout", dataTooltip: "Logout", path: "/logout" },
  ];

  return (
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
  );
};

export default SideBar;
