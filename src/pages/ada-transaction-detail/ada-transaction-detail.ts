import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { WalletTransaction } from '../../providers/ada/domain/WalletTransaction';
import { AdaProvider } from '../../providers/ada/ada';

/**
 * Generated class for the AdaTransactionDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ada-transaction-detail',
  templateUrl: 'ada-transaction-detail.html',
})
export class AdaTransactionDetailPage {

  transaction;
  transactionWallet: WalletTransaction;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public ada: AdaProvider
  ) {
    this.transaction = navParams.data.transaction;
    this.transactionWallet = new WalletTransaction(this.transaction);
    console.log(this.transactionWallet);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdaTransactionDetailPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
