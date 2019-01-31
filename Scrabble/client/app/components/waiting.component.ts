import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Sockets } from '../modules/sockets';
import { GameInfo } from '../modules/gameInfo';
import { Chat } from '../classes/chat';

@Component({
    templateUrl: 'assets/templates/waiting-component-template.html',
    styleUrls: ['assets/stylesheets/waiting-component-stylesheet.css']
})

export class WaitingComponent {
    nbConnectedPlayer = 1;
    nbRemainingPlayer = GameInfo.nbPlayer - 1;
    chat: Chat;

    constructor(private router: Router)
    {
        GameInfo.init();
        this.chat = GameInfo.chat;
        Sockets.addEventHandler('gameIsReady', (data: string) =>
        {
            this.router.navigate(['./scrabble']);
        });

        Sockets.addEventHandler('waitingRemainingPlayer', (data: string) =>
        {
            this.nbRemainingPlayer = JSON.parse(data);
            this.nbConnectedPlayer = GameInfo.nbPlayer - this.nbRemainingPlayer;
        });

        Sockets.addEventHandler('messageToClient', (data: string) =>
        {
            let message: {name: string, text: string} = JSON.parse(data);
            this.chat.addEntry(message.name, message.text);
            this.chat.hasAnswerFromServer();
        });
    }

    disconnect(): void
    {
        Sockets.leaveRoom();
        GameInfo.nbPlayer = 0;
        this.router.navigate(['./lobby']);
    }
}
