const express = require('express');

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

app.listen(3001, () => console.log('Server running on port 3001'));

