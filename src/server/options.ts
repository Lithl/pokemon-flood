import express from 'express';
import * as mysql from 'mysql';
import { Optional } from '../util';

export function apply(app: express.Application, pool: mysql.Pool) {
  /**
   * POST to /user/:id/options to save game options
   * body = {
   *   text_speed: 'Normal',
   *   battle_effect: 'On',
   *   ...
   * }
   */
  app.post('/user/:id/options',
    (req: express.Request, res: express.Response) => {
      const values = [
        req.params.id,
        req.body.text_speed,
        req.body.battle_effects,
        req.body.battle_style,
        Number(req.body.music_volume),
        Number(req.body.effect_volume),
        Number(req.body.pokemon_cries),
      ];
      pool.query(`replace into options
          (
            id,
            text_speed,
            battle_effects,
            battle_style,
            music_volume,
            effect_volume,
            pokemon_cries
          )
          (
            select ?, ts.id, be.id, bs.id, mv.id, ev.id, pc.id
            from options
            inner join text_speed_values ts on ts.name=?
            inner join battle_effects_values be on be.name=?
            inner join battle_style_values bs on bs.name=?
            inner join music_volume_values mv on mv.value=?
            inner join effect_volume_values ev on ev.value=?
            inner join pokemon_cries_values pc on pc.value=?
          )`, values, (err) => {
        if (err) {
          console.error(err);
          res.sendStatus(500);
          return;
        }
        res.sendStatus(200);
      });
  });

  /**
   * GET from /user/:id/options to load game options
   * response = {
   *   text_speed: 'Normal',
   *   battle_effects: 'On',
   *   ...
   * }
   */
  app.get('/user/:id/options',
    (req: express.Request, res: express.Response) => {
      type optionRow = {
        text_speed: string,
        battle_effects: string,
        battle_style: string,
        music_volume: string,
        effect_volume: string,
        pokemon_cries: string,
      };
      pool.query(`select
          ts.name as text_speed,
          be.name as battle_effects,
          bs.name as battle_style,
          mv.value as music_volume,
          ev.value as effect_volume,
          pc.value as pokemon_cries
        from options o
          inner join text_speed_values ts on o.text_speed=ts.id
          inner join battle_effects_values be on o.battle_effects=be.id
          inner join battle_style_values bs on o.battle_style=bs.id
          inner join music_volume_values mv on o.music_volume=mv.id
          inner join effect_volume_values ev on o.effect_volume=ev.id
          inner join pokemon_cries_values pc on o.pokemon_cries=pc.id
        where o.id = ?`,
        req.params.id,
        (err, results: optionRow[]) => {
          if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
          }
          let body: Optional<optionRow>;
          if (results.length) {
            body = results[0];
          }
          res.status(200).send(body || {});
        });
  });
}
