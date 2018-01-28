import { Injectable } from '@angular/core';

import { 
  LoadingController,
  ActionSheetController,
  ModalController,
  AlertController
} from 'ionic-angular';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Clipboard } from '@ionic-native/clipboard';
import {Http, Headers, RequestOptionsArgs} from '@angular/http';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

import { has, split } from 'lodash';
import { LOVELACES_PER_ADA } from './config/numbersConfig';
import BigNumber from 'bignumber.js';
import { unixTimestampToDate } from './lib/utils';
import { isValidMnemonic } from './lib/decrypt';

import { WalletAddress } from './domain/WalletAddress';
import { WalletTransaction, transactionTypes } from './domain/WalletTransaction';


import { 
  RestoreAdaWalletParams, 
  AdaWallet,
  AdaWallets,
  AdaAccounts, 
  AdaTransactions, 
  AdaTransactionFee, 
  AdaAddress, 
  AdaTransaction 
} from './types';

import { 
  CreateWalletResponse, 
  WalletAlreadyRestoredError, 
  GenericApiError 
} from './common';

import { generateMnemonic } from './utils/crypto';
import { Wallet } from './domain/Wallet';
import { ToastController } from 'ionic-angular';
import { LocalStoreProvider } from '../local-store/local-store';

import { DynamoDB } from '../../providers/aws.dynamodb';
import { Config } from 'ionic-angular';
import { Cognito } from '../aws.cognito';
import { User } from '../../providers/user';

declare var AWS: any;

