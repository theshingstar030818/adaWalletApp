import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AdaProvider } from '../../providers/ada/ada';

/**
 * Generated class for the AdaCreateNewWalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ada-create-new-wallet',
  templateUrl: 'ada-create-new-wallet.html',
})
export class AdaCreateNewWalletPage {

  slideOneForm: FormGroup;
  submitAttempt: boolean = false;
  
  activatePasswordChecked = false;
  passwordsMatch = true;
  rePass = new FormControl('', Validators.compose([Validators.minLength(7),Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$"), Validators.required]));

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public ada: AdaProvider,
    public alertCtrl: AlertController,
  ) {
    this.slideOneForm = formBuilder.group({
      walletName: ['', Validators.compose([Validators.minLength(3), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      pass: ['', Validators.compose([Validators.minLength(7),Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$"), Validators.required])],
      rePass: this.rePass,
      activatePasswordChecked: this.activatePasswordChecked
    });

    this.rePass
    .valueChanges.subscribe(() => this.isPasswordMatch());
  }

  isPasswordMatch(){
    this.passwordsMatch = this.rePass.value == this.slideOneForm.controls.pass.value;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdaCreateNewWalletPage');
  }

  ionViewDidEnter() {
    console.log('ionViewWillEnter AdaCreateNewWalletPage');
    if(!this.navParams.get('overriderDismiss') && this.ada.wallets.length){
      this.dismiss();
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  createWallet(){
    console.log(this.slideOneForm.value);
    this.submitAttempt = true;
    if(this.slideOneForm.valid){
      this.ada.walletInitData.cwInitMeta.cwName = this.slideOneForm.value.walletName;
      this.ada.walletInitData.password = this.slideOneForm.value.rePass;
      this.ada.getRandomMemonic();
      this.showConfirm();
		} else {
      console.log('form invalid');
    }
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'RECOVERY PHRASE',
      message: `
      <p >  On the following screen, you will see a 12-word phrase. This is your wallet backup phrase. It can be entered in any version of Daedalus in order to restore your wallet.</p>
      <p style="color: red;" > <b>  Please make sure nobody looks into your screen unless you want them to have access to your funds. </b> </p>`,
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: (data) => {
            console.log('Agree clicked: ' + data);
            if(data){
              this.showPhraseWrittenDownConfirm();
            }else{
              this.ada.presentToast('Please Agree and then');
              return false;
            }
          }
        }
      ]
    });
    confirm.addInput({
      type: 'radio',
      label: 'I agree',
      value: 'accept',
      checked: false
    });
    confirm.present();
  }

  showPhraseWrittenDownConfirm() {
    console.log('showPhraseWrittenDownConfirm');
    let alert = this.alertCtrl.create({
      title: `<h1>RECOVERY PHRASE</h1>`,
      message: '<p > The phrase is case sensitive. Please make sure you write down and save your recovery phrase. You will need this phrase to use and restore your wallet.</p> <b style="color: red !important;">'+this.ada.walletInitData.cwBackupPhrase.bpToList.toString()+'</b>',
      buttons: [{
        text: 'Yes, I have written it down.',
        handler: () => {
          console.log('Yes, I have written it down. clicked');
          this.showBtcRecoveryPhraseVerifyModal();
        }
      }]
    });
    alert.present();
  }

  showBtcRecoveryPhraseVerifyModal(){
    this.navCtrl.push('AdaRecoveryPhraseVerifyModalPage', {});
  }
}
