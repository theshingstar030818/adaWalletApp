import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AdaProvider, CreateTransactionRequest } from '../../providers/ada/ada';
import { BigNumber } from 'bignumber.js';
import { CreateTransactionResponse } from '../../providers/ada/common';
/**
 * Generated class for the AdaConfirmTransactionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ada-confirm-transaction',
  templateUrl: 'ada-confirm-transaction.html',
})
export class AdaConfirmTransactionPage {

  transactionRequest: CreateTransactionRequest;
  adaTxFee: BigNumber;
  totalAmount: BigNumber = new BigNumber(0);
  
  pass = '';
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public ada: AdaProvider
  ) {
    if(!navParams.data){this.navCtrl.setRoot('AdaPage')}
    this.transactionRequest = navParams.data.transactionRequest;
    this.adaTxFee = navParams.data.adaTxFee;
    if(!this.transactionRequest || !this.adaTxFee ){this.navCtrl.setRoot('AdaPage')}
    console.log(this.transactionRequest);
    console.log(this.adaTxFee);
    this.totalAmount = this.adaTxFee.add(this.transactionRequest.amount);
    console.log(this.totalAmount);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdaConfirmTransactionPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  back(){
    this.dismiss();
  }

  send(){
    let tmpTransaction = {
      sender: this.transactionRequest.sender,
      receiver: this.transactionRequest.receiver,
      amount: ((parseFloat(this.transactionRequest.amount)*1000000).toFixed(0)).toString(),
      password: this.pass,
    }
    console.log(tmpTransaction);
    this.transactionRequest.password = this.pass;
    this.ada.createTransaction(tmpTransaction).then((createTransactionResponse: CreateTransactionResponse)=>{
      console.log(createTransactionResponse);
      this.ada.presentToast('Transaction Successful');
      this.dismiss();
    }).catch((error)=>{
      console.log(error);
      this.ada.presentToast(error.defaultMessage);
    });
  }
}
