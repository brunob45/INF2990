import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameInfo } from '../modules/gameInfo';
import { Sockets } from '../modules/sockets';
import { CookieService } from 'angular2-cookie/core';

@Component({
    templateUrl: 'assets/templates/lobby-component-template.html',
    styleUrls: ['assets/stylesheets/lobby-component-stylesheet.css']
})

export class LobbyComponent {

    user: {name: string} = {name: ""};

    constructor(private router: Router, private cookieService: CookieService)
    {
        this.user = { name: GameInfo.username};
    }

    chooseTypeOfGame(nbPlayer: number): void
    {
        Sockets.enterRoom(nbPlayer);
        GameInfo.nbPlayer = nbPlayer;
        this.router.navigate(['./waiting']);
    }

    disconnect(username: string, password: string): void
    {
        this.cookieService.remove("username");
        this.cookieService.remove("password");
        Sockets.userDisconnect();
        this.router.navigate(['./welcome']);
    }
}
