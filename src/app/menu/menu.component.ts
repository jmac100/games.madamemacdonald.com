import { Component, OnInit } from '@angular/core';
import { Auth0Service } from '../services';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(public _auth0: Auth0Service) { }

  ngOnInit() {
  }

}
