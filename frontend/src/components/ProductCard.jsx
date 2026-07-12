import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) { toast.error("Please login to add to cart"); navigate("/login"); return; }
    dispatch(addToCart(product));
    toast.success("Added to cart!");
  };

  return (
    <div
      onClick={() => navigate(`/products/${product._id}`)}
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", cursor: "pointer", transition: "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "var(--primary)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--border)"; }}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={product.imageUrl?.[0] || "https://placehold.co/300x200?text=No+Image"}
          alt={product.name}
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
        {product.stock === 0 && (
          <div style={{ position: "absolute", top: "10px", left: "10px", backgroundColor: "var(--error)", color: "white", fontSize: "0.7rem", fontWeight: "600", padding: "3px 8px", borderRadius: "var(--radius-full)" }}>
            Out of Stock
          </div>
        )}
      </div>
      <div style={{ padding: "1rem" }}>
        <p style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>{product.category}</p>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: "600", color: "var(--text-h)", marginBottom: "8px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{product.name}</h3>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-h)" }}>₹{product.price}</span>
          <span style={{ fontSize: "0.75rem", color: product.stock > 0 ? "var(--success)" : "var(--error)", fontWeight: "500" }}>
            {product.stock > 0 ? `${product.stock} left` : "Sold out"}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          style={{ width: "100%", padding: "9px", backgroundColor: product.stock === 0 ? "var(--border)" : "var(--primary)", color: product.stock === 0 ? "var(--text-muted)" : "#1C1815", border: "none", borderRadius: "var(--radius-md)", fontSize: "0.875rem", fontWeight: "600", cursor: product.stock === 0 ? "not-allowed" : "pointer" }}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;