/*
  Generated class for the AdaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AdaProvider {

  private baseUrl: string = 'https://pacecouriers.com:8099';
  private getWalletsUrl: string = '/api/wallets';
  public walletInitData = {
    cwInitMeta: {
      cwName: '',
      cwAssurance: '',
      cwUnit: 0,
    },
    cwBackupPhrase: {
      bpToList: [], // array of mnemonic words
    },
    password: '',
  };

  accountIndex = '@2147483648';

  public loader: any;
  public wallets: AdaWallets = [];
  public accounts: any = [];
  public transactions: AdaTransactions;
  public skip: number = 0;
  private limit: number = 10;
  public refresher: any;
  private taskTable: string = 'ionic-mobile-hub-ada';

  constructor(
    public http: Http,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public localStorageApi: LocalStoreProvider,
    public user: User,
    public cognito: Cognito, 
    public config: Config,
    private clipboard: Clipboard,
    public db: DynamoDB,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
  ) {
    this.initLoader();
    this.loadDataFromLocalStore();
  }

  loadDataFromLocalStore(){
    this.localStorageApi.getWallets().then((wallets)=>{
      this.wallets = wallets;
      console.log(wallets);
    })
    this.localStorageApi.getAccounts().then((accounts)=>{
      this.accounts = accounts;
      console.log(accounts);
    })
  }

  copyToClipboard(data){
    this.clipboard.copy(data);
  }

  pasteFromClipboard(){
    this.clipboard.paste().then((resolve: string) => {
        alert(resolve);
    },(reject: string) => {
        alert('Error: ' + reject);
      }
    );
  }

  initLoader(){
    this.loader = this.loadingCtrl.create({
        content: "Please wait ...",
    });
  };

  presentLoader() {
    this.loader.present()
  };

  closeLoader(){
      this.loader.dismiss();
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Recover Wallet by',
      buttons: [
        {
          text: 'Recovery Phrase',
          handler: () => {
            console.log('Recovery Phrase clicked');
            this.restoreWallet();
          }
        },{
          text: 'Private Key',
          handler: () => {
            console.log('Private Key clicked');
            this.showAdaWalletRecoverUsingIdPage();
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  showAdaWalletRecoverUsingIdPage(){
    let modal = this.modalCtrl.create('AdaWalletRecoverUsingIdPage', {});
    modal.present();
  }

  showBtcRecoveryPhraseVerifyModal(){
    let modal = this.modalCtrl.create('AdaRecoveryPhraseVerifyModalPage', {});
    modal.present();
  }

  addWallet(){
    let modal = this.modalCtrl.create('AdaCreateNewWalletPage', {overriderDismiss: true});
    modal.present();
  }

  addWalletAlert(){
    let prompt = this.alertCtrl.create({
      title: 'CREATE WALLET',
      message: "Enter a name for this new wallet",
      inputs: [
        {
          name: 'walletName',
          placeholder: 'e.g Shopping Wallet'
        },
        {
          name: 'walletPass',
          placeholder: 'Wallet Password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked : ' + data);
          }
        },
        {
          text: 'Create Wallet',
          handler: data => {
            if(data.walletName.length > 0 && data.walletPass.length > 8){
              this.walletInitData.cwInitMeta.cwName = data.walletName;
              this.walletInitData.password = data.walletPass;
              this.getRandomMemonic();
              this.showConfirm();
            }else{
              this.presentToast("Enter Wallet Name & Password");
              return false;
            }
          }
        }
      ]
    });
    prompt.present();
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
              this.presentToast("Please Agree and then ");
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
    let alert = this.alertCtrl.create({
      title: `<h1>RECOVERY PHRASE</h1> 
      <br> 
      <p> The phrase is case sensitive. Please make sure you write down and save your recovery phrase. You will need this phrase to use and restore your wallet.</p>`,
      message: '',
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

  restoreWallet() {
    let modal = this.modalCtrl.create('AdaRecoverWalletModalPage', {});
    modal.present();
  }

  sendADA(){
    let modal = this.modalCtrl.create('AdaSendPage', {});
    modal.present();
  }

  receiveADA(){
    let modal = this.modalCtrl.create('AdaReceivePage', {});
    modal.present();
  }

  addRestoreAdaWallet(){
    let actionSheet = this.actionSheetCtrl.create({
      title: '+ ADD WALLET',
      buttons: [
        {
          text: 'Create new wallet',
          handler: () => {
            console.log('Create New Wallet clicked');
            this.addWallet();
          }
        },{
          text: 'Restore wallet from backup',
          handler: () => {
            console.log('Restore wallet from backup clicked');
            this.presentActionSheet();
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  getWallets() {
    console.log(AWS.config.credentials.identityId);
    this.db.getDocumentClient().query({
      'TableName': this.taskTable,
      'IndexName': 'DateSorted',
      'KeyConditionExpression': "#userId = :userId",
      'ExpressionAttributeNames': {
        '#userId': 'userId',
      },
      'ExpressionAttributeValues': {
        ':userId': AWS.config.credentials.identityId
      },
      'ScanIndexForward': false
    }).promise().then((data) => {
      console.log(data);
      if (this.refresher) {
        this.refresher.complete();
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  connectWalletToUser(id) {
    let item = {
      'taskId': id,
      'category': 'Wallet',
      'userId': AWS.config.credentials.identityId,
      'created': (new Date().getTime() / 1000)
    };    
    this.db.getDocumentClient().put({
      'TableName': this.taskTable,
      'Item': item,
      'ConditionExpression': 'attribute_not_exists(id)'
    }, (err, data) => {
      console.log(data);
      if (err) { 
        console.log(err); 
      }
      this.getWallets();
    });
  }

  getAllWallets() {
    return new Promise(resolve => {
      let url = this.baseUrl+this.getWalletsUrl;
      this.http.get(url).subscribe(data => {
        console.log(data);
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  restoreAdaWallet(restoreAdaWalletParams: RestoreAdaWalletParams): Promise<AdaWallet>{
    console.log(restoreAdaWalletParams);
    this.presentLoader();
    let path = '/api/wallets/restore'; 
    let url = this.baseUrl+path;
    let headers = new Headers({
      'Content-Type' : 'application/json'
    });
    let requestOptionsArgs: RequestOptionsArgs = {"headers":headers};
    let sample = { 
      "cwInitMeta": { 
        "cwName": "yo yo", 
        "cwAssurance": "CWAStrict",
        "cwUnit": 0
      },
      "cwBackupPhrase": {
        // "bpToList": [ "library", "inspire", "post", "retreat", "crumble", "fish", "profit", "balance", "category", "catalog", "suggest", "web"]
        // "bpToList": [ "wash", "session", "bullet", "pink", "chef", "hazard",  "pull", "swamp", "ceiling", "try", "joy", "toddler"]
        // "bpToList": [ "region", "place", "mandate", "employ", "invite", "celery", "ripple", "cigar", "feature", "melody", "soul", "village"]
        // "bpToList": [ "define", "owner", "glare", "mixture", "drum", "palm", "side", "gauge", "clerk", "fringe", "bulb"]
        // "bpToList": [ "wire", "bleak", "entire", "cream", "load", "explain", "horror", "trophy", "celery", "ripple", "into", "glance"]
        // "bpToList": [ "prepare", "history", "lock", "census", "nuclear", "ticket", "yard", "abandon", "faculty", "raw", "explain", "aisle"]
        // "bpToList": [ "fault", "census", "fatal", "joke", "armor", "spring", "away", "this", "people", "stumble", "drive", "joke"]
        // "bpToList": [ "across", "few", "gallery", "door", "tilt", "want", "one", "mammal", "devote", "bubble", "daughter", "lesson"]
        // "bpToList": [ "toilet", "curtain", "stadium", "hazard", "hub", "trash", "stuff", "salon", "stable", "lunar", "window", "metal",]
        // "bpToList": [ "couple", "noise", "replace", "fiber", "artist", "jazz", "marriage", "reduce", "region", "fiscal", "hawk", "mosquito"]
        // "bpToList": [ "since", "task", "manage", "virtual", "lunch", "brain", "school", "teach", "master", "penalty", "expose", "twice"]
        "bpToList": [ "paddle", "melody", "civil", "ocean", "aim", "debris", "movie", "spread", "vote", "gown", "core", "luggage"]
        // "bpToList": [ "wash", "session", "bullet", "pink", "chef", "hazard", "pull", "swamp", "ceiling", "try", "joy", "toddler"]
      }
    }
    
    let data = JSON.stringify(sample);
    
    return new Promise((resolve, reject) => {

      try {
        this.http.post(url, data, requestOptionsArgs)
        .timeout(100000000)
        .subscribe(res => {

          let responseBody = JSON.parse(res['_body']);
          this.closeLoader();
          if (has(responseBody, 'Right')) {
            // "Right" means 200 ok (success) -> also handle if Right: false (boolean response)
            let wallet = this._createWalletFromServerData(responseBody['Right'] );
            this.wallets.push(<any>wallet);
            this.localStorageApi.setWallets(this.wallets).then((wallets)=>{
              console.log('wallet stored to local storage');
              console.log(wallets);
              resolve(responseBody['Right']);
            }).catch((error)=>{
              this.presentToast(error.message);
              reject(new Error(error));
            });
          } else if (has(responseBody, 'Left')) {
            // "Left" means error case -> return error with contents (exception on nextUpdate)
            if (responseBody) {
              let err = new Error(responseBody['Left'].contents);
              this.presentToast(err.message);
              reject(new Error(responseBody['Left'].contents));
            } else {
              this.presentToast('Unknown response from backend.');
              reject(new Error('Unknown response from backend.'));
            }
          } else {
            this.presentToast('Unknown response from backend.');
            reject(new Error('Unknown response from backend.'));
          }   
        }, (err) => {
          reject(err);
        });
      } catch (error) {
        // TODO: backend will return something different here, if multiple wallets
        // are restored from the key and if there are duplicate wallets we will get
        // some kind of error and present the user with message that some wallets
        // where not imported/restored if some where. if no wallets are imported
        // we will error out completely with throw block below
        if (error.message.includes('Wallet with that mnemonics already exists')) {
          throw new WalletAlreadyRestoredError();
        }
        // We don't know what the problem was -> throw generic error
        throw new GenericApiError();
      }
    });
  }

  getTransactions(walletId, skip, limit) {
    console.log(walletId);
    try {
      this.getAdaHistoryByWallet(walletId, skip, limit ).then((history: AdaTransactions)=>{
        console.log(history);
        this.transactions = <AdaTransactions>JSON.parse(history['_body'])["Right"];
        return this.transactions;
      })
    } catch (error) {
      throw new GenericApiError();
    }
  }

  getAdaHistoryByWallet(walletId, skip, limit): Promise<AdaTransactions> {
    console.log(walletId);
    return new Promise((resolve, reject) => {
      this.presentLoader();
      let path = '/api/txs/histories?walletId='+walletId+'&skip='+skip+'&limit='+limit; 
      let url = this.baseUrl+path;
      let data = {
        walletId: walletId,
        skip: skip,
        limit: limit,
      }
      let stringData = JSON.stringify(data);
      this.http.get(url, stringData ).subscribe(res => {
        console.log(res);
        resolve(<any>res);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }


  getAccount(accountId): Promise<AdaAccounts> {
    return new Promise((resolve, reject) => {
      this.presentLoader();
      let path = '/api/accounts?accountId='+accountId; 
      let url = this.baseUrl+path;
      this.http.get(url).subscribe(res => {
        this.accounts.push(JSON.parse(res['_body'])["Right"][0]);
        this.localStorageApi.setAccounts(this.accounts).then(()=>{
          console.log('accounts stored to local storage');
          resolve(this.accounts);
        }).catch((error)=>{
          this.presentToast(error.message);
          reject(new Error(error));
        });
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  createWallet(): Promise<CreateWalletResponse> {

    this.presentLoader();
    let path = '/api/wallets/new'; 
    let url = this.baseUrl+path;
    let headers = new Headers({
      'Content-Type' : 'application/json'
    });
    let requestOptionsArgs: RequestOptionsArgs = {"headers":headers};
    // let password = 'abc';
    const assurance = 'CWAStrict';
    const unit = 0;
    try {
      this.walletInitData.cwInitMeta.cwAssurance = assurance;
      this.walletInitData.cwInitMeta.cwUnit = unit;

      console.log(this.walletInitData);
      let data = JSON.stringify(this.walletInitData);

      return new Promise((resolve, reject) => {
        this.http.post(url, data, requestOptionsArgs)
        .timeout(100000000)
        .subscribe(res => {
          let responseBody = JSON.parse(res['_body']);
          if (has(responseBody, 'Right')) {
            // "Right" means 200 ok (success) -> also handle if Right: false (boolean response)
            this.getTransactions(responseBody['Right'].cwId, this.skip, this.limit);
            this.getAccount(responseBody['Right'].cwId).then(()=>{
              let wallet = this._createWalletFromServerData(responseBody['Right'] );
              this.connectWalletToUser(wallet.id);
              this.wallets.push(<any>wallet);
              this.localStorageApi.setWallets(this.wallets).then((wallets)=>{
                console.log('wallet stored to local storage');
                console.log(wallets);
                this.closeLoader();
                resolve(responseBody['Right']);
              }).catch((error)=>{
                this.presentToast(error.message);
                reject(new Error(error));
              });
            }).catch((error)=>{
              this.closeLoader();
              this.presentToast(error.message);
              reject(new Error(error));
            });
          } else if (has(responseBody, 'Left')) {
            // "Left" means error case -> return error with contents (exception on nextUpdate)
            if (responseBody) {
              let err = new Error(responseBody['Left'].contents);
              this.closeLoader();
              this.presentToast(err.message);
              reject(new Error(responseBody['Left'].contents));
            } else {
              this.closeLoader();
              this.presentToast('Unknown response from backend.');
              reject(new Error('Unknown response from backend.'));
            }
          } else {
            this.closeLoader();
            this.presentToast('Unknown response from backend.');
            reject(new Error('Unknown response from backend.'));
          }
        })
      });
    } catch (error) {
      this.closeLoader();
      this.presentToast('Response from backend : ' + error.message);
    }
  }

  isValidMnemonic(mnemonic: string): Promise<boolean> {
    return isValidMnemonic(mnemonic, 12);
  }

  getRandomMemonic(){
    let memonic = split(generateMnemonic());
    this.walletInitData.cwBackupPhrase.bpToList = memonic;
    return memonic;
  }

  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  // ========== TRANSFORM SERVER DATA INTO FRONTEND MODELS =========

  _createWalletFromServerData(data) {
    let amount = new BigNumber(data.cwAmount.getCCoin)
    console.log(amount);
    console.log(amount.toPrecision(6));
    return new Wallet({
      id: data.cwId,
      amount: amount,
      name: data.cwMeta.cwName,
      assurance: data.cwMeta.cwAssurance,
      hasPassword: data.cwHasPassphrase,
      passwordUpdateDate: unixTimestampToDate(data.cwPassphraseLU),
    });
  };
  
  _createAddressFromServerData (data: AdaAddress) {
      new WalletAddress({
        id: data.cadId,
        amount: new BigNumber(data.cadAmount.getCCoin).dividedBy(LOVELACES_PER_ADA),
        isUsed: data.cadIsUsed,
      })
    };
  
  _conditionToTxState = (condition: string) => {
    switch (condition) {
      case 'CPtxApplying': return 'pending';
      case 'CPtxWontApply': return 'failed';
      default: return 'ok'; // CPtxInBlocks && CPtxNotTracked
    }
  };
  
  _createTransactionFromServerData = (data: AdaTransaction) => {
      const coins = data.ctAmount.getCCoin;
      const { ctmTitle, ctmDescription, ctmDate } = data.ctMeta;
      return new WalletTransaction({
        id: data.ctId,
        title: ctmTitle || data.ctIsOutgoing ? 'Ada sent' : 'Ada received',
        type: data.ctIsOutgoing ? transactionTypes.EXPEND : transactionTypes.INCOME,
        amount: new BigNumber(data.ctIsOutgoing ? -1 * coins : coins).dividedBy(LOVELACES_PER_ADA),
        date: unixTimestampToDate(ctmDate),
        description: ctmDescription || '',
        numberOfConfirmations: data.ctConfirmations,
        addresses: {
          from: data.ctInputs.map(address => address[0]),
          to: data.ctOutputs.map(address => address[0]),
        },
        state: this._conditionToTxState(data.ctCondition),
      });
    };
  
  _createTransactionFeeFromServerData = (data: AdaTransactionFee) => {
      const coins = data.getCCoin;
      return new BigNumber(coins).dividedBy(LOVELACES_PER_ADA);
  };
}
