const PUBLIC_HTML = __dirname + '/public/html';
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const port = 3000;
const db = new sqlite3.Database(':memory:');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(morgan('dev')); // Add verbose logging

// Initialize database
db.serialize(() => {
    db.run("CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, completed INTEGER)");
});

// CRUD operations
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

app.get('/', (req, res) => {
  res.sendFile(PUBLIC_HTML + '/' + 'todolist.html');
});

app.listen(port, () => {
  console.log(`To-do-list app listening at http://localhost:${port}`);
});