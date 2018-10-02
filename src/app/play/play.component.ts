import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable, FirebaseRef } from 'angularfire2';
import { AppService, HelperService, AuthService } from '../services';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  players_db: FirebaseListObservable<any>;
  game_db: FirebaseObjectObservable<any>;
  playing_db: FirebaseObjectObservable<any>;
  af: AngularFire;
  fb: any;

  playing: any;
  player: any;
  players: any;
  player_count: number;
  gameDetails: any[];
  master: any[];
  gameId: any;
  game: any;  
  host: boolean = false;
  player_key: any;
  playing_key: any;
  expressions: any[];
  question: any;
  answer: any;
  wins: number = 0;
  activityCount: number = 0;
  duplicatePlayerCount: number;

  constructor
  (
    private _route: ActivatedRoute,
    af: AngularFire,
    @Inject(FirebaseRef) fb,
    private _appService: AppService,
    public _helper: HelperService,
    private _auth: AuthService
  ) {
    this.af = af;
    this.fb = fb;    
   }

   public get BravoCount() : number {
     return Math.floor(this.activityCount / environment.activityCount);
   }

  ngOnInit() {
    this.loadPlayer();    
    this.loadGame();
    this.loadGameDetails();
    this.getPlayers();      
    this.joinGame();     
    this.initEvents();
  }  

  loadPlayer() {
    this.player = JSON.parse(localStorage.getItem('player'));
    this.updateActivityCount(false);
  }

  loadGame() {
    this._route.params
      .map(params => params['id'])
      .subscribe((id) => {
        this.gameId = id;

        this.game_db = this.af.database.object('/games/' + this.gameId);
          this.game_db.subscribe(game => {
            this.game = game;
            this.playing_db = this.af.database.object('/games/' + this.gameId + '/playing');
            this.playing_db.subscribe(playing => {
              this.playing = playing;
            });
          });
      });
  }

  loadGameDetails() {
    this._appService.loadGame(this.gameId)
      .subscribe(details => {
        this.master = details.items;
        this.gameDetails = Array.from(this.master);
      });
  }

  updateDuplicatePlayerCount() {
    var query = this.fb.database().ref('/games/' + this.gameId + '/players');
    var me = this;
    this.duplicatePlayerCount = 0;
    query.once('value')
      .then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
          var player = childSnapshot.val();
          if (player.player.id == me.player.id) {
            me.duplicatePlayerCount += 1;
          }
        });
      });
  }

  joinGame() {
    let player = {
      id: this.player.id,
      name: this.player.displayName,
      avatar: 'http://madamemacdonald.com/images/avatars/' + this.player.avatarUrl,
      gameId: this.gameId
    };

    var gameRef = this.fb.database().ref('/games/' + this.gameId + '/players');
    var newPlayerRef = gameRef.push({player: player});
    localStorage.setItem('player_key', newPlayerRef.key);
    this.getPlayerRef();
  }

  getPlayers() {
    this.players_db = this.af.database.list('/games/' + this.gameId + '/players');
  }

  updateActivityCount(updateBravos) {
    this._auth.getToken()
      .subscribe(token => {
        this._auth.getActivities(this.player.id, token.access_token)
          .subscribe(res => {
            this.activityCount = res.length;
            if (!updateBravos) return;
            if (this.activityCount >= environment.activityCount && this.activityCount % environment.activityCount == 0) {
              var bravoLog = {
                bravoLogID: 0,
                userID: this.player.id,
                dateInserted: this._helper.getDate()
              }
              this._auth.getToken()
                .subscribe(token => {
                  this._auth.saveBravo(bravoLog, token.access_token)
                    .subscribe(res => res);
                });
            }
          });
      });
  }

  resolveHost() {
    var ref = this.fb.database().ref('/games/' + this.gameId);
    var me = this;

    ref.once('value', function(snapshot){
      if (!snapshot.child('host').exists()) {
        var newHost = {
          playerId: me.player.id
        };
        me.game_db.update({ host: newHost })
          .then(function(){
            me.getHostRef();
            me.host = true;
            me.startGame();
          });
      }     
    });
  }

  initEvents() {
    var gameRef = this.fb.database().ref('/games/' + this.gameId);
    var playerRef = this.fb.database().ref('/games/' + this.gameId + '/players');
    var me = this;

    gameRef.on('value', function(snaphost){
      if(playerRef && !snaphost.child('host').exists()) {
        playerRef.limitToFirst(1).once('value', (snap) => {
          snap.forEach(function (playerSnap){
            var player = playerSnap.val();
            if (me.player.id == player.player.id){
              me.resolveHost();
            }
          });
        });
      }

      if (snaphost.child('winner').exists()) {
        me.answer = {
          question: snaphost.child('winner/question').val(),
          image: snaphost.child('winner/image').val(),
          winner: snaphost.child('winner/winner').val()
        };
      } else {
        me.answer = null;
      }
    });

    playerRef.on('value', (snapshot) => {
      this.player_count = snapshot.numChildren();
      me.updateDuplicatePlayerCount()
    });
  }

  getPlayerRef(){
    var ref = this.fb.database().ref('/games/' + this.gameId + '/players/' + localStorage.getItem('player_key'));
    ref.onDisconnect().remove();
  }

  getHostRef(){
    var ref = this.fb.database().ref('/games/' + this.gameId + '/host');
    ref.onDisconnect().remove();
  }

  removeFromGame() {
    this.fb.database().ref('/games/' + this.gameId + '/players/' + localStorage.getItem('player_key')).remove();
    if (this.host) {
      var ref = this.fb.database().ref('/games/' + this.gameId);
      ref.off('value');
      ref.child('host').remove();
    }
  }

  startGame() {
    if (this.gameDetails && this.gameDetails.length < 4) {
      this.gameDetails = Array.from(this.master);
    }
    this.expressions = [];
    for (var i = 0; i <= 3; i++) {
      this.expressions.push(this._helper.randsplice(this.gameDetails)[0]);
    }
    this.question = this._helper.randval(this.expressions);
    var playing = {
      gameId: this.gameId,
      question: this.question,
      expressions: this.expressions
    };
    this.game_db.update({ playing: playing });
  }

  guess(image: string) {
    if (this.player_count < 2) return;

    var ref = this.fb.database().ref('/games/' + this.gameId + '/playing/');
    var me = this;
    
    ref.once('value', function(snapshot){
      if (image == snapshot.child('question/image').val()) {
        var winner = {
          question: snapshot.child('question/question').val(),
          image: snapshot.child('question/image').val(),
          winner: me.player.displayName
        };
        ref.remove();
        me.game_db.update({ winner: winner });
        me.wins += 1;

        if (me.wins >= 5 && me.wins % 5 == 0) {
          var activityLog = {
            activityLogID: 0,
            userID: me.player.id,
            description: me.game.namespace,
            activityDate: me._helper.getDate()  
          };
          me._auth.getToken()
            .subscribe(token => {
              me._auth.saveActivityLog(activityLog, token.access_token)
                .subscribe(res => {
                  me.updateActivityCount(true);
                });
            });
        }

        setTimeout(function() {
          me.game_db.update({ winner: null });
          me.startGame();
        }, 3500);
      }
    });
  }
}
