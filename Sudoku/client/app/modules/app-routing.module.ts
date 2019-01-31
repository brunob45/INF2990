import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SudokuComponent } from '../components/sudoku.component';
import { WelcomeComponent } from '../components/welcome.component';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'sudoku', component: SudokuComponent},
  { path: 'welcome', component: WelcomeComponent }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
