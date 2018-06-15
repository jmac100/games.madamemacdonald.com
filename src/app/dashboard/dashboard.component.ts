import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  lobby: FirebaseListObservable<any[]>;
  games: FirebaseListObservable<any[]>;

  constructor(af: AngularFire) {
    this.lobby = af.database.list('/lobby');
    this.games = af.database.list('/games');
   }

  ngOnInit() {
  }

}
