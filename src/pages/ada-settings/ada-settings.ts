import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AdaProvider } from '../../providers/ada/ada';
/**
 * Generated class for the AdaSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ada-settings',
  templateUrl: 'ada-settings.html',
})
export class AdaSettingsPage {

  tabComponent: string = 'AdaPage';
  transactionAssuranceSecurityLevel: string = "normal";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public ada: AdaProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdaSettingsPage');
  }

}
