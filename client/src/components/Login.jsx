import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faLinkedinIn,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

// Stylesheet
import "../assets/scss/pages/login.scss";

function Login() {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    Axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`, {
      email,
      password,
    })
      .then((response) => {
        if (response.data.success) {
          const token = response.data.token;
          const user = response.data.user;

          localStorage.setItem("token", token);

          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            // Also save role and email separately for easy access:
            localStorage.setItem("role", user.role);
            localStorage.setItem("email", user.email);
            console.log("User stored:", user);
          } else {
            console.warn(
              "Login successful but user data is missing in response."
            );
          }

          navigate("/"); // Assuming your dashboard route is /dashboard
        } else {
          alert("Invalid credentials");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert("An error occurred. Please try again.");
      });
  };

  return (
    <div
      className={`container ${isSignUpActive ? "right-panel-active" : ""}`}
      id="container"
    >
      {/* Sign Up */}
      <div className="form-container sign-up-container">
        <form>
          <h1>Create Account</h1>
          <div className="social-container">
            <a
              href="https://www.facebook.com/enovationagency/"
              target="_blank"
              className="social"
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a
              href="https://www.instagram.com/enovationagency/"
              target="_blank"
              className="social"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://www.linkedin.com/company/enovation---digital-marketing-agency/"
              target="_blank"
              className="social"
            >
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
          </div>
          <span>Use your email for registration</span>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="button">Sign Up</button>
        </form>
      </div>

      {/* Sign In */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleLogin}>
          <h1>Sign in</h1>
          <div className="social-container">
            <a
              href="https://www.facebook.com/enovationagency/"
              target="_blank"
              className="social"
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a
              href="https://www.instagram.com/enovationagency/"
              target="_blank"
              className="social"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://www.linkedin.com/company/enovation---digital-marketing-agency/"
              target="_blank"
              className="social"
            >
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
          </div>
          <span>Use your account</span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <a className="forgot_password" href="/forgot-password">
            Forgot your password?
          </a>
          <button type="submit">Sign In</button>
        </form>
      </div>

      {/* Overlay */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>
              To keep connected with us please login with your personal info
            </p>
            <button className="ghost" onClick={() => setIsSignUpActive(false)}>
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start your journey with us</p>
            <button className="ghost" onClick={() => setIsSignUpActive(true)}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
