const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const db = new sqlite3.Database("chat.db");

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from "public"

// Create messages table
db.run(
  "CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, group_id INTEGER, sender TEXT, text TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)"
);

// Save a message
app.post("/save-message", (req, res) => {
  const { group_id, sender, text } = req.body;
  if (!group_id || !sender || !text) {
    return res.status(400).send("Missing required fields");
  }
  const query = "INSERT INTO messages (group_id, sender, text) VALUES (?, ?, ?)";
  db.run(query, [group_id, sender, text], function (err) {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).send("Database error");
    }
    res.status(200).json({ success: true, id: this.lastID });
  });
});

// Fetch messages for a group
app.get("/get-messages/:group_id", (req, res) => {
  const groupId = req.params.group_id;
  db.all(
    "SELECT sender, text, timestamp FROM messages WHERE group_id = ? ORDER BY timestamp ASC",
    [groupId],
    (err, rows) => {
      if (err) {
        return res.status(500).send("Error retrieving messages");
      }
      res.status(200).json(rows);
    }
  );
});

// Start the server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
