import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { LocalStoreProvider } from '../local-store/local-store';
import async from 'async';
import { LoadingController,ActionSheetController,ModalController,AlertController } from 'ionic-angular';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Clipboard } from '@ionic-native/clipboard';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import {Http, Headers, RequestOptionsArgs} from '@angular/http';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

//  DAEDALUS IMPORTS

import { generateMnemonic } from './utils/crypto';

// import { getAdaWallets } from './getAdaWallets';
import { changeAdaWalletPassphrase } from './api/changeAdaWalletPassphrase';
import { deleteAdaWallet } from './api/deleteAdaWallet';
import { newAdaWallet } from './api/newAdaWallet';
import { newAdaWalletAddress } from './api/newAdaWalletAddress';
import { restoreAdaWallet } from './api/restoreAdaWallet';
import { updateAdaWallet } from './api/updateAdaWallet';
import { exportAdaBackupJSON } from './api/exportAdaBackupJSON';
import { importAdaBackupJSON } from './api/importAdaBackupJSON';
import { importAdaWallet } from './api/importAdaWallet';
import { getAdaWalletAccounts } from './api/getAdaWalletAccounts';
import { isValidAdaAddress } from './api/isValidAdaAddress';
import { adaTxFee } from './api/adaTxFee';
import { newAdaPayment } from './api/newAdaPayment';
import { redeemAda } from './api/redeemAda';
import { redeemAdaPaperVend } from './api/redeemAdaPaperVend';
import { getAdaHistoryByWallet } from './api/getAdaHistoryByWallet';
import { getAdaAccountRecoveryPhrase } from './getAdaAccountRecoveryPhrase';
import { getAdaLocalTimeDifference } from './api/getAdaLocalTimeDifference';
import { getAdaSyncProgress } from './api/getAdaSyncProgress';

import { split, has } from 'lodash';
import BigNumber from 'bignumber.js';
import { Logger, stringifyData, stringifyError } from './utils/logging';
import { unixTimestampToDate } from './lib/utils';
import { transactionTypes, WalletTransaction } from './domain/WalletTransaction';
import { Wallet } from './domain/Wallet';
import { WalletAddress } from './domain/WalletAddress';
import { isValidMnemonic } from './lib/decrypt';
import { LOVELACES_PER_ADA } from './config/numbersConfig';


import {
  AdaLocalTimeDifference,
  AdaSyncProgressResponse,
  AdaAddress,
  AdaAccounts,
  AdaTransaction,
  AdaTransactionFee,
  AdaTransactions,
  AdaWallet,
  AdaWalletRecoveryPhraseResponse,

  RestoreAdaWalletParams

} from './types';

import {
  CreateWalletRequest,
  CreateWalletResponse,
  CreateTransactionResponse,
  DeleteWalletRequest,
  DeleteWalletResponse,
  GetLocalTimeDifferenceResponse,
  GetSyncProgressResponse,
  GetTransactionsRequest,
  GetTransactionsResponse,
  GetWalletRecoveryPhraseResponse,
  // GetWalletsResponse,
  RestoreWalletRequest,
  RestoreWalletResponse,
  UpdateWalletResponse,
  UpdateWalletPasswordRequest,
  UpdateWalletPasswordResponse,
} from './common';

import {
  GenericApiError,
  IncorrectWalletPasswordError,
  WalletAlreadyRestoredError,
} from './common';

import {
  AllFundsAlreadyAtReceiverAddressError,
  NotAllowedToSendMoneyToRedeemAddressError,
  NotAllowedToSendMoneyToSameAddressError,
  NotEnoughFundsForTransactionFeesError,
  NotEnoughMoneyToSendError,
  RedeemAdaError,
  WalletAlreadyImportedError,
  WalletFileImportError,
} from './errors';

// ADA specific Request / Response params
export type GetAddressesResponse = {
  accountId?: string,
  addresses: Array<WalletAddress>,
};
export type GetAddressesRequest = {
  walletId: string,
};
export type CreateAddressResponse = WalletAddress;
export type CreateAddressRequest = {
  accountId: string,
  password?: string,
};

