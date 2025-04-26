// backend/routes/login.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query(
      "SELECT employee_id, email, password, department, manager_id FROM employees WHERE email = $1", 
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Kullanıcı bulunamadı" });
    }

    const user = userResult.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Geçersiz şifre" });
    }

    const token = jwt.sign({ email: user.email }, "mysecretkey", { expiresIn: "1h" });

    res.json({ 
      token, 
      email: user.email, 
      department: user.department, 
      employee_id: user.employee_id,
      manager_id: user.manager_id
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

module.exports = router;
