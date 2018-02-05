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

  phrase = '';
  reEnteredPhrase = '';
  disabledPhraseWords = [0,0,0,0,0,0,0,0,0,0,0,0];
  orignalPhrase = '';
  reEnteredPhraseIsValid: boolean = false;
  reEnteredPhraseCounter = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public ada: AdaProvider
  ) {
    this.orignalPhrase = this.ada.walletInitData.cwBackupPhrase.bpToList[0];
    console.log(ada.walletInitData.cwBackupPhrase.bpToList);
    this.phrase = this.shuffle((<string>ada.walletInitData.cwBackupPhrase.bpToList[0]).split(' '));
    console.log(this.phrase);
  }

  phraseSelected(phrase, disableSwitchIndex){
    this.disabledPhraseWords[disableSwitchIndex] = 1;
    this.reEnteredPhrase += phrase + ' ';
    this.reEnteredPhraseCounter ++;
    this.reEnteredPhraseIsValid = (this.reEnteredPhraseCounter == 12 && this.orignalPhrase == this.reEnteredPhrase.slice(0, -1));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdaRecoveryPhraseVerifyModalPage');
  }

  clearReEnteredPhrase(){
    this.reEnteredPhrase = '';
    this.disabledPhraseWords = [0,0,0,0,0,0,0,0,0,0,0,0];
    this.reEnteredPhraseCounter = 0;
    this.reEnteredPhraseIsValid = false;
    console.log("clearReEnteredPhrase");
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }

  verifyPhraseAndCreateWallet(){
    if(this.reEnteredPhraseIsValid){
      this.ada.createWallet_my().then((data)=>{
        console.log(data);
        this.dismiss();
      }).catch((error)=>{
        console.log(error);
        this.dismiss();
      });      
    }else{
      this.ada.presentToast('Phrase  ');
    }
    
  }

  /**
   * Shuffles array in place. ES6 version
   * @param {Array} a items An array containing the items.
   */
  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}
