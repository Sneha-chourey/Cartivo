import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Loader from "../components/Loader";

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/api/orders/${id}`);
        setOrder(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Loader />;

  return (
    <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🎉</div>
      <h1 style={{ fontSize: "1.8rem", fontWeight: "700", color: "var(--primary)", marginBottom: "0.5rem" }}>
        Order Placed Successfully!
      </h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
        Order ID: <strong style={{ color: "var(--text)" }}>#{id}</strong>
      </p>

      {order && (
        <div className="card" style={{
          padding: "1.5rem",
          maxWidth: "500px",
          margin: "0 auto 2rem",
          textAlign: "left"
        }}>
          <h3 style={{ fontWeight: "700", marginBottom: "1rem", color: "var(--text)" }}>Order Details</h3>
          {order.orderItems.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              <span>{item.name} x{item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr style={{ margin: "1rem 0", border: "none", borderTop: "1px solid var(--border)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", color: "var(--text)" }}>
            <span>Total Paid</span>
            <span style={{ color: "var(--primary)" }}>₹{order.totalPrice}</span>
          </div>
          <p style={{ marginTop: "1rem", color: "var(--success)", fontWeight: "600", fontSize: "0.9rem" }}>
            ✅ Payment Status: Paid
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            📦 Status: {order.orderStatus}
          </p>
        </div>
      )}

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button onClick={() => navigate("/my-orders")} className="btn-primary" style={{ padding: "12px 24px" }}>
          View My Orders
        </button>
        <button onClick={() => navigate("/products")} className="btn-secondary" style={{ padding: "12px 24px" }}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;