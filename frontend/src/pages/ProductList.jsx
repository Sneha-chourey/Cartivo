import { useEffect, useState } from "react";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/api/products");
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filtered = products
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "All" || p.category === category;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: "700", marginBottom: "4px" }}>All Products</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          {filtered.length} products found
        </p>
      </div>

      {/* Filters */}
      <div style={{
        display: "flex",
        gap: "12px",
        marginBottom: "2rem",
        flexWrap: "wrap",
        alignItems: "center"
      }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "0.9rem" }}>🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: "36px" }}
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input" style={{ width: "180px" }}>
          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input" style={{ width: "180px" }}>
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Category Pills */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "2rem", flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            style={{
              padding: "6px 16px",
              borderRadius: "var(--radius-full)",
              border: "1px solid",
              borderColor: category === cat ? "var(--primary)" : "var(--border)",
              backgroundColor: category === cat ? "var(--primary)" : "var(--surface)",
              color: category === cat ? "#1C1815" : "var(--text-secondary)",
              fontSize: "0.8rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.15s"
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? <Loader /> : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-secondary)" }}>
          <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</p>
          <h3 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>No products found</h3>
          <p style={{ fontSize: "0.875rem" }}>Try a different search or category</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.25rem" }}>
          {filtered.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      )}
    </div>
  );
};

export default ProductList;