import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdaProvider } from '../../providers/ada/ada';

/**
 * Generated class for the AdaRecoverWalletModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ada-recover-wallet-modal',
  templateUrl: 'ada-recover-wallet-modal.html',
})
export class AdaRecoverWalletModalPage {

	slideOneForm: FormGroup;
	submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public ada: AdaProvider
  ) {
    this.slideOneForm = formBuilder.group({
    walletName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
    walletPhrase: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
    activatePasswordChecked: false
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdaRecoverWalletModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  restoreWallet(){
    this.submitAttempt = true;
    console.log(this.slideOneForm.value);
    if(this.slideOneForm.valid){
      this.ada.recoverWallet(this.slideOneForm).then((res)=>{
        console.log(res);
      }).catch((error)=>{
        console.error(error);
      });
		} else {
      console.log('form invalid');
    }
  }
}
