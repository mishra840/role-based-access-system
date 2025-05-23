// const jwt = require('jsonwebtoken');
// const db = require('../config/db');
// const { verifyToken } = require('../controllers/authController');



// exports.verifyToken = (req, res) => {
//     const authHeader = req.headers['authorization'];
//     console.log('verify')
//     if (!authHeader) return res.status(401).json({ error: 'No token provided' });

//     const token = authHeader.split(' ')[1];
//     if (!token) return res.status(401).json({ error: 'No token provided' });

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) return res.status(401).json({ error: 'Invalid token' });

//         const userId = decoded.id;
//         console.log(userId)

//         db.query('SELECT id, name,role_id FROM users WHERE id = ?', [userId], (err, results) => {
//             if (err) return res.status(500).json({ error: 'Database error' });
//             if (results.length === 0) return res.status(404).json({ error: 'User not found' });

//             const user = results[0];
//             // ✅ This is the key fix:
//             return res.status(200).json({
//                 message: 'Token is valid',
//                 user: user  // <--- Include user info here
//             });
//         });
//     });
// };


// module.exports = verifyToken;
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

// Authenticate JWT token
exports.authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, secret, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Authorize based on role id (Admin = role_id 1)
exports.authorizeAdmin = (req, res, next) => {
    if (req.user.role_id !== 1) return res.status(403).json({ error: 'Access denied. Admins only.' });
    next();
};

// Optionally check if user is admin or accessing own resource
exports.authorizeAdminOrSelf = (req, res, next) => {
    if (req.user.role_id === 1 || req.user.id == req.params.id) return next();
    return res.status(403).json({ error: 'Access denied.' });
};
