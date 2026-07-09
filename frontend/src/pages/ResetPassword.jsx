import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const { data } = await API.post("/api/users/reset-password", {
        email,
        otp,
        newPassword,
        confirmPassword,
      });
      setMessage(data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "1rem" }}
        />
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "1rem" }}
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "1rem" }}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "1rem" }}
        />
        <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "10px" }}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
};

export default ResetPassword;