import * as express from 'express';
import { Database } from '../modules/database';

module Route {

  export class Index {

    public index(req: express.Request, res: express.Response, next: express.NextFunction) {
      res.send('Hello world');
    }


    public login(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        Database.importUser({username: req.body.name, password: req.body.pass})
        .then((usr) =>
        {
            if (usr)
            {
                res.json(true);
            }
            else
            {
                res.json(false);
            }
        });
    }

    public register(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        Database.createNewUser({username: req.body.name, password: req.body.pass})
        .then((isConnected) =>
        {
            res.json(isConnected);
        });
    }

    public highScores(req: express.Request, res: express.Response, next: express.NextFunction): void
    {
        Database.getHighScores()
        .then((highScores) => {
            res.json(highScores);
        });
    }

    public sendHighScore(req: express.Request, res: express.Response, next: express.NextFunction): void
    {
        Database.setHighScores(req.body.name, req.body.pass, JSON.parse(req.body.score), JSON.parse(req.body.isHard))
        .then((isNewHighScore) => {
            console.log(isNewHighScore);
            res.json(isNewHighScore);
        });
    }
  }
}

export = Route;
