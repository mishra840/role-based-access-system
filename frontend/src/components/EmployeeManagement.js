import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, X } from 'lucide-react';

const EmployeeManagement = ({ user }) => {
    const API_BASE = "http://localhost:5000/api";
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        id: null, name: '', department: '', salary: '', status: 'Active',
        enterprise_id: '', role_id: ''
    });
    const [editCandidate, setEditCandidate] = useState(null);
    const [deleteCandidate, setDeleteCandidate] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const formRef = useRef(null);

    const fetchEmployees = async () => {
        const res = await axios.get(`${API_BASE}/employees`);
        setEmployees(res.data);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.id) {
            await axios.put(`${API_BASE}/employees/${formData.id}`, formData);
        } else {
            await axios.post(`${API_BASE}/employees`, formData);
        }
        setFormData({ id: null, name: '', department: '', salary: '', status: 'Active', enterprise_id: '', role_id: '' });
        fetchEmployees();
    };

    const handleDeleteClick = (emp) => {
        setDeleteCandidate(emp);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${API_BASE}/employees/${deleteCandidate.id}`);
            fetchEmployees();
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setShowDeleteModal(false);
        }
    };

    const handleEdit = (emp) => {
        setEditCandidate(emp);
        setShowEditModal(true);
    };

    const confirmEdit = () => {
        setFormData(editCandidate);
        setShowEditModal(false);
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen relative">
            <h2 className="text-3xl font-bold mb-6 text-blue-700">Employee Management</h2>

            {user.role_id !== 2 && (
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="grid md:grid-cols-3 sm:grid-cols-2 gap-4 mb-8 bg-white p-6 rounded-lg shadow-md"
                >
                    {['name', 'department', 'salary', 'enterprise_id', 'role_id'].map((field) => (
                        <input
                            key={field}
                            name={field}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            value={formData[field]}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 transition"
                            required
                        />
                    ))}
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 transition"
                    >
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                    <button
                        type="submit"
                        className="col-span-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-all duration-300"
                    >
                        {formData.id ? 'Update Employee' : 'Add Employee'}
                    </button>
                </form>
            )}

            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full text-sm text-center">
                    <thead className="bg-blue-100 sticky top-0">
                        <tr>
                            <th>ID</th><th>Name</th><th>Dept</th><th>Salary</th>
                            <th>Status</th><th>Enterprise</th><th>Role</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp, idx) => (
                            <tr key={emp.id} className={`border-t ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-yellow-50`}>
                                <td>{emp.id}</td>
                                <td>{emp.name}</td>
                                <td>{emp.department}</td>
                                <td>{emp.salary}</td>
                                <td>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {emp.status}
                                    </span>
                                </td>
                                <td>{emp.enterprise_id}</td>
                                <td>{emp.role_id}</td>
                                <td className="flex justify-center gap-2 py-2">
                                    <button
                                        onClick={() => handleEdit(emp)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center gap-1 transition"
                                    >
                                        <Pencil size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(emp)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 transition"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {showEditModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative"
                        >
                            <h3 className="text-xl font-semibold mb-4">Confirm Edit</h3>
                            <p className="text-gray-600 mb-6">Edit employee <strong>{editCandidate?.name}</strong>?</p>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => setShowEditModal(false)} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Cancel</button>
                                <button onClick={confirmEdit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Confirm</button>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative"
                        >
                            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete <strong>{deleteCandidate?.name}</strong>?
                            </p>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => setShowDeleteModal(false)} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Cancel</button>
                                <button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Delete</button>
                            </div>
                            <button onClick={() => setShowDeleteModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EmployeeManagement;
