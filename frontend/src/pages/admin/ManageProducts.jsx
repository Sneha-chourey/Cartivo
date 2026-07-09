import { useEffect, useState } from "react";
import API from "../../api/axios";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
};

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/api/products");
      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      category: product.category || "",
      stock: product.stock ?? "",
    });
    setImageFile(null);
    setImagePreview(product.imageUrl?.[0] || null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Image is required on create (backend schema requires imageUrl), optional on edit
    if (!editingId && !imageFile) {
      toast.error("Please select a product image");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("description", formData.description);
      fd.append("price", formData.price);
      fd.append("category", formData.category);
      fd.append("stock", formData.stock);
      if (imageFile) fd.append("image", imageFile);

      if (editingId) {
        await API.put(`/api/products/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated!");
      } else {
        await API.post("/api/products", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product added!");
      }

      closeForm();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Save failed!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await API.delete(`/api/products/${id}`);
      toast.success("Product deleted!");
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed!");
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "4px" }}>Manage Products</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{products.length} products</p>
        </div>
        <button onClick={openAddForm} className="btn-primary" style={{ fontSize: "0.875rem" }}>
          + Add Product
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
          <h3 style={{ fontWeight: "700", marginBottom: "1.25rem", fontSize: "1rem" }}>
            {editingId ? "Edit Product" : "Add New Product"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label className="label">Product Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Wireless Headphones"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Category</label>
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Electronics"
                  className="input"
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label className="label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product description..."
                className="input"
                rows={3}
                style={{ resize: "vertical", fontFamily: "inherit" }}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label className="label">Price (₹)</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Stock</label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className="input"
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label className="label">
                Product Image {editingId && "(leave empty to keep current image)"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="input"
                style={{ padding: "8px 14px" }}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "var(--radius-md)", marginTop: "10px", border: "1px solid var(--border)" }}
                />
              )}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" disabled={saving} className="btn-primary" style={{ padding: "10px 24px" }}>
                {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
              </button>
              <button type="button" onClick={closeForm} className="btn-secondary" style={{ padding: "10px 24px" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--background)" }}>
                {["Image", "Name", "Category", "Price", "Stock", "Rating", "Action"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>
                    No products yet. Click "Add Product" to create one.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} style={{ borderTop: "1px solid var(--border)" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--background)"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <td style={{ padding: "10px 16px" }}>
                      <img
                        src={product.imageUrl?.[0] || "https://placehold.co/48x48?text=No+Image"}
                        alt={product.name}
                        style={{ width: "44px", height: "44px", objectFit: "cover", borderRadius: "var(--radius-sm)" }}
                      />
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "0.875rem", fontWeight: "500", maxWidth: "220px" }}>
                      {product.name}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                      {product.category}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "0.875rem", fontWeight: "600" }}>
                      ₹{product.price}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span className={product.stock > 0 ? "badge badge-success" : "badge badge-error"}>
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      ⭐ {product.rating ?? 0} ({product.numReviews ?? 0})
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => openEditForm(product)}
                          style={{ padding: "6px 12px", backgroundColor: "var(--primary-light)", color: "var(--primary)", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", fontSize: "0.8rem", fontWeight: "500" }}>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          style={{ padding: "6px 12px", backgroundColor: "var(--error-light)", color: "var(--error)", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", fontSize: "0.8rem", fontWeight: "500" }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;