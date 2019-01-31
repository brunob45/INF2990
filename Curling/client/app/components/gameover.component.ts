import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';

interface ScoreData
{
  username: string;
  score: number;
}

const SERVER_LINK = "http://localhost:3002/";

const DEFAULT_HIGHSCORES_EASY: ScoreData[] = [
  {username: "CurlingMaster999", score: 8},
  {username: "MichelGagnon", score: 6},
  {username: "TiitVunk", score: 5}];
const DEFAULT_HIGHSCORES_HARD: ScoreData[] = [
  {username: "CurlingMaster999", score: 7},
  {username: "DestroyerOfWorlds", score: 6},
  {username: "Kimiko", score: 4}];

@Component({
    selector: 'game-over',
    templateUrl: 'assets/templates/gameover-component-template.html',
    styleUrls: ['assets/stylesheets/gameover-component-stylesheet.css']
})

export class GameoverComponent {
    highScoresEasy: ScoreData[];
    highScoresHard: ScoreData[];
    constructor(private http: Http, private router: Router, private cookieService: CookieService)
    {
        this.getHighScores();
        setInterval(() =>
        {
            this.getHighScores();
        }, 500);
    }

    homepageEvent(){
        this.router.navigate(['./difficulty']);
    }

    replayEvent(){
        this.router.navigate(['./dashboard']);
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
                this.highScoresEasy[i] = {username: scores.easy[i].username,
                        score: scores.easy[i].bestScoreCurlingEasy};
            }
            for (let i = 0; i < scores.hard.length; i++)
            {
                this.highScoresHard[i] = {username: scores.hard[i].username,
                        score: scores.hard[i].bestScoreCurlingHard};
            }
            this.manageHighScoreDefault();
        });
    }
    private manageHighScoreDefault(): void
    {
        this.highScoresEasy = this.highScoresEasy.concat(DEFAULT_HIGHSCORES_EASY);
        this.highScoresEasy.sort((a, b) => b.score - a.score);
        this.highScoresEasy.splice(3, 3);

        this.highScoresHard = this.highScoresHard.concat(DEFAULT_HIGHSCORES_HARD);
        this.highScoresHard.sort((a, b) => b.score - a.score);
        this.highScoresHard.splice(3, 3);
    }
}
