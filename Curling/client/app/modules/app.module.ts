import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from "@angular/http";

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from '../components/app.component';
import { GlComponent } from '../components/gl.component';
import { DashboardComponent } from '../components/dashboard.component';
import { WelcomeComponent } from '../components/welcome.component';
import { DifficultyComponent } from '../components/difficulty.component';
import { GameoverComponent } from '../components/gameover.component';


import { ModifierDirective } from '../directives/modifier.directive';

import { CameraService } from '../services/camera.service';
import { InputService } from '../services/input.service';
import { SceneService } from '../services/scene.service';
import { AudioService } from '../services/audio.service';
import { Mouse3DService } from '../services/mouse3d.service';
import { ObjectCreaterService } from '../services/object-creater.service';

import { CurlingGame } from '../classes/curling-game';
import { GameInfo } from '../classes/game-info';
import { AimLine } from '../classes/aim-line';
import { Brush } from '../classes/brush';

import { RenderService } from '../services/render.service';

import { MaterialModule } from '@angular/material';

import { CookieService } from 'angular2-cookie/services/cookies.service';

@NgModule({
  imports: [ BrowserModule, FormsModule, AppRoutingModule, MaterialModule.forRoot()],
  declarations: [ AppComponent,
                  GlComponent,
                  DashboardComponent,
                  WelcomeComponent,
                  DifficultyComponent,
                  GameoverComponent,
                  ModifierDirective
                ],

  providers: [ RenderService,
               HttpModule,
               CookieService,
               InputService,
               SceneService,
               CameraService,
               AudioService,
               ObjectCreaterService,
               Mouse3DService,
               CurlingGame,
               GameInfo,
               AimLine,
               Brush
             ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
