const db = require('../config/db');

// Create Enterprise
exports.createEnterprise = (req, res) => {
    const { name, location, contact_info } = req.body;
    if (!name) return res.status(400).json({ error: 'Enterprise name is required' });

    db.query(
        'INSERT INTO enterprises (name, location, contact_info) VALUES (?, ?, ?)',
        [name, location || '', contact_info || ''],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: result.insertId, name, location, contact_info });
        }
    );
};

// Get All Enterprises
exports.getEnterprises = (req, res) => {
    db.query('SELECT * FROM enterprises', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Get Enterprise by ID
exports.getEnterpriseById = (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM enterprises WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!results.length) return res.status(404).json({ error: 'Enterprise not found' });
        res.json(results[0]);
    });
};

// Update Enterprise
exports.updateEnterprise = (req, res) => {
    const id = req.params.id;
    const { name, location, contact_info } = req.body;
    if (!name) return res.status(400).json({ error: 'Enterprise name is required' });

    db.query(
        'UPDATE enterprises SET name = ?, location = ?, contact_info = ? WHERE id = ?',
        [name, location || '', contact_info || '', id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Enterprise not found' });
            res.json({ message: 'Enterprise updated' });
        }
    );
};

// Delete Enterprise
exports.deleteEnterprise = (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM enterprises WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Enterprise not found' });
        res.json({ message: 'Enterprise deleted' });
    });
};
