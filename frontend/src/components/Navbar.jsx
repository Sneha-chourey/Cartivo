import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    fontSize: "0.9rem",
    fontWeight: "500",
    color: isActive(path) ? "var(--primary)" : "var(--text-secondary)",
    padding: "6px 12px",
    borderRadius: "var(--radius-md)",
    transition: "color 0.15s ease, background 0.15s ease",
    backgroundColor: isActive(path) ? "var(--primary-light)" : "transparent",
  });

  return (
    <>
      <nav style={{
        backgroundColor: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "0 2rem",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "var(--shadow-sm)"
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontFamily: "var(--font-display)",
          fontWeight: "700",
          fontSize: "1.2rem",
          color: "var(--text-h)"
        }}>
          <span style={{
            backgroundColor: "var(--primary)",
            color: "#1C1815",
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            fontWeight: "700"
          }}>C</span>
          Cartivo
        </Link>

        {/* Center Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Link to="/products" style={linkStyle("/products")}>Products</Link>
          {user && <Link to="/my-orders" style={linkStyle("/my-orders")}>Orders</Link>}
          {user?.role === "admin" && (
            <Link to="/admin/dashboard" style={linkStyle("/admin/dashboard")}>Admin</Link>
          )}
        </div>

        {/* Right Side */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user && (
            <Link to="/cart" style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "38px",
              height: "38px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              fontSize: "1.1rem",
              transition: "background 0.15s"
            }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--background)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              🛒
              {cartItems.length > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  backgroundColor: "var(--primary)",
                  color: "#1C1815",
                  fontSize: "0.65rem",
                  fontWeight: "700",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {cartItems.length}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 12px",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--surface)",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  color: "var(--text)"
                }}>
                <span style={{
                  width: "24px",
                  height: "24px",
                  backgroundColor: "var(--primary)",
                  color: "#1C1815",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: "700"
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                {user.name?.split(" ")[0]}
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>▼</span>
              </button>

              {menuOpen && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-lg)",
                  minWidth: "180px",
                  zIndex: 200,
                  overflow: "hidden"
                }}>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "block",
                      padding: "10px 16px",
                      fontSize: "0.875rem",
                      color: "var(--text)",
                      transition: "background 0.15s"
                    }}
                    onMouseEnter={e => e.target.style.background = "var(--background)"}
                    onMouseLeave={e => e.target.style.background = "transparent"}
                  >
                    👤 My Profile
                  </Link>
                  <Link
                    to="/my-orders"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "block",
                      padding: "10px 16px",
                      fontSize: "0.875rem",
                      color: "var(--text)",
                      transition: "background 0.15s"
                    }}
                    onMouseEnter={e => e.target.style.background = "var(--background)"}
                    onMouseLeave={e => e.target.style.background = "transparent"}
                  >
                    📦 My Orders
                  </Link>
                  <div style={{ borderTop: "1px solid var(--border)", margin: "4px 0" }} />
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      border: "none",
                      backgroundColor: "transparent",
                      textAlign: "left",
                      fontSize: "0.875rem",
                      color: "var(--error)",
                      cursor: "pointer",
                      transition: "background 0.15s"
                    }}
                    onMouseEnter={e => e.target.style.background = "var(--error-light)"}
                    onMouseLeave={e => e.target.style.background = "transparent"}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <Link to="/login" className="btn-secondary" style={{ padding: "8px 16px", fontSize: "0.875rem" }}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.875rem" }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Overlay to close menu */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 99 }}
        />
      )}
    </>
  );
};

export default Navbar;