import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from "@angular/http";
import { AppComponent } from '../components/app.component';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { AppRoutingModule } from './app-routing.module';
import { SudokuComponent } from '../components/sudoku.component';
import { WelcomeComponent } from '../components/welcome.component';

import { MaterialModule } from '@angular/material';

@NgModule({
  imports: [ BrowserModule, AppRoutingModule, MaterialModule.forRoot() ],
  declarations: [ AppComponent, SudokuComponent, WelcomeComponent ],
  providers: [ CookieService, HttpModule ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
