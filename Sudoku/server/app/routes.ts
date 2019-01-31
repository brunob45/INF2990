import * as express from 'express';
import { Database } from './modules/database';
import { Sudoku } from './sudoku';
import { ResponseQueue } from './responseQueue';
import { Queues } from './queues';
import { Sockets } from './sockets';

module Route {

    export class Index {

        constructor()
        {
            Queues.easyResponseQueue = new ResponseQueue(false);
            Queues.hardResponseQueue = new ResponseQueue(true);
        }

        public index(req: express.Request, res: express.Response, next: express.NextFunction): void
        {
            res.end('Hello world');
        }

        public getEasy(req: express.Request, res: express.Response, next: express.NextFunction): void
        {
            Sockets.emit("Sudoku facile demandé par " + req.connection.remoteAddress);
            Queues.easyResponseQueue.push(res, req.connection.remoteAddress);
        }

        public getHard(req: express.Request, res: express.Response, next: express.NextFunction): void
        {
            Sockets.emit("Sudoku difficile demandé par " + req.connection.remoteAddress);
            Queues.hardResponseQueue.push(res, req.connection.remoteAddress);
        }

        public verificationService(req: express.Request, res: express.Response, next: express.NextFunction): void
        {
            Sockets.emit("Vérification de sudoku demandée par " + req.connection.remoteAddress);
            let mySudoku = new Sudoku(req.body.sudoku);
            if (mySudoku.completeTest())
            {
                this.checkHighScore(req, res);
                res.json(true);
            }
            else
            {
                res.json(false);
            }
        }

        public highScores(req: express.Request, res: express.Response, next: express.NextFunction): void
        {
            Database.getHighScores()
            .then((highScores) => {
                res.json(highScores);
            });
        }

        public login(req: express.Request, res: express.Response, next: express.NextFunction): void
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

        public register(req: express.Request, res: express.Response, next: express.NextFunction): void
        {
            Database.createNewUser({username: req.body.name, password: req.body.pass})
            .then((isConnected) =>
            {
                res.json(isConnected);
            });
        }

        private checkHighScore(req: express.Request, res: express.Response): void
        {
            Database.setHighScores(req.body.name, req.body.pass,
                                   JSON.parse(req.body.time), JSON.parse(req.body.isHard));
        }
    }
}

export = Route;
