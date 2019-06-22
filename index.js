const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const dbConfig = require('./db.config.json');
const pool = mysql.createPool({
  connectionLimite: 10,
  host: 'localhost',
  database: 'flood',
  user: dbConfig.user,
  password: dbConfig.password,
});

const app = express();

const whitelist = {
  'flood.js': 'dist/flood.js',
  'flood.lib.js': 'dist/vendors~flood.js',
  'signin.js': '',
  'root.css': '',
  'toc.js': '',
  '': 'index.html',
  'favicon.ico': '',
  'privacy': 'privacy.html',
  'terms': 'terms.html',
};

// app.use('/images', express.static('resources/images'));
for (const key in whitelist) {
  const file = whitelist[key] || key;
  app.get(`/${key}`, (req, res) => res.sendFile(`${__dirname}/${file}`));
}

app.use(bodyParser.json());
app.post('/user/:id/keys', (req, res) => {
  const valuesPlaceholder = Object.keys(req.body).map(() =>
      '(?, ?, ?, ?)').join(',');
  const values = Object.keys(req.body).reduce((arr, action) => {
    arr.push(
      req.params.id,
      action,
      req.body[action][0].trim() || null,
      req.body[action][1].trim() || null);
    return arr;
  }, []);
  pool.query(`replace into keybindings (id, action, binding1, binding2)
      values ${valuesPlaceholder}`, values, (err) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
  });
});
app.get('/user/:id/keys', (req, res) => {
  pool.query('select action, binding1, binding2 from keybindings where id = ?',
      req.params.id, (err, results) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
    const body = results.reduce((obj, row) => {
      obj[row.action] = [row.binding1 || '', row.binding2 || ''];
      return obj;
    }, {});
    res.status(200).send(body);
  });
});

app.listen(3001, () => console.log('Server running on port 3001'));
