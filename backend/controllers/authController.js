const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const db = require('../config/db')
require('dotenv').config();

const generateToken = (user) => {
    return jwt.sign({ id: user.id, role_id: user.role_id }, process.env.JWT_SECRET, { expiresIn: 'id' })
}

// exports.register = (req, res) => {
//     const { name, email, password, role_id, enterprise_id } = req.body
//     // Hash password
//     const hashedPassword = bcrypt.hashSync(password, 10);


//     console.log(hashedPassword)
//     //Insert user into DB

//     db.query('INSERT INTO users (name, email, password, role_id, enterprise_id) VALUES (?,?,?,?,?)', [name, email, hashedPassword, role_id, enterprise_id],

//         (err, result) => {
//             if (err) {
//                 if (err.code === 'ER_DUP_ENTRY') {
//                     return res.status(400).json({ message: 'Email already registered' });
//                 }
//                 return res.status(500).json({ error: err.message });
//             }
//             res.json({ message: 'User registered successfully' });


//         }

//     )

// }

exports.register = (req, res) => {
    let { name, email, password, role_id, enterprise_id } = req.body;

    // Set default values if not provided
    role_id = role_id || 2; // Default role: User
    enterprise_id = enterprise_id || 1; // Default enterprise

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    console.log(hashedPassword);

    // Insert user into DB
    db.query(
        'INSERT INTO users (name, email, password, role_id, enterprise_id) VALUES (?,?,?,?,?)',
        [name, email, hashedPassword, role_id, enterprise_id],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Email already registered' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'User registered successfully' });
        }
    );
};



exports.login = (req, res) => {
    const { email, password } = req.body

    if (!email && !password) {
        return res.status(400).json({ error: "Email and Password are required" })
    }

    db.query('SELECT * FROM users WHERE email=? ', [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            // User not found
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];


        // Check if account is locked
        if (user.account_locked) {
            return res.status(403).json({ error: 'Account is locked' });
        }

        // Compare password with hashed password
        const passwordMatch = bcrypt.compareSync(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, role_id: user.role_id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        console.log(token)
        res.json({

            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role_id: user.role_id,
                enterprise_id: user.enterprise_id,
            },

        })


    }
    )


}

exports.logout = (req, res) => {
    res.json({ message: 'Logout successful' });
};

exports.verifyToken = (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        const userId = decoded.id;

        db.query('SELECT id, name, email, role_id FROM users WHERE id = ?', [userId], (err, results) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (results.length === 0) return res.status(404).json({ error: 'User not found' });

            const user = results[0];

            // ✅ Return full user object
            res.status(200).json({
                message: 'Token is valid',
                user
            });
        });
    });
};



