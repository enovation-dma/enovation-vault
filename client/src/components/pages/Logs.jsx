import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../ui-shield/Sidebar";
import Navbar from "../ui-shield/Navbar";
import Breadcrumb from "../utils/Breadcrumb";

import "../../assets/scss/pages/dashboard.scss";
import "../../assets/scss/pages/log.scss";

// const logUserAction = async (email, action, details) => {
//   try {
//     await axios.post("http://localhost:3001/log", { email, action, details });
//   } catch (err) {
//     console.error("Logging user action failed:", err);
//   }
// };

const TABS = [
  {
    key: "sessions",
    label: "User Sessions",
    actions: ["LOGIN", "LOGOUT"],
  },
  {
    key: "updates",
    label: "Credential Updates",
    actions: ["DELETED_PASSWORD", "EDITED_PASSWORD"],
  },
  {
    key: "access",
    label: "Credential Access",
    actions: ["COPIED_PASSWORD", "COPIED_USERNAME"],
  },
  {
    key: "usage",
    label: "Resource Usage",
    actions: ["LAUNCHED_SITE", "LAUNCHED_STAGING"],
  },
  {
    key: "team",
    label: "Team Info",
    actions: ["USER_DELETED"],
  },
];

const Logs = () => {
  const breadcrumbItems = [{ label: "enovault" }, { label: "Activity Logs" }];
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(TABS[0].key);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get("http://localhost:3001/getlogs");
        const sorted = response.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setLogs(sorted);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const renderTable = (title, actions) => {
    const filtered = logs.filter((log) => actions.includes(log.action));
    return (
      <div className="logs">
        <h2 className="logs__title">{title}</h2>
        <div className="logs__table-wrapper">
          <table className="logs__table">
            <thead>
              <tr className="logs__header-row">
                <th className="logs__header-cell">User</th>
                <th className="logs__header-cell">Action</th>
                <th className="logs__header-cell">Details</th>
                <th className="logs__header-cell">Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id} className="logs__row">
                  <td className="logs__cell">{log.user_email}</td>
                  <td className="logs__cell">{log.action}</td>
                  <td className="logs__cell">{log.details || "—"}</td>
                  <td className="logs__cell">{formatDate(log.created_at)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="logs__empty" colSpan="4">
                    No logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) return <div className="p-4">Loading logs...</div>;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-container__content">
        <Navbar />
        <div className="dashboard-container__content__main">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="page__title">Activity Logs</h1>
          <p className="page__description">
            View, manage, and take action on vital logs for EnoVault.
          </p>

          {/* Tabs navigation */}
          <div className="tabs">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                className={`tabs__button ${activeTab === key ? "active" : ""}`}
                onClick={() => setActiveTab(key)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Active tab content */}
          <div className="tab-content">
            {TABS.map(
              ({ key, label, actions }) =>
                activeTab === key && renderTable(label, actions)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logs;
