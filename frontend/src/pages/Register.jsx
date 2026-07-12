import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, registerEmail } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (registerEmail) { toast.success("Account created! Please verify your email."); navigate("/verify-otp"); }
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [registerEmail, error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { toast.error("Passwords do not match!"); return; }
    if (formData.password.length < 6) { toast.error("Password must be at least 6 characters!"); return; }
    dispatch(registerUser({ name: formData.name, email: formData.email, password: formData.password }));
  };

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      {/* Left — dark surface with gold accents, not a solid gold fill */}
      <div style={{
        backgroundColor: "var(--surface)",
        borderRight: "1px solid var(--border)",
        padding: "3rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Subtle ambient glow — same signature accent used across Home and Login */}
        <div style={{
          position: "absolute",
          top: "-140px",
          left: "-100px",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,162,39,0.12) 0%, rgba(201,162,39,0) 70%)",
          pointerEvents: "none"
        }} />

        <div style={{ maxWidth: "400px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-display)", fontWeight: "700", fontSize: "1.3rem", color: "var(--text-h)", marginBottom: "3rem" }}>
            <span style={{ backgroundColor: "var(--primary)", color: "#1C1815", width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800" }}>C</span>
            Cartivo
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: "700", color: "var(--text-h)", marginBottom: "1rem" }}>
            Start shopping today
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: "1.6", marginBottom: "2.5rem" }}>
            Create a free account and get access to handcrafted pieces made for your home.
          </p>
          {[
            { icon: "✅", text: "Free account, no credit card needed" },
            { icon: "🚚", text: "Free shipping on orders above ₹999" },
            { icon: "↩️", text: "7-day hassle-free returns" },
            { icon: "🔒", text: "Your data is always safe with us" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <span>{item.icon}</span>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem", backgroundColor: "var(--background)" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem", color: "var(--text-h)" }}>Create account</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "2rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--primary)", fontWeight: "500" }}>Sign in</Link>
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label className="label">Full Name</label>
              <input className="input" placeholder="John Doe" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div style={{ marginBottom: "1.25rem" }}>
              <label className="label">Email address</label>
              <input type="email" className="input" placeholder="you@example.com" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>
            <div style={{ marginBottom: "1.25rem" }}>
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} className="input" placeholder="Min. 6 characters"
                  value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required style={{ paddingRight: "48px" }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div style={{ marginBottom: "1.75rem" }}>
              <label className="label">Confirm Password</label>
              <input type="password" className="input" placeholder="Re-enter password"
                value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "12px", fontSize: "0.95rem" }}>
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            By registering, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;