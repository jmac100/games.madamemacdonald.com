import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { AuthService } from '../services';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

  games: FirebaseListObservable<any[]>;
  selected_game: any = "Select a Game";
  game: any;
  gameRef: FirebaseObjectObservable<any>;

  constructor(public af: AngularFire, private _authService: AuthService) {
    this.games = af.database.list('/games');
  }

  ngOnInit() {
  }

  getGame(key, name) {
    this.selected_game = name;
    this.af.database.object('/games/' + key).subscribe(game => {
      this.game = game;
    });
  }

  addNew() {
    var me = this;
    this._authService.getToken()
      .subscribe(token => {
        this._authService.getGuid(token.access_token).subscribe(guid => {
          me.game = {
            name: '',
            topic: '',
            id: guid,
            instructions: ''
          };
        });
      });
  }

  saveGame() {
    if (this.game.$key) {
      this.gameRef = this.af.database.object('/games/' + this.game.$key);
      this.gameRef.update({ name: this.game.name });
      this.gameRef.update({ topic: this.game.topic });
      this.gameRef.update({ id: this.game.id });
      this.gameRef.update({ instructions: this.game.instructions });
    } else {
      this.games.push(this.game);
      this.game = null;
    }
  }

}
