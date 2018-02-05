import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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

  walletPhrase = new FormControl('', Validators.compose([Validators.minLength(5), Validators.pattern('[a-zA-Z ]*'), Validators.required]));
  isValidwalletPhrase = true;
  passwordsMatch = true;
  rePass = new FormControl('', Validators.compose([Validators.minLength(7),Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$"), Validators.required]));
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public ada: AdaProvider
  ) {
    this.slideOneForm = formBuilder.group({
      walletName: ['', Validators.compose([Validators.minLength(5), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      walletPhrase: this.walletPhrase,
      pass: ['', Validators.compose([Validators.minLength(7),Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$"), Validators.required])],
      rePass: this.rePass,
    });

    this.walletPhrase
    .valueChanges
    .debounceTime(700)
    .subscribe(() => this.isValidMnemonic());

    this.rePass
    .valueChanges.subscribe(() => this.isPasswordMatch());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdaRecoverWalletModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  isPasswordMatch(){
    this.passwordsMatch = this.rePass.value == this.slideOneForm.controls.pass.value;
  }

  isValidMnemonic(){
    this.isValidwalletPhrase = <any>this.ada.isValidMnemonic(this.walletPhrase.value);
    console.log(this.isValidwalletPhrase);
  }

  restoreWallet(){
    this.submitAttempt = true;
    if(this.slideOneForm.valid && this.isValidwalletPhrase && this.passwordsMatch){
      console.log('form is valid');
      this.ada.presentLoader();
      this.ada.restoreWallet({
        recoveryPhrase: this.walletPhrase.value,
        walletName: this.slideOneForm.controls.walletName.value,
        walletPassword: this.rePass.value,
      }).then((wallet)=>{
        this.ada.postRestoreAdaWallet(wallet).then(()=>{
          this.ada.closeLoader();
        }).catch((error)=>{
          console.log(error);
        })
      }).catch((error)=>{
        console.log(error);
      })
    }else{
      console.log('invalid form');
    }
  }

  restoreWalletProxy(){
    this.submitAttempt = true;
    if(this.slideOneForm.valid){
      const walletName = this.slideOneForm.controls.walletName.value;
      const walletPassword = this.slideOneForm.controls.rePass.value;
      const assurance = 'CWAStrict';
      const unit = 0;
      const walletInitData: AdaWalletInitData = {
        cwInitMeta: {
          cwName: walletName,
          cwAssurance: assurance,
          cwUnit: unit,
        },
        cwBackupPhrase: {
          bpToList: (this.slideOneForm.controls.walletPhrase.value.split(" ")), // array of mnemonic words
        }
      };

      let restoreAdaWalletParams: RestoreAdaWalletParams = { walletPassword, walletInitData};
      console.log(restoreAdaWalletParams);
      this.ada.proxyRestoreWallet(restoreAdaWalletParams).then((res)=>{
        console.log(res);
      }).catch((error)=>{
        console.error(error);
      });
		} else {
      console.log('form invalid');
    }
  }
}
