import { useEffect, useRef, useState } from "react";
import Axios from "axios";

import Sidebar from "../ui-shield/Sidebar";
import Navbar from "../ui-shield/Navbar";
import Breadcrumb from "../utils/Breadcrumb";

import "../../assets/scss/pages/dashboard.scss";
import "../../assets/scss/pages/adduser.scss";

const UpdateProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    location: "",
    userRole: "",
    email: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // Fetch fresh user profile from backend by email
      Axios.get("http://localhost:3001/userprofile", {
        params: { email: parsedUser.email },
      })
        .then((res) => {
          const userData = res.data;
          setUser(userData);
          setFormData({
            name: userData.name || "",
            surname: userData.surname || "",
            phone: userData.phone || "",
            location: userData.location || "",
            userRole: userData.role || "",
            email: userData.email || "",
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch user profile:", err);
          // fallback to localStorage data
          setUser(parsedUser);
          setFormData({
            name: parsedUser.name || "",
            surname: parsedUser.surname || "",
            phone: parsedUser.phone || "",
            location: parsedUser.location || "",
            userRole: parsedUser.role || "",
            email: parsedUser.email || "",
          });
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

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

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setProfilePhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, val]) => {
      data.append(key, val);
    });

    if (profilePhoto) {
      data.append("profilePhoto", profilePhoto);
    }

    try {
      const response = await Axios.post(
        "http://localhost:3001/updateprofile",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Profile updated successfully!");

      const updatedUser = response.data.updatedUser || {
        ...user,
        ...formData,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setProfilePhoto(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  const breadcrumbItems = [
    { label: "enovault" },
    { label: "Profile" },
    { label: "Update Profile" },
  ];

  if (loading) return <p>Loading user data...</p>;
  if (!user) return <p>No user data found. Please login.</p>;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-container__content">
        <Navbar />
        <div className="dashboard-container__content__main">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="page__title">Update Profile</h1>

          <form
            className="adduser__form"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <input type="hidden" name="email" value={formData.email} />

            <div className="d-flex">
              <div className="left__column">
                <div className="form__group profile-photo-upload">
                  <div className="profile-photo-preview">
                    <div
                      className="profile-photo-wrapper"
                      onClick={() => fileInputRef.current.click()}
                      style={{ cursor: "pointer" }}
                    >
                      {profilePhoto ? (
                        <img
                          src={URL.createObjectURL(profilePhoto)}
                          alt="Preview"
                          className="profile-photo-preview__image"
                        />
                      ) : user?.profile_photo_url ? (
                        <img
                          src={`http://localhost:3001${user.profile_photo_url}`}
                          alt="Profile"
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
                        onClick={handleRemovePhoto}
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
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              <div className="right__column">
                <div className="d-flex">
                  <div className="form__group">
                    <label htmlFor="name">First Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
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
                      value={formData.surname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex">
                  <div className="form__group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
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
                      <option value="">Select location</option>
                      <option value="Cape Town">Cape Town</option>
                      <option value="Johannesburg">Johannesburg</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="form__submit">
                  Update Profile
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
