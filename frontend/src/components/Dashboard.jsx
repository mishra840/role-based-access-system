import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = ({ user }) => {
    const [dashboardData, setDashboardData] = useState(null);
    const API_BASE_URL = 'http://localhost:5000/api';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/dashboard/${user.id}`);
                setDashboardData(res.data);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            }
        };

        if (user?.id) {
            fetchDashboardData();
        }
    }, [user]);

    if (!dashboardData) {
        return <div style={styles.loading}>Loading dashboard...</div>;
    }

    const { role, widgets } = dashboardData;

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>
                Welcome, <span style={styles.highlight}>{user?.name || 'User'}</span>!
            </h2>
            <p style={styles.subText}>
                You are logged in as <strong>{role}</strong>.
            </p>

            <div style={styles.cardsContainer}>
                <DashboardCard title="Employee Stats" value={widgets.employeeStats.totalEmployees} />
                <DashboardCard title="Total Products" value={widgets.productInfo.totalProducts} />
            </div>
        </div>
    );
};

const DashboardCard = ({ title, value }) => (
    <div style={styles.card}>
        <h3 style={styles.cardTitle}>{title}</h3>
        <p style={styles.cardValue}>{value}</p>
    </div>
);

const styles = {
    container: {
        padding: '40px',
        fontFamily: 'Segoe UI, sans-serif',
        backgroundColor: '#f4f6f8',
        minHeight: '100vh',
    },
    header: {
        fontSize: '28px',
        marginBottom: '10px',
    },
    highlight: {
        color: '#007bff',
    },
    subText: {
        fontSize: '18px',
        marginBottom: '30px',
        color: '#555',
    },
    cardsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
        padding: '25px 20px',
        minWidth: '220px',
        textAlign: 'center',
        transition: 'transform 0.2s ease',
    },
    cardTitle: {
        fontSize: '20px',
        marginBottom: '12px',
        color: '#333',
    },
    cardValue: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#007bff',
    },
    loading: {
        fontSize: '18px',
        textAlign: 'center',
        padding: '50px',
    },
};

export default Dashboard;
