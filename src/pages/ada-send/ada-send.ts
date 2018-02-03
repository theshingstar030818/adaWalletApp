import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ModalController } from 'ionic-angular';

/**
 * Generated class for the AdaSendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ada-send',
  templateUrl: 'ada-send.html',
})
export class AdaSendPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdaSendPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  next() {
    let modal = this.modalCtrl.create('AdaConfirmTransactionPage', {});
    modal.present();
  }
}
