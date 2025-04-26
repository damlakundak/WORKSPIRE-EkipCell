const express = require("express");
const router = express.Router();
const db = require("../db/db"); // veritabanı bağlantın


// Bireysel mesaj geçmişi
router.get("/private", async (req, res) => {
  const { user1, user2 } = req.query;

  if (!user1 || !user2) {
    return res.status(400).json({ message: "Eksik kullanıcı bilgisi." });
  }
  console.log("user1:", user1, "user2:", user2);

  try {
    const result = await db.query(
      `SELECT * FROM messages
       WHERE is_private = true AND (
         (username = $1 AND recipient_email = $2) OR
         (username = $2 AND recipient_email = $1)
       )
       ORDER BY timestamp ASC`,
      [user1, user2]
    );
    
    res.json(result.rows);
    
  } catch (err) {
    console.error("Bireysel mesajlar alınamadı:", err);
    res.status(500).json({ message: "Sunucu hatası." });
  }
});

module.exports = router;
