import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AdaProvider } from '../../providers/ada/ada';
import { Wallet } from '../../providers/ada/domain/Wallet';
/**
 * Generated class for the AdaChangeWalletPassphraseModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ada-change-wallet-passphrase-modal',
  templateUrl: 'ada-change-wallet-passphrase-modal.html',
})
export class AdaChangeWalletPassphraseModalPage {

  wallet: Wallet;
  slideOneForm: FormGroup;
  submitAttempt: boolean = false;
  passwordsMatch = true;
  repeatPassword = new FormControl('', Validators.compose([Validators.minLength(7),Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$"), Validators.required]));
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public ada: AdaProvider
  ) {
    
    this.wallet = navParams.data.wallet;

    this.slideOneForm = formBuilder.group({
      currentPassword: ['', Validators.compose([Validators.minLength(7),Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$"), Validators.required])],
      newPassword: ['', Validators.compose([Validators.minLength(7),Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$"), Validators.required])],
      repeatPassword: this.repeatPassword,
      removePaswordChecked: false
    });
  
    this.repeatPassword.valueChanges.subscribe(() => this.isPasswordMatch());
  }

  isPasswordMatch(){
    this.passwordsMatch = this.repeatPassword.value == this.slideOneForm.controls.newPassword.value;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdaChangeWalletPassphraseModalPage');
  }

  changeAdaWalletPassword(){
    console.log(this.slideOneForm.value);
    this.submitAttempt = true;
    if(this.slideOneForm.valid && this.passwordsMatch){
      this.ada.updateWalletPassword({
        walletId: this.wallet.id,
        oldPassword: this.slideOneForm.controls.currentPassword.value,
        newPassword: this.slideOneForm.controls.repeatPassword.value,
      }).then((res: boolean)=>{
        if(res){
          console.log('update success');
          this.ada.presentToast('Wallet password updated succesfully.');
          this.dismiss();
        }else{
          console.log('update fail');
          this.ada.presentToast('Wallet password updated unccesfully.');
        }
      }).catch((error)=>{
        this.ada.presentToast(error.defaultMessage);
        console.log(error);
      });
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
