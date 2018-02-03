import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AdaBuyProvider } from '../../providers/ada-buy/ada-buy'
/**
 * Generated class for the AdaBuySellPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ada-buy-sell',
  templateUrl: 'ada-buy-sell.html',
})
export class AdaBuySellPage {

  public mobileNo: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public adaBuy:AdaBuyProvider
  ) {
  }
  

  GetInfo(){
    this.adaBuy.GetCustomerInfo(this.mobileNo);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdaBuySellPage');
  }

}
