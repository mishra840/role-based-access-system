// const db = require('../config/db');
// const bcrypt = require('bcryptjs');

// // Get all users (admin only)
// exports.getUsers = (req, res) => {
//     db.query('SELECT id, name, email, role_id, enterprise_id FROM users', (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(results);
//     });
// };

// // Get user by ID (admin or user themselves)
// exports.getUserById = (req, res) => {
//     const userId = req.params.id;

//     // Allow only if admin or requesting own data
//     if (req.user.role_id !== 1 && req.user.id != userId) {
//         return res.status(403).json({ error: 'Access denied' });
//     }

//     db.query('SELECT id, name, email, role_id, enterprise_id FROM users WHERE id = ?', [userId], (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         if (results.length === 0) return res.status(404).json({ error: 'User not found' });
//         res.json(results[0]);
//     });
// };

// // Update user (admin or user themselves)
// exports.updateUser = (req, res) => {
//     const userId = req.params.id;
//     const { name, email, password, role_id, enterprise_id } = req.body;

//     // Only admin or user themselves can update
//     if (req.user.role_id !== 1 && req.user.id != userId) {
//         return res.status(403).json({ error: 'Access denied' });
//     }

//     let updateFields = [];
//     let params = [];

//     if (name) {
//         updateFields.push('name = ?');
//         params.push(name);
//     }
//     if (email) {
//         updateFields.push('email = ?');
//         params.push(email);
//     }
//     if (password) {
//         const hashedPassword = bcrypt.hashSync(password, 10);
//         updateFields.push('password = ?');
//         params.push(hashedPassword);
//     }
//     if (req.user.role_id === 1) {
//         // Only admin can update role and enterprise
//         if (role_id) {
//             updateFields.push('role_id = ?');
//             params.push(role_id);
//         }
//         if (enterprise_id) {
//             updateFields.push('enterprise_id = ?');
//             params.push(enterprise_id);
//         }
//     }

//     if (updateFields.length === 0) {
//         return res.status(400).json({ error: 'No fields to update' });
//     }

//     params.push(userId);

//     const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;

//     db.query(sql, params, (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });
//         if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
//         res.json({ message: 'User updated successfully' });
//     });
// };

// // Delete user (admin only)
// exports.deleteUser = (req, res) => {
//     const userId = req.params.id;

//     if (req.user.role_id !== 1) {
//         return res.status(403).json({ error: 'Access denied' });
//     }

//     db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });
//         if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
//         res.json({ message: 'User deleted successfully' });
//     });
// };


const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { getModules } = require('./moduleController');

// Get all users - Admin only
exports.getUsers = (req, res) => {
    db.query('SELECT id, name, email, role_id, enterprise_id FROM users', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Get single user by ID - Admin or Self
exports.getUserById = (req, res) => {
    const userId = req.params.id;
    db.query('SELECT id, name, email, role_id, enterprise_id FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(results[0]);
    });
};

// // Create new user - Admin only
// exports.createUser = async (req, res) => {
//     const { name, email, password, role_id, enterprise_id } = req.body;
//     if (!name || !email || !password || !role_id) return res.status(400).json({ error: 'Missing required fields' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const sql = `INSERT INTO users (name, email, password, role_id, enterprise_id) VALUES (?, ?, ?, ?, ?)`;
//     db.query(sql, [name, email, hashedPassword, role_id, enterprise_id], (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.status(201).json({ message: 'User created successfully', userId: result.insertId });
//     });
// };
exports.createUser = async (req, res) => {
    const { name, email, password, role_id, enterprise_id, modules } = req.body;

    if (!name || !email || !password || !role_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const userSql = `INSERT INTO users (name, email, password, role_id, enterprise_id) VALUES (?, ?, ?, ?, ?)`;
        db.query(userSql, [name, email, hashedPassword, role_id, enterprise_id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            const userId = result.insertId;

            // If modules were sent, insert into user_modules
            if (modules && Array.isArray(modules) && modules.length > 0) {
                // First get module ids from names
                const placeholders = modules.map(() => '?').join(', ');
                const getModulesSql = `SELECT id FROM modules WHERE name IN (${placeholders})`;

                db.query(getModulesSql, modules, (err, moduleResults) => {
                    if (err) return res.status(500).json({ error: err.message });

                    if (moduleResults.length === 0) {
                        return res.status(400).json({ error: 'No valid modules found' });
                    }

                    const userModules = moduleResults.map(mod => [userId, mod.id]);
                    const insertUserModulesSql = `INSERT INTO user_modules (user_id, module_id) VALUES ?`;

                    db.query(insertUserModulesSql, [userModules], (err) => {
                        if (err) return res.status(500).json({ error: err.message });

                        res.status(201).json({
                            message: 'User created and modules assigned successfully',
                            userId
                        });
                    });
                });
            } else {
                res.status(201).json({ message: 'User created successfully (no modules)', userId });
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Update user - Admin or Self
exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { name, email, password, role_id, enterprise_id } = req.body;

    // Prepare update fields
    let updateFields = [];
    let params = [];

    if (name) { updateFields.push('name = ?'); params.push(name); }
    if (email) { updateFields.push('email = ?'); params.push(email); }
    if (password) {
        const hashed = await bcrypt.hash(password, 10);
        updateFields.push('password = ?');
        params.push(hashed);
    }

    // Only Admin can update role and enterprise
    if (req.user.role_id === 1) {
        if (role_id) { updateFields.push('role_id = ?'); params.push(role_id); }
        if (enterprise_id) { updateFields.push('enterprise_id = ?'); params.push(enterprise_id); }
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(userId);
    const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User updated successfully' });
    });
};

// Delete user - Admin only
exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    });
};
// Get current logged-in user info
exports.getCurrentUser = (req, res) => {
    const userId = req.user.id; // from JWT (authenticate middleware)

    db.query(
        'SELECT id, name, email, role_id, enterprise_id FROM users WHERE id = ?',
        [userId],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ error: 'User not found' });
            res.json(results[0]);
        }
    );
};

