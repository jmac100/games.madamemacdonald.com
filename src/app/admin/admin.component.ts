import { Component } from '@angular/core';
import { Auth0Service } from '../services';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  games: any;

  constructor(public auth: Auth0Service){}
  
}
