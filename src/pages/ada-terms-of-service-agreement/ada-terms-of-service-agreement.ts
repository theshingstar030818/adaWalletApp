import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the AdaTermsOfServiceAgreementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ada-terms-of-service-agreement',
  templateUrl: 'ada-terms-of-service-agreement.html',
})
export class AdaTermsOfServiceAgreementPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdaTermsOfServiceAgreementPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
