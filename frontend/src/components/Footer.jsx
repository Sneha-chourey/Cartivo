import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: "var(--surface)",
      borderTop: "1px solid var(--border)",
      padding: "3rem 2rem 1.5rem",
      marginTop: "auto"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr",
        gap: "2rem",
        marginBottom: "2rem"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-display)", fontWeight: "700", fontSize: "1.1rem", marginBottom: "0.75rem", color: "var(--text-h)" }}>
            <span style={{ backgroundColor: "var(--primary)", color: "#1C1815", width: "28px", height: "28px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>C</span>
            Cartivo
          </div>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: "1.6", maxWidth: "260px" }}>
            Handcrafted decor, idols, and home essentials — curated pieces for every corner of your home.
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "1rem", color: "var(--text)" }}>Shop</h4>
          {["All Products", "New Arrivals", "Top Rated"].map((item) => (
            <Link key={item} to="/products" style={{ display: "block", fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "8px" }}>{item}</Link>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "1rem", color: "var(--text)" }}>Account</h4>
          {[{ label: "My Profile", path: "/profile" }, { label: "My Orders", path: "/my-orders" }, { label: "Cart", path: "/cart" }].map((item) => (
            <Link key={item.label} to={item.path} style={{ display: "block", fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "8px" }}>{item.label}</Link>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "1rem", color: "var(--text)" }}>Info</h4>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "8px" }}>🔒 Secure Payments</p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "8px" }}>🚚 Free Shipping above ₹999</p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "8px" }}>↩️ 7 Day Returns</p>
        </div>
      </div>
      <div style={{ maxWidth: "1200px", margin: "0 auto", paddingTop: "1.5rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>© 2026 Cartivo. All rights reserved.</p>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Built with React + Node.js + MongoDB</p>
      </div>
    </footer>
  );
};

export default Footer;