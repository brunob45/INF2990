import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from "@angular/http";
import { AppComponent } from '../components/app.component';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { AppRoutingModule } from './app-routing.module';
import { ScrabbleComponent } from '../components/scrabble.component';
import { WelcomeComponent } from '../components/welcome.component';
import { LobbyComponent } from '../components/lobby.component';
import { WaitingComponent } from '../components/waiting.component';
import { TimerComponent } from '../components/timer.component';

import { MaterialModule } from '@angular/material';

@NgModule({
    imports: [ BrowserModule, AppRoutingModule, MaterialModule.forRoot() ],
    declarations: [ AppComponent, ScrabbleComponent, WelcomeComponent, LobbyComponent, WaitingComponent,
    TimerComponent ],
    providers: [ CookieService, HttpModule ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
