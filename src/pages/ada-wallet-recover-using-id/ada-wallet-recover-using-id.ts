import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AdaProvider } from '../../providers/ada/ada';

/**
 * Generated class for the AdaWalletRecoverUsingIdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ada-wallet-recover-using-id',
  templateUrl: 'ada-wallet-recover-using-id.html',
})
export class AdaWalletRecoverUsingIdPage {

  key='';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public ada: AdaProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdaWalletRecoverUsingIdPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  restoreAdaWalletUsingId(key){
    this.ada.restoreAdaWalletUsingId(key).then(()=>{
      this.dismiss();
    }).catch((error)=>{
      console.log(error);
    });
  }

  pasteFromClipboard(){
    this.ada.pasteFromClipboard().then((res)=>{
      this.key = <string>res;
    }).catch((error)=>{
      console.log(error);
      this.ada.presentToast(error);
    })
  }

}
