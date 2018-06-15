import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  constructor(private _http: Http) { }

  getToken(): Observable<any>{
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' });
    let body = 'grant_type=password&username=admin&password=53Ss2u8SRCcQHMqL';
    let options = new RequestOptions({headers: headers});
    let url = environment.baseUrl + 'token';

    return this._http.post(url, body, options)
      .map(res => res.json());
  }

  getUserInfo(id: number, apiKey: string): Observable<any> {
    let headers = new Headers({ 'Authorization': 'Bearer ' + apiKey });
    let options = new RequestOptions({ headers: headers });
    let url = environment.baseUrl + 'api/userinfo/' + id;

    return this._http.get(url, options)
      .map(res => res.json());    
  }

  getActivities(userId: number, apiKey: string): Observable<any> {
    let headers = new Headers({ 'Authorization': 'Bearer ' + apiKey });
    let options = new RequestOptions({ headers: headers });
    let url = environment.baseUrl + 'api/activitylog/' + userId;

    return this._http.get(url, options)
      .map(res => res.json());
  }

  getBonusBravoCount(userId: number, apiKey: string): Observable<any> {
    let headers = new Headers({ 'Authorization': 'Bearer ' + apiKey });
    let options = new RequestOptions({ headers: headers });
    let url = environment.baseUrl + 'api/getbonusbravocount/' + userId;

    return this._http.get(url, options)
      .map(res => res.json());
  }

  saveActivityLog(activityLog: any, apiKey:string): Observable<any> {    
    let headers = new Headers({ 'Authorization': 'Bearer ' + apiKey });
    let options = new RequestOptions({ headers: headers });
    let url = environment.baseUrl + 'api/activitylog';

    return this._http.post(url, activityLog, options)
      .map(res => res.json());
  }

  getBravos(query: string, apiKey: string): Observable<any> {
    let headers = new Headers({ 'Authorization': 'Bearer ' + apiKey });
    let options = new RequestOptions({ headers: headers });
    let url = environment.baseUrl + 'api/bravoreport/' + query;

    return this._http.get(url, options)
      .map(res => res.json());
  }

  saveBravo(bravoLog: any, apiKey:string): Observable<any> {    
    let headers = new Headers({ 'Authorization': 'Bearer ' + apiKey });
    let options = new RequestOptions({ headers: headers });
    let url = environment.baseUrl + 'api/bravolog';

    return this._http.post(url, bravoLog, options)
      .map(res => res.json());
  }

  loadBravoCounts(query: string, apiKey:string) {
    let headers = new Headers({ 'Authorization': 'Bearer ' + apiKey });
    let options = new RequestOptions({ headers: headers });
    let url = environment.baseUrl + 'api/bravolog?query=' + query;

    return this._http.get(url, options)
      .map(res => res.json());
  }

  getGuid(apiKey: string) {
    let headers = new Headers({ 'Authorization': 'Bearer ' + apiKey });
    let options = new RequestOptions({ headers: headers });
    let url = environment.baseUrl + 'api/guid';

    return this._http.get(url, options)
      .map(res => res.json());
  }

  cacheUserInfo(user: any){
    localStorage.setItem('user', JSON.stringify(user));
  }

  getCachedUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  deleteCachedUser(){
    localStorage.removeItem('user');
  }
}
