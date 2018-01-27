import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

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


import { RestoreAdaWalletParams, AdaWallet, AdaAccounts, AdaTransactions, AdaTransactionFee, AdaAddress, AdaTransaction } from './types';
import { CreateWalletResponse, WalletAlreadyRestoredError, GenericApiError } from './common';
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
  public wallets: any = [];
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
    public db: DynamoDB,
    public cognito: Cognito, public config: Config
  ) {
    this.loadDataFromLocalStore();
    this.initLoader();
  }

  loadDataFromLocalStore(){
    this.localStorageApi.getWallets().then((wallets)=>{
      this.wallets = wallets;
    })
    this.localStorageApi.getAccounts().then((accounts)=>{
      this.accounts = accounts;
    })
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

  getWalletWithMnemonic() {
    let x = {
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
    };
    console.log(x);
    this.db.getDocumentClient().query(x).promise().then((data) => {
      console.log(data);
      if (this.refresher) {
        this.refresher.complete();
      }
    }).catch((err) => {
      console.log(err);
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
            this.wallets.push(wallet);
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
        this.accounts = JSON.parse(res['_body'])["Right"];
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
              this.wallets.push(wallet);
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

    return new Wallet({
      id: data.cwId,
      amount: new BigNumber(data.cwAmount.getCCoin).dividedBy(LOVELACES_PER_ADA),
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
