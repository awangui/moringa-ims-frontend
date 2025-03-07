import React, { useEffect, useState, useRef } from "react";
import { Chart, registerables } from "chart.js";
import dash from "../styles/Dashboard.module.css";
import { Link, useNavigate } from "react-router-dom";
import SideBar from "@/components/SideBar";

Chart.register(...registerables);

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [itemsCount, setItemsCount] = useState(0);
    const [vendorsCount, setVendorsCount] = useState(0);
    const [usersCount, setUsersCount] = useState(0);
    const expensesChartRef = useRef(null);
    const ordersChartRef = useRef(null);
    const expensesChartInstance = useRef(null);
    const ordersChartInstance = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ordersResponse = await fetch("http://172.236.2.18:5376/orders/");
                const ordersData = await ordersResponse.json();
                setOrders(ordersData.filter(order => ["received", "cancelled", "pending", "approved"].includes(order.status.toLowerCase())));
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        const fetchItems = async () => {
            try {
                const itemsResponse = await fetch("http://172.236.2.18:5050/assets");
                const itemsData = await itemsResponse.json();
                setItemsCount(itemsData.length);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        const fetchVendors = async () => {
            try {
                const vendorsResponse = await fetch("http://172.236.2.18:5555/vendors/");
                const vendorsData = await vendorsResponse.json();
                setVendorsCount(vendorsData.length);
            } catch (error) {
                console.error("Error fetching vendors:", error);
            }
        };

        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const usersResponse = await fetch("http://172.236.2.18:5000/users/all", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const usersData = await usersResponse.json();
                setUsersCount(usersData.length);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchData();
        fetchItems();
        fetchVendors();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (expensesChartInstance.current) {
            expensesChartInstance.current.destroy();
        }
        if (ordersChartInstance.current) {
            ordersChartInstance.current.destroy();
        }

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

        if (ordersChartRef.current) {
            ordersChartInstance.current = new Chart(ordersChartRef.current, {
                type: "pie",
                data: {
                    labels: ["Received", "Cancelled", "Pending", "Approved"],
                    datasets: [{
                        data: [
                            orders.filter(order => order.status.toLowerCase() === "received").length,
                            orders.filter(order => order.status.toLowerCase() === "cancelled").length,
                            orders.filter(order => order.status.toLowerCase() === "pending").length,
                            orders.filter(order => order.status.toLowerCase() === "approved").length
                        ],
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
    }, [orders]);

    return (
        <div className={dash["dashboard-container"]}>
            <SideBar />
            <main className={dash["main-content"]}>
                <section className={dash["cards"]}>
                    <div className={dash["card"]}>
                        <span className="material-icons">person</span> {usersCount} Users
                    </div>
                    <div className={dash["card"]}>
                        <span className="material-icons">people</span> {vendorsCount} Vendors
                    </div>
                    <div className={dash["card"]}>
                        <span className="material-icons">content_paste</span> {itemsCount} Items
                    </div>
                    <div className={dash["card"]}>
                        <span className="material-icons">description</span> {orders.length} Orders
                    </div>
                </section>

                <section className={dash["charts"]}>
                    <div className={dash["chart"]}>
                        <h2>Expense Chart</h2>
                        <div className={dash["chart-container"]}>
                            <canvas id="expensesChart" ref={expensesChartRef}></canvas>
                        </div>
                    </div>
                    <div className={dash["orders"]}>
                        <h2>Orders Summary</h2>
                        <div className={dash["pie-chart-container"]}>
                            <canvas id="ordersPieChart" ref={ordersChartRef}></canvas>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;