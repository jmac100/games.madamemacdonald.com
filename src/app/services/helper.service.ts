import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class HelperService {

  debug: boolean = environment.debug;

  constructor() { }

  removeDuplicates(arr, prop): any[] {
    var newArray = [];
    var obj = {};

    for (var i in arr) {
      obj[arr[i][prop]] = arr[i];
    }

    for (i in obj) {
      newArray.push(obj[i]);
    }
    return newArray;
  }

  randsplice(arr: any[]) {
    var ri = Math.floor(Math.random() * arr.length);
    var rs = arr.splice(ri, 1);
    return rs;
  }
  
  randval(arr: any[]) {
      var ri = Math.floor(Math.random() * arr.length);
      var val = arr[ri];
      return val;
  }

  getDate(){
    var date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
  }
}
