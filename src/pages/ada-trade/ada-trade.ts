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
  wallet;
  accountIndex;
  public tabs: any ;
  Stab: string = "Summary";
  
  public send = {
    
  }

  public dummyTransaction = {
    time: '2018-01-28T18:48:03.962Z'
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ada: AdaProvider,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    ) {
      if(!navParams.data){this.navCtrl.setRoot('AdaPage')}
      this.accountIndex = navParams.data.accountIndex;
      this.wallet = navParams.data.wallet;

      if(!this.wallet){
        this.navCtrl.setRoot('AdaPage');
      }

      console.log(this.accountIndex);
      this.tabs = [
        {
          'name'  : 'Summary',
          'iconsvg'  : 'assets/img/wallet-nav/summary-ic.inline.svg'
        },
        {
          'name': 'Send',
          'iconsvg'  : 'assets/img/wallet-nav/send-ic.inline.svg'
        },
        {
          'name'  : 'Receive',
          'iconsvg'  : 'assets/img/wallet-nav/receive-ic.inline.svg'
        },
        {
          'name': 'Transactions',
          'iconsvg'  : 'assets/img/wallet-nav/transactions-ic.inline.svg'
        },
        {
          'name': 'Settings',
          'iconsvg'  : 'assets/img/wallet-nav/wallet-settings-ic.svg'
        }
      ]
  }

  copyAddressToClipboard(address){
    console.log(address.innerText);
    this.ada.copyToClipboard(address.innerText);
  }

  next() {
    let modal = this.modalCtrl.create('AdaConfirmTransactionPage', {});
    modal.present();
  }

  ionViewDidLoad(){
    
  }
  
}