import { useState, useEffect } from "react";
import Axios from "axios";

import Sidebar from "../ui-shield/Sidebar";
import Navbar from "../ui-shield/Navbar";
import Breadcrumb from "../utils/Breadcrumb";

import "../../assets/scss/pages/dashboard.scss";
import "../../assets/scss/pages/addpassword.scss";

const AddCredentials = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    client: "",
    username: "",
    password: "",
    websiteUrl: "",
    stagingUrl: "",
    notes: "",
    role: "", // New field
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const roles = [
    "Super Admin",
    "Admin",
    "Developer",
    "Designer",
    "Copywriter",
    "Social Media Specialist",
    "Digital Marketer",
    "Account Manager",
  ];

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      updatedAt: new Date(),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      updatedAt: new Date(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Axios.post(
        "https://enovation-vault-1.onrender.com/addpassword",
        formData
      );
      alert("Password added successfully!");
    } catch (err) {
      console.error("Failed to add password", err);
      alert("Failed to add password");
    }
  };

  const breadcrumbItems = [
    { label: "enovault" },
    { label: "Credentials" },
    { label: "Add Credential" },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-container__content">
        <Navbar />
        <div className="dashboard-container__content__main">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="page__title">Add a new Password</h1>
          <p className="page__description">
            Store a new set of login details securely in EnoVault.
          </p>

          <form className="addpassword__form" onSubmit={handleSubmit}>
            <div className="form__group">
              <label htmlFor="itemName">Item Name</label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                placeholder="e.g., Production Server"
                value={formData.itemName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form__group">
              <label htmlFor="client">Client</label>
              <input
                type="text"
                id="client"
                name="client"
                placeholder="e.g., Enovation"
                value={formData.client}
                onChange={handleChange}
              />
            </div>

            <div className="form__group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="form__group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="e.g., johndoe"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="form__group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form__group">
              <label htmlFor="websiteUrl">Website URL</label>
              <input
                type="url"
                id="websiteUrl"
                name="websiteUrl"
                placeholder="https://example.com"
                value={formData.websiteUrl}
                onChange={handleChange}
              />
            </div>

            <div className="form__group">
              <label htmlFor="stagingUrl">Staging URL</label>
              <input
                type="url"
                id="stagingUrl"
                name="stagingUrl"
                placeholder="https://staging.example.com"
                value={formData.stagingUrl}
                onChange={handleChange}
              />
            </div>

            <div className="form__group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Any additional details..."
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            <div className="form__meta">
              <p>
                <strong>Created:</strong> {formData.createdAt.toLocaleString()}
              </p>
              <p>
                <strong>Last Updated:</strong>{" "}
                {formData.updatedAt.toLocaleString()}
              </p>
            </div>

            <button type="submit" className="form__submit">
              Add Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCredentials;
