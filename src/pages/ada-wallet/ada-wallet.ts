import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AdaTradePage } from '../ada-trade/ada-trade';
import { AdaTransactionsPage } from '../ada-transactions/ada-transactions';
import { AdaSettingsPage } from '../ada-settings/ada-settings';
import { AdaProvider } from '../../providers/ada/ada';
/**
 * Generated class for the AdaWalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ada-wallet',
  templateUrl: 'ada-wallet.html',
})
export class AdaWalletPage {

  settings: any = AdaSettingsPage;
  transactions: any = AdaTransactionsPage;
  trade: any = AdaTradePage;
  mySelectedIndex: number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public ada: AdaProvider
  ) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdaPage');
    this.ada.getWallets();
  }

}
