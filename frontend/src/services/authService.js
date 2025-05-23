// src/services/authService.js

const API_BASE_URL = 'http://localhost:5000/api';

export async function login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    console.log('res', response.body)
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
    }

    return response.json(); // should return { token, user }
}

export async function register(user) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
    }

    return response.json();
}

export function logout() {
    localStorage.removeItem('token');
}

export function isAuthenticated() {
    return !!localStorage.getItem('token');
}

export default { login, logout, register, isAuthenticated }