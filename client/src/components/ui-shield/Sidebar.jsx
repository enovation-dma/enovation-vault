import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faPlusCircle,
  faLock,
  faHistory,
  faUsers,
  // faCog,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import SidebarFooter from "../utils/SidebarFooter";

import "../../assets/scss/pages/sidebar.scss";

const Sidebar = ({ user }) => {
  const [isPrivileged, setIsPrivileged] = useState(false);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const role = storedUser?.role;
      if (role === "Admin" || role === "Super Admin") {
        setIsPrivileged(true);
      }
    } catch (e) {
      console.error("Invalid user in localStorage", e);
    }
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="logo">enovault</div>
      </div>
      <nav className="sidebar__nav">
        <NavLink to="/" className="sidebar__link">
          <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
        </NavLink>
        <NavLink to="/credentials" className="sidebar__link">
          <FontAwesomeIcon icon={faLock} /> My Vault
        </NavLink>
        {isPrivileged && (
          <>
            <NavLink
              to="/credentials/new"
              className="sidebar__link sidebar__link--child"
            >
              <FontAwesomeIcon icon={faPlusCircle} /> Add Credential
            </NavLink>
          </>
        )}
        <NavLink to="/users" className="sidebar__link">
          <FontAwesomeIcon icon={faUsers} /> Team
        </NavLink>
        {isPrivileged && (
          <>
            <NavLink
              to="/users/add"
              className="sidebar__link sidebar__link--child"
            >
              <FontAwesomeIcon icon={faUser} /> Add Team Member
            </NavLink>
          </>
        )}
        {isPrivileged && (
          <>
            <NavLink
              to="/users/manage"
              className="sidebar__link sidebar__link--child"
            >
              <FontAwesomeIcon icon={faUser} /> Manage Team
            </NavLink>
          </>
        )}
        {isPrivileged && (
          <>
            <NavLink to="/logs" className="sidebar__link">
              <FontAwesomeIcon icon={faHistory} /> Activity Logs
            </NavLink>
          </>
        )}
        {/* <NavLink to="/settings" className="sidebar__link">
          <FontAwesomeIcon icon={faCog} /> Settings
        </NavLink> */}
      </nav>
      <SidebarFooter />
    </aside>
  );
};

export default Sidebar;
