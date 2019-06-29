import express from 'express';
import * as bodyParser from 'body-parser';
import * as mysql from 'mysql';
import dbConfig from './db.config.json';
import * as keybindings from './keybindings';
import * as options from './options';

export function apply(root: string) {
  const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    database: 'flood',
    user: dbConfig.user,
    password: dbConfig.password,
  });

  const app = express();

  const whitelist: {[uri: string]: string} = {
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
    app.get(`/${key}`, (_: express.Request, res: express.Response) =>
        res.sendFile(`${root}/${file}`));
  }

  app.use(bodyParser.json());
  keybindings.apply(app, pool);
  options.apply(app, pool);


  app.listen(3001, () => console.log('Server running on port 3001'));
}
