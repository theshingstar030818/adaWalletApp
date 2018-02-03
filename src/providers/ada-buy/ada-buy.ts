import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the AdaBuyProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AdaBuyProvider {

  private finjaCustInfoUrl : string = 'http://devmerchant.finpay.pk/public/api/getCustInfo';
  private finjaPaymentUrl : string = 'http://devmerchant.finpay.pk/public/api/paymentToMerchant';
  
  private finjaMerchantID : string = '506986460';
  private finjaAccountNo : string ;

  constructor(public http: HttpClient) {
    console.log('Hello AdaBuyProvider Provider');
  }

//
  GetCustomerInfo(mobile){

    this.finjaAccountNo = mobile;

    let url = this.finjaCustInfoUrl;

    let data = {
      mobileNo:this.finjaAccountNo, 
      customerIdMerchant:this.finjaMerchantID
    };

    this.http.post(url,data,).subscribe(result => {
      console.log(result);
      //let custInfo = JSON.parse(result);
    }, err => {
      console.log(err);
    });

  }

  InitiatePaymentOTP(Amount,OTP){

    let url = this.finjaPaymentUrl;
    this.http.post(url,{
      mobileNo:this.finjaAccountNo, 
      customerIdMerchant:this.finjaMerchantID,
      amount: Amount,
      otp: OTP,
      customerId: '',
      customerName: ''
    })
    .subscribe(data => {
      console.log(data);
    }, err => {
      console.log(err);
    });

  }

}
