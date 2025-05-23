import React, { useEffect, useState } from "react";
import '../css/UserManagement.css';

const API_BASE = "http://localhost:5000/api";

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [modules, setModules] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        id: null,
        name: "",
        email: "",
        password: "",
        role_id: 2,
        enterprise_id: 1,
        modules: [],
    });
    const [editing, setEditing] = useState(false);

    const token = localStorage.getItem("token");
    const authHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
        if (!token) {
            setError("No token found. Please login.");
            setLoading(false);
            return;
        }

        async function fetchData() {
            try {
                const [userRes, modulesRes] = await Promise.all([
                    fetch(`${API_BASE}/users/current`, { headers: authHeaders }),
                    fetch(`${API_BASE}/modules`, { headers: authHeaders }),
                ]);

                if (!userRes.ok) throw new Error("Failed to fetch current user");
                if (!modulesRes.ok) throw new Error("Failed to fetch modules");

                const userData = await userRes.json();
                const modulesData = await modulesRes.json();

                setCurrentUser(userData);
                setModules(modulesData);
                setLoading(false);

                if (userData.role_id === 1) {
                    fetchUsers();
                }
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }
        fetchData();
    }, [token]);

    function fetchUsers() {
        fetch(`${API_BASE}/users`, { headers: authHeaders })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch users");
                return res.json();
            })
            .then((data) => setUsers(data))
            .catch((err) => setError(err.message));
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function handleModuleChange(e) {
        const checked = e.target.checked;
        const modId = Number(e.target.value);
        setForm((prev) => {
            if (checked) {
                return { ...prev, modules: [...prev.modules, modId] };
            } else {
                return { ...prev, modules: prev.modules.filter((id) => id !== modId) };
            }
        });
    }

    function handleSubmit(e) {
        e.preventDefault();

        const selectedModuleNames = form.modules
            .map((id) => modules.find((m) => m.id === id))
            .filter(Boolean)
            .map((m) => m.name);

        const url = editing ? `${API_BASE}/users/${form.id}` : `${API_BASE}/users`;
        const method = editing ? "PUT" : "POST";

        const payload = {
            name: form.name,
            email: form.email,
            role_id: Number(form.role_id),
            enterprise_id: Number(form.enterprise_id),
            modules: selectedModuleNames,
        };
        if (!editing || form.password.trim() !== "") {
            payload.password = form.password;
        }

        fetch(url, {
            method,
            headers: authHeaders,
            body: JSON.stringify(payload),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Failed");
                }
                return res.json();
            })
            .then(() => {
                alert(editing ? "User updated!" : "User created!");
                resetForm();
                if (currentUser.role_id === 1) fetchUsers();
            })
            .catch((err) => {
                alert("Error: " + err.message);
            });
    }

    function resetForm() {
        setEditing(false);
        setForm({
            id: null,
            name: "",
            email: "",
            password: "",
            role_id: 2,
            enterprise_id: 1,
            modules: [],
        });
    }

    function handleEdit(user) {
        setEditing(true);
        setForm({
            id: user.id,
            name: user.name,
            email: user.email,
            password: "",
            role_id: user.role_id,
            enterprise_id: user.enterprise_id,
            modules: user.modules || [],
        });
    }

    function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        fetch(`${API_BASE}/users/${id}`, {
            method: "DELETE",
            headers: authHeaders,
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to delete user");
                alert("User deleted");
                fetchUsers();
            })
            .catch((err) => alert("Error: " + err.message));
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

    return (
        <div style={{ maxWidth: 900, margin: "20px auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#333" }}>
            {/* User Management header as link */}
            <div style={{ marginBottom: 20 }}>
                <a
                    href="#"
                    style={{
                        textDecoration: "none",
                        color: "#2c3e50",
                        fontWeight: "700",
                        fontSize: 24,
                        cursor: "pointer",
                    }}
                    onClick={(e) => e.preventDefault()}
                >
                    User Management
                </a>
                <p style={{ marginTop: 5, color: "#666" }}>
                    Logged in as: <b>{currentUser.name}</b> (Role ID: {currentUser.role_id})
                </p>
            </div>

            {currentUser.role_id === 1 && (
                <>
                    {/* Add User Form Card */}
                    <div
                        style={{
                            background: "#fff",
                            padding: 20,
                            borderRadius: 8,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            marginBottom: 30,
                        }}
                    >
                        <h3 style={{ textAlign: "center", marginBottom: 15 }}>
                            {editing ? "Edit User" : "Add User"}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder={editing ? "Leave blank to keep password" : "Password"}
                                value={form.password}
                                onChange={handleChange}
                                {...(!editing && { required: true })}
                                style={inputStyle}
                            />
                            <select
                                name="role_id"
                                value={form.role_id}
                                onChange={handleChange}
                                style={{ ...inputStyle, height: 35 }}
                            >
                                <option value={1}>Admin</option>
                                <option value={2}>User</option>
                                <option value={3}>HR</option>
                                <option value={4}>Manager</option>
                                <option value={5}>Sales</option>
                            </select>
                            <input
                                type="number"
                                name="enterprise_id"
                                placeholder="Enterprise ID"
                                value={form.enterprise_id}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />

                            <div style={{ marginTop: 10 }}>
                                <label style={{ fontWeight: "600" }}>Assign Modules:</label>
                                <div style={{ marginTop: 5 }}>
                                    {modules.length === 0 && <p>No modules available.</p>}
                                    {modules.map((mod) => (
                                        <label
                                            key={mod.id}
                                            style={{ marginRight: 15, userSelect: "none", fontSize: 14 }}
                                        >
                                            <input
                                                type="checkbox"
                                                name="modules"
                                                value={mod.id}
                                                checked={form.modules.includes(mod.id)}
                                                onChange={handleModuleChange}
                                                style={{ marginRight: 4 }}
                                            />
                                            {mod.name}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
                                <button
                                    type="submit"
                                    style={buttonPrimaryStyle}
                                >
                                    {editing ? "Update User" : "Create User"}
                                </button>
                                {editing && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        style={buttonSecondaryStyle}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* User List Card */}
                    <div
                        style={{
                            background: "#fff",
                            padding: 20,
                            borderRadius: 8,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        }}
                    >
                        <h3 style={{ textAlign: "center", marginBottom: 15 }}>User List</h3>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                fontSize: 14,
                            }}
                        >
                            <thead style={{ backgroundColor: "#f4f6f8" }}>
                                <tr>
                                    <th style={thStyle}>ID</th>
                                    <th style={thStyle}>Name</th>
                                    <th style={thStyle}>Email</th>
                                    <th style={thStyle}>Role ID</th>
                                    <th style={thStyle}>Enterprise ID</th>
                                    <th style={thStyle}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id} style={{ borderBottom: "1px solid #eaeaea" }}>
                                        <td style={tdStyle}>{u.id}</td>
                                        <td style={tdStyle}>{u.name}</td>
                                        <td style={tdStyle}>{u.email}</td>
                                        <td style={tdStyle}>{u.role_id}</td>
                                        <td style={tdStyle}>{u.enterprise_id}</td>
                                        <td style={tdStyle}>
                                            <button
                                                onClick={() => handleEdit(u)}
                                                style={smallButtonStyle}
                                            >
                                                Edit
                                            </button>{" "}
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                style={{ ...smallButtonStyle, backgroundColor: "#e74c3c" }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {currentUser.role_id !== 1 && (
                <div
                    style={{
                        background: "#fff",
                        padding: 20,
                        borderRadius: 8,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }}
                >
                    <h3 style={{ textAlign: "center", marginBottom: 15 }}>Your Profile</h3>
                    <p><b>ID:</b> {currentUser.id}</p>
                    <p><b>Name:</b> {currentUser.name}</p>
                    <p><b>Email:</b> {currentUser.email}</p>
                    <p><b>Role ID:</b> {currentUser.role_id}</p>
                    <p><b>Enterprise ID:</b> {currentUser.enterprise_id}</p>
                </div>
            )}
        </div>
    );
}


const inputStyle = {
    display: "block",
    width: "100%",
    padding: "8px 10px",
    marginBottom: 15,
    borderRadius: 5,
    border: "1px solid #ccc",
    fontSize: 14,
};

const buttonPrimaryStyle = {
    padding: "10px 20px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontWeight: "600",
};

const buttonSecondaryStyle = {
    padding: "10px 20px",
    backgroundColor: "#95a5a6",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontWeight: "600",
};

const smallButtonStyle = {
    padding: "6px 12px",
    backgroundColor: "#2980b9",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 12,
};

const thStyle = {
    padding: "10px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    fontWeight: "600",
};

const tdStyle = {
    padding: "8px 10px",
};

export default UserManagement;
