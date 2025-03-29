const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const pool = require("./db/db");
const employeeRoutes = require("./routes/employees");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/employees", employeeRoutes);

// ======================= SOCKET.IO ============================
io.on("connection", (socket) => {
  console.log("🔌 Yeni kullanıcı bağlandı");

  socket.on("sendMessage", async (data) => {
    const { username, content, department, recipient_email, is_private } = data;
    const timestamp = new Date();

    console.log(">> Gelen mesaj:", data);

    try {
      await pool.query(
        `INSERT INTO messages (username, content, timestamp, department, recipient_email, is_private)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [username, content, timestamp, department, recipient_email, is_private]
      );

      io.emit("receiveMessage", { username, content, timestamp, department, recipient_email, is_private });
    } catch (err) {
      console.error("Mesaj kaydedilemedi:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Kullanıcı ayrıldı");
  });
});

// ======================= LOGIN ============================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query(
      "SELECT employee_id, email, password, department, manager_id FROM employees WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Kullanıcı bulunamadı." });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Şifre yanlış." });
    }

    const token = jwt.sign(
      { employee_id: user.employee_id, manager_id: user.manager_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      email: user.email,
      department: user.department,
      employee_id: user.employee_id,
      manager_id: user.manager_id,
    });
  } catch (err) {
    console.error("Login hatası:", err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// ======================= GET REQUESTLER ============================
app.get("/", (req, res) => {
  res.send("Todo + Chat API çalışıyor 🚀");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "API is running" });
});

app.get("/employees", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        employee_id AS id, 
        name, 
        email, 
        department, 
        phone_number, 
        photo_url, 
        CASE WHEN manager_id = 1 THEN 'Manager' ELSE department END AS role
      FROM employees
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Veriler getirilemedi:", err.message);
    res.status(500).json({ message: "Veriler getirilemedi!" });
  }
});

app.get("/employees/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const userResult = await pool.query("SELECT department FROM employees WHERE email = $1", [email]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı!" });
    }

    const userDepartment = userResult.rows[0].department;
    const result = await pool.query(
      "SELECT employee_id, name, manager_id, department, phone_number, photo_url FROM employees WHERE department = $1",
      [userDepartment]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Departman çalışanları getirilemedi:", err.message);
    res.status(500).json({ message: "Veriler getirilemedi!" });
  }
});

app.get("/assigned-tasks/:employeeId", async (req, res) => {
  const { employeeId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM assigned_tasks WHERE employee_id = $1",
      [employeeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Atanmış görev yok." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Atanan görevler getirilemedi:", error.message);
    res.status(500).json({ message: "Sunucu hatası." });
  }
});

app.get("/api/messages", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM messages ORDER BY timestamp ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Mesajlar alınamadı:", err.message);
    res.status(500).json({ error: "Mesajlar yüklenemedi" });
  }
});



// ======================= TODO CRUD ============================
app.get("/api/todos/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("ToDo getirme hatası:", err.message);
    res.status(500).json({ error: "Veriler alınamadı." });
  }
});

app.post("/api/todos", async (req, res) => {
  const { user_id, title, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO todos (user_id, title, description) VALUES ($1, $2, $3) RETURNING *",
      [user_id, title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Görev eklenemedi:", err.message);
    res.status(500).json({ error: "Görev eklenemedi." });
  }
});

app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { is_completed } = req.body;
  try {
    const result = await pool.query(
      "UPDATE todos SET is_completed = $1 WHERE todo_id = $2 RETURNING *",
      [is_completed, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Güncelleme başarısız:", err.message);
    res.status(500).json({ error: "Güncelleme başarısız." });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM todos WHERE todo_id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error("Silme başarısız:", err.message);
    res.status(500).json({ error: "Silme başarısız." });
  }
});

// ======================= SUNUCUYU BAŞLAT ============================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} numaralı portta çalışıyor`);
});
