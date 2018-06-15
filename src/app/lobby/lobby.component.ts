import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFire, FirebaseListObservable, FirebaseRef } from 'angularfire2';

import { environment } from '../../environments/environment';
import { AuthService, HelperService } from '../services';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  player: any;
  players_db: FirebaseListObservable<any>;
  games_db: FirebaseListObservable<any>;
  players: any[];
  games: any;
  firebase: AngularFire;
  fb: any;
  player_key: any;
  referrer: string = environment.referrer;

  constructor
  (
    public af: AngularFire,
    private _route: ActivatedRoute,
    private _auth: AuthService,
    @Inject(FirebaseRef) fb,
    private _helper: HelperService
  ) 
  { 
    this.firebase = af;
    this.fb = fb;
    this.players_db = af.database.list('/lobby');

    af.database.list('/lobby', {
      query: {
        orderByKey: true
      }
    }).subscribe(players => {
        this.players = this._helper.removeDuplicates(players, '$key')
      });

    this.games_db = af.database.list('/games');
  }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo()
  {
    this._route.params
      .map(params => params['id'])
      .subscribe((id) => {
        this._auth.getToken()
          .subscribe(token => {
            this._auth.getUserInfo(id, token.access_token)
              .subscribe(player => {
                this.player = player;
                localStorage.setItem('player', JSON.stringify(player));
                this.joinLobby();
            });
          });        
      });
  }

  joinLobby(){
    let newPlayer = {
      id: this.player.id,
      name: this.player.displayName,
      avatar: 'http://madamemacdonald.com/images/avatars/' + this.player.avatarUrl
    };

    this.players_db.push(newPlayer)
      .then((item) => {
        this.player_key = item.key;
        this.getRef();              
    });  
  }

  getRef(){
    var ref = this.fb.database().ref('/lobby/' + this.player_key);
    ref.onDisconnect().remove();
  }

  removeFromLobby(gameId: string) {
    this.fb.database().ref('/lobby/' + this.player_key).remove();
  }
}
