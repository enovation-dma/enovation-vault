import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCog,
  faBell,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

import "../../assets/scss/pages/navbar.scss";

const Navbar = ({ onToggleSidebar }) => {
  return (
    <nav className="navbar">
      <div className="navbar__left">
        <button
          className="navbar__hamburger"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        <input
          type="search"
          className="navbar__search"
          placeholder="Search..."
          aria-label="Search"
        />
      </div>

      <div className="navbar__right">
        <FontAwesomeIcon
          icon={faCog}
          className="navbar__icon"
          title="Settings"
        />
        <FontAwesomeIcon
          icon={faUserCircle}
          className="navbar__icon"
          title="Profile"
        />
        <FontAwesomeIcon
          icon={faBell}
          className="navbar__icon"
          title="Notifications"
        />
      </div>
    </nav>
  );
};

export default Navbar;
