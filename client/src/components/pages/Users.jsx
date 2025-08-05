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
} from "@fortawesome/free-solid-svg-icons";

import "../../assets/scss/pages/dashboard.scss";
import "../../assets/scss/pages/users.scss";

const Users = () => {
  const breadcrumbItems = [{ label: "enovault" }, { label: "Team" }];

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

          {/* Users List Section */}
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
