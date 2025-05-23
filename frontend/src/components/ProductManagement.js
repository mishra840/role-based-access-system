import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ProductManagement.css';

const API_BASE_URL = 'http://localhost:5000/api';

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
    marginLeft: 10,
};

const smallButtonStyle = {
    padding: "6px 12px",
    backgroundColor: "#2980b9",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 12,
    marginRight: 5,
};

const deleteButtonStyle = {
    ...smallButtonStyle,
    backgroundColor: "#e74c3c",
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

const ProductManagement = ({ user }) => {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        name: '',
        sku: '',
        price: '',
        category: '',
        status: '',
        enterprise_id: '',
    });
    const [editId, setEditId] = useState(null);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/products`);
            setProducts(res.data);
        } catch (err) {
            alert('Error fetching products');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const payload = {
                ...form,
                price: parseFloat(form.price),
                enterprise_id: parseInt(form.enterprise_id),
            };
            if (editId) {
                await axios.put(`${API_BASE_URL}/products/${editId}`, payload);
                alert('Product updated');
            } else {
                await axios.post(`${API_BASE_URL}/products`, payload);
                alert('Product created');
            }
            setForm({ name: '', sku: '', price: '', category: '', status: '', enterprise_id: '' });
            setEditId(null);
            fetchProducts();
        } catch (err) {
            alert('Error saving product: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleEdit = product => {
        setEditId(product.id);
        setForm({
            name: product.name,
            sku: product.sku,
            price: product.price.toString(),
            category: product.category,
            status: product.status,
            enterprise_id: product.enterprise_id.toString(),
        });
    };

    const handleDelete = async id => {
        if (window.confirm('Delete product?')) {
            try {
                await axios.delete(`${API_BASE_URL}/products/${id}`);
                alert('Product deleted');
                fetchProducts();
            } catch {
                alert('Error deleting product');
            }
        }
    };

    return (
        <div className="product-management-container">
            {user.role_id !== 2 ? (<h2 className="product-management-heading">Product Management</h2>) : <h2 className="product-management-heading">Product Details</h2>}
            
            {user.role_id !== 2 && (
                <form onSubmit={handleSubmit} className="product-form">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        id="name"
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />

                    <label htmlFor="sku" className="form-label">SKU</label>
                    <input
                        id="sku"
                        name="sku"
                        placeholder="SKU"
                        value={form.sku}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />

                    <label htmlFor="price" className="form-label">Price</label>
                    <input
                        id="price"
                        name="price"
                        type="number"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        style={inputStyle}
                        required
                    />

                    <label htmlFor="category" className="form-label">Category</label>
                    <input
                        id="category"
                        name="category"
                        placeholder="Category"
                        value={form.category}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />

                    <label htmlFor="status" className="form-label">Status</label>
                    <input
                        id="status"
                        name="status"
                        placeholder="Status"
                        value={form.status}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />

                    <label htmlFor="enterprise_id" className="form-label">Enterprise ID</label>
                    <input
                        id="enterprise_id"
                        name="enterprise_id"
                        type="number"
                        placeholder="Enterprise ID"
                        value={form.enterprise_id}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />

                    <div style={{ marginTop: 10 }}>
                        <button type="submit" style={buttonPrimaryStyle}>
                            {editId ? 'Update' : 'Create'}
                        </button>

                        {editId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditId(null);
                                    setForm({
                                        name: '',
                                        sku: '',
                                        price: '',
                                        category: '',
                                        status: '',
                                        enterprise_id: ''
                                    });
                                }}
                                style={buttonSecondaryStyle}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            )}

            <div className="table-wrapper" style={{ marginTop: 30 }}>
                <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>SKU</th>
                            <th style={thStyle}>Price</th>
                            <th style={thStyle}>Category</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Enterprise ID</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((p) => (
                                <tr key={p.id}>
                                    <td style={tdStyle}>{p.id}</td>
                                    <td style={tdStyle}>{p.name}</td>
                                    <td style={tdStyle}>{p.sku}</td>
                                    <td style={tdStyle}>{p.price}</td>
                                    <td style={tdStyle}>{p.category}</td>
                                    <td style={tdStyle}>{p.status}</td>
                                    <td style={tdStyle}>{p.enterprise_id}</td>
                                    <td style={tdStyle}>
                                        <button
                                            onClick={() => handleEdit(p)}
                                            disabled={user.role_id === 2}
                                            style={{
                                                ...smallButtonStyle,
                                                opacity: user.role_id === 2 ? 0.5 : 1,
                                                cursor: user.role_id === 2 ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            disabled={user.role_id === 2}
                                            style={{
                                                ...deleteButtonStyle,
                                                opacity: user.role_id === 2 ? 0.5 : 1,
                                                cursor: user.role_id === 2 ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: 20 }}>
                                    No products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductManagement;
