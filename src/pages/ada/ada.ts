import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  NavParams,
  ActionSheetController 
} from 'ionic-angular';

import { AdaSendReceivePage } from '../ada-send-receive/ada-send-receive';
import { AdaBuySellPage } from '../ada-buy-sell/ada-buy-sell';
import { AdaSettingsPage } from '../ada-settings/ada-settings';
import { AdaProvider } from '../../providers/ada/ada';

/**
 * Generated class for the AdaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ada',
  templateUrl: 'ada.html',
})
export class AdaPage {

  settings: any = AdaSettingsPage;
  adaBuySell: any = AdaBuySellPage;
  adaSendReceive: any = AdaSendReceivePage;
  mySelectedIndex: number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public ada: AdaProvider,
    public actionSheetCtrl: ActionSheetController
  ) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
    console.log(this.mySelectedIndex);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdaPage');
    this.ada.getWallets();
  }
}
