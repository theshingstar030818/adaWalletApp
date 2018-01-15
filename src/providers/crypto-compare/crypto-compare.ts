import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the CryptoCompareProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CryptoCompareProvider {

  coinListURL : string = 'https://www.cryptocompare.com/api/data/coinlist/';
  coinlistData : any = {};
  coinIcons = {};

  constructor(
    public http: HttpClient,
    public storage: Storage
  ) {
    storage.get('cryptoCompareCoinList').then((val) => {
      if(!val || val == undefined){
        this.getCoinList().then((coinlist)=>{
          this.coinlistData = coinlist;
        }).catch((error)=>{
          console.error(error);
        });
      }else{
        this.coinlistData = val;
      }
      console.log(val);
      // this.downloadCoinIcons();
    });
  }

  getCoinList(){
    return new Promise((resolve, reject) => {
      this.makeRequest(this.coinListURL).then((coinlist)=>{
        this.storage.set('cryptoCompareCoinList',coinlist);
        resolve(coinlist);
      }).catch((error)=>{
        console.error(error);
        reject(error);
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

  downloadCoinIcons(){
    let size = 0;
    this.storage.get('coinIcons').then((coinIcons)=>{
      if(!coinIcons ||(Object.keys(coinIcons).length === 0 && coinIcons.constructor === Object)){
        for (let key in this.coinlistData.Data) {
          this.coinIcons[key] = "https://www.cryptocompare.com"+this.coinlistData.Data[key]['ImageUrl'];
          size++;
        }
        this.coinIcons['__size__'] = size;
        this.storage.set('coinIcons',this.coinIcons);
      }else{
        this.coinIcons = coinIcons;
      }
    }); 
  }

}
