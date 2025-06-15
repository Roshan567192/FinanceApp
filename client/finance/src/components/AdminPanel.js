import React, { useEffect, useState } from "react";
import api from "../api"; // Axios instance with token
import FinancialReport from "./FinancialReport"; // Component below

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  useEffect(() => {
    api.get("/admin/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        alert("Unauthorized or not an admin");
        setLoading(false);
      });
  }, []);

  const changeRole = (id, newRole) => {
    api.put(`/admin/users/${id}/role`, { role: newRole })
      .then((res) => {
        const updatedUser = res.data;
        setUsers(users.map((u) => (u._id === id ? updatedUser : u)));
        alert(`Role updated to ${updatedUser.role}`);
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Failed to update role");
      });
  };

  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setEditForm({ name: user.name, email: user.email });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveUserInfo = (id) => {
    api.put(`/admin/users/${id}`, editForm)
      .then((res) => {
        const updatedUser = res.data;
        setUsers(users.map((u) => (u._id === id ? updatedUser : u)));
        setEditingUserId(null);
        alert("User info updated");
      })
      .catch(() => alert("Failed to update user info"));
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditForm({ name: "", email: "" });
  };

  const deleteUser = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    api.delete(`/admin/users/${id}`)
      .then(() => {
        setUsers(users.filter((u) => u._id !== id));
        alert("User deleted successfully");
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Failed to delete user");
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Panel</h2>

      <h4>User Management</h4>
      {loading ? (
        <div className="text-center">Loading users...</div>
      ) : (
        <div className="table-responsive mb-5">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th style={{ minWidth: "250px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  {editingUserId === user._id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </td>
                      <td>{user.role}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => saveUserInfo(user._id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{user.name}</td>
                      <td>{user.email || <i>No email</i>}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            user.role === "admin" ? "primary" : "secondary"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        {user.role === "user" ? (
                          <button
                            className="btn btn-outline-primary btn-sm me-2"
                            onClick={() => changeRole(user._id, "admin")}
                          >
                            Make Admin
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-warning btn-sm me-2"
                            onClick={() => changeRole(user._id, "user")}
                          >
                            Revoke Admin
                          </button>
                        )}
                        <button
                          className="btn btn-outline-secondary btn-sm me-2"
                          onClick={() => handleEditClick(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deleteUser(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <hr />
      <FinancialReport />
    </div>
  );
}
