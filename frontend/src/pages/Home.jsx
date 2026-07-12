import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const Home = () => {
  const navigate = useNavigate();
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const { data } = await API.get("/api/products/top");
        setTopProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopProducts();
  }, []);

  return (
    <div>
      {/* Hero */}
      <div style={{
        position: "relative",
        backgroundColor: "var(--background)",
        borderBottom: "1px solid var(--border)",
        padding: "6rem 2rem 5rem",
        textAlign: "center",
        overflow: "hidden"
      }}>
        {/* Ambient brass glow — signature element, subtle warm light like a diya behind an idol */}
        <div style={{
          position: "absolute",
          top: "-120px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "560px",
          height: "560px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,162,39,0.16) 0%, rgba(201,162,39,0) 70%)",
          pointerEvents: "none"
        }} />

        <div style={{ position: "relative", maxWidth: "660px", margin: "0 auto" }}>
          <span style={{
            display: "inline-block",
            color: "var(--primary)",
            fontSize: "0.75rem",
            fontWeight: "600",
            marginBottom: "1.5rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase"
          }}>
            Handcrafted · Thoughtfully Made
          </span>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "3.2rem",
            fontWeight: "700",
            color: "var(--text-h)",
            lineHeight: "1.25",
            marginBottom: "1.25rem"
          }}>
            Everyday pieces,<br />crafted with care
          </h1>
          <p style={{
            fontSize: "1.05rem",
            color: "var(--text-secondary)",
            marginBottom: "2.25rem",
            lineHeight: "1.7",
            maxWidth: "480px",
            marginLeft: "auto",
            marginRight: "auto"
          }}>
            From deity idols to kitchenware and home essentials — curated
            pieces that bring warmth and character to every corner of your home.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/products")}
              className="btn-primary"
              style={{ padding: "13px 30px", fontSize: "0.95rem" }}
            >
              Explore Collection →
            </button>
            <button
              onClick={() => navigate("/register")}
              className="btn-secondary"
              style={{ padding: "13px 30px", fontSize: "0.95rem" }}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>

      {/* Trust strip — honest, no invented numbers */}
      <div style={{
        backgroundColor: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "1.75rem 2rem"
      }}>
        <div style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          textAlign: "center"
        }}>
          {[
            { icon: "✦", label: "Hand-carved by artisans" },
            { icon: "⌂", label: "Pan-India shipping" },
            { icon: "◈", label: "Secure Razorpay checkout" },
            { icon: "↺", label: "7-day easy returns" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <span style={{ color: "var(--primary)", fontSize: "1.1rem" }}>{item.icon}</span>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: "500" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: "5rem 2rem", backgroundColor: "var(--background)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <hr className="gold-rule" />
            <h2 style={{ fontSize: "1.75rem", fontWeight: "600", marginBottom: "0.5rem" }}>
              Why Cartivo
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              Every piece is chosen for the craft behind it
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem"
          }}>
            {[
              { icon: "🪔", title: "Handcrafted Quality", desc: "Each piece is shaped and finished by skilled artisans, never mass-produced." },
              { icon: "🔒", title: "Secure Payments", desc: "Checkout safely with Razorpay — encrypted, trusted, and instant." },
              { icon: "↩︎", title: "Easy Returns", desc: "Not the right fit for your space? Return within 7 days, hassle-free." },
            ].map((feature, i) => (
              <div key={i} className="card" style={{ padding: "2rem" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.3rem",
                  marginBottom: "1.25rem"
                }}>{feature.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: "600", marginBottom: "8px", fontSize: "1.1rem" }}>{feature.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.7" }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div style={{ padding: "1rem 2rem 5rem", backgroundColor: "var(--background)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: "600", marginBottom: "6px" }}>Most Loved Pieces</h2>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Chosen and cherished by our customers</p>
            </div>
            <button onClick={() => navigate("/products")} className="btn-secondary" style={{ fontSize: "0.875rem" }}>
              View All →
            </button>
          </div>

          {loading ? <Loader /> : topProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>
              <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>🪔</p>
              <p>New pieces are being crafted. Check back soon.</p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1.25rem"
            }}>
              {topProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Banner */}
      <div style={{
        backgroundColor: "var(--surface)",
        borderTop: "1px solid var(--border)",
        padding: "4.5rem 2rem",
        textAlign: "center"
      }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.9rem", fontWeight: "600", color: "var(--text-h)", marginBottom: "0.75rem" }}>
          Find the piece that belongs in your home
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.75rem", fontSize: "1rem" }}>
          Create an account to save favorites and track your orders.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="btn-primary"
          style={{ padding: "13px 32px", fontSize: "0.95rem" }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;