export type CreateTransactionRequest = {
  sender: string,
  receiver: string,
  amount: string,
  password?: string,
};
export type UpdateWalletRequest = {
  walletId: string,
  name: string,
  assurance: string,
};
export type RedeemAdaRequest = {
  redemptionCode: string,
  accountId: string,
  walletPassword?: string,
};
export type RedeemAdaResponse = Wallet;
export type RedeemPaperVendedAdaRequest = {
  shieldedRedemptionKey: string,
  mnemonics: string,
  accountId: string,
  walletPassword?: string,
};
export type RedeemPaperVendedAdaResponse = RedeemPaperVendedAdaRequest;
export type ImportWalletFromKeyRequest = {
  filePath: string,
  walletPassword?: string,
};
export type ImportWalletFromKeyResponse = Wallet;
export type ImportWalletFromFileRequest = {
  filePath: string,
  walletPassword?: string,
  walletName?: string,
};
export type ImportWalletFromFileResponse = Wallet;
export type NextUpdateResponse = {
  version?: string,
};
export type PostponeUpdateResponse = Promise<void>;
export type ApplyUpdateResponse = Promise<void>;

export type TransactionFeeRequest = {
  sender: string,
  receiver: string,
  amount: string,
};
export type TransactionFeeResponse = BigNumber;
export type ExportWalletToFileRequest = {
  walletId: string,
  filePath: string,
  password: string
};
export type ExportWalletToFileResponse = [''];

// AMAZON WEB SERVICES IMPORTS

import { DynamoDB } from '../../providers/aws.dynamodb';
import { Config } from 'ionic-angular';
import { Cognito } from '../aws.cognito';
import { User } from '../../providers/user';
import { now } from 'moment';
declare var AWS: any;

// CERTIFICATES 

const ca = '../../tls/ca.crt';

