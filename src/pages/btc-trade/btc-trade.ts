import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';

import { BtcProvider } from '../../providers/btc/btc';

/**
 * Generated class for the BtcTradePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-btc-trade',
  templateUrl: 'btc-trade.html',
})
export class BtcTradePage {

  trade: string = "buySell";
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public btcProvider: BtcProvider,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController
    ) {

  }

  showBtcRecoveryPhraseVerifyModal(){
    let modal = this.modalCtrl.create('adaRecoveryPhraseVerifyModalPage', {phrase: [['Charming', 'Victoria', 'Title', 'Mission', 'Parking', 'Loft', 'Amazing', 'Mordern', 'View', 'Sensitive', 'Included', 'Great']]});
    modal.present();
  }

  // addWallet(){
  //   let prompt = this.alertCtrl.create({
  //     title: 'CREATE WALLET',
  //     message: "Enter a name for this new wallet",
  //     inputs: [
  //       {
  //         name: 'walletName',
  //         placeholder: 'e.g Shopping Wallet'
  //       },
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         handler: data => {
  //           console.log('Cancel clicked : ' + data);
  //         }
  //       },
  //       {
  //         text: 'Create Wallet',
  //         handler: data => {
  //           console.log('Cancel clicked : ' + data);
  //           this.showConfirm();
  //         }
  //       }
  //     ]
  //   });
  //   prompt.present();
  // }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'RECOVERY PHRASE',
      message: `
      <p >  On the following screen, you will see a 12-word phrase. This is your wallet backup phrase. It can be entered in any version of Daedalus in order to restore your wallet.</p>
      <p style="color: red;" >  Please make sure nobody looks into your screen unless you want them to have access to your funds.</p>`,
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked');
            this.showPhraseWrittenDownConfirm();
          }
        }
      ]
    });

    confirm.addInput({
      type: 'radio',
      label: 'I agree',
      value: 'accept',
      checked: false
    });
    
    confirm.present();
  }

  showPhraseWrittenDownConfirm() {
    let alert = this.alertCtrl.create({
      title: `RECOVERY PHRASE`,
      message: `
        <p > The phrase is case sensitive. Please make sure you write down and save your recovery phrase. You will need this phrase to use and restore your wallet.</p>
        <p style="color:red;" >Charming Victoria Title Mission Parking Loft Amazing Mordern View Sensitive Included Great</p>
      `,
      buttons: [{
        text: 'Yes, I have written it down.',
        handler: () => {
          console.log('Yes, I have written it down. clicked');
          this.showBtcRecoveryPhraseVerifyModal();
        }
      }]
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BtcTradePage');
  }



}
