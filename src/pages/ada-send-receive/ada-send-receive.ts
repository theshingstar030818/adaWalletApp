import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, ModalController, ActionSheetController } from 'ionic-angular';
import { AdaProvider } from '../../providers/ada/ada';

// import * as ClipboardJS from '../../assets/clipboard/clipboard';

/**
 * Generated class for the AdaSendReceivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ada-send-receive',
  templateUrl: 'ada-send-receive.html',
})
export class AdaSendReceivePage {

  clipboard;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ada: AdaProvider,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController
    ) {}

  walletSelected(wallet, index){
    console.log(wallet);
    if(wallet.syncStatus){
      this.ada.syncAdaWallet(index).then(()=>{
        this.ada.presentToast('Wallet sync complete!');
        this.ada.wallets[index].syncStatus = false;
      }).catch(()=>{
        this.ada.presentToast('Wallet sync in progress.');
      })
    }else{
      this.navCtrl.push('AdaTradePage', {wallet: wallet, accountIndex: index});
    }
  }

  ionViewDidLoad(){}
}
