import { Component, AfterViewInit, Input } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'app-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.css']
})
export class PlayerDetailsComponent implements AfterViewInit {

  @Input() game: any;
  players: FirebaseListObservable<any[]>;

  constructor(private af: AngularFire) { }

  ngAfterViewInit() {
    window.setTimeout(() => {
      this.getPlayers();
    });
  }

  getPlayers() {
    this.players = this.af.database.list('/games/' + this.game.$key + '/players');
  }
}
