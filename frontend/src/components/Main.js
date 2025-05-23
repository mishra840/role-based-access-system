import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCog, FaBoxOpen, FaBuilding, FaUsers, FaTachometerAlt, FaMoon, FaSun } from 'react-icons/fa';
import '../css/AuthForm.css';

import EnterpriseManagement from './EnterpriseManagement';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import EmployeeManagement from './EmployeeManagement';
import Dashboard from './Dashboard';

const moduleComponents = {
    'Product Management': ProductManagement,
    'Enterprise Management': EnterpriseManagement,
    'User Management': UserManagement,
    'Employee Management': EmployeeManagement,
    'Dashboard': Dashboard
};

// Icons per module
const moduleIcons = {
    'Product Management': <FaBoxOpen size={28} color="#2980b9" />,
    'Enterprise Management': <FaBuilding size={28} color="#27ae60" />,
    'User Management': <FaUserCog size={28} color="#8e44ad" />,
    'Employee Management': <FaUsers size={28} color="#e67e22" />,
    'Dashboard': <FaTachometerAlt size={28} color="#c0392b" />
};

const loadingVariants = {
    rotate: {
        rotate: 360,
        transition: { repeat: Infinity, duration: 1, ease: 'linear' }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.15, type: 'spring', stiffness: 120 }
    }),
};

const Main = ({ user }) => {
    const [assignedModules, setAssignedModules] = useState([]);
    const [loadingModules, setLoadingModules] = useState(true);
    const [error, setError] = useState(null);
    const [darkMode, setDarkMode] = useState(() => {
        // Load theme from localStorage or default to false
        return localStorage.getItem('darkMode') === 'true';
    });

    useEffect(() => {
        if (!user) return;

        const fetchAssignedModules = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/users/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const moduleNames = response.data.modules.map(m => m.name);
                setAssignedModules(moduleNames);
            } catch (err) {
                setError('Failed to load modules.');
            } finally {
                setLoadingModules(false);
            }
        };

        fetchAssignedModules();
    }, [user]);

    useEffect(() => {
        // Add/remove dark class on body
        if (darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    if (!user) {
        return (
            <div className="loading-center">
                <motion.div
                    className="loader"
                    animate="rotate"
                    variants={loadingVariants}
                    aria-label="Loading"
                />
            </div>
        );
    }

    if (loadingModules) {
        return (
            <div className="loading-center">
                <motion.div
                    className="loader"
                    animate="rotate"
                    variants={loadingVariants}
                    aria-label="Loading"
                />
            </div>
        );
    }

    if (error) {
        return <div className="error-msg" style={{ textAlign: 'center', marginTop: 30 }}>{error}</div>;
    }

    let modulesToShow;

    if (user.role_id === 1) {
        modulesToShow = [
            'User Management',
            'Product Management',
            'Enterprise Management',
            'Employee Management',
            'Dashboard'
        ];
    } else if (user.role_id === 2) {
        modulesToShow = [
            'Enterprise Management',
            'Product Management'
        ];
    } else {
        modulesToShow = assignedModules;
    }

    return (
        <div className="main-container">
            <header className="main-header">
                <h1>
                    Welcome, <span className="highlight">{user.name || 'User'}</span>!
                </h1>
                <button
                    className="dark-mode-toggle"
                    onClick={() => setDarkMode(prev => !prev)}
                    aria-label="Toggle dark mode"
                    title="Toggle dark mode"
                >
                    {darkMode ? <FaSun size={22} color="#f39c12" /> : <FaMoon size={22} color="#34495e" />}
                </button>
            </header>

            {modulesToShow.length === 0 ? (
                <p className="no-modules-msg">
                    You have no assigned modules to display.
                </p>
            ) : (
                <div className="module-grid">
                    <AnimatePresence>
                        {modulesToShow.map((moduleName, index) => {
                            const Component = moduleComponents[moduleName];
                            if (!Component) return null;
                            const icon = moduleIcons[moduleName];

                            // Pass user only to selected modules
                            const passUser = ['Dashboard', 'Enterprise Management', 'Product Management', 'Employee Management'].includes(moduleName);

                            return (
                                <motion.div
                                    key={moduleName}
                                    custom={index}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={cardVariants}
                                    className="module-card"
                                    whileHover={{ scale: 1.05, boxShadow: '0 20px 35px rgba(0,0,0,0.15)' }}
                                >
                                    <div className="module-icon">{icon}</div>
                                    <h2 className="module-title">{moduleName}</h2>
                                    <div className="module-content">
                                        <Component {...(passUser ? { user } : {})} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default Main;
