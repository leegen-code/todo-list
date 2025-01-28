const PUBLIC_HTML = __dirname + '/public/html';

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(PUBLIC_HTML + '/' + 'todolist.html');
});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`To-do-list app listening at http://localhost:${port}`);
});