// import React, { useEffect } from "react";
import { Chart, registerables } from "chart.js";
import React, { useEffect, useRef } from "react";
// import Chart from "chart.js/auto";
import dash from "../styles/Dashboard.module.css";
import { Link, useNavigate } from "react-router-dom";
import SideBar from "@/components/SideBar";

Chart.register(...registerables);

const Dashboard = () => {
    const expensesChartRef = useRef(null);
    const ordersChartRef = useRef(null);
    const expensesChartInstance = useRef(null);
    const ordersChartInstance = useRef(null);
    // const navigate = useNavigate();
    
    useEffect(() => {
        // Destroy existing instances before creating new ones
        if (expensesChartInstance.current) {
            expensesChartInstance.current.destroy();
        }
        if (ordersChartInstance.current) {
            ordersChartInstance.current.destroy();
        }

        // Create Expenses Chart
        if (expensesChartRef.current) {
            expensesChartInstance.current = new Chart(expensesChartRef.current, {
            type: "line",
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [{
                label: "Expenses (in $)",
                data: [120, 150, 180, 200, 220, 250, 230, 210, 260, 280, 300, 320],
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                borderWidth: 2,
                pointRadius: 5,
                pointBackgroundColor: "blue",
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                y: { beginAtZero: true },
                },
            },
            });
        }

        // Create Orders Pie Chart
        if (ordersChartRef.current) {
            ordersChartInstance.current = new Chart(ordersChartRef.current, {
            type: "pie",
            data: {
                labels: ["Completed", "Cancelled", "Pending", "Approved"],
                datasets: [{
                data: [40, 10, 30, 20], // Example percentages
                backgroundColor: ["#4CAF50", "#FF5722", "#FFC107", "#2196F3"],
                borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
            });
        }

        // Cleanup: Destroy chart instances when component unmounts
        return () => {
            if (expensesChartInstance.current) {
            expensesChartInstance.current.destroy();
            }
            if (ordersChartInstance.current) {
            ordersChartInstance.current.destroy();
            }
        };
    }, []);

    // const links = [
    //     { icon: "dashboard", dataTooltip: "Dashboard", path: "/" },
    //     { icon: "people", dataTooltip: "Vendors", path: "/vendors" },
    //     { icon: "description", dataTooltip: "Orders", path: "/orders" },
    //     { icon: "content_paste", dataTooltip: "Items", path: "/items" },
    //     { icon: "mark_unread_chat_alt", dataTooltip: "Requests", path: "/requests" },
    //     { icon: "person", dataTooltip: "Users", path: "/users" },
    //     { icon: "undo", dataTooltip: "Returns", path: "/returns" },
    //     { icon: "apartment", dataTooltip: "Spaces", path: "/spaces" },
    //     { icon: "settings", dataTooltip: "Settings", path: "/settings" },
    //     { icon: "logout", dataTooltip: "Logout", path: "/logout" },
    // ];

    // const handleLogout = () => {
    //     localStorage.removeItem("access_token"); // Remove token from local storage
    //     navigate("/login"); // Redirect to login page
    // };

  return (
    <div className={dash["dashboard-container"]}>
      <SideBar/>
      {/* <aside className={dash["sidebar"]}>
        <div className="logo">
          <img src="/images/moringa.png" alt="moringa-logo" width="60" />
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
          <div className="profile">
            <img
              src="/images/no-image.jpg"
              alt="User Profile"
              width="60"
              style={{ borderRadius: "1000px", overflow: "hidden" }}
            />
          </div>
        </nav>
      </aside> */}

      <main className={dash["main-content"]}>
        <section className={dash["cards"]}>
          {["53 Users", "57 Vendors", "3451 Items"].map((text, index) => (
            <div key={index} className={dash["card"]}>
              <span className="material-icons">person</span> {text}
            </div>
          ))}
        </section>

        <section className={dash["charts"]}>
          <div className={dash["chart"]}>
            <h2>Expense Chart</h2>
            <div className={dash["chart-container"]}>
              {/* <canvas id="expensesChart"></canvas> */}
              <canvas id="expensesChart" ref={expensesChartRef}></canvas>
            </div>
          </div>
          <div className={dash["orders"]}>
            <h2>Orders Summary</h2>
            <div className={dash["pie-chart-container"]}>
              {/* <canvas id="ordersPieChart"></canvas> */}
              <canvas id="ordersPieChart" ref={ordersChartRef}></canvas>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
{/* <ul>
    {[
        "dashboard",
        "people",
        "shopping_cart",
        "description",
        "content_paste",
        "mark_unread_chat_alt",
        "person",
        "settings",
        "logout",
    ].map((icon, index) => (
        <li key={index} data-tooltip={icon.charAt(0).toUpperCase() + icon.slice(1)}>
        <span className="material-icons">{icon}</span>
        </li>
    ))}
</ul> */}
