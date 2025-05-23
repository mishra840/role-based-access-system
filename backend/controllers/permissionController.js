const db = require('../config/db');

exports.createPermission = (req, res) => {
    const { role_id, module_id, can_create, can_read, can_update, can_delete } = req.body;
    if (!role_id || !module_id) return res.status(400).json({ error: 'role_id and module_id required' });

    db.query(
        'INSERT INTO permissions (role_id, module_id, can_create, can_read, can_update, can_delete) VALUES (?, ?, ?, ?, ?, ?)',
        [role_id, module_id, !!can_create, !!can_read, !!can_update, !!can_delete],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: result.insertId });
        }
    );
};

exports.getPermissions = (req, res) => {
    db.query('SELECT * FROM permissions', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.getPermissionById = (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM permissions WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!results.length) return res.status(404).json({ error: 'Permission not found' });
        res.json(results[0]);
    });
};

exports.updatePermission = (req, res) => {
    const id = req.params.id;
    const { can_create, can_read, can_update, can_delete } = req.body;

    db.query(
        'UPDATE permissions SET can_create = ?, can_read = ?, can_update = ?, can_delete = ? WHERE id = ?',
        [!!can_create, !!can_read, !!can_update, !!can_delete, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Permission not found' });
            res.json({ message: 'Permission updated' });
        }
    );
};

exports.deletePermission = (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM permissions WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Permission not found' });
        res.json({ message: 'Permission deleted' });
    });
};
