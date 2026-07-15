import { useEffect, useState } from "react";
import API from "../../api/axios";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, ordersRes] = await Promise.all([
          API.get("/api/analytics/summary"),
          API.get("/api/analytics/orders/recent"),
        ]);
        setSummary(summaryRes.data);
        setRecentOrders(ordersRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  const cards = [
    { title: "Total Revenue", value: `₹${summary?.totalRevenue?.toLocaleString()}`, icon: "💰", color: "var(--primary)" },
    { title: "Total Orders", value: summary?.totalOrders, icon: "📦", color: "#3b82f6" },
    { title: "Total Users", value: summary?.totalUsers, icon: "👥", color: "#10b981" },
    { title: "Total Products", value: summary?.totalProducts, icon: "🛍️", color: "#f59e0b" },
    { title: "Paid Orders", value: summary?.paidOrders, icon: "✅", color: "#059669" },
    { title: "Delivered", value: summary?.deliveredOrders, icon: "🚚", color: "#6366f1" },
    { title: "Cancelled", value: summary?.cancelledOrders, icon: "❌", color: "var(--error)" },
  ];

  const getStatusBadge = (status) => {
    const map = {
      "Delivered": "badge badge-success",
      "Shipped": "badge badge-primary",
      "Cancelled": "badge badge-error",
      "Processing": "badge badge-warning",
    };
    return map[status] || "badge";
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "4px" }}>Dashboard</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Welcome back, Admin</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => navigate("/admin/products")} className="btn-secondary" style={{ fontSize: "0.875rem" }}>
            Manage Products
          </button>
          <button onClick={() => navigate("/admin/orders")} className="btn-primary" style={{ fontSize: "0.875rem" }}>
            Manage Orders
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {cards.map((card, i) => (
          <div key={i} className="card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div style={{ width: "40px", height: "40px", backgroundColor: "var(--background)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                {card.icon}
              </div>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px" }}>{card.title}</p>
            <p style={{ fontSize: "1.6rem", fontWeight: "700", color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontWeight: "600", fontSize: "1rem" }}>Recent Orders</h3>
          <button onClick={() => navigate("/admin/orders")} style={{ fontSize: "0.8rem", color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontWeight: "500" }}>
            View all →
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--background)" }}>
                {["Order ID", "Customer", "Amount", "Paid", "Status", "Date"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} style={{ borderTop: "1px solid var(--border)" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--background)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <td style={{ padding: "12px 16px", fontSize: "0.875rem", fontWeight: "500" }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.875rem" }}>{order.user?.name || "N/A"}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.875rem", fontWeight: "600" }}>₹{order.totalPrice}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span className={order.isPaid ? "badge badge-success" : "badge badge-error"}>
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span className={getStatusBadge(order.orderStatus)}>{order.orderStatus}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;