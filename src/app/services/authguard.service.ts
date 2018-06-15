import { Injectable } from '@angular/core';
import { Router,
         ActivatedRouteSnapshot,
         RouterStateSnapshot }    from '@angular/router';
import { CanActivate }            from '@angular/router';
import { Auth0Service } from './auth0.service';

@Injectable()
export class AuthguardService implements CanActivate {

  constructor(
    private _auth0: Auth0Service,
    private _router: Router
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(this._auth0.authenticated()){
        return true;      
    } else {
      this._router.navigate(['/']);
      return false;
    }
  } 
}
