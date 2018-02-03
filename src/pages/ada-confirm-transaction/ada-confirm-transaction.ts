import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdaConfirmTransactionPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  back(){

  }

  send(){

  }
}
