const db = require('../config/db');



exports.createProduct = (req, res) => {
    const { name, sku, price, category, status, enterprise_id } = req.body;

    if (!name || !enterprise_id) {
        return res.status(400).json({ error: 'Product name and enterprise_id are required' });
    }

    db.query(
        `INSERT INTO products 
        (name, sku, price, category, status, enterprise_id) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [name, sku || null, price || 0, category || null, status || null, enterprise_id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({
                id: result.insertId,
                name, sku, price, category, status, enterprise_id
            });
        }
    );
};



exports.getProducts = (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.getProductById = (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!results.length) return res.status(404).json({ error: 'Product not found' });
        res.json(results[0]);
    });
};

exports.updateProduct = (req, res) => {
    const id = req.params.id;
    const {
        name,
        sku,
        price,
        category,
        status,
        enterprise_id
    } = req.body;

    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!results.length) return res.status(404).json({ error: 'Product not found' });

        const product = results[0];

        const updatedProduct = {
            name: name !== undefined ? name : product.name,
            sku: sku !== undefined ? sku : product.sku,
            price: price !== undefined ? price : product.price,
            category: category !== undefined ? category : product.category,
            status: status !== undefined ? status : product.status,
            enterprise_id: enterprise_id !== undefined ? enterprise_id : product.enterprise_id
        };

        db.query(
            `UPDATE products 
             SET name = ?, sku = ?, price = ?, category = ?, status = ?, enterprise_id = ?
             WHERE id = ?`,
            [
                updatedProduct.name,
                updatedProduct.sku,
                updatedProduct.price,
                updatedProduct.category,
                updatedProduct.status,
                updatedProduct.enterprise_id,
                id
            ],
            (updateErr) => {
                if (updateErr) return res.status(500).json({ error: updateErr.message });
                res.json({ message: 'Product updated successfully' });
            }
        );
    });
};

exports.deleteProduct = (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted' });
    });
};
