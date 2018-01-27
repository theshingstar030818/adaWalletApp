import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AdaWalletRecoverUsingIdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ada-wallet-recover-using-id',
  templateUrl: 'ada-wallet-recover-using-id.html',
})
export class AdaWalletRecoverUsingIdPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdaWalletRecoverUsingIdPage');
  }

}
