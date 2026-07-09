import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";
import API from "../api/axios";
import { toast } from "react-toastify";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [address, setAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
  });

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = totalPrice > 999 ? 0 : 60;
  const taxPrice = parseFloat((0.18 * totalPrice).toFixed(2));
  const grandTotal = parseFloat((totalPrice + shippingPrice + taxPrice).toFixed(2));

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

const handlePlaceOrder = async () => {
  try {
    const orderItems = cartItems.map((item) => ({
      product: item._id,
      name: item.name,
      imageUrl: item.imageUrl?.[0] || "",
      price: item.price,
      quantity: item.quantity,
    }));

    const { data: order } = await API.post("/api/orders", {
      orderItems,
      shippingAddress: address,
      paymentMethod: "Razorpay",
    });

    const { data: razorpayData } = await API.post("/api/payment/razorpay/create-order", {
      orderId: order._id,
    });

    const options = {
      key: razorpayData.key,
      amount: razorpayData.amount,
      currency: razorpayData.currency,
      name: "Cartivo",
      description: "Order Payment",
      order_id: razorpayData.razorpayOrderId,
      handler: async (response) => {
        await API.post("/api/payment/razorpay/verify", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          orderId: order._id,
        });
        dispatch(clearCart());
        toast.success("Payment successful! 🎉");
        navigate(`/order-success/${order._id}`);
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: address.phone,
      },
      theme: { color: "#5046e5" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    console.log("FULL ERROR:", error);
    console.log("RESPONSE:", error.response?.data);
    toast.error(error.response?.data?.message || "Order failed!");
  }
};

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1.5rem" }}>
        Checkout
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "2rem" }}>
        {/* Shipping Address */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontWeight: "700", marginBottom: "1rem", fontSize: "1rem" }}>📦 Shipping Address</h3>
          <label className="label">Full Name</label>
          <input name="fullName" placeholder="Full Name" value={address.fullName} onChange={handleChange} className="input" style={{ marginBottom: "1rem" }} />
          <label className="label">Phone Number</label>
          <input name="phone" placeholder="Phone Number" value={address.phone} onChange={handleChange} className="input" style={{ marginBottom: "1rem" }} />
          <label className="label">Street Address</label>
          <input name="address" placeholder="Street Address" value={address.address} onChange={handleChange} className="input" style={{ marginBottom: "1rem" }} />
          <label className="label">City</label>
          <input name="city" placeholder="City" value={address.city} onChange={handleChange} className="input" style={{ marginBottom: "1rem" }} />
          <label className="label">State</label>
          <input name="state" placeholder="State" value={address.state} onChange={handleChange} className="input" style={{ marginBottom: "1rem" }} />
          <label className="label">Postal Code</label>
          <input name="postalCode" placeholder="Postal Code" value={address.postalCode} onChange={handleChange} className="input" style={{ marginBottom: "1rem" }} />
          <label className="label">Country</label>
          <input name="country" placeholder="Country" value={address.country} onChange={handleChange} className="input" />
        </div>

        {/* Order Summary */}
        <div className="card" style={{ padding: "1.5rem", height: "fit-content" }}>
          <h3 style={{ fontWeight: "700", marginBottom: "1rem", fontSize: "1rem" }}>Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item._id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              <span>{item.name} x{item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr style={{ margin: "1rem 0", border: "none", borderTop: "1px solid var(--border)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            <span>Shipping</span>
            <span>{shippingPrice === 0 ? "FREE" : `₹${shippingPrice}`}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            <span>GST (18%)</span>
            <span>₹{taxPrice}</span>
          </div>
          <hr style={{ margin: "1rem 0", border: "none", borderTop: "1px solid var(--border)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "1.1rem", marginBottom: "1.5rem", color: "var(--text)" }}>
            <span>Total</span>
            <span style={{ color: "var(--primary)" }}>₹{grandTotal}</span>
          </div>

          <button onClick={handlePlaceOrder} className="btn-primary" style={{ width: "100%", padding: "12px", fontSize: "0.95rem" }}>
            Pay ₹{grandTotal} with Razorpay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;