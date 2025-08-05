import { useEffect, useState } from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faExternalLinkAlt,
  faEllipsisV,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

import Sidebar from "../ui-shield/Sidebar";
import Navbar from "../ui-shield/Navbar";
import Breadcrumb from "../utils/Breadcrumb";
import PasswordModal from "../utils/PasswordModal";

import "../../assets/scss/pages/dashboard.scss";
import "../../assets/scss/pages/passwords.scss";

const Passwords = () => {
  const [passwords, setPasswords] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    Axios.get("https://enovation-vault-1.onrender.com/getpasswords")
      .then((res) => setPasswords(res.data))
      .catch((err) => console.error("Error loading passwords:", err));
  }, []);

  useEffect(() => {
    const newSelected = {};
    passwords.forEach((item) => {
      newSelected[item.id] = selectAll;
    });
    setSelectedRows(newSelected);
  }, [selectAll, passwords]);

  const toggleRow = (id) => {
    setSelectedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserEmail(parsedUser.email);
        fetchPasswords(parsedUser.role); // <- Pass role
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
    }
  }, []);

  const fetchPasswords = (role) => {
    Axios.get(`https://enovation-vault-1.onrender.com/getpasswords`, {
      params: { role },
    })
      .then((res) => setPasswords(res.data))
      .catch((err) => console.error("Error loading passwords:", err));
  };

  const logUserAction = async (action, details) => {
    if (!userEmail) return;

    console.log("Sending log:", {
      email: userEmail,
      action,
      details,
    });

    try {
      await Axios.post("https://enovation-vault-1.onrender.com/log", {
        email: userEmail,
        action,
        details,
      });
    } catch (err) {
      console.error("Logging user action failed:", err);
    }
  };

  const copyToClipboard = async (text, item, type) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");

      const detail =
        type === "username"
          ? `Copied username for "${item.item_name}"`
          : `Copied password for "${item.item_name}"`;

      const action =
        type === "username" ? "COPIED_USERNAME" : "COPIED_PASSWORD";

      await logUserAction(action, detail);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const breadcrumbItems = [{ label: "enovault" }, { label: "Credentials" }];

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => (prev === id ? null : id));
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-container__content">
        <Navbar />
        <div className="dashboard-container__content__main">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="page__title">Passwords</h1>
          <p className="page__description">
            View, manage, and take action on saved credentials securely in
            EnoVault.
          </p>

          <div className="passwords-table">
            <table>
              <thead>
                <tr>
                  <th className="checkbox">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => setSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="name">Name</th>
                  <th className="owner">Owner</th>
                  <th className="blank"></th>
                </tr>
              </thead>
              <tbody>
                {passwords.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows[item.id] || false}
                        onChange={() => toggleRow(item.id)}
                      />
                    </td>
                    <td>
                      <div className="item-name">
                        <span
                          className="name"
                          onClick={() => setSelectedPassword(item)}
                        >
                          {item.item_name}
                        </span>
                        <div className="description">{item.client}</div>
                      </div>
                    </td>
                    <td>
                      <span className="owner-pill">Enovation DMA</span>
                    </td>
                    <td className="action-cell">
                      <div className="dropdown">
                        <button
                          className="dropdown-toggle"
                          onClick={() => toggleDropdown(item.id)}
                        >
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </button>

                        {dropdownOpen === item.id && (
                          <div className="dropdown-content">
                            <button
                              onClick={() =>
                                copyToClipboard(item.username, item, "username")
                              }
                            >
                              <FontAwesomeIcon icon={faCopy} /> Copy username
                            </button>
                            <button
                              onClick={() =>
                                copyToClipboard(item.password, item, "password")
                              }
                            >
                              <FontAwesomeIcon icon={faCopy} /> Copy password
                            </button>
                            <a
                              href={item.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() =>
                                logUserAction(
                                  "LAUNCHED_SITE",
                                  `Launched "${item.item_name}" site`
                                )
                              }
                            >
                              <FontAwesomeIcon icon={faExternalLinkAlt} />{" "}
                              Launch
                            </a>
                            <a
                              href={item.staging_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() =>
                                logUserAction(
                                  "LAUNCHED_STAGING",
                                  `Launched "${item.item_name}" staging`
                                )
                              }
                            >
                              <FontAwesomeIcon icon={faExternalLinkAlt} />{" "}
                              Launch Staging
                            </a>
                            <button
                              className="delete"
                              onClick={async () => {
                                try {
                                  await Axios.delete(
                                    `https://enovation-vault-1.onrender.com/deletepassword/${item.id}`
                                  );
                                  await logUserAction(
                                    "DELETED_PASSWORD",
                                    `Deleted "${item.item_name}"`
                                  );

                                  setPasswords((prev) =>
                                    prev.filter((p) => p.id !== item.id)
                                  );
                                } catch (err) {
                                  console.error(
                                    "Failed to delete password:",
                                    err
                                  );
                                }
                              }}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedPassword && (
        <PasswordModal
          data={selectedPassword}
          onClose={() => setSelectedPassword(null)}
        />
      )}
    </div>
  );
};

export default Passwords;
