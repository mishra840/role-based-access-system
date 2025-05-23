const db = require('../config/db');

exports.getDashboardData = async (req, res) => {
    const { userId } = req.params;

    try {
        // Get role of user
        const [roleResult] = await db.promise().query(`
            SELECT r.name AS role FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = ?
        `, [userId]);

        if (roleResult.length === 0) return res.status(404).json({ message: 'User not found' });

        const role = roleResult[0].role;
        let data = {};

        if (role === 'Admin') {
            const [empStats] = await db.promise().query('SELECT COUNT(*) as totalEmployees FROM employees');
            const [productInfo] = await db.promise().query('SELECT COUNT(*) as totalProducts FROM products');
            data = {
                role,
                widgets: {
                    employeeStats: empStats[0],
                    productInfo: productInfo[0]
                }
            };
        } else if (role === 'Manager') {
            const [empStats] = await db.promise().query('SELECT COUNT(*) as totalTeamMembers FROM employees WHERE department = "Sales"');
            data = {
                role,
                widgets: {
                    employeeStats: empStats[0]
                }
            };
        } else {
            data = {
                role,
                widgets: {}
            };
        }

        res.json(data);
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
