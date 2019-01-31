/**
 * app.ts - Configures an Express application.
 *
 * @authors Nicolas Richard, Emilio Riviera
 * @date 2017/01/09
 */

import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import * as indexRoute from './routes';

import { SudokuQueue } from './sudokuQueue';
import { Queues } from './queues';

export class Application {



  public app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this this.app.
   */
  public static bootstrap(): Application {
    return new Application();
  }



  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {

    // Application instantiation
    this.app = express();

    Queues.easySudokuQueue = new SudokuQueue();
    Queues.hardSudokuQueue = new SudokuQueue(true);

    //configure this.application
    this.config();

    //configure routes
    this.routes();
  }

  /**
   * The config function.
   *
   * @class Server
   * @method config
   */
  private config() {
    // Middlewares configuration
    this.app.use(logger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(express.static(path.join(__dirname, '../../dashboard')));
    this.app.use(cors());
  }

  /**
   * The routes function.
   *
   * @class Server
   * @method routes
   */
  public routes() {
    let router: express.Router;
    router = express.Router();

    const index: indexRoute.Index = new indexRoute.Index();

    //home page
    router.get('/', index.index.bind(index.index));

    //sudoku request URLs
    router.get('/easy', index.getEasy.bind(index));
    router.get('/hard', index.getHard.bind(index));
    router.get('/highscores', index.highScores.bind(index));
    router.post('/verify', index.verificationService.bind(index));
    router.post('/login', index.login.bind(index));
    router.post('/register', index.register.bind(index));

    //use router middleware
    this.app.use(router);

    // Gestion des erreurs
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        let err = new Error('Not Found');
        next(err);
    });

    // development error handler
    // will print stacktrace
    if (this.app.get('env') === 'development') {
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user (in production env only)
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
        res.end(err.message);
    });
  }
}
