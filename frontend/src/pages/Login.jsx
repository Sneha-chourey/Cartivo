import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [user, error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      {/* Left Panel */}
      <div style={{ backgroundColor: "var(--primary)", padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
        <div style={{ maxWidth: "400px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", fontSize: "1.3rem", color: "white", marginBottom: "3rem" }}>
            <span style={{ backgroundColor: "white", color: "var(--primary)", width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800" }}>C</span>
            Cartivo
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", color: "white", marginBottom: "1rem", lineHeight: "1.3" }}>
            Welcome back to Cartivo
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1rem", lineHeight: "1.6", marginBottom: "2.5rem" }}>
            Sign in to continue shopping and track your orders.
          </p>
          {[
            { icon: "🛒", text: "Access your cart and saved items" },
            { icon: "📦", text: "Track your orders in real-time" },
            { icon: "🔒", text: "Secure checkout with Razorpay" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9rem" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem", backgroundColor: "var(--background)" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem", color: "var(--text)" }}>Sign in</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "2rem" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--primary)", fontWeight: "500" }}>Create one free</Link>
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label className="label">Email address</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div style={{ marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label className="label" style={{ margin: 0 }}>Password</label>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  className="input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  style={{ paddingRight: "48px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "var(--text-secondary)" }}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div style={{ textAlign: "right", marginBottom: "1.75rem" }}>
              <Link to="/forgot-password" style={{ fontSize: "0.85rem", color: "var(--primary)" }}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "12px", fontSize: "0.95rem" }}>
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            By signing in, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;