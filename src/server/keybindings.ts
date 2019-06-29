import express from 'express';
import * as mysql from 'mysql';

export function apply(app: express.Application, pool: mysql.Pool) {
  /**
   * POST to /user/:id/keys to save keybindings
   * body = {
   *   CONFIRM: ['Space', 'Enter'],
   *   CANCEL: ['Escape', ' '],
   *   ...
   * }
   *
   * Empty strings (or strings of only whitespace characters) will be stored in
   * the database as NULL.
   */
  app.post('/user/:id/keys', (req: express.Request, res: express.Response) => {
    const valuesPlaceholder = Object.keys(req.body).map(() =>
      '(?, ?, ?, ?)').join(',');
    const values = Object.keys(req.body).reduce((arr, action) => {
      arr.push(
          req.params.id,
          action,
          // tslint:disable-next-line:no-null-keyword
          req.body[action][0].trim() || null,
          // tslint:disable-next-line:no-null-keyword
          req.body[action][1].trim() || null);
      return arr;
    }, [] as string[]);
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

  /**
   * GET from /user/:id/keys to load keybindings
   * response = {
   *   CONFIRM: ['Space', 'Enter'],
   *   CANCEL: ['Escape', ''],
   *   ...
   * }
   *
   * NULL entires in the database will be returned as empty strings
   */
  app.get('/user/:id/keys', (req: express.Request, res: express.Response) => {
    type keybindRow = {action: string, binding1: string, binding2: string};
    pool.query(`select action, binding1, binding2
        from keybindings where id = ?`,
      req.params.id, (err, results: keybindRow[]) => {
        if (err) {
          console.error(err);
          res.sendStatus(500);
          return;
        }
        const body = results.reduce((obj, row) => {
          obj[row.action] = [row.binding1 || '', row.binding2 || ''];
          return obj;
        }, {} as {[action: string]: [string, string]});
        res.status(200).send(body);
      });
  });
}
