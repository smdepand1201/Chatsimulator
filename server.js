const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/"))); // Serve static files (HTML, CSS, JS)
app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve images explicitly

// Database setup
const dbPath = path.join('/tmp', 'chat.db'); // Use writable /tmp directory for Render
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database at:", dbPath);
  }
});

// Create the messages table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER,
      sender TEXT,
      text TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default messages if the table is empty
  db.get("SELECT COUNT(*) AS count FROM messages", (err, row) => {
    if (row.count === 0) {
      db.run(`INSERT INTO messages (group_id, sender, text) VALUES (1, 'Alice', 'Welcome to Group 1!')`);
      db.run(`INSERT INTO messages (group_id, sender, text) VALUES (2, 'Bob', 'Welcome to Group 2!')`);
    }
  });
});

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
        console.error("Error saving message:", err.message); // Logs errors
        res.status(500).send("Error saving message.");
      } else {
        console.log(`Message saved: ${text} (ID: ${this.lastID})`); // Logs success
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
const PORT = process.env.PORT || 3000; // Use Render's assigned port or default to 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
