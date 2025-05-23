import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Main from './components/Main';
import './App.css'
import EnterpriseManagement from './components/EnterpriseManagement';

const App = () => {
  const API_BASE_URL = 'http://localhost:5000/api';
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // For showing loader while verifying token

  useEffect(() => {
    const token = localStorage.getItem('token');

    const user = localStorage.getItem('user');
    if (token) {
      fetch(`${API_BASE_URL}/auth/verify-token`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then(res => {
          if (!res.ok) throw new Error('Token invalid');
          return res.json();
        })
        .then(data => {
          console.log('Verify token response:', data);  // <--- Add this
          setUser(data.user);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLoginSuccess = (loggedInUser, token) => {
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  if (loading) {
    return <div>Loading...</div>;  // Or any loading spinner you prefer
  }

  return (
    <Router>
      <nav className="navbar">
        <div className="navbar-left">
          {/* <h2 className="brand">MyCompany</h2> */}
        </div>
        <div className="navbar-right">
          {!user ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          ) : (
            <>
              <Link to="/auth" className="nav-link">Dashboard</Link>
              <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>
            </>
          )}
        </div>
      </nav>


      <Routes>
        <Route path="/" element={<Navigate to={user ? "/auth" : "/login"} />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/auth" /> : <Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/auth" /> : <Register />}
        />
        <Route
          path="/auth"
          element={user ? <Main user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/enterprise"
          element={<EnterpriseManagement user={user} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
