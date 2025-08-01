import Sidebar from "../ui-shield/Sidebar";
import Navbar from "../ui-shield/Navbar";
import Breadcrumb from "../utils/Breadcrumb";

import "../../assets/scss/pages/dashboard.scss";

const Settings = () => {
  const breadcrumbItems = [{ label: "enovault" }, { label: "Settings" }];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-container__content">
        <Navbar />
        <div className="dashboard-container__content__main">
          <Breadcrumb items={breadcrumbItems} />
          <h1>Settings</h1>
          <p>A bried summary of what that page is about</p>
          <p>There will be cards/ Content here</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
