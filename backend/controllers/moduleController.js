const db = require('../config/db');

exports.createModule = (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Module name required' });

    db.query('INSERT INTO modules (name) VALUES (?)', [name], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, name });
    });
};

exports.getModules = (req, res) => {
    db.query('SELECT * FROM modules', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.getModuleById = (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM modules WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!results.length) return res.status(404).json({ error: 'Module not found' });
        res.json(results[0]);
    });
};

exports.updateModule = (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Module name required' });

    db.query('UPDATE modules SET name = ? WHERE id = ?', [name, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Module not found' });
        res.json({ message: 'Module updated' });
    });
};

exports.deleteModule = (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM modules WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Module not found' });
        res.json({ message: 'Module deleted' });
    });
};


// // Assign modules to an existing user
// exports.assignModulesToUser = (req, res) => {
//     const userId = req.params.id;
//     const { modules } = req.body;  // expecting modules as an array of module names

//     if (!Array.isArray(modules) || modules.length === 0) {
//         return res.status(400).json({ error: 'Modules array is required' });
//     }

//     // First, get module IDs from module names
//     const placeholders = modules.map(() => '?').join(', ');
//     const getModulesSql = `SELECT id FROM modules WHERE name IN (${placeholders})`;

//     db.query(getModulesSql, modules, (err, moduleResults) => {
//         if (err) return res.status(500).json({ error: err.message });

//         if (moduleResults.length === 0) {
//             return res.status(400).json({ error: 'No valid modules found' });
//         }

//         const userModules = moduleResults.map(mod => [userId, mod.id]);

//         // First, delete existing user_modules for this user to avoid duplicates
//         db.query('DELETE FROM user_modules WHERE user_id = ?', [userId], (err) => {
//             if (err) return res.status(500).json({ error: err.message });

//             // Insert new user_modules
//             const insertUserModulesSql = `INSERT INTO user_modules (user_id, module_id) VALUES ?`;

//             db.query(insertUserModulesSql, [userModules], (err) => {
//                 if (err) return res.status(500).json({ error: err.message });

//                 res.json({ message: 'Modules assigned successfully to user' });
//             });
//         });
//     });
// };

