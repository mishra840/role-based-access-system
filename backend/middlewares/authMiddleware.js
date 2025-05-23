
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
