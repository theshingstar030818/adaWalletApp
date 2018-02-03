import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';

/**
 * Generated class for the BtcPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-btc',
  templateUrl: 'btc.html',
})
export class BtcPage {

  @ViewChild('myTabs') tabRef: Tabs;
  
  settings: any;
  transactions: any;
  trade: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
    this.settings = 'BtcSettingsPage';
    this.transactions = 'BtcTransactionsPage';
    this.trade = 'BtcTradePage';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BtcPage');
  }
}