import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const { data } = await API.post("/api/users/forgot-password", { email });
      setMessage(data.message);
      setTimeout(() => navigate("/reset-password", { state: { email } }), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "1rem" }}
        />
        <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "10px" }}>
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
};

export default ForgotPassword;