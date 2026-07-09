import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import API from "../api/axios";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }
    dispatch(addToCart(product));
    toast.success("Added to cart!");
  };

  if (loading) return <Loader />;
  if (!product) return (
    <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
      Product not found!
    </p>
  );

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <button onClick={() => navigate(-1)} className="btn-secondary" style={{ marginBottom: "1.5rem" }}>
        ← Back
      </button>

      <div className="card" style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "2rem",
        padding: "2rem"
      }}>
        <img
          src={product.imageUrl?.[0] || "https://via.placeholder.com/400"}
          alt={product.name}
          style={{
            width: "100%",
            borderRadius: "var(--radius-lg)",
            objectFit: "cover",
            maxHeight: "400px"
          }}
        />

        <div>
          <p style={{
            color: "var(--primary)",
            fontWeight: "600",
            fontSize: "0.8rem",
            marginBottom: "0.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            {product.category}
          </p>

          <h1 style={{
            fontSize: "1.6rem",
            fontWeight: "700",
            marginBottom: "1rem",
            color: "var(--text)"
          }}>
            {product.name}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
            <span style={{ color: "var(--warning)", fontSize: "1.1rem" }}>
              {"⭐".repeat(Math.round(product.rating))}
            </span>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              {product.rating}/5 ({product.numReviews} reviews)
            </span>
          </div>

          <p style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "var(--primary)",
            marginBottom: "1rem"
          }}>
            ₹{product.price}
          </p>

          <p style={{
            color: "var(--text-secondary)",
            lineHeight: "1.7",
            marginBottom: "1.5rem",
            fontSize: "0.95rem"
          }}>
            {product.description}
          </p>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "1.5rem",
            padding: "10px 14px",
            backgroundColor: product.stock > 0 ? "var(--success-light)" : "var(--error-light)",
            borderRadius: "var(--radius-md)"
          }}>
            <span style={{
              color: product.stock > 0 ? "var(--success)" : "var(--error)",
              fontWeight: "600",
              fontSize: "0.9rem"
            }}>
              {product.stock > 0
                ? `In Stock (${product.stock} items left)`
                : "Out of Stock"}
            </span>
          </div>

          <div style={{
            backgroundColor: "var(--background)",
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            marginBottom: "1.5rem",
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
            border: "1px solid var(--border)"
          }}>
            🚚 Free shipping on orders above ₹999
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={product.stock === 0 ? "" : "btn-primary"}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: product.stock === 0 ? "var(--border)" : undefined,
              color: product.stock === 0 ? "var(--text-muted)" : undefined,
              border: product.stock === 0 ? "none" : undefined,
              borderRadius: "var(--radius-md)",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: product.stock === 0 ? "not-allowed" : "pointer"
            }}
          >
            {product.stock === 0 ? "Out of Stock" : "🛒 Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;