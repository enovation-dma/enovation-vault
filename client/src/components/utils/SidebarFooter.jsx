import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import LogoutModal from "./LogoutModal";

const SidebarFooter = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error parsing user from localStorage", error);
      localStorage.removeItem("user");
    }
  }, []);

  const handleLogoutClick = () => setShowModal(true);

  const handleConfirmLogout = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const userEmail = userData?.email;

    if (userEmail) {
      try {
        await fetch("http://localhost:3001/loglogout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userEmail }),
        });
      } catch (err) {
        console.error("Failed to log logout:", err);
      }
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const handleCancelLogout = () => setShowModal(false);

  return (
    <div className="sidebar-footer">
      <div className="sidebar-footer__container">
        <Link to="/users/update" className="sidebar-footer__profile">
          <div className="sidebar-footer__avatar">
            <img
              src={
                user?.profile_photo_url
                  ? `http://localhost:3001${user.profile_photo_url}`
                  : "http://localhost:3001/uploads/profile_photos/default-avatar.png"
              }
              alt={`Profile of ${user?.name || "User"}`}
              className="user-card__avatar"
            />
          </div>
        </Link>

        <Link to="/users/update" className="sidebar-footer__profile">
          <div className="sidebar-footer__user">
            <div className="sidebar-footer__name">
              {user?.name || "John Doe"}
            </div>
            <div className="sidebar-footer__role">{user?.role || "User"}</div>
          </div>
        </Link>

        <div className="sidebar-footer__logout" onClick={handleLogoutClick}>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </div>
      </div>

      {showModal && (
        <LogoutModal
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      )}
    </div>
  );
};

export default SidebarFooter;
