import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = totalPrice > 999 ? 0 : 60;
  const taxPrice = parseFloat((0.18 * totalPrice).toFixed(2));
  const grandTotal = parseFloat((totalPrice + shippingPrice + taxPrice).toFixed(2));

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛒</div>
        <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "var(--text)", marginBottom: "1.5rem" }}>
          Your cart is empty
        </h2>
        <button onClick={() => navigate("/products")} className="btn-primary" style={{ padding: "12px 28px" }}>
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "4px" }}>Your Cart</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{cartItems.length} items</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        {/* Cart Items */}
        <div>
          {cartItems.map((item) => (
            <div key={item._id} className="card" style={{
              display: "flex",
              gap: "1rem",
              padding: "1rem",
              marginBottom: "1rem",
              alignItems: "center"
            }}>
              <img
                src={item.imageUrl?.[0] || "https://placehold.co/80x80?text=No+Image"}
                alt={item.name}
                style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "var(--radius-md)" }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: "600", fontSize: "0.95rem", marginBottom: "4px", color: "var(--text)" }}>{item.name}</h3>
                <p style={{ color: "var(--primary)", fontWeight: "700" }}>₹{item.price}</p>
              </div>

              {/* Quantity */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  onClick={() => item.quantity > 1
                    ? dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))
                    : dispatch(removeFromCart(item._id))
                  }
                  className="btn-secondary"
                  style={{ width: "30px", height: "30px", padding: 0, fontSize: "1.1rem" }}>-</button>
                <span style={{ fontWeight: "600", minWidth: "20px", textAlign: "center" }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
                  className="btn-secondary"
                  style={{ width: "30px", height: "30px", padding: 0, fontSize: "1.1rem" }}>+</button>
              </div>

              <p style={{ fontWeight: "700", minWidth: "80px", textAlign: "right", color: "var(--text)" }}>
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>

              <button
                onClick={() => dispatch(removeFromCart(item._id))}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  color: "var(--error)"
                }}>🗑️</button>
            </div>
          ))}

          <button
            onClick={() => dispatch(clearCart())}
            style={{
              background: "none",
              border: "1px solid var(--error)",
              color: "var(--error)",
              padding: "8px 16px",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500"
            }}>
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="card" style={{ padding: "1.5rem", height: "fit-content" }}>
          <h3 style={{ fontWeight: "700", fontSize: "1.05rem", marginBottom: "1rem", color: "var(--text)" }}>
            Order Summary
          </h3>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            <span>Subtotal</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.9rem" }}>
            <span style={{ color: "var(--text-secondary)" }}>Shipping</span>
            <span style={{ color: shippingPrice === 0 ? "var(--success)" : "var(--text-secondary)" }}>
              {shippingPrice === 0 ? "FREE" : `₹${shippingPrice}`}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            <span>GST (18%)</span>
            <span>₹{taxPrice}</span>
          </div>
          <hr style={{ margin: "1rem 0", border: "none", borderTop: "1px solid var(--border)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "1.1rem", color: "var(--text)" }}>
            <span>Total</span>
            <span style={{ color: "var(--primary)" }}>₹{grandTotal}</span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="btn-primary"
            style={{ width: "100%", padding: "12px", marginTop: "1rem", fontSize: "0.95rem" }}>
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;