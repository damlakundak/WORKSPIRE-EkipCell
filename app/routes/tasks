// backend/app.js

const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('../db/db');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const employeeRoutes = require('./routes/employees');
const taskRoutes = require('./routes/tasks');

app.use('/employees', employeeRoutes);
app.use('/tasks', taskRoutes);

// Server Başlatma
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} numaralı portta çalışıyor.`);
});
