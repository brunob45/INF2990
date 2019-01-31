import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScrabbleComponent } from '../components/scrabble.component';
import { WelcomeComponent } from '../components/welcome.component';
import { LobbyComponent } from '../components/lobby.component';
import { WaitingComponent } from '../components/waiting.component';

const routes: Routes = [
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: 'scrabble', component: ScrabbleComponent},
    { path: 'welcome', component: WelcomeComponent },
    { path: 'lobby', component: LobbyComponent },
    { path: 'waiting', component: WaitingComponent }
];
@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
