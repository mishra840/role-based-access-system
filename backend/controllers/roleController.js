const db = require('../config/db');

// Create a role
exports.createRole = (req, res) => {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Invalid role name' });
    }

    db.execute('INSERT INTO roles (name) VALUES (?)', [name], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, name });
    });
};

// Get all roles
exports.getRoles = (req, res) => {
    db.execute('SELECT * FROM roles', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
};

// Update a role
exports.updateRole = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Invalid role name' });
    }

    db.execute('UPDATE roles SET name = ? WHERE id = ?', [name, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Role not found' });
        }

        res.status(200).json({ message: 'Role updated successfully' });
    });
};

// Delete a role
exports.deleteRole = (req, res) => {
    const { id } = req.params;

    db.execute('DELETE FROM roles WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Role not found' });
        }

        res.status(200).json({ message: 'Role deleted successfully' });
    });
};
