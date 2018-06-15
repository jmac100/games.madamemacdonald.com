import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AppService {

  constructor
  (
    private _http: Http
  ) { }

  loadGame(key: string) : Observable<any> {
    let url: string = './assets/' + key + '.json';
    return this.executeGet(url);
  }

  private executeGet(url): Observable<any> {
    return this._http.get(url)
      .map(res => res.json());
  }
}
