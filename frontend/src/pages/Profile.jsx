import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, updateUserProfile } from "../redux/slices/authSlice";
import API from "../api/axios";
import { toast } from "react-toastify";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    dispatch(getUserProfile());
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateUserProfile(formData));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Profile updated successfully!");
    } else {
      toast.error("Update failed!");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      await API.put("/api/users/change-password", passwordData);
      toast.success("Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "2rem", color: "var(--text)" }}>
        My Profile
      </h1>

      {/* Profile Info */}
      <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            backgroundColor: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            color: "white",
            fontWeight: "700"
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 style={{ fontWeight: "700", fontSize: "1.1rem", color: "var(--text)" }}>{user?.name}</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "4px" }}>{user?.email}</p>
            <span className={user?.role === "admin" ? "badge badge-error" : "badge badge-primary"}>
              {user?.role?.toUpperCase()}
            </span>
          </div>
        </div>

        <h3 style={{ fontWeight: "700", marginBottom: "1rem", fontSize: "1rem", color: "var(--text)" }}>Update Profile</h3>
        <form onSubmit={handleProfileUpdate}>
          <div style={{ marginBottom: "1rem" }}>
            <label className="label">Full Name</label>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label className="label">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: "10px 24px" }}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <h3 style={{ fontWeight: "700", marginBottom: "1rem", fontSize: "1rem", color: "var(--text)" }}>
          🔒 Change Password
        </h3>
        <form onSubmit={handlePasswordChange}>
          <div style={{ marginBottom: "1rem" }}>
            <label className="label">Current Password</label>
            <input
              type="password"
              placeholder="Current Password"
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              className="input"
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label className="label">New Password</label>
            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="input"
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label className="label">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="input"
            />
          </div>
          <button type="submit" className="btn-secondary" style={{ padding: "10px 24px", backgroundColor: "var(--text)", color: "white", border: "none" }}>
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;