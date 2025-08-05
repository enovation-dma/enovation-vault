import { useState, useEffect } from "react";
import Axios from "axios";
import UpdateProfile from "./UpdateProfile";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Axios.get("https://enovation-vault-1.onrender.com/currentuser")
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load user data");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>{error}</p>;

  return <UpdateProfile user={user} />;
};

export default Profile;
