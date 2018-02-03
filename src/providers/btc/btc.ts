import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// declare function require(name:string);
// import { HDNode, Transaction } from 'bitcoinjs-lib';


/*
  Generated class for the BtcProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BtcProvider {

  wallet: any = "null";

  constructor(
    public http: HttpClient,
  ) {

    // let bitcoin = require('bitcoinjs-lib');
    console.log('Hello BtcProvider Provider');

  }

}
