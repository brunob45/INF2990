import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from '../components/dashboard.component';
import { WelcomeComponent } from '../components/welcome.component';
import { DifficultyComponent } from '../components/difficulty.component';
import { GameoverComponent } from '../components/gameover.component';

import { GlComponent } from '../components/gl.component';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'glcomp', component: GlComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'difficulty', component: DifficultyComponent },
  { path: 'gameover', component: GameoverComponent }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
