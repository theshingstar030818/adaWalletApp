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

  phrase;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public ada: AdaProvider
  ) {
    this.phrase = ada.walletInitData.cwBackupPhrase.bpToList;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdaRecoveryPhraseVerifyModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  verifyPhraseAndCreateWallet(){
    this.ada.createWallet().then((data)=>{
      console.log(data);
    }).catch((error)=>{
      console.log(error);
    })
    this.dismiss();
  }
}
