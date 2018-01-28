import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, ModalController, ActionSheetController } from 'ionic-angular';
import { AdaProvider } from '../../providers/ada/ada';

// import * as ClipboardJS from '../../assets/clipboard/clipboard';

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
  accountIndex;
  public tabs: any ;
  Stab: string = "Summary";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ada: AdaProvider,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController
    ) {
      this.accountIndex = (navParams.data.accountIdex) ? navParams.data.accountIdex : 0;

      console.log(this.accountIndex);
      this.tabs = [
        {
          'name'  : 'Summary',
          'iconsvg'  : '../assets/img/wallet-nav/summary-ic.inline.svg'
        },
        {
          'name': 'Send',
          'iconsvg'  : '../assets/img/wallet-nav/send-ic.inline.svg'
        },
        {
          'name'  : 'Receive',
          'iconsvg'  : '../assets/img/wallet-nav/receive-ic.inline.svg'
        },
        {
          'name': 'Transactions',
          'iconsvg'  : '../assets/img/wallet-nav/transactions-ic.inline.svg'
        },
        {
          'name': 'Settings',
          'iconsvg'  : '../assets/img/wallet-nav/wallet-settings-2-ic.inline.svg'
        }
      ]
  }

  ionViewDidLoad(){
    if(this.ada.wallets.length){
      // this.clipboard = new ClipboardJS('#cpyBtn');
      // this.clipboard.on('success', () => {
      //   let toast = this.toastCtrl.create({
      //     message: 'Address copied to clipboard',
      //     duration: 3000,
      //     position: 'top'
      //   });
      //   toast.present();
      // });
    }
  }
  
}