// // Get current logged-in user info with assigned modules
// exports.getCurrentUser = (req, res) => {
//     const userId = req.user.id; // from JWT middleware

//     // First, get user info
//     const userQuery = 'SELECT id, name, email, role_id, enterprise_id FROM users WHERE id = ?';

//     // Then, get assigned modules for that user
//     const modulesQuery = `
//     SELECT m.name FROM user_modules um
//     JOIN modules m ON um.module_id = m.id
//     WHERE um.user_id = ?
//   `;

//     db.query(userQuery, [userId], (err, userResults) => {
//         if (err) return res.status(500).json({ error: err.message });
//         if (userResults.length === 0) return res.status(404).json({ error: 'User not found' });

//         const user = userResults[0];

//         db.query(modulesQuery, [userId], (err, modulesResults) => {
//             if (err) return res.status(500).json({ error: err.message });

//             // Map module names into an array
//             const modules = modulesResults.map(row => row.name);

//             // Add modules array to user object
//             user.modules = modules;

//             res.json(user);
//         });
//     });
// };



// New function to assign modules to user with token verification inside controller
exports.assignModulesToUser = (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        const userId = decoded.id;
        const { modules } = req.body;

        if (!modules || !Array.isArray(modules) || modules.length === 0) {
            return res.status(400).json({ error: 'Modules array is required' });
        }

        const placeholders = modules.map(() => '?').join(', ');
        const getModulesSql = `SELECT id FROM modules WHERE name IN (${placeholders})`;

        db.query(getModulesSql, modules, (err, moduleResults) => {
            if (err) return res.status(500).json({ error: err.message });

            if (moduleResults.length === 0) {
                return res.status(400).json({ error: 'No valid modules found' });
            }

            const values = moduleResults.map((mod) => [userId, mod.id]);

            const insertSql = `
        INSERT IGNORE INTO user_modules (user_id, module_id)
        VALUES ?
      `;

            db.query(insertSql, [values], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });

                res.json({
                    message: 'Modules assigned successfully',
                    assignedModules: values.map(([uid, mid]) => ({ user_id: uid, module_id: mid }))
                });
            });
        });
    });
};

exports.getUserModules = (req, res) => {
    const userId = parseInt(req.params.userId);

    // assuming req.user is set by your auth middleware after token verification
    if (req.user.id !== userId && req.user.role_id !== 1) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const sql = `
    SELECT m.id, m.name 
    FROM modules m
    JOIN user_modules um ON m.id = um.module_id
    WHERE um.user_id = ?
  `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('DB error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ modules: results });
    });
};
