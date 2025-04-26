const express = require('express');
const router = express.Router();
const pool = require('../db');

// Görev Atama Route
router.post('/', async (req, res) => {
    const { employee_id, manager_id, task_name, task_description, deadline, score } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO assigned_tasks (employee_id, manager_id, task_name, task_description, deadline, score)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [employee_id, manager_id, task_name, task_description, deadline, score]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Görev atanamadı:', error.message);
        res.status(500).json({ message: 'Görev atanamadı!' });
    }
});

module.exports = router;
