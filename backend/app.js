const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes')
const userRoutes = require('./routes/userRoutes');

const moduleRoutes = require('./routes/moduleRoutes');
const permissionRoutes = require('./routes/permissionRoutes');

const enterpriseRoutes = require('./routes/enterpriseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const productRoutes = require('./routes/productRoutes');
const employeeRoutes = require('./routes/employeeRoutes')



require('dotenv').config();

const app = express();



app.use(express.json()); // Parse JSON request bodies

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // allow requests from frontend
    credentials: true // if you're sending cookies or auth headers
}));

// Mount auth routes at /api/auth
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

app.use('/api/modules', moduleRoutes);
app.use('/api/permissions', permissionRoutes);

app.use('/api/enterprises', enterpriseRoutes);

app.use('/api/products', productRoutes);
app.use('/api/employees', employeeRoutes)



// Basic root route for sanity check
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});