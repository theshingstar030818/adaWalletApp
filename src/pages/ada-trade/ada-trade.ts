import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, ModalController, ActionSheetController } from 'ionic-angular';
import { AdaProvider } from '../../providers/ada/ada';

import * as ClipboardJS from '../../assets/clipboard/clipboard';

/**
 * Generated class for the AdaTradePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ada-trade',
  templateUrl: 'ada-trade.html',
})
export class AdaTradePage {

  tabComponent: string = 'AdaPage';
  trade: string = "sendReceive";
  clipboard;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ada: AdaProvider,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController
    ) {
      console.log(ada.wallets);
      // this.ada.getWallets();
  }

  ionViewDidLoad(){
    if(this.ada.wallets.length){
      this.clipboard = new ClipboardJS('#cpyBtn');
      this.clipboard.on('success', () => {
        let toast = this.toastCtrl.create({
          message: 'Address copied to clipboard',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      });
    }
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Recover Wallet by',
      buttons: [
        {
          text: 'Recovery Phrase',
          handler: () => {
            console.log('Recovery Phrase clicked');
            this.restoreWallet();
          }
        },{
          text: 'Private Key',
          handler: () => {
            console.log('Private Key clicked');
            this.showAdaWalletRecoverUsingIdPage();
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  showAdaWalletRecoverUsingIdPage(){
    let modal = this.modalCtrl.create('AdaWalletRecoverUsingIdPage', {});
    modal.present();
  }

  showBtcRecoveryPhraseVerifyModal(){
    let modal = this.modalCtrl.create('AdaRecoveryPhraseVerifyModalPage', {});
    modal.present();
  }

  addWallet(){
    let modal = this.modalCtrl.create('AdaCreateNewWalletPage', {});
    modal.present();
  }

  addWalletAlert(){
    let prompt = this.alertCtrl.create({
      title: 'CREATE WALLET',
      message: "Enter a name for this new wallet",
      inputs: [
        {
          name: 'walletName',
          placeholder: 'e.g Shopping Wallet'
        },
        {
          name: 'walletPass',
          placeholder: 'Wallet Password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked : ' + data);
          }
        },
        {
          text: 'Create Wallet',
          handler: data => {
            if(data.walletName.length > 0 && data.walletPass.length > 8){
              this.ada.walletInitData.cwInitMeta.cwName = data.walletName;
              this.ada.walletInitData.password = data.walletPass;
              this.ada.getRandomMemonic();
              this.showConfirm();
            }else{
              this.ada.presentToast("Enter Wallet Name & Password");
              return false;
            }
          }
        }
      ]
    });
    prompt.present();
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'RECOVERY PHRASE',
      message: `
      <p >  On the following screen, you will see a 12-word phrase. This is your wallet backup phrase. It can be entered in any version of Daedalus in order to restore your wallet.</p>
      <p style="color: red;" > <b>  Please make sure nobody looks into your screen unless you want them to have access to your funds. </b> </p>`,
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: (data) => {
            console.log('Agree clicked: ' + data);
            if(data){
              this.showPhraseWrittenDownConfirm();
            }else{
              this.ada.presentToast("Please Agree and then ");
              return false;
            }
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
      title: `<h1>RECOVERY PHRASE</h1> 
      <br> 
      <p> The phrase is case sensitive. Please make sure you write down and save your recovery phrase. You will need this phrase to use and restore your wallet.</p>`,
      message: '',
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

  restoreWallet() {
    let modal = this.modalCtrl.create('AdaRecoverWalletModalPage', {});
    modal.present();
  }

  sendADA(){
    let modal = this.modalCtrl.create('AdaSendPage', {});
    modal.present();
  }

  receiveADA(){
    let modal = this.modalCtrl.create('AdaReceivePage', {});
    modal.present();
  }

  // test code 
  getAllWallets(){
    this.ada.getAllWallets();
  }

}