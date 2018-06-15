import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';

import { AuthService, AppService, HelperService, Auth0Service, AuthguardService } from './services';

import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby.component';
import { AdminComponent } from './admin/admin.component';
import { PlayComponent } from './play/play.component';
import { environment } from '../environments/environment';
import { MenuComponent } from './menu/menu.component';
import { GamesComponent } from './games/games.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SpinComponent } from './spin/spin.component';
import { PlayerDetailsComponent } from './player-details/player-details.component';

export const config = {
  apiKey: environment.fb_apiKey,
  authDomain: environment.fb_authDomain,
  databaseURL: environment.fb_DatabaseUrl,
  storageBucket: environment.fb_storageBucket,
  messagingSenderId: environment.fb_messagingSenderId
}

@NgModule({
  declarations: [
    AppComponent,
    LobbyComponent,
    AdminComponent,
    PlayComponent,
    MenuComponent,
    GamesComponent,
    DashboardComponent,
    SpinComponent,
    PlayerDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: '', component: AdminComponent },
      { path: 'lobby', component: LobbyComponent },
      { path: 'lobby/:id', component: LobbyComponent },
      { path: 'play/:id', component: PlayComponent },
      { path: 'games', component: GamesComponent, canActivate: [AuthguardService] },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthguardService] },
      { path: 'spin', component: SpinComponent }
    ]),
    AngularFireModule.initializeApp(config)
  ],
  providers: [AuthService, AppService, HelperService, Auth0Service, AuthguardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
