import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the CoinMarketCapProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CoinMarketCapProvider {

  coinListURL : string = 'https://api.coinmarketcap.com/v1/ticker/?limit=0';
  private coinlistData : any = {};

  constructor(
    public http: HttpClient,
    public storage: Storage,
  ) {}

  getCoins(){
    return this.coinlistData;
  }

  getCoinList(){
    return new Promise((resolve, reject) => {
      this.storage.get('coinMarketCapCoinList').then((storedCoinlist) => {
        if(storedCoinlist){
          console.log("got a stored coin list");
        }
        this.makeRequest(this.coinListURL).then((coinlist)=>{
          this.storage.set('coinMarketCapCoinList',coinlist);
          this.coinlistData = coinlist;
          resolve(coinlist);
        }).catch((error)=>{
          console.error(error);
          reject(error);
        });
      });
    });
  }

  makeRequest(url: string){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.get(url) 
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

}
