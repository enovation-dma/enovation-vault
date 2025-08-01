import { useState } from "react";
import Axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post(`${process.env.REACT_APP_API_BASE_URL}/forgot-password`, {
      email,
    })
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        setMessage("Something went wrong.");
        console.error(error);
      });
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgotPassword;
