import * as express from 'express';
import { Database } from './modules/database';
import { GameList } from './modules/gameList';

module Route {

    export class Index {

        public index(req: express.Request, res: express.Response, next: express.NextFunction) {
            res.send('Hello world');
        }

        public login(req: express.Request, res: express.Response, next: express.NextFunction): void
        {
            Database.importUser({username: req.body.name, password: req.body.pass})
            .then((usr) =>
            {
                if (usr)
                {
                    if (GameList.playerExist(usr.getName()))
                    {
                        res.json(false);
                    }
                    else
                    {
                        res.json(true);
                    }
                }
                else
                {
                    res.json(false);
                }
            });
        }

        public register(req: express.Request, res: express.Response, next: express.NextFunction): void
        {
            Database.createNewUser({username: req.body.name, password: req.body.pass})
            .then((isConnected) =>
            {
                res.json(isConnected);
            });
        }
    }
}

export = Route;
