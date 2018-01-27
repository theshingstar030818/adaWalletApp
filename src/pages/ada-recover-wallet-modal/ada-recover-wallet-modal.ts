import { Component } from '@angular/core';
import { split } from 'lodash';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdaProvider } from '../../providers/ada/ada';
import { RestoreAdaWalletParams, AdaWalletInitData } from '../../providers/ada/types';
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
    console.log(this.slideOneForm.value);
    this.submitAttempt = true;
    if(this.slideOneForm.valid){
      const walletName = '';
      const walletPassword = '';
      const assurance = 'CWANormal';
      const unit = 0;
      const walletInitData: AdaWalletInitData = {
        cwInitMeta: {
          cwName: walletName,
          cwAssurance: assurance,
          cwUnit: unit,
        },
        cwBackupPhrase: {
          bpToList: split('recoveryPhrase'), // array of mnemonic words
        }
      };

      let restoreAdaWalletParams: RestoreAdaWalletParams = { walletPassword, walletInitData};
    
      this.ada.restoreAdaWallet(restoreAdaWalletParams).then((res)=>{
        console.log(res);
      }).catch((error)=>{
        console.error(error);
      });
		} else {
      console.log('form invalid');
    }
  }
}
