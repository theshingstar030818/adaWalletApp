import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, ModalController, ActionSheetController } from 'ionic-angular';
import { AdaProvider, UpdateWalletRequest } from '../../providers/ada/ada';
import { Wallet } from '../../providers/ada/domain/Wallet';
import 'rxjs/add/operator/debounceTime';
import {Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { BigNumber } from 'bignumber.js';
import { DECIMAL_PLACES_IN_ADA } from '../../providers/ada/config/numbersConfig';

/**
 * Generated class for the AdaTradePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ada-trade',
  templateUrl: 'ada-trade.html',
})
export class AdaTradePage {

  tabComponent: string = 'AdaPage';
  trade: string = "sendReceive";
  wallet: Wallet;
  accountIndex;
  public tabs: any ;
  Stab: string = "Summary";
  textInput = new FormControl('');
  genAddPass = ""
  
  adaTxFee: BigNumber = new BigNumber(0.000000);
  adaTxErrorMessage = '';
  isAdaTxAllowed = true;

  receiver = new FormControl('', Validators.required);
  amount = new FormControl('0.000000', Validators.required);

  isReceiverValid = true;

  private sendAdaFormGroup : FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ada: AdaProvider,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    ) {
      if(!navParams.data){this.navCtrl.setRoot('AdaPage')}
      this.accountIndex = navParams.data.accountIndex;
      this.wallet = navParams.data.wallet;

      this.sendAdaFormGroup = this.formBuilder.group({
        sender: [this.ada.accounts[this.wallet.id].caId, Validators.required],
        // sender: [this.wallet.id, Validators.required],
        receiver: this.receiver,
        amount: this.amount,
      });

      if(!this.wallet){
        this.navCtrl.setRoot('AdaPage');
      }

      this.textInput
      .valueChanges
      .debounceTime(1000)
      .subscribe(() => this.updateAdaWallet());

      this.receiver
      .valueChanges
      .debounceTime(1000)
      .subscribe(() => this.isValidAdaAddress());

      this.amount
      .valueChanges
      .debounceTime(1100)
      .subscribe(() => this.calculateTransactionFee());


      console.log(this.accountIndex);
      this.tabs = [
        {
          'name'  : 'Summary',
          'iconsvg'  : 'assets/img/wallet-nav/summary-ic.inline.svg'
        },
        {
          'name': 'Send',
          'iconsvg'  : 'assets/img/wallet-nav/send-ic.inline.svg'
        },
        {
          'name'  : 'Receive',
          'iconsvg'  : 'assets/img/wallet-nav/receive-ic.inline.svg'
        },
        {
          'name': 'Transactions',
          'iconsvg'  : 'assets/img/wallet-nav/transactions-ic.inline.svg'
        },
        {
          'name': 'Settings',
          'iconsvg'  : 'assets/img/wallet-nav/wallet-settings-ic.svg'
        }
      ]
  }

  newAdaWalletAddress(){
    this.ada.presentLoader();
    this.ada.createAddress({
      accountId: this.ada.accounts[this.wallet.id].caId,
      password: this.genAddPass
    }).then(()=>{
      this.ada.syncAdaWallet(this.accountIndex).then(()=>{
        this.ada.closeLoader();
      }).catch((error)=>{
        this.ada.closeLoader();
        console.log(error);
      });
    }).catch((error)=>{
      this.ada.closeLoader();
      console.log(error);
    });
  }

  refreshWallet(){
    this.ada.presentLoader();
    this.ada.syncAdaWallet(()=>{
      this.ada.closeLoader();
    }).catch((error)=>{
      this.ada.closeLoader();
      this.ada.presentToast(error.defaultMessage);
    })
  }

  isValidAdaAddress(){
    console.log(this.receiver.value);
    if(this.receiver.value == ""){this.isReceiverValid = false;return;}
    this.ada.isValidAddress(this.receiver.value).then((res: boolean)=>{
      console.log(res);
      this.isReceiverValid = res;
    }).catch((err)=>{
      console.log(err);
    })
  }

  calculateTransactionFee(){
    console.log(this.amount.value);
    if(!this.receiver.valid || !this.isReceiverValid){this.isReceiverValid=false;return;}
    if(this.amount.value == "0.000000" || this.amount.value == "0" || this.amount.value == ""){
      this.amount.setValue("0.000000");
      this.adaTxErrorMessage='Please enter an amount';
      this.isAdaTxAllowed = false;
      return;
    }
    
    let tmpAmount = (new BigNumber(this.amount.value).toFormat(DECIMAL_PLACES_IN_ADA)).toString();
    this.amount.setValue(tmpAmount);
    
    this.ada.calculateTransactionFee({
      sender: this.sendAdaFormGroup.controls.sender.value,
      receiver: this.receiver.value,
      amount: ((parseFloat(tmpAmount)*1000000).toFixed(0)).toString()
    }).then((res: BigNumber)=>{
      console.log(res);
      this.adaTxFee = res;
      this.isAdaTxAllowed = true;
    }).catch((err)=>{
      this.isAdaTxAllowed = false;
      this.adaTxErrorMessage = err.defaultMessage;
      console.log(err);
    })
  }

  convetToLoveLace(amount: string){
    let tmpAmountNum :number = parseFloat(parseFloat(amount).toFixed(6));
    this.amount.setValue(tmpAmountNum.toString());
    tmpAmountNum *= 1000000;
    return tmpAmountNum;
  }

  ionViewWillEnter(){
    if(!this.wallet){
      this.navCtrl.setRoot('AdaPage');
    }
  }

  newAdaPayment(){
    if(this.sendAdaFormGroup.valid && this.isAdaTxAllowed && this.isReceiverValid){
      let transactionRequest = {
        sender: this.sendAdaFormGroup.controls.sender.value,
        receiver: this.receiver.value,
        amount: this.amount.value,
        password: '',
      };
      let modal = this.modalCtrl.create('AdaConfirmTransactionPage', {transactionRequest: transactionRequest, adaTxFee: this.adaTxFee});
      modal.present();
    }else{
      this.calculateTransactionFee();
      this.isValidAdaAddress();
      console.log('invalid info');
    }
  }

  changeAdaWalletPassphrase(){
    console.log('changeAdaWalletPassphrase');
    let modal = this.modalCtrl.create('AdaChangeWalletPassphraseModalPage',{
      wallet: this.wallet
    });
    modal.present();
  }

  updateAdaWallet(){
    let updateWalletRequest: UpdateWalletRequest = {
      walletId: this.ada.wallets[this.accountIndex].id,
      name: this.ada.wallets[this.accountIndex].name,
      assurance: this.ada.wallets[this.accountIndex].assurance,
    }
    this.ada.updateWallet(updateWalletRequest).then((wallet=>{
      this.ada.wallets[this.accountIndex] = wallet;
      this.ada.localStorageApi.setWallets(this.ada.wallets);
    }))
  }

  scanBarcode(){
    this.ada.scanBarCode().then((data)=>{
      // {"cancelled":0,"text":"DdzFFzCqrhspgVMkDvrJSfRJbFrFa31TDkCjyt5RqibCcJLh1XiTfhKuKWrvFkrgpSvHyLfpons5BHdtqthr3aRBoE3a8V43uiskTyFc","format":"QR_CODE"}
      // this.receiver.value =
      console.log(data);
      console.log('check if can read data right ....');
      console.log((<any>data).text);
      this.showAlert(JSON.stringify(data));
      this.receiver.setValue((<any>data).text);
    }).catch((error)=>{
      console.log(error);
    })
  }

  showAlert(data) {
    console.log('alert called ....');
    let alert = this.alertCtrl.create({
      title: 'QR code data',
      subTitle: data,
      buttons: ['OK']
    });
    alert.present();
  }

  copyOlderAddress(address){
    this.ada.copyToClipboard(address);
  }

  copyAddressToClipboard(address){
    console.log(address.innerText);
    this.ada.copyToClipboard(address.innerText);
  }

  next() {
    let modal = this.modalCtrl.create('AdaConfirmTransactionPage', {});
    modal.present();
  }

  ionViewDidLoad(){
    
  }
  
}