
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const containerStyle = {
    padding: '24px',
    fontFamily: 'Arial, sans-serif',
};

const headingStyle = {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '16px',
};

const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '8px 10px',
    marginBottom: 15,
    borderRadius: 5,
    border: '1px solid #ccc',
    fontSize: 14,
    boxSizing: 'border-box',
};

const buttonPrimaryStyle = {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    fontWeight: '600',
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
};

const thStyle = {
    border: '1px solid #ddd',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    fontWeight: '600',
    textAlign: 'left',
};

const tdStyle = {
    border: '1px solid #ddd',
    padding: '8px 10px',
};

const editButtonStyle = {
    padding: '6px 12px',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 12,
    marginRight: 8,
};

const deleteButtonStyle = {
    padding: '6px 12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 12,
};

const EnterpriseManagement = ({ user }) => {
    const [enterprises, setEnterprises] = useState([]);
    const [form, setForm] = useState({ name: '', location: '', contact_info: '' });
    const [editingId, setEditingId] = useState(null);
    console.log('user-e', user)

    const fetchEnterprises = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/enterprises`);
            setEnterprises(res.data);
        } catch (err) {
            console.error('Error fetching enterprises:', err.message);
        }
    };

    useEffect(() => {
        fetchEnterprises();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API_BASE_URL}/enterprises/${editingId}`, form);
            } else {
                await axios.post(`${API_BASE_URL}/enterprises`, form);
            }
            setForm({ name: '', location: '', contact_info: '' });
            setEditingId(null);
            fetchEnterprises();
        } catch (err) {
            console.error('Error saving enterprise:', err.message);
        }
    };

    const handleEdit = (enterprise) => {
        setForm({
            name: enterprise.name,
            location: enterprise.location,
            contact_info: enterprise.contact_info,
        });
        setEditingId(enterprise.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this enterprise?')) {
            try {
                await axios.delete(`${API_BASE_URL}/enterprises/${id}`);
                fetchEnterprises();
            } catch (err) {
                console.error('Error deleting enterprise:', err.message);
            }
        }
    };


    return (
        <div style={containerStyle}>
            {user.role_id !== 2 ? (<h2 style={headingStyle}>Enterprise Management</h2>) : (<h2 className="product-management-heading">Enterprise Details</h2>)
            }
            {/* ✅ Show Form only if user.role_id is NOT 2 */}
            {user.role_id !== 2 && (
                <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enterprise Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={form.location}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    <input
                        type="text"
                        name="contact_info"
                        placeholder="Contact Info"
                        value={form.contact_info}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    <button type="submit" style={buttonPrimaryStyle}>
                        {editingId ? 'Update Enterprise' : 'Add Enterprise'}
                    </button>
                </form>
            )}

            {/* ✅ Show Table for all roles */}
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Location</th>
                        <th style={thStyle}>Contact Info</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {enterprises.map((ent) => (
                        <tr key={ent.id}>
                            <td style={tdStyle}>{ent.name}</td>
                            <td style={tdStyle}>{ent.location}</td>
                            <td style={tdStyle}>{ent.contact_info}</td>
                            <td style={tdStyle}>
                                <button
                                    onClick={() => handleEdit(ent)}
                                    style={{
                                        ...editButtonStyle,
                                        opacity: user.role_id === 2 ? 0.5 : 1,
                                        cursor: user.role_id === 2 ? 'not-allowed' : 'pointer'
                                    }}
                                    disabled={user.role_id === 2}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(ent.id)}
                                    style={{
                                        ...deleteButtonStyle,
                                        opacity: user.role_id === 2 ? 0.5 : 1,
                                        cursor: user.role_id === 2 ? 'not-allowed' : 'pointer'
                                    }}
                                    disabled={user.role_id === 2}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );

};

export default EnterpriseManagement;
