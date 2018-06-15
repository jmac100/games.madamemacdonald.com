import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Auth0Service } from './auth0.service';

@Injectable()
export class AuthguardService implements CanActivate {

  constructor(public auth: Auth0Service, public router: Router) {}

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
