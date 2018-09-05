import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.css']
})
export class PlayerDetailsComponent implements AfterViewInit {

  @Input() game: any;
  @Output() buttonClicked = new EventEmitter<string>();

  player_cap: number = environment.player_cap
  players: any[];

  constructor(private af: AngularFire) { }

  ngAfterViewInit() {
    window.setTimeout(() => {
      this.getPlayers();
    });
  }

  getPlayers() {
    this.af.database
      .list('/games/' + this.game.$key + '/players')
      .subscribe(players => {
        this.players = players;
      })
  } 

  removeFromLobby() {
    this.buttonClicked.emit()
  }
}
