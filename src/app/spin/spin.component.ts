import { Component, OnInit, Inject } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseRef } from 'angularfire2';
import { HelperService, AuthService } from '../services';

@Component({
  selector: 'app-spin',
  templateUrl: './spin.component.html',
  styleUrls: ['./spin.component.css']
})
export class SpinComponent implements OnInit {

  classList = [];
  selected_class;
  class_details: FirebaseListObservable<any[]>;
  _af: AngularFire;
  complete_list: any[];
  fb: any;
  winner: string;
  spin_complete: boolean = false;
  spin_count: number = 0;
  bravo_report: any[];
  loading: boolean = false;
  selected_month: string;

  constructor(
    private _helper: HelperService,
    private _authService: AuthService,
    af: AngularFire, 
    @Inject(FirebaseRef) fb
  ) 
  { 
    this._af = af;
    this.fb = fb;
  }

  ngOnInit() {
    this.classList = ['34-1', '5-1', '5-2', '5-3', '6-1', '6-2', '6-3'];
    this.selected_class = this.classList[0];
    this.getClass(this.selected_class);
  }

  getClass(code) {
    this.complete_list = [];
    this.winner = '';
    this.spin_complete = false;
    this.selected_month = '';
    this.selected_class = code;
    this.class_details = this._af.database.list('/spinner/' + this.selected_class);
  }

  saveClassDetail(key, val){
    this.class_details.update(key, { bravos: val });
  }
  
  loadBravoCounts(offset: number) {
    this.loading = true;
    var d = new Date();
    var query = (String)((d.getMonth() + offset) + '|' + d.getFullYear());
    var me = this;
    this.selected_month = this.getMonth(offset);

    this._authService.getToken().subscribe(token => {
      this._authService.loadBravoCounts(query, token.access_token).subscribe(report => {
        this.bravo_report = report;

        var playerRef = this.fb.database().ref('/spinner/' + this.selected_class);
        playerRef.once('value').then(function(snapshot){
          snapshot.forEach(function(snap){
            var player = snap.val();
            var bravoCount = me.filterItems(player.id).length;
            me.class_details.update(snap.key, { bravos: bravoCount });
          });
          me.loading = false;
        });
      });
    });
  }

  filterItems(id) {
    return this.bravo_report.filter(function(el) {
      return el.userID == id;
    });
  }

  spin() {
    this.complete_list = [];
    this.spin_count = 0;
    var me = this;    

    this.fb.database().ref('/spinner/' + this.selected_class)
      .once('value', (snap) => {
        snap.forEach(function(child){
          let bravos = +child.val().bravos;
          for (var i = 0; i < bravos; i++) {
            me.complete_list.push(child.key);
          }
        });
        for (var i = 0; i < 100; i++) {
            window.setTimeout(() => {
              me.winner = me._helper.randval(me.complete_list);
              this.spin_count += 1;
              this.spin_complete = this.spin_count == 100;
          }, 100 * i);
        }
      });
  }

  getMonth(offset: number) {
    var monthNames = ["", "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[new Date().getMonth() + offset];
  }
}
