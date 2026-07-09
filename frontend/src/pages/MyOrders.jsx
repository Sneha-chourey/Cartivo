import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Loader from "../components/Loader";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/api/orders/mine");
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    setCancellingId(orderId);
    try {
      await API.put(`/api/orders/${orderId}/cancel`);
      await fetchOrders(); // refresh list to show updated status
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      "Delivered": "badge badge-success",
      "Shipped": "badge badge-primary",
      "Cancelled": "badge badge-error",
      "Processing": "badge badge-warning",
    };
    return map[status] || "badge";
  };

  const canCancel = (status) => !["Shipped", "Delivered", "Cancelled"].includes(status);

  if (loading) return <Loader />;

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1.5rem" }}>
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
          <h3 style={{ marginBottom: "1.5rem", color: "var(--text)" }}>No orders yet</h3>
          <button onClick={() => navigate("/products")} className="btn-primary" style={{ padding: "12px 24px" }}>
            Start Shopping
          </button>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div>
                <p style={{ fontWeight: "600", marginBottom: "4px", color: "var(--text)" }}>
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric", month: "long", day: "numeric"
                  })}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span className={getStatusBadge(order.orderStatus)}>
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Order Items */}
            {order.orderItems.map((item, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid var(--border)",
                fontSize: "0.9rem",
                color: "var(--text-secondary)"
              }}>
                <span>{item.name} x{item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", alignItems: "center" }}>
              <span className={order.isPaid ? "badge badge-success" : "badge badge-error"}>
                {order.isPaid ? "Paid" : "Unpaid"}
              </span>
              <span style={{ fontWeight: "700", fontSize: "1.1rem", color: "var(--primary)" }}>
                Total: ₹{order.totalPrice}
              </span>
            </div>

            {canCancel(order.orderStatus) && (
              <div style={{ marginTop: "1rem", textAlign: "right" }}>
                <button
                  onClick={() => handleCancel(order._id)}
                  disabled={cancellingId === order._id}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "1px solid var(--error, #e53e3e)",
                    background: "transparent",
                    color: "var(--error, #e53e3e)",
                    cursor: cancellingId === order._id ? "not-allowed" : "pointer",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                  }}
                >
                  {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;