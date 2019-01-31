import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CookieService } from 'angular2-cookie/core';
import { Router } from '@angular/router';
import { Grid } from '../modules/grid';

const SERVER_LINK = "http://localhost:3002/";

const DEFAULT_HIGHSCORES_EASY: ScoreData[] = [
  {username: "SudokuMaster999", score: 48},
  {username: "MichelGagnon", score: 253},
  {username: "TiitVunk", score: 536}];
const DEFAULT_HIGHSCORES_HARD: ScoreData[] = [
  {username: "SudokuMaster999", score: 73},
  {username: "DestroyerOfWorlds", score: 302},
  {username: "Kimiko", score: 553}];

interface ScoreData
{
  username: string;
  score: number;
}

@Component({
  selector: 'sudoku-component',
  templateUrl: 'assets/templates/sudoku-component-template.html',
  styleUrls: ['assets/stylesheets/sudoku-component-stylesheet.css']
})

export class SudokuComponent {

  time = 0;
  win = false;
  loading = false;
  grid: Grid = new Grid();

  title = 'Sudoku Genius';

  highScoresEasy: ScoreData[];
  highScoresHard: ScoreData[];

  user: {name: string, password: string, score: number, difficulty: string} =
        {name: "", password: "", score: 0, difficulty: ""};

  timer = Observable.timer(0, 1000);
  sub = this.timer.subscribe(s =>
  {
    if (this.user.difficulty !== "")
    {
      this.time += 1;
    }
    else
    {
      this.time = 0;
    }
  });

  constructor(private http: Http, private cookieService: CookieService, private router: Router)
  {
    if (this.cookieService.get('username') != null)
    {
      this.login(this.cookieService.get('username'), this.cookieService.get('password'));
    }

    this.getHighScores();
    setInterval(() =>
    {
      this.getHighScores();
    }, 60000);
  }

  setEasy()
  {
    if (this.user.name !== "")
    {
      this.user.difficulty = "normal";
    }
  }

  setHard()
  {
    if (this.user.name !== "")
    {
      this.user.difficulty = "difficile";
    }
  }

  newGrid()
  {
    if (this.user.name !== "")
    {
        this.importGrid();
    }
    else
    {
      window.alert("Entrez votre nom en premier!");
    }
  }

  importGrid(): void
  {
    let link: string = SERVER_LINK;
    if (this.user.difficulty === "normal")
    {
        link = link + 'easy';
    }
    else
    {
        link = link + 'hard';
    }

    this.loading = true;
    this.http.get(link).subscribe(data =>
    {
        this.loading = false;
        this.win = false;
        this.restartStopwatch();
        this.grid.fill(JSON.parse(data.text()));
    });
  }

  getHighScores(): void
  {
    let link: string = SERVER_LINK + "highscores";

    this.http.get(link).subscribe(data =>
    {
      let scores = JSON.parse(data.text());
      this.highScoresEasy = [];
      this.highScoresHard = [];
      for (let i = 0; i < scores.easy.length; i++)
      {
        this.highScoresEasy[i] = {username: scores.easy[i].username, score: scores.easy[i].bestTimeSudokuEasy};
      }
      for (let i = 0; i < scores.hard.length; i++)
      {
        this.highScoresHard[i] = {username: scores.hard[i].username, score: scores.hard[i].bestTimeSudokuHard};
      }

      this.manageHighScoreDefault();
    });
  }

  restartStopwatch()
  {
    this.sub.unsubscribe();
    this.time = 0;
    this.timer = Observable.timer(0, 1000);

    this.sub = this.timer.subscribe(s =>
    {
      this.time += 1;
    });
  }

  stopTimer()
  {
    this.sub.unsubscribe();
  }

  fullChecker() : void
  {
    if (this.grid.isComplete())
    {
      this.verifyGrid();
    }
  }

  verifyGrid()
  {
    let body = "name=" + this.user.name
      + "&pass=" + this.user.password
      + "&time=" + String(this.time)
      + "&sudoku=" + this.grid.toString()
      + "&isHard=" + String(this.user.difficulty === "difficile");

    let headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    this.http.post(SERVER_LINK + "verify", body, {headers: headers}).subscribe(data =>
    {
      let valid: boolean = JSON.parse(data.json());
      if (valid && this.time > 0)
      {
        this.win = true;
        this.stopTimer();

        //There is a timeout to let the database update.
        setTimeout(() =>
        {
          this.getHighScores();
        }, 500);
      }
    });
  }

  newInput_Handler(e: any)
  {
    let cell: {x: number, y: number} = Grid.parseId(e.target.id);
    if (e.keyCode === 8 /*backspace*/ || e.keyCode === 46 /*delete*/)
    {
      this.grid.clearValue(cell.x, cell.y);
    }

    if ( (e.key >= "1" && e.key <= "9") )
    {
      this.grid.setValue(e.key, cell.x, cell.y);
    }

    return false; //so the input is not shown doubled.
  }

  login(username: string, password: string): void
  {
    let body = "name=" + username + "&pass=" + password;
    let headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    this.http.post(SERVER_LINK + "login", body, {headers: headers}).subscribe(data =>
    {
      if (JSON.parse(data.json()))
        {
          this.user.name = username;
          this.user.password = password;
        }
        else
        {
          window.alert("Le nom d'utilisateur ou le mot de passe est invalide!");
        }
    });
  }

  disconnect(username: string, password: string): void
  {
    this.cookieService.remove("username");
    this.cookieService.remove("password");
    this.router.navigate(['./welcome']);
  }

  timeToString(time: number): string
  {
    let m = Math.floor(time / 60);
    let s = Math.floor(time % 60);
    let ret: string = String(m) + ":";
    if (s < 10)
    {
      ret += "0";
    }
    ret += String(s);
    return ret;
  }

  private manageHighScoreDefault(): void
  {
    this.highScoresEasy = this.highScoresEasy.concat(DEFAULT_HIGHSCORES_EASY);
    this.highScoresEasy.sort((a, b) => a.score - b.score);
    this.highScoresEasy.splice(3, 3);

    this.highScoresHard = this.highScoresHard.concat(DEFAULT_HIGHSCORES_HARD);
    this.highScoresHard.sort((a, b) => a.score - b.score);
    this.highScoresHard.splice(3, 3);
  }
}

function getElementById(id: {x: number, y: number}): HTMLElement
{
  return document.getElementById(String(id.x) + String(id.y));
}

document.addEventListener('keydown', (event) =>
{
  const keyName = event.key;
  let nextId: {x: number, y: number} = Grid.parseId(document.activeElement.id);

  if (keyName === 'ArrowUp')
  {
      do
      {
          nextId.y = (nextId.y - 1 + Grid.DIMENSION) % Grid.DIMENSION;
      } while ( getElementById(nextId).hasAttribute("disabled") );
  }
  if (keyName === 'ArrowDown')
  {
      do
      {
          nextId.y = (nextId.y + 1) % Grid.DIMENSION;
      } while ( getElementById(nextId).hasAttribute("disabled") );
  }
  if (keyName === 'ArrowLeft')
  {
      do
      {
          nextId.x = (nextId.x - 1 + Grid.DIMENSION) % Grid.DIMENSION;
      } while ( getElementById(nextId).hasAttribute("disabled") );
  }
  if (keyName === 'ArrowRight')
  {
      do
      {
          nextId.x = (nextId.x + 1) % Grid.DIMENSION;
      } while ( getElementById(nextId).hasAttribute("disabled") );
  }
  getElementById(nextId).focus();
}, false);
