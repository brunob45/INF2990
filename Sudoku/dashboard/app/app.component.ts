import { Component } from '@angular/core';
import { Http } from '@angular/http';
import * as io from 'socket.io-client';
import { Log } from './log';

const SERVER_LINK = "http://localhost:3002/";

@Component({
  selector: 'my-app',
  template: `
  <h1>{{title}}</h1>
    <div class="menu">
        <h2 id="sizeEasy">Nombre de grilles facile(s) : {{queueSize.easy}}</h2>
        <h2 id="sizeHard">Nombre de grilles difficile(s) : {{queueSize.hard}}</h2>
    </div>
    <div class="frame">
        <p *ngFor="let s of text">{{s}}</p>
    </div>
  `
})

export class AppComponent {

    text: string[] = [];
    socket : SocketIOClient.Socket;

    queueSize: {easy: number, hard: number} = {"easy": 0, "hard": 0};
    title = 'Sudoku Genius Dashboard';

    constructor(private http: Http)
    {
        this.socket = io.connect(SERVER_LINK);
        this.socket.on('QueueSize', (data: string) =>
        {
            this.queueSize = JSON.parse(data);
        });
        this.socket.on('message', (data: string) =>
        {
            Log.push(data);
            this.text = Log.data;
        });
    }
}