/*
  Generated class for the AdaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AdaProvider {

  private baseUrl: string = 'https://pacecouriers.com:8099';
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
  public wallets: Wallet[] = [];
  public accounts: any = {};
  public transactions: any = {};
  public skip: number = 0;
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
    private barcodeScanner: BarcodeScanner,
  ) {
    this.initLoader();
    this.loadDataFromLocalStore();
  }

  async getAddresses(request: GetAddressesRequest): Promise<GetAddressesResponse> {
    Logger.debug('AdaApi::getAddresses called: ' + stringifyData(request));
    const { walletId } = request;
    try {
      const response: AdaAccounts = await getAdaWalletAccounts({ ca, walletId });
      Logger.debug('AdaApi::getAddresses success: ' + stringifyData(response));
      if (!response.length) {
        return { 
          accountId: null, 
          addresses: Array<WalletAddress>()
        };
      }
      // For now only the first wallet account is used
      const firstAccount = response[0];
      const firstAccountId = firstAccount.caId;
      const firstAccountAddresses = firstAccount.caAddresses;

      return {
        accountId: firstAccountId,
        addresses: <any>(firstAccountAddresses.map(data => this._createAddressFromServerData(data))),
      };
    } catch (error) {
      Logger.error('AdaApi::getAddresses error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  async getTransactions(request: GetTransactionsRequest): Promise<GetTransactionsResponse> {
    Logger.debug('AdaApi::searchHistory called: ' + stringifyData(request));
    const { walletId, skip, limit } = request;
    try {
      const history: AdaTransactions = await getAdaHistoryByWallet({ ca, walletId, skip, limit });
      Logger.debug('AdaApi::searchHistory success: ' + stringifyData(history));
      return {
        transactions: history[0].map(data => this._createTransactionFromServerData(data)),
        total: history[1]
      };
    } catch (error) {
      Logger.error('AdaApi::searchHistory error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  async createWallet(request: CreateWalletRequest): Promise<CreateWalletResponse> {
    Logger.debug('AdaApi::createWallet called');
    const { name, mnemonic, password } = request;
    const assurance = 'CWANormal';
    const unit = 0;
    try {
      const walletInitData: any = {
        cwInitMeta: {
          cwName: name,
          cwAssurance: assurance,
          cwUnit: unit,
        },
        cwBackupPhrase: {
          bpToList: split(mnemonic), // array of mnemonic words
        }
      };
      const wallet: AdaWallet = await newAdaWallet({ ca, password, walletInitData });
      Logger.debug('AdaApi::createWallet success');
      return this._createWalletFromServerData(wallet);
    } catch (error) {
      Logger.error('AdaApi::createWallet error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  async deleteWallet(request: DeleteWalletRequest): Promise<DeleteWalletResponse> {
    Logger.debug('AdaApi::deleteWallet called: ' + stringifyData(request));
    try {
      const { walletId } = request;
      await deleteAdaWallet({ ca, walletId });
      Logger.debug('AdaApi::deleteWallet success: ' + stringifyData(request));
      return true;
    } catch (error) {
      Logger.error('AdaApi::deleteWallet error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  async createTransaction(request: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    console.log('AdaApi::createTransaction called');
    const { sender, receiver, amount, password } = request;
    // sender must be set as accountId (account.caId) and not walletId
    try {
      // default value. Select (OptimizeForSecurity | OptimizeForSize) will be implemented
      const groupingPolicy = 'OptimizeForSecurity';
      const response: AdaTransaction = await newAdaPayment(
        { ca, sender, receiver, amount, groupingPolicy, password }
      );
      console.log('AdaApi::createTransaction success: ' + stringifyData(response));
      return this._createTransactionFromServerData(response);
    } catch (error) {
      console.log('AdaApi::createTransaction error: ' + stringifyError(error));
      // eslint-disable-next-line max-len
      if (error.message.includes('It\'s not allowed to send money to the same address you are sending from')) {
        throw new NotAllowedToSendMoneyToSameAddressError();
      }
      if (error.message.includes('Destination address can\'t be redeem address')) {
        throw new NotAllowedToSendMoneyToRedeemAddressError();
      }
      if (error.message.includes('Not enough money')) {
        throw new NotEnoughMoneyToSendError();
      }
      if (error.message.includes('Passphrase doesn\'t match')) {
        throw new IncorrectWalletPasswordError();
      }
      throw new GenericApiError();
    }
  }

  async calculateTransactionFee(request: TransactionFeeRequest): Promise<TransactionFeeResponse> {
    console.log('AdaApi::calculateTransactionFee called');
    const { sender, receiver, amount } = request;
    try {
      // default value. Select (OptimizeForSecurity | OptimizeForSize) will be implemented
      const groupingPolicy = 'OptimizeForSecurity';
      const response = await adaTxFee(
        { ca, sender, receiver, amount, groupingPolicy }
      );
      console.log('AdaApi::calculateTransactionFee success: ' + stringifyData(response));
      return this._createTransactionFeeFromServerData(response);
    } catch (error) {
      console.log('AdaApi::calculateTransactionFee error: ' + stringifyError(error));
      // eslint-disable-next-line max-len
      if (error.message.includes('not enough money on addresses which are not included in output addresses set')) {
        throw new AllFundsAlreadyAtReceiverAddressError();
      }
      if (error.message.includes('not enough money')) {
        throw new NotEnoughFundsForTransactionFeesError();
      }
      throw new GenericApiError();
    }
  }

  async createAddress(request: CreateAddressRequest): Promise<CreateAddressResponse> {
    Logger.debug('AdaApi::createAddress called');
    const { accountId, password } = request;
    try {
      const response: AdaAddress = await newAdaWalletAddress(
        { ca, password, accountId }
      );
      Logger.debug('AdaApi::createAddress success: ' + stringifyData(response));
      return <any>this._createAddressFromServerData(response);
    } catch (error) {
      Logger.error('AdaApi::createAddress error: ' + stringifyError(error));
      if (error.message.includes('Passphrase doesn\'t match')) {
        throw new IncorrectWalletPasswordError();
      }
      throw new GenericApiError();
    }
  }

  isValidAddress(address: string): Promise<boolean> {
    if(!address){address=''}
    return isValidAdaAddress({ ca, address });
  }  

  isValidMnemonic(mnemonic: string): Promise<boolean> {
    let b = isValidMnemonic(mnemonic, 12);
    console.log(b);
    return b;
  }

  getWalletRecoveryPhrase(): Promise<GetWalletRecoveryPhraseResponse> {
    Logger.debug('AdaApi::getWalletRecoveryPhrase called');
    try {
      const response: Promise<AdaWalletRecoveryPhraseResponse> = new Promise(
        (resolve) => resolve(getAdaAccountRecoveryPhrase())
      );
      Logger.debug('AdaApi::getWalletRecoveryPhrase success');
      return response;
    } catch (error) {
      Logger.error('AdaApi::getWalletRecoveryPhrase error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  async restoreWallet(request: RestoreWalletRequest): Promise<RestoreWalletResponse> {
    Logger.debug('AdaApi::restoreWallet called');
    const { recoveryPhrase, walletName, walletPassword } = request;
    const assurance = 'CWANormal';
    const unit = 0;

    const walletInitData = {
      cwInitMeta: {
        cwName: walletName,
        cwAssurance: assurance,
        cwUnit: unit,
      },
      cwBackupPhrase: {
        bpToList: split(recoveryPhrase), // array of mnemonic words
      }
    };

    try {
      const wallet: AdaWallet = await restoreAdaWallet(
        <any>({ ca, walletPassword, walletInitData })
      );
      Logger.debug('AdaApi::restoreWallet success');
      return this._createWalletFromServerData(wallet);
    } catch (error) {
      Logger.error('AdaApi::restoreWallet error: ' + stringifyError(error));
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
  }

  async importWalletFromKey(
    request: ImportWalletFromKeyRequest
  ): Promise<ImportWalletFromKeyResponse> {
    Logger.debug('AdaApi::importWalletFromKey called');
    const { filePath, walletPassword } = request;
    try {
      const importedWallet: AdaWallet = await importAdaWallet(
        { ca, walletPassword, filePath }
      );
      Logger.debug('AdaApi::importWalletFromKey success');
      return this._createWalletFromServerData(importedWallet);
    } catch (error) {
      Logger.error('AdaApi::importWalletFromKey error: ' + stringifyError(error));
      if (error.message.includes('already exists')) {
        throw new WalletAlreadyImportedError();
      }
      throw new WalletFileImportError();
    }
  }

  async importWalletFromFile(
    request: ImportWalletFromFileRequest
  ): Promise<ImportWalletFromFileResponse> {
    Logger.debug('AdaApi::importWalletFromFile called');
    const { filePath, walletPassword } = request;
    const isKeyFile = filePath.split('.').pop().toLowerCase() === 'key';
    try {
      const importedWallet: AdaWallet = isKeyFile ? (
        await importAdaWallet({ ca, walletPassword, filePath })
      ) : (
        await importAdaBackupJSON({ ca, filePath })
      );
      Logger.debug('AdaApi::importWalletFromFile success');
      return this._createWalletFromServerData(importedWallet);
    } catch (error) {
      Logger.error('AdaApi::importWalletFromFile error: ' + stringifyError(error));
      if (error.message.includes('already exists')) {
        throw new WalletAlreadyImportedError();
      }
      throw new WalletFileImportError();
    }
  }

  scanBarCode(){
    return new Promise((resolve, reject) => {
      this.barcodeScanner.scan().then((barcodeData) => {
        // Success! Barcode data is here
        console.log(barcodeData);
        resolve(barcodeData);
      }, (err) => {
        // An error occurred
        console.log(err);
        reject(err);
      });
    });
  }

  async redeemAda(request: RedeemAdaRequest): Promise<RedeemAdaResponse> {
    Logger.debug('AdaApi::redeemAda called');
    const { redemptionCode, accountId, walletPassword } = request;
    try {
      const walletRedeemData = {
        crWalletId: accountId,
        crSeed: redemptionCode,
      };

      const response: AdaTransaction = await redeemAda(
        { ca, walletPassword, walletRedeemData }
      );

      Logger.debug('AdaApi::redeemAda success');
      return <any>(this._createTransactionFromServerData(response));
    } catch (error) {
      Logger.error('AdaApi::redeemAda error: ' + stringifyError(error));
      if (error.message.includes('Passphrase doesn\'t match')) {
        throw new IncorrectWalletPasswordError();
      }
      throw new RedeemAdaError();
    }
  }

  async redeemPaperVendedAda(
    request: RedeemPaperVendedAdaRequest
  ): Promise<RedeemPaperVendedAdaResponse> {
    Logger.debug('AdaApi::redeemAdaPaperVend called');
    const { shieldedRedemptionKey, mnemonics, accountId, walletPassword } = request;
    try {
      const redeemPaperVendedData = {
        pvWalletId: accountId,
        pvSeed: shieldedRedemptionKey,
        pvBackupPhrase: {
          bpToList: split(mnemonics),
        }
      };

      const response: AdaTransaction = await redeemAdaPaperVend(
        { ca, walletPassword, redeemPaperVendedData }
      );

      Logger.debug('AdaApi::redeemAdaPaperVend success');
      return <any>this._createTransactionFromServerData(response);
    } catch (error) {
      Logger.error('AdaApi::redeemAdaPaperVend error: ' + stringifyError(error));
      if (error.message.includes('Passphrase doesn\'t match')) {
        throw new IncorrectWalletPasswordError();
      }
      throw new RedeemAdaError();
    }
  }

  getSyncProgress = async (): Promise<GetSyncProgressResponse> => {
    Logger.debug('AdaApi::syncProgress called');

    try {
      const response: AdaSyncProgressResponse = await getAdaSyncProgress({ ca });
      Logger.debug('AdaApi::syncProgress success: ' + stringifyData(response));
      const localDifficulty = response._spLocalCD.getChainDifficulty.getBlockCount;
      // In some cases we dont get network difficulty & we need to wait for it from the notify API
      let networkDifficulty = null;
      if (response._spNetworkCD) {
        networkDifficulty = response._spNetworkCD.getChainDifficulty.getBlockCount;
      }
      return { localDifficulty, networkDifficulty };
    } catch (error) {
      Logger.error('AdaApi::syncProgress error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  async updateWallet(request: UpdateWalletRequest): Promise<UpdateWalletResponse> {
    Logger.debug('AdaApi::updateWallet called: ' + stringifyData(request));
    const { walletId, name, assurance } = request;
    const unit = 0;

    const walletMeta = {
      cwName: name,
      cwAssurance: assurance,
      cwUnit: unit,
    };

    try {
      const wallet: AdaWallet = await updateAdaWallet({ ca, walletId, walletMeta });
      Logger.debug('AdaApi::updateWallet success: ' + stringifyData(wallet));
      return this._createWalletFromServerData(wallet);
    } catch (error) {
      Logger.error('AdaApi::updateWallet error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  async updateWalletPassword(
    request: UpdateWalletPasswordRequest
  ): Promise<UpdateWalletPasswordResponse> {
    Logger.debug('AdaApi::updateWalletPassword called');
    const { walletId, oldPassword, newPassword } = request;
    try {
      await changeAdaWalletPassphrase({ ca, walletId, oldPassword, newPassword });
      Logger.debug('AdaApi::updateWalletPassword success');
      return true;
    } catch (error) {
      Logger.error('AdaApi::updateWalletPassword error: ' + stringifyError(error));
      if (error.message.includes('Invalid old passphrase given')) {
        throw new IncorrectWalletPasswordError();
      }
      throw new GenericApiError();
    }
  }

  async exportWalletToFile(
    request: ExportWalletToFileRequest
  ): Promise<ExportWalletToFileResponse> {
    const { walletId, filePath } = request;
    Logger.debug('AdaApi::exportWalletToFile called');
    try {
      const response = await exportAdaBackupJSON({ ca, walletId, filePath });
      Logger.debug('AdaApi::exportWalletToFile success: ' + stringifyData(response));
      return response;
    } catch (error) {
      Logger.error('AdaApi::exportWalletToFile error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  async getLocalTimeDifference(): Promise<GetLocalTimeDifferenceResponse> {
    Logger.debug('AdaApi::getLocalTimeDifference called');
    try {
      const response: AdaLocalTimeDifference = await getAdaLocalTimeDifference({ ca });
      Logger.debug('AdaApi::getLocalTimeDifference success: ' + stringifyData(response));
      return response;
    } catch (error) {
      Logger.error('AdaApi::getLocalTimeDifference error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  handleApiRequest(res){
    return new Promise((resolve, reject) => {
      let responseBody = JSON.parse(res['_body']);
      if (has(responseBody, 'Right')) {
        // "Right" means 200 ok (success) -> also handle if Right: false (boolean response)
        resolve (responseBody['Right']);
      } else if (has(responseBody, 'Left')) {
        // "Left" means error case -> return error with contents (exception on nextUpdate)
        if (responseBody) {
          let err = new Error(responseBody['Left'].contents);
          // this.presentToast(err.message);
          reject (err);
        } else {
          // this.presentToast('Unknown response from backend.');
          reject (new Error('Unknown response from backend.'));
        }
      } else {
        // this.presentToast('Unknown response from backend.');
        reject (new Error('Unknown response from backend.'));
      }
    });
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
    this.localStorageApi.getTransactions().then((transactions)=>{
      this.transactions = transactions;
      console.log(transactions);
    })
  }

  copyToClipboard(data){
    let toastData = (<string>data).substring(0,15) + '....';
    this.clipboard.copy(data).then(()=>{
      this.presentToast('Address: ' + toastData + ' copied.');
    }).catch((error)=>{
      console.log(error);
      window.prompt("Copy to clipboard: Ctrl+C, Enter", data);
      this.presentToast('Address: ' + toastData + ' copied.');
    });
  }

  pasteFromClipboard(){
    return new Promise((resolve) => {
      this.clipboard.paste().then((res: string) => {
        console.log(res);
        resolve(res);
      },(err: string) => {
        console.log(window.getSelection().toString());
        console.log(err);
      });
    });
  }

  initLoader(){
    this.loader = this.loadingCtrl.create({
      content: "Please wait ...",
    });
  }



  presentLoader() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait ...",
    });
    this.loader.present();
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
            this.openRestoreWalletModal();
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

  openRestoreWalletModal() {
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
            // this.openRestoreWalletModal();
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

  async getWallets() {
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
      if(data.Items.length!=this.wallets.length){
        async.forEachOf(data.Items, (wallet, index, callback) => {
          console.log(wallet);
          console.log(index);
          this.restoreAdaWalletUsingId(wallet.taskId,true).then(()=>{
            callback();
          }).catch((error)=>{
            return callback(error);
          });
        }, err => {
            if (err) console.error(err.message);
            console.log(err);
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  disconnectWalletToUser(id){
    return new Promise((resolve, reject) => {
      this.db.getDocumentClient().delete({
        'TableName': this.taskTable,
        'Key': {
          'userId': AWS.config.credentials.identityId,
          'taskId': id
        }
      }).promise().then((data) => {
        console.log(data);
        console.log('wallet disconected sucessfully');
        resolve(data);
      }).catch((err) => {
        console.log('there was an error', err);
        reject(err);
      });
    });
  }

  connectWalletToUser(id) {
    let item = {
      'taskId': id,
      'category': 'Wallet',
      'userId': AWS.config.credentials.identityId,
      'created': (new Date().getTime() / 1000)
    };    
    return new Promise((resolve, reject) => {
      this.db.getDocumentClient().put({
        'TableName': this.taskTable,
        'Item': item,
        'ConditionExpression': 'attribute_not_exists(id)'
      }, (err, data) => {
        console.log(data);
        if (err) { 
          console.log(err); 
          reject(err);
        }else{
          resolve(data);
        }
      });
    });
  }

  postRestoreAdaWallet(wallet: RestoreWalletResponse){
    return new Promise((resolve, reject) => {
      this.connectWalletToUser(wallet.id);
      this.wallets.push(wallet);
      this.localStorageApi.setWallets(this.wallets).then(()=>{
        this.syncAdaWallet(this.wallets.length-1).then(()=>{
          resolve();
        }).catch((error)=>{
          console.log(error);
          reject(error)
        })
      }).catch((error)=>{
        this.presentToast(error.message);
        reject(new Error(error));
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
    let data = JSON.stringify(restoreAdaWalletParams.walletInitData);
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

  getTransactions_my(walletId, skip, limit) : Promise<WalletTransaction> {
    return new Promise((resolve, reject) => {
      try {
        this.getAdaHistoryByWallet(walletId, skip, limit ).then((history: WalletTransaction)=>{
          console.log(history);
          this.transactions[walletId] = history;
          this.localStorageApi.setTransactions(this.transactions).then(()=>{
            resolve(history);
          }).catch((error)=>{
            reject(error);
          });
        })
      } catch (error) {
        throw new GenericApiError();
      }
    });
  }

  getAdaHistoryByWallet(walletId, skip, limit): Promise<WalletTransaction> {
    console.log(walletId);
    return new Promise((resolve, reject) => {
      let path = '/api/txs/histories?walletId='+walletId+'&skip='+skip+'&limit='+limit; 
      let url = this.baseUrl+path;
      let data = {
        walletId: walletId,
        skip: skip,
        limit: limit,
      }
      let stringData = JSON.stringify(data);
      this.http.get(url, stringData ).subscribe(res => {
        
        let history = JSON.parse(res['_body'])["Right"];
        let adaHistory = {
          transactions: history[0].map(d => this._createTransactionFromServerData(d)),
          total: history[1]
        }
        console.log(adaHistory);
        this.transactions[walletId] = adaHistory;
        this.localStorageApi.setTransactions(this.transactions).then(()=>{
          resolve(<any>adaHistory);
        }).catch((error)=>{
          console.log(error);
        });        
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  syncAdaWallet(walletIndex){
    let walletId = this.wallets[walletIndex]['id'];
    return new Promise((resolve, reject) => {
      let path = '/api/wallets/'+walletId; 
      let url = this.baseUrl+path;
      this.http.get(url).subscribe(res => {
        this.handleApiRequest(res).then((responseBody)=>{
          let wallet = this._createWalletFromServerData(responseBody);
          console.log(walletIndex);
          console.log(wallet);
          this.getAccount(wallet.id);
          this.getAdaHistoryByWallet(wallet.id,this.skip,1000);
          this.wallets[walletIndex] = wallet;
          this.localStorageApi.setWallets(this.wallets).then(()=>{
            resolve(wallet);
          });
        }).catch((error)=>{
          console.log(error);
          reject(error);
        });
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  getAccount(accountId): Promise<AdaAccounts> {
    return new Promise((resolve, reject) => {
      let path = '/api/accounts?accountId='+accountId; 
      let url = this.baseUrl+path;
      this.http.get(url).subscribe(res => {
        this.accounts[accountId] = JSON.parse(res['_body'])["Right"][0];
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

  restoreAdaWalletUsingId(walletId, force?:boolean): Promise<CreateWalletResponse>{
    return new Promise((resolve, reject) => {
      console.log('restoreAdaWalletUsingId');
      if(walletId.length==0){
        this.presentToast('Invalid Wallet Key');
        resolve();
      }else if(this.accounts[walletId]){
        this.presentToast('Wallet already restored');
        resolve();
      }else{
        let path = '/api/wallets/'+walletId;
        let url = this.baseUrl+path;
          this.http.get(url).subscribe(res => {
            this.handleApiRequest(res).then((responseBody)=>{
              let wallet = this._createWalletFromServerData(responseBody);
              console.log(wallet);
              this.getTransactions_my(wallet.id,0,1000).then(()=>{
                this.getAccount(wallet.id).then(()=>{
                  this.connectWalletToUser(wallet.id);
                  this.wallets.push(wallet);
                  this.localStorageApi.setWallets(this.wallets).then((wallets)=>{
                    console.log(wallets);
                    this.presentToast('Wallet succesfully restored');
                    resolve(wallet);
                  });
                }).catch((error)=>{
                  this.presentToast(error.message);
                });
              }).catch((error)=>{
                this.presentToast(error.message);
              });
            }).catch((error)=>{
              console.log(error);
              if(force){
                let wallet = new Wallet({
                  id: walletId,
                  amount: new BigNumber(0),
                  name: 'Wallet syncing ...',
                  assurance: 'CWAStrict',
                  hasPassword: true,
                  passwordUpdateDate: unixTimestampToDate(now),
                });
                wallet.syncStatus = true;
                this.wallets.push(wallet);
                this.localStorageApi.setWallets(this.wallets).then((wallets)=>{
                  console.log(wallets);
                  this.presentToast('Wallet succesfully restored but still syncing.');
                  resolve(wallet);
                });
              }else{
                this.presentToast(error.message);
              }
              
            });
          }, err => {
            this.presentToast('Wallet restored unsuccessful : ' + err.message);
            console.log(err);
            reject(err);
          });
        }
      });
    }

  newAdaWalletAddress(accountId: string, accountIndex?: number): Promise<WalletAddress> {
    let path = '/api/addresses';
    let url = this.baseUrl+path;
    let headers = new Headers({
      'Content-Type' : 'application/json'
    });
    let requestOptionsArgs: RequestOptionsArgs = {"headers":headers};

    return new Promise((resolve, reject) => {
      let data = JSON.stringify(accountId+this.accountIndex);
      this.http.post(url, data, requestOptionsArgs).subscribe(res => {
        this.syncAdaWallet(accountIndex);
        console.log(res);
        resolve(<any>res);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  deleteAdaWalletLocal(walletId:string, walletIndex:number){
    return new Promise((resolve) => {
      delete this.transactions[walletId];
      delete this.accounts[walletId];
      this.wallets.splice(walletIndex,1);
      this.localStorageApi.setWallets(this.wallets).then(()=>{
        this.localStorageApi.setAccounts(this.accounts).then(()=>{
          this.localStorageApi.setTransactions(this.transactions).then(()=>{
            console.log(this.wallets);
            console.log(this.accounts);
            console.log(this.transactions);
            resolve();
          });
        });
      });
    });
  }

  deleteAdaWallet(walletId, walletIndex){
    return new Promise((resolve, reject) => {
      this.deleteAdaWalletLocal(walletId,walletIndex).then(()=>{
        this.disconnectWalletToUser(walletId).then(()=>{
          // delete wallet from node as well
          let path = '/api/wallets/'+walletId; 
          let url = this.baseUrl+path;
          let headers = new Headers({
            'Content-Type' : 'application/json'
          });
          let requestOptionsArgs: RequestOptionsArgs = {"headers":headers};
          try {
            this.http.delete(url, requestOptionsArgs).subscribe(res => {
              console.log(res);
              resolve();
            });
          }catch(error){
            console.log(error);
            reject(error);
          }
        }).catch((error)=>{
          console.log(error);
          reject(error);
        });
      });
    });
  }

  proxyRestoreWallet(restoreAdaWalletParams: RestoreAdaWalletParams): Promise<AdaWallet>{
    this.presentLoader();
    let restor_path = '/api/wallets/restore';
    let new_path = '/api/wallets/new'; 
    let url_new = this.baseUrl+new_path;
    let url_restore = this.baseUrl+restor_path;
    let headers = new Headers({
      'Content-Type' : 'application/json'
    });
    console.log(url_restore);
    let requestOptionsArgs: RequestOptionsArgs = {"headers":headers};
    let data = JSON.stringify(restoreAdaWalletParams.walletInitData);
    return new Promise((resolve, reject) => {
      this.http.post(url_new, data, requestOptionsArgs).subscribe(res=>{
        console.log(res);
        try{
          this.handleApiRequest(res).then((responseBody)=>{
            let wallet = this._createWalletFromServerData(responseBody);
            wallet.syncStatus = true;
            this.connectWalletToUser(wallet.id);
            let path = '/api/wallets/'+wallet.id; 
            let delete_url = this.baseUrl+path;
            try {
              this.http.delete(delete_url, requestOptionsArgs).subscribe(res => {
                console.log(res);
                this.wallets.push(wallet);
                this.localStorageApi.setWallets(this.wallets).then((wallets) => {
                  console.log('wallet stored to local storage');
                  console.log(wallets);
                  try{
                    console.log('do the actual restore...')
                    this.restoreAdaWallet(restoreAdaWalletParams).then((res)=>{
                      console.log(res);
                      this.closeLoader();
                      // resolve();
                    }).catch((error)=>{
                      console.log(error);
                      reject(error);
                    })
                  }catch(error){
                    this.closeLoader();
                    console.log(error);
                  };
                }).catch((error)=>{
                  this.presentToast(error.message);
                  reject(new Error(error));
                });
              });
            }catch(error){
              this.closeLoader();
              console.log(error);
              this.presentToast(error.message);
              resolve();
            }
          }).catch((error)=>{
            this.closeLoader();
            console.log(error);
            this.presentToast(error.message);
            resolve();
          });
        }catch(error){
          this.closeLoader();
          console.log(error);
          this.presentToast(error.message);
          resolve();
        }
      });
    });
  }

  createWallet_my(): Promise<CreateWalletResponse> {
    
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
            this.getTransactions_my(responseBody['Right'].cwId, 0, 100).then((transactions)=>{
              console.log(transactions);
              this.getAccount(responseBody['Right'].cwId).then(()=>{
                let wallet = this._createWalletFromServerData(responseBody['Right'] );
                this.connectWalletToUser(wallet.id);
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

  getRandomMemonic(){
    let memonic = split(generateMnemonic());
    this.walletInitData.cwBackupPhrase.bpToList = memonic;
    return memonic;
  }

  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'top',
      showCloseButton: true
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