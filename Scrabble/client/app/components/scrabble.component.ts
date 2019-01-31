import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { Router } from '@angular/router';
import { Grid } from '../classes/grid';
import { Columns } from '../classes/columns';
import { Rows } from '../classes/rows';
import { Chat } from '../classes/chat';
import { Deck, Letter } from '../classes/deck';
import { Player } from '../classes/player';
import { Sockets } from '../modules/sockets';
import { GameInfo } from '../modules/gameInfo';

let deck = new Deck();
let index = 0;
const CAPITAL_A_CODE = 65;
const CAPITAL_Z_CODE = 90;
const SMALL_A_CODE = 97;
const SMALL_Z_CODE = 122;

@Component({
    templateUrl: 'assets/templates/scrabble-component-template.html',
    styleUrls: ['assets/stylesheets/scrabble-component-stylesheet.css']
})

export class ScrabbleComponent {
    chat: Chat;
    deck: Deck;
    grid: Grid;
    columns : Columns;
    rows: Rows;
    player: Player;
    opponents: {name: string, score: number, active: boolean, connected: boolean}[] = [];
    gameEnded: boolean;
    winner: string;
    win = false;
    loading = false;

    title = 'Scrabble Online';

    user: {name: string, score: number, nbLetters: number} = {name: "", score: 0, nbLetters: 0};

    constructor(private http: Http, private cookieService: CookieService, private router: Router)
    {
        this.user = { name: GameInfo.username, score: GameInfo.score, nbLetters: GameInfo.nbLetters};
        this.grid = new Grid();
        this.columns = new Columns();
        this.rows = new Rows();
        this.chat = GameInfo.chat;
        this.deck = deck = new Deck();
        this.winner = "";
        Sockets.addEventHandler('gameUpdate', (data) => this.updateHandler(data));
        Sockets.addEventHandler('sendDeck', (data) => this.sendDeckHandler(data));
        Sockets.addEventHandler('endGame', () => this.endGameHandler());
        Sockets.addEventHandler( 'playerDisconnect', (name) => this.playerDisconnectedHandler(name));
    }

    updateHandler(data: any)
    {
        if (!this.gameEnded)
        {
            data = data[0];
            this.grid.setGrid(data[0]);
            let players = data[1];
            this.opponents = players.map( (p: {name: string, score: number}) => {
                return {name: p.name , score: p.score, active: false, connected: true};
            });
            this.opponents[data[2]].active = true;
        }
    }

    sendDeckHandler(data: any): void
    {
        let newLetters: Letter[] = data[0];
        let newDeck: Letter[] = [];
        for (let l of deck.letters)
        {
            for (let i = 0; i < newLetters.length; i++)
            {
                if (l.letter === newLetters[i].letter)
                {
                    newDeck.push(newLetters.splice(i, 1)[0]);
                    break;
                }
            }
        }
        for ( let l of newLetters)
        {
            newDeck.push(l);
        }
        deck.letters = newDeck;
    }

    endGameHandler(): void
    {
        let best = {name: "", score: 0, active: false};
        for (let p of this.opponents)
        {
            if (p.score > best.score)
            {
                best = p;
            }
            p.active = false;
        }
        this.winner = best.name;
        this.gameEnded = true;
    }

    playerDisconnectedHandler(data: any): void
    {
        let i = this.opponents.findIndex((a) => a.name === data[0][0]);
        if (i > -1)
        {
            this.opponents[i].connected = false;
        }
    }

    disconnect(username: string, password: string): void
    {
        this.cookieService.remove("username");
        this.cookieService.remove("password");
        Sockets.userDisconnect();
        this.router.navigate(['./welcome']);
    }
    focusFunction(): void{
        document.getElementById("tabindex1").focus();
    }
}

document.addEventListener('keydown', (event) => {
    const keyCode = event.keyCode;
    const keyName = event.key;

    if (document.activeElement.className === "deck")
    {
        if ((keyCode >= CAPITAL_A_CODE && keyCode <= CAPITAL_Z_CODE) ||
            (keyCode >= SMALL_A_CODE && keyCode <= SMALL_Z_CODE))
        {
            index = deck.findLetter(keyName);
        }
        if (keyName === "ArrowLeft")
        {
            deck.swapLetters(index % deck.MAX_SIZE, (index - 1 + deck.MAX_SIZE) % deck.MAX_SIZE);
            index = index - 1 + deck.MAX_SIZE;
        }
        if (keyName === "ArrowRight")
        {
            deck.swapLetters(index % deck.MAX_SIZE, (index + 1) % deck.MAX_SIZE);
            index++;
        }
    }
}, false);
