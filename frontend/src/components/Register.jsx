// import React, { useState } from 'react';
// import authService from '../services/authService';
// import { useNavigate } from 'react-router-dom';

// import '../css/AuthForm.css'

// const Register = () => {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');
//         try {
//             await authService.register({ name, email, password });
//             setSuccess('Registration successful. Redirecting to login...');
//             setTimeout(() => navigate('/login'), 2000); // redirect after 2s
//         } catch (err) {
//             setError(err.message || 'Registration failed');
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <h2>Register</h2>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             {success && <p style={{ color: 'green' }}>{success}</p>}
//             <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
//             <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
//             <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
//             <button type="submit">Register</button>
//         </form>
//     );
// };

// export default Register;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import '../css/AuthForm.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await authService.register({ name, email, password });
            setSuccess('Registration successful. Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2> Register</h2>
                {error && <p className="error-msg">{error}</p>}
                {success && <p className="success-msg">{success}</p>}
                <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
