import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Auth.css";

const API_URL = import.meta.env.VITE_API_URL;

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        formData
      );

      setMessage(response.data.message);

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Branding */}
        <div className="auth-brand">
          <div className="brand-icon">☻</div>

          <h1>MoodCircle</h1>

          <p>
            Share your mood. Connect with your circle.
          </p>
        </div>

        {/* Registration Content */}
        <div className="auth-content">
          <h2>Create Account</h2>

          <p className="auth-subtitle">
            Join MoodCircle and start sharing your moments
          </p>

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="input-group">
              <label>Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Register Button */}
            <button
              className="auth-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          {/* Message */}
          {message && (
            <p
              className={
                message.toLowerCase().includes("success") ||
                message.toLowerCase().includes("registered")
                  ? "success-message"
                  : "error-message"
              }
            >
              {message}
            </p>
          )}

          {/* Divider */}
          <div className="auth-divider">
            <span>OR</span>
          </div>

          {/* Login Link */}
          <p className="auth-footer">
            Already have an account?{" "}
            <Link to="/">
              Login here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;
