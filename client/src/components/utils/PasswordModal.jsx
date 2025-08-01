import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCopy,
  faExternalLinkAlt,
  faTrashAlt,
  faTimes,
  faSave,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

import "../../assets/scss/pages/passwordmodal.scss";

const PasswordModal = ({ data, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    item_name: data.item_name,
    username: data.username,
    password: data.password,
    website_url: data.website_url,
    staging_url: data.staging_url,
    notes: data.notes,
    client: data.client,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  const handleSave = async () => {
    const confirmSave = window.confirm(
      "Are you sure you want to save changes?"
    );
    if (!confirmSave) return;

    try {
      const res = await fetch(
        `http://localhost:3001/updatepassword/${data.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Failed to update password data");

      alert("Changes saved successfully.");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating password data:", err);
      alert("Failed to save changes.");
    }
  };

  return (
    <div className="password-modal-overlay">
      <div className="password-modal">
        <div className="d-flex">
          <h2>{isEditing ? "Edit Logins" : "View Logins"}</h2>
          <button className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="modal-content">
          <section>
            <h4>Item details</h4>
            {isEditing ? (
              <input
                value={formData.item_name}
                onChange={(e) => handleChange("item_name", e.target.value)}
              />
            ) : (
              <div className="field">{formData.item_name}</div>
            )}
          </section>

          <section>
            <h4>Client</h4>
            {isEditing ? (
              <input
                value={formData.client}
                onChange={(e) => handleChange("client", e.target.value)}
              />
            ) : (
              <div className="field">{formData.client}</div>
            )}
          </section>

          <section>
            <h4>Login credentials</h4>
            <div className="field-row">
              <label>Username:</label>
              <div>
                {isEditing ? (
                  <input
                    value={formData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                  />
                ) : (
                  <>
                    {formData.username}
                    <FontAwesomeIcon
                      icon={faCopy}
                      onClick={() => copyToClipboard(formData.username)}
                    />
                  </>
                )}
              </div>
            </div>

            <div className="field-row">
              <label>Password:</label>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                ) : (
                  <>
                    {showPassword ? formData.password : "•".repeat(10)}
                    <div>
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                      <FontAwesomeIcon
                        icon={faCopy}
                        onClick={() => copyToClipboard(formData.password)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          <section>
            <h4>Auto-fill options</h4>
            <div className="field-row">
              <label>Website:</label>
              <div>
                {isEditing ? (
                  <input
                    value={formData.website_url}
                    onChange={(e) =>
                      handleChange("website_url", e.target.value)
                    }
                  />
                ) : (
                  <>
                    <a
                      href={formData.website_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {formData.website_url}
                    </a>
                    <div>
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                      <FontAwesomeIcon
                        icon={faCopy}
                        onClick={() => copyToClipboard(formData.website_url)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="field-row">
              <label>Staging Website:</label>
              <div>
                {isEditing ? (
                  <input
                    value={formData.staging_url}
                    onChange={(e) =>
                      handleChange("staging_url", e.target.value)
                    }
                  />
                ) : (
                  <>
                    <a
                      href={formData.staging_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {formData.staging_url}
                    </a>
                    <div>
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                      <FontAwesomeIcon
                        icon={faCopy}
                        onClick={() => copyToClipboard(formData.staging_url)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          <section>
            <h4>Additional notes</h4>
            {isEditing ? (
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            ) : (
              <div className="field">{formData.notes}</div>
            )}
          </section>

          <section className="history">
            <h4>Item history</h4>
            <div>
              Last edited:{" "}
              {new Date(data.updated_at).toLocaleString("en-US", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </div>
            <div>
              Created:{" "}
              {new Date(data.created_at).toLocaleString("en-US", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </div>
          </section>

          <div className="modal-actions">
            {isEditing ? (
              <button className="save-btn" onClick={handleSave}>
                <FontAwesomeIcon icon={faSave} /> Save
              </button>
            ) : (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <FontAwesomeIcon icon={faEdit} /> Edit
              </button>
            )}

            <button className="delete-btn">
              <FontAwesomeIcon icon={faTrashAlt} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
