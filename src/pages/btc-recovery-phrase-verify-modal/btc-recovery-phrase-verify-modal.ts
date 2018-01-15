import { Component } from '@angular/core';
import { IonicPage, Platform, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the BtcRecoveryPhraseVerifyModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-btc-recovery-phrase-verify-modal',
  templateUrl: 'btc-recovery-phrase-verify-modal.html',
})
export class BtcRecoveryPhraseVerifyModalPage {

  phrase = ['Charming', 'Victoria', 'Title', 'Mission', 'Parking', 'Loft', 'Amazing', 'Mordern', 'View', 'Sensitive', 'Included', 'Great'];

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    console.log(this.phrase);
    this.phrase = this.params.get('phrase');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
