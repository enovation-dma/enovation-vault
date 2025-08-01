import { Link } from "react-router-dom";

import "../../assets/scss/pages/breadcrumb.scss";

const Breadcrumb = ({ items }) => {
  return (
    <nav className="breadcrumb">
      <ol className="breadcrumb__list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb__item">
            {index !== 0 && <span className="breadcrumb__separator">/</span>}
            {item.to ? (
              <Link to={item.to} className="breadcrumb__link">
                {item.label}
              </Link>
            ) : (
              <span className="breadcrumb__current">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
