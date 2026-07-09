import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp, resendOtp, clearError } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, registerEmail } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (!registerEmail) navigate("/register");
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, registerEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(verifyOtp({ email: registerEmail, otp }));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Email verified! Please login.");
      navigate("/login");
    }
  };

  const handleResend = async () => {
    const result = await dispatch(resendOtp({ email: registerEmail }));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("OTP resent successfully!");
    }
  };

  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "var(--background)"
    }}>
      <div className="card" style={{
        padding: "2.5rem",
        width: "100%",
        maxWidth: "420px",
        textAlign: "center"
      }}>
        <h2 style={{ marginBottom: "0.5rem", fontSize: "1.5rem", fontWeight: "700", color: "var(--text)" }}>Verify Email ✉️</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          OTP sent to <strong style={{ color: "var(--text)" }}>{registerEmail}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            required
            className="input"
            style={{
              fontSize: "1.2rem",
              textAlign: "center",
              letterSpacing: "6px",
              marginBottom: "1rem"
            }}
          />

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "12px", fontSize: "1rem" }}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={loading}
          style={{
            marginTop: "1rem",
            background: "none",
            border: "none",
            color: "var(--primary)",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "0.9rem"
          }}>
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;