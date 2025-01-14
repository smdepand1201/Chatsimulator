const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/"))); // Serve static files (HTML, CSS, JS)

// Database setup
const db = new sqlite3.Database("chat.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create the messages table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER,
    sender TEXT,
    text TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`
);

// API to get messages for a group
app.get("/get-messages/:group_id", (req, res) => {
  const groupId = req.params.group_id;

  db.all("SELECT * FROM messages WHERE group_id = ?", [groupId], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error retrieving messages.");
    } else {
      res.json(rows);
    }
  });
});

// API to save a message
app.post("/save-message", (req, res) => {
  const { group_id, sender, text } = req.body;

  db.run(
    "INSERT INTO messages (group_id, sender, text) VALUES (?, ?, ?)",
    [group_id, sender, text],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send("Error saving message.");
      } else {
        res.json({ id: this.lastID });
      }
    }
  );
});

// Serve the chat interface (chatsimulator.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "chatsimulator.html"));
});

// Start the server on the Render-assigned port
const PORT = process.env.PORT || 3000; // Use the Render-assigned port or default to 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
