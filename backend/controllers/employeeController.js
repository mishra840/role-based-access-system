const db = require('../config/db');

// Get all employees
exports.getEmployees = (req, res) => {
    db.query('SELECT * FROM employees', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Get employee by ID
exports.getEmployeeById = (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM employees WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(results[0]);
    });
};

// Create employee
exports.createEmployee = (req, res) => {
    const { name, department, salary, status, enterprise_id, role_id } = req.body;
    db.query(
        'INSERT INTO employees (name, department, salary, status, enterprise_id, role_id) VALUES (?, ?, ?, ?, ?, ?)',
        [name, department, salary, status || 'Active', enterprise_id, role_id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Employee created', id: result.insertId });
        }
    );
};

// Update employee
exports.updateEmployee = (req, res) => {
    const id = req.params.id;
    const { name, department, salary, status, enterprise_id, role_id } = req.body;
    db.query(
        'UPDATE employees SET name=?, department=?, salary=?, status=?, enterprise_id=?, role_id=? WHERE id=?',
        [name, department, salary, status, enterprise_id, role_id, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
            res.json({ message: 'Employee updated' });
        }
    );
};

// Delete employee
exports.deleteEmployee = (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM employees WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Employee deleted' });
    });
};
