import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the AdaChangeWalletPassphraseModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ada-change-wallet-passphrase-modal',
  templateUrl: 'ada-change-wallet-passphrase-modal.html',
})
export class AdaChangeWalletPassphraseModalPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdaChangeWalletPassphraseModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
