const PUBLIC_HTML = __dirname + '/public/html';
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const port = 3000;
const db = new sqlite3.Database(':memory:');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse incoming JSON requests
app.use(bodyParser.json());

// Add verbose logging
app.use(morgan('dev'));

// Initialize database
db.serialize(() => {
    // Create 'tasks' table with columns: id, text, and completed
    db.run("CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, completed INTEGER)");
});

// CRUD operations

// Fetch all tasks
app.get('/tasks', (req, res) => {
    console.log('Fetching all tasks');
    db.all("SELECT * FROM tasks", (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
});

// Add a new task
app.post('/tasks', (req, res) => {
    const { text } = req.body;
    console.log(`Adding new task: ${text}`);
    db.run("INSERT INTO tasks (text, completed) VALUES (?, 0)", [text], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        } else {
            res.json({ id: this.lastID, text, completed: 0 });
        }
    });
});

// Update an existing task
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;
    console.log(`Updating task ${id} with text: ${text} and completed: ${completed}`);
    db.run("UPDATE tasks SET text = ?, completed = ? WHERE id = ?", [text, completed, id], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        } else {
            res.sendStatus(200);
        }
    });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Deleting task ${id}`);
    db.run("DELETE FROM tasks WHERE id = ?", [id], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        } else {
            res.sendStatus(200);
        }
    });
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(PUBLIC_HTML + '/' + 'todolist.html');
});

// Start the server
app.listen(port, () => {
  console.log(`To-do-list app listening at http://localhost:${port}`);
});