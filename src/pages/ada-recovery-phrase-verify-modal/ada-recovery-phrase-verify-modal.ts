import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { AdaProvider } from '../../providers/ada/ada';

/**
 * Generated class for the AdaRecoveryPhraseVerifyModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ada-recovery-phrase-verify-modal',
  templateUrl: 'ada-recovery-phrase-verify-modal.html',
})
export class AdaRecoveryPhraseVerifyModalPage {

  phrase = ['Charming', 'Victoria', 'Title', 'Mission', 'Parking', 'Loft', 'Amazing', 'Mordern', 'View', 'Sensitive', 'Included', 'Great'];
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public ada: AdaProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdaRecoveryPhraseVerifyModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  verifyPhraseAndCreateWallet(){
    console.log("adding wallet");
    this.ada.wallets.push({
      walletName: 'My new wallet'
    });
    this.dismiss();
  }

}
