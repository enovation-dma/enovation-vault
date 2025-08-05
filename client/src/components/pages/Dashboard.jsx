import { useEffect, useState } from "react";
import Sidebar from "../ui-shield/Sidebar";
import Navbar from "../ui-shield/Navbar";
import Breadcrumb from "../utils/Breadcrumb";
import axios from "axios";

import "../../assets/scss/pages/dashboard.scss";

const Dashboard = () => {
  const breadcrumbItems = [{ label: "enovault" }, { label: "Dashboard" }];

  const [loggedInUsers, setLoggedInUsers] = useState(0);
  const [passwordCount, setPasswordCount] = useState(0);
  const [teamMembers, setTeamMembers] = useState(0);
  const [logs, setLogs] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedEmail = localStorage.getItem("email");

    console.log("🔍 Loaded role:", storedRole); // <-- ADD THIS
    console.log("🔍 Loaded email:", storedEmail);

    setUserRole(storedRole);
    setUserEmail(storedEmail);

    // Fetch dashboard data
    axios
      .get("https://enovation-vault-1.onrender.com/users/logged-in")
      .then((res) => setLoggedInUsers(res.data.count));
    axios
      .get("https://enovation-vault-1.onrender.com/passwords/count")
      .then((res) => setPasswordCount(res.data.count));
    axios
      .get("https://enovation-vault-1.onrender.com/users/count")
      .then((res) => setTeamMembers(res.data.count));
    axios
      .get("https://enovation-vault-1.onrender.com/getlogs")
      .then((res) => setLogs(res.data));
  }, []);

  const isAdmin = userRole === "Admin" || userRole === "Super Admin";

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-container__content">
        <Navbar />
        <div className="dashboard-container__content__main">
          <Breadcrumb items={breadcrumbItems} />
          <h1>Welcome back Joshua!</h1>
          <p>Security at a glance</p>

          {/* 🧩 Summary Cards */}
          <div className="dashboard__cards">
            <div className="dashboard__card">
              <h3>Current Users Logged In</h3>
              <p>{loggedInUsers}</p>
            </div>
            <div className="dashboard__card">
              <h3>Current Passwords on the Vault</h3>
              <p>{passwordCount}</p>
            </div>
            <div className="dashboard__card">
              <h3>Current Number of Team Members</h3>
              <p>{teamMembers}</p>
            </div>
          </div>

          {/* 👁️ Logs (Admins only) or Recent Activity */}
          {isAdmin ? (
            <div className="dashboard__logs">
              <h2>All Logs</h2>
              <div className="dashboard__logs__table-wrapper">
                <table className="dashboard__logs__table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Action</th>
                      <th>Details</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, index) => (
                      <tr key={index}>
                        <td>{log.email}</td>
                        <td>{log.action}</td>
                        <td>{log.details}</td>
                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="dashboard__recent-activity">
              <h2>Recent Activity</h2>
              <div className="dashboard__recent-activity__cards">
                {logs
                  .filter((log) => log.user_email === userEmail)
                  .slice(0, 5)
                  .map((log, index) => (
                    <div
                      key={index}
                      className="dashboard__recent-activity__card"
                      onClick={() => {
                        if (log.tab) {
                          window.location.href = log.tab;
                        }
                      }}
                    >
                      <h4>{log.action}</h4>
                      <p>{log.details}</p>
                      <small>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </small>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
