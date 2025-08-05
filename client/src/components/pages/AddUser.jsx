import { useState, useRef } from "react";
import Axios from "axios";

import Sidebar from "../ui-shield/Sidebar";
import Navbar from "../ui-shield/Navbar";
import Breadcrumb from "../utils/Breadcrumb";

import "../../assets/scss/pages/dashboard.scss";
import "../../assets/scss/pages/adduser.scss";

const AddUser = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    email: "",
    password: "",
    userRole: "User",
    location: "Cape Town",
    phoneNumber: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("surname", formData.surname);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("userRole", formData.userRole);
      data.append("location", formData.location);
      data.append("phoneNumber", formData.phoneNumber);

      if (profilePhoto) {
        data.append("profilePhoto", profilePhoto);
      }

      await Axios.post("https://enovation-vault-1.onrender.com/adduser", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("User added successfully!");
      setFormData({
        firstName: "",
        surname: "",
        email: "",
        password: "",
        userRole: "User",
      });
      setProfilePhoto(null);
    } catch (err) {
      console.error("Failed to add user", err);
      alert("Failed to add user. Please try again.");
    }
  };

  const breadcrumbItems = [
    { label: "enovault" },
    { label: "Team" },
    { label: "Add Team Member" },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-container__content">
        <Navbar />
        <div className="dashboard-container__content__main">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="page__title">Add a New User</h1>
          <p className="page__description">Add a new user to your system.</p>

          <form
            className="adduser__form"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="d-flex">
              <div className="left__column">
                <div className="form__group profile-photo-upload">
                  <div className="profile-photo-preview">
                    <div
                      className="profile-photo-wrapper"
                      onClick={() => fileInputRef.current.click()}
                    >
                      {profilePhoto ? (
                        <img
                          src={URL.createObjectURL(profilePhoto)}
                          alt="Preview"
                          className="profile-photo-preview__image"
                        />
                      ) : (
                        <div className="profile-photo-preview__placeholder">
                          Click to upload
                        </div>
                      )}
                    </div>

                    {profilePhoto && (
                      <button
                        type="button"
                        className="profile-photo-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProfilePhoto(null);
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <input
                    type="file"
                    id="profilePhoto"
                    name="profilePhoto"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="profile-photo-input"
                    ref={fileInputRef}
                  />
                </div>
                <label htmlFor="profilePhoto">Profile Photo</label>
              </div>
              <div className="right__column">
                <div className="d-flex">
                  <div className="form__group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form__group">
                    <label htmlFor="surname">Surname</label>
                    <input
                      type="text"
                      id="surname"
                      name="surname"
                      placeholder="Enter surname"
                      value={formData.surname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex">
                  <div className="form__group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form__group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex">
                  <div className="form__group">
                    <label htmlFor="userRole">User Role</label>
                    <select
                      id="userRole"
                      name="userRole"
                      value={formData.userRole}
                      onChange={handleChange}
                      required
                    >
                      <option value="Super Admin">Super Administrator</option>
                      <option value="Admin">Administrator</option>
                      <option value="Developer">Software Developer</option>
                      <option value="Designer">UI/UX Designer</option>
                      <option value="Copywriter">Copywriter</option>
                      <option value="Social Media Specialist">
                        Social Media Specialist
                      </option>
                      <option value="Digital Marketer">
                        Digital Marketing Specialist
                      </option>
                      <option value="User">Standard User</option>
                    </select>
                  </div>

                  <div className="form__group">
                    <label htmlFor="location">Location</label>
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    >
                      <option value="Cape Town">Cape Town</option>
                      <option value="Johannesburg">Johannesburg</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="form__group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Enter phone number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form__group">
                    <label>Teams Message Link</label>
                    <input
                      type="text"
                      value={`https://teams.microsoft.com/l/chat/0/0?users=${formData.email}`}
                      readOnly
                    />
                  </div>
                </div>

                <button type="submit" className="form__submit">
                  Add User
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
