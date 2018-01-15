import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the AdaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AdaProvider {

  private baseUrl: string = 'https://localhost:8090';
  private restoreUrl: string = '/api/wallets/restore';
  private getWalletsUrl: string = '/api/wallets';
  wallets: any = [];

  constructor(
    public http: Http
  ) {
    console.log('Hello AdaProvider Provider');
  }

  recoverWallet (form: any){
    console.log(form);
    let url = this.baseUrl+this.getWalletsUrl;
    // let headers = new Headers({
    //   'Content-Type' : 'application/json'
    // });
    return new Promise((resolve, reject) => {
      this.http.get(url)
      .toPromise()
      .then((response) =>
      {
        console.log('API Response : ', response.json());
        resolve(response.json());
      })
      .catch((error) =>
      {
        console.error('API Error : ', error.status);
        console.error('API Error : ', JSON.stringify(error));
        reject(error.json());
      });
    });
  }
  
  getWallets(formData: any): Promise<{}>{
    
    console.log(formData);

    let url = this.baseUrl+this.restoreUrl;

    let headers = new Headers({
      'Content-Type' : 'application/json'
    });
    
    let options = new RequestOptions({ headers: headers });
    let body = {
      "cwInitMeta": {
        "cwName": "My lovely wallet",
        
        
        "cwAssurance": "CWANormal",
        "cwUnit": 0
      },
      "cwBackupPhrase": {
          "bpToList":
          ["squirrel","material","silly","twice","direct","slush","pistol","razor","become","junk","kingdom","flee"]
        }
    }
    let data = JSON.stringify(body);
    return new Promise((resolve, reject) => {
      this.http.post(url, data, options)
      .toPromise()
      .then((response) =>
      {
        console.log('API Response : ', response.json());
        resolve(response.json());
      })
      .catch((error) =>
      {
        console.error('API Error : ', error.status);
        console.error('API Error : ', JSON.stringify(error));
        reject(error.json());
      });
    });
  }
}
