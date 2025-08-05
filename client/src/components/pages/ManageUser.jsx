import { useEffect, useState } from "react";
import Sidebar from "../ui-shield/Sidebar";
import Navbar from "../ui-shield/Navbar";
import Breadcrumb from "../utils/Breadcrumb";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faLocationDot,
  faPaperPlane,
  faComments,
  faEllipsisV,
  faUserShield,
  faUserTimes,
} from "@fortawesome/free-solid-svg-icons";

import "../../assets/scss/pages/dashboard.scss";
import "../../assets/scss/pages/users.scss";

const Users = () => {
  const breadcrumbItems = [{ label: "enovault" }, { label: "Team" }];

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const logAction = (email, action, details = "") => {
    fetch("https://enovation-vault-1.onrender.com/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, action, details }),
    }).catch((err) => console.error("Log error:", err));
  };

  useEffect(() => {
    fetch("https://enovation-vault-1.onrender.com/getusers")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch users");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserEmail(parsedUser.email);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
    }
  }, []);

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleChangeRole = (id) => {
    alert(`Change role for user ID: ${id}`);
    setDropdownOpen(null);
  };

  const handleRemoveMember = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `https://enovation-vault-1.onrender.com/deleteuser/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete user");

      // Refresh UI after deletion
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      alert("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    } finally {
      setDropdownOpen(null);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-container__content">
        <Navbar />
        <div className="dashboard-container__content__main">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="page__title">Team Members</h1>
          <p className="page__description">
            View, manage, and contact your colleagues securely in EnoVault.
          </p>

          <section className="users-list">
            {loading && (
              <div className="centre">
                <div className="loader">
                  <svg viewBox="0 0 80 80">
                    <circle r="32" cy="40" cx="40" id="test"></circle>
                  </svg>
                </div>
                <div className="loader triangle">
                  <svg viewBox="0 0 86 80">
                    <polygon points="43 8 79 72 7 72"></polygon>
                  </svg>
                </div>
                <div className="loader">
                  <svg viewBox="0 0 80 80">
                    <rect height="64" width="64" y="8" x="8"></rect>
                  </svg>
                </div>
              </div>
            )}

            {error && <p className="error">Error: {error}</p>}

            {!loading && !error && (
              <div className="user-cards">
                {users.map(
                  ({
                    id,
                    email,
                    role,
                    profile_photo_url,
                    phone_number,
                    location,
                    name: fullName,
                    surname,
                  }) => (
                    <div key={id} className="user-card">
                      {/* 3-dot dropdown menu */}
                      <div className="d-flex">
                        <div className="user-card__header">
                          <img
                            src={
                              profile_photo_url
                                ? `https://enovation-vault-1.onrender.com${profile_photo_url}`
                                : "https://enovation-vault-1.onrender.com/uploads/profile_photos/default-avatar.png"
                            }
                            alt={`Profile of ${email}`}
                            className="user-card__avatar"
                          />
                          <div className="user-card__info">
                            <div className="user-card__name">
                              {fullName} {surname}
                            </div>
                            <div
                              className={`user-card__role user-card__role--${role.toLowerCase()}`}
                            >
                              {role}
                            </div>
                          </div>
                        </div>
                        <div className="user-card__menu">
                          <div
                            className="dropdown-toggle"
                            role="button"
                            tabIndex={0}
                            onClick={() => toggleDropdown(id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ")
                                toggleDropdown(id);
                            }}
                          >
                            <FontAwesomeIcon icon={faEllipsisV} />
                          </div>

                          {dropdownOpen === id && (
                            <div className="dropdown-content">
                              <button onClick={() => handleChangeRole(id)}>
                                <FontAwesomeIcon icon={faUserShield} /> Change
                                Role
                              </button>
                              <button
                                className="remove"
                                onClick={() => {
                                  handleRemoveMember(id);
                                  logAction(
                                    userEmail,
                                    "USER_DELETED",
                                    `${email} deleted`
                                  );
                                }}
                              >
                                <FontAwesomeIcon icon={faUserTimes} /> Remove
                                Member
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="user-card__details">
                        <div>
                          <FontAwesomeIcon icon={faLocationDot} /> {location}
                        </div>
                        <div>
                          <FontAwesomeIcon icon={faEnvelope} /> {email}
                        </div>
                        <div>
                          <FontAwesomeIcon icon={faPhone} />{" "}
                          {phone_number || "+27 62 568 9654"}
                        </div>
                      </div>
                      <div className="user-card__actions">
                        <a
                          href={`https://teams.microsoft.com/l/chat/0/0?users=${email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="user-card__button"
                        >
                          <FontAwesomeIcon icon={faComments} /> Teams
                        </a>
                        <a
                          href={`mailto:${email}`}
                          className="user-card__button"
                        >
                          <FontAwesomeIcon icon={faPaperPlane} /> Email
                        </a>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Users;
