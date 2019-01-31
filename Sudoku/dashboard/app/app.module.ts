import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from "@angular/http";
import { AppComponent } from './app.component';
import { CookieService } from 'angular2-cookie/services/cookies.service';

@NgModule({
  imports: [ BrowserModule, HttpModule ],
  declarations: [ AppComponent ],
  providers: [ CookieService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
