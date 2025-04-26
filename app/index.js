const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const pool = require("./db/db");
const employeeRoutes = require("./routes/employees");
const messagesRoutes = require("./routes/messages");

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
app.use("/api/messages", messagesRoutes);

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
// ======================= GÖREV TAMAMLAMA ============================
app.put('/complete-task/:taskId', async (req, res) => {
  const { taskId } = req.params;

  try {
    const result = await pool.query(
      `UPDATE assigned_tasks 
       SET is_completed = true, completed_at = NOW()
       WHERE task_id = $1
       RETURNING *;`,
      [taskId]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Görev başarıyla tamamlandı.', task: result.rows[0] });
    } else {
      res.status(404).json({ message: 'Görev bulunamadı.' });
    }
  } catch (error) {
    console.error('Görev tamamlama hatası:', error.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});



// Şirket Puan Sıralaması - Tüm çalışanlar (Yöneticiler hariç)
app.get('/scores/company', async (req, res) => {
  try {
      const result = await pool.query(`
          SELECT employees.employee_id, employees.name, employees.photo_url, scores.total_score
          FROM scores
          JOIN employees ON scores.employee_id = employees.employee_id
          WHERE employees.manager_id IS NOT NULL  -- Eğer Manager olarak ayırıyorsan
          ORDER BY scores.total_score DESC;

      `);

      res.json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
});

// Ekip Puan Sıralaması - Aynı ekipteki çalışanlar
app.get('/scores/team/:manager_id', async (req, res) => {
  const { manager_id } = req.params;

  if (isNaN(manager_id)) {
    return res.status(400).json({ message: 'Geçersiz manager_id!' });
  }

  try {
      const result = await pool.query(`
          SELECT employees.employee_id, employees.name, employees.photo_url, scores.total_score
          FROM scores
          JOIN employees ON scores.employee_id = employees.employee_id
          WHERE employees.manager_id = $1
          ORDER BY scores.total_score DESC;
      `, [manager_id]);

      res.json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).send('Sunucu hatası');
  }
});

// -------------------- POMODORO: Çalışma Süresi Ekleme ------------------------
app.post("/api/pomodoro/complete", async (req, res) => {
  const { employee_id, minutes } = req.body;

  try {
    const result = await pool.query(`
      INSERT INTO work_sessions (employee_id, minutes)
      VALUES ($1, $2)
      ON CONFLICT (employee_id)
      DO UPDATE SET minutes = work_sessions.minutes + EXCLUDED.minutes
      RETURNING *
    `, [employee_id, minutes]);

    console.log("Database güncellemesi başarılı:", result.rows[0]);
    res.json({ success: true, message: "Pomodoro kaydedildi.", data: result.rows[0] });
  } catch (error) {
    console.error("Pomodoro kaydetme hatası:", error.message);
    res.status(500).json({ success: false, message: "Sunucu hatası." });
  }
});

// -------------------- POMODORO: Departman Skoru Çekme ------------------------
app.get("/api/pomodoro/scoreboard/:department", async (req, res) => {
  const { department } = req.params;

  try {
    const result = await pool.query(`
      SELECT e.employee_id, e.name, e.department, COALESCE(w.minutes, 0) AS minutes
      FROM employees e
      LEFT JOIN work_sessions w ON e.employee_id = w.employee_id
      WHERE e.department = $1
      ORDER BY minutes DESC;
    `, [department]);

    console.log("Departman Skoru Başarıyla Çekildi.");
    res.json(result.rows);
  } catch (err) {
    console.error("Scoreboard hatası:", err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});




// ======================= SUNUCUYU BAŞLAT ============================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} numaralı portta çalışıyor`);
});
