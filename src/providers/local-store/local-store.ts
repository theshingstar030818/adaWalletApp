// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import environment from '../ada/environment';
import { AdaWallets, AdaAccounts, AdaTransactions } from '../ada/types';

/*
  Generated class for the LocalStoreProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const networkForLocalStorage = String(environment.NETWORK);
const storageKeys = {
  USER_LOCALE: networkForLocalStorage + '-USER-LOCALE',
  TERMS_OF_USE_ACCEPTANCE: networkForLocalStorage + '-TERMS-OF-USE-ACCEPTANCE',
  SEND_LOGS_CHOICE: networkForLocalStorage + '-SEND-LOGS-CHOICE',
  THEME: networkForLocalStorage + '-THEME',
  WALLETS: 'WALLETS',
  ACCOUNTS: 'ACCOUNTS',
  TRANSACTIONS: 'TRANSACTIONS',
};

@Injectable()
export class LocalStoreProvider {

  constructor(private storage: Storage) { }

  getTransactions = () => new Promise((resolve, reject) => {
    try {
      this.storage.get(storageKeys.TRANSACTIONS).then((transactions)=>{
        if (!transactions) return resolve([]);
        resolve(transactions);
      }).catch((error)=>{
        return reject(error);
      })
    } catch (error) {
      return reject(error);
    }
  });

  setTransactions = (accounts: Array<AdaTransactions>) => new Promise((resolve, reject) => {
    try {
      this.storage.set(storageKeys.TRANSACTIONS, accounts).then((transactions)=>{
        if (!transactions) return resolve([]);
        resolve();
      }).catch((error)=>{
        return reject(error);
      })
    } catch (error) {
      return reject(error);
    }
  });

  getAccounts = () => new Promise((resolve, reject) => {
    try {
      this.storage.get(storageKeys.ACCOUNTS).then((accounts)=>{
        if (!accounts) return resolve([]);
        resolve(accounts);
      }).catch((error)=>{
        return reject(error);
      })
    } catch (error) {
      return reject(error);
    }
  });

  setAccounts = (accounts: Array<AdaAccounts>) => new Promise((resolve, reject) => {
    try {
      this.storage.set(storageKeys.ACCOUNTS, accounts).then((accounts)=>{
        if (!accounts) return resolve([]);
        resolve();
      }).catch((error)=>{
        return reject(error);
      })
    } catch (error) {
      return reject(error);
    }
  });

  getWallets = () => new Promise<AdaWallets>((resolve, reject) => {
    try {
      this.storage.get(storageKeys.WALLETS).then((wallets)=>{
        if (!wallets) return resolve(<AdaWallets>[]);
        resolve(JSON.parse(wallets));
      }).catch((error)=>{
        return reject(error);
      })
    } catch (error) {
      return reject(error);
    }
  });

  setWallets = (wallets: AdaWallets) => new Promise((resolve, reject) => {
    try {
      
      this.storage.set(storageKeys.WALLETS, JSON.stringify(wallets)).then((wallets)=>{
        if (!wallets) return resolve([]);
        resolve();
      }).catch((error)=>{
        return reject(error);
      })
    } catch (error) {
      return reject(error);
    }
  });

  getUserLocale = () => new Promise((resolve, reject) => {
    try {
      const locale = this.storage.get(storageKeys.USER_LOCALE);
      if (!locale) return resolve('');
      resolve(locale);
    } catch (error) {
      return reject(error);
    }
  });

  setUserLocale = (locale: string) => new Promise((resolve, reject) => {
    try {
      this.storage.set(storageKeys.USER_LOCALE, locale);
      resolve();
    } catch (error) {
      return reject(error);
    }
  });

  unsetUserLocale = () => new Promise((resolve) => {
    try {
      this.storage.remove(storageKeys.USER_LOCALE);
      resolve();
    } catch (error) {} // eslint-disable-line
  });

  getTermsOfUseAcceptance = () => new Promise((resolve, reject) => {
    try {
      const accepted = this.storage.get(storageKeys.TERMS_OF_USE_ACCEPTANCE);
      if (!accepted) return resolve(false);
      resolve(accepted);
    } catch (error) {
      return reject(error);
    }
  });

  setTermsOfUseAcceptance = () => new Promise((resolve, reject) => {
    try {
      this.storage.set(storageKeys.TERMS_OF_USE_ACCEPTANCE, true);
      resolve();
    } catch (error) {
      return reject(error);
    }
  });

  unsetTermsOfUseAcceptance = () => new Promise((resolve) => {
    try {
      this.storage.remove(storageKeys.TERMS_OF_USE_ACCEPTANCE);
      resolve();
    } catch (error) {} // eslint-disable-line
  });

  getSendLogsChoice = () => new Promise((resolve, reject) => {
    try {
      const sendLogs = this.storage.get(storageKeys.SEND_LOGS_CHOICE);
      if (typeof sendLogs === 'undefined') return resolve(null);
      resolve(sendLogs);
    } catch (error) {
      return reject(error);
    }
  });

  setSendLogsChoice = (sendLogs: boolean) => new Promise((resolve, reject) => {
    try {
      this.storage.set(storageKeys.SEND_LOGS_CHOICE, sendLogs);
      resolve();
    } catch (error) {
      return reject(error);
    }
  });

  unsetSendLogsChoice = () => new Promise((resolve) => {
    try {
      this.storage.remove(storageKeys.SEND_LOGS_CHOICE);
      resolve();
    } catch (error) {} // eslint-disable-line
  });

  getUserTheme = () => new Promise((resolve, reject) => {
    try {
      const theme = this.storage.get(storageKeys.THEME);
      if (!theme) return resolve('');
      resolve(theme);
    } catch (error) {
      return reject(error);
    }
  });

  setUserTheme = (theme: string) => new Promise((resolve, reject) => {
    try {
      this.storage.set(storageKeys.THEME, theme);
      resolve();
    } catch (error) {
      return reject(error);
    }
  });

  unsetUserTheme = () => new Promise((resolve) => {
    try {
      this.storage.remove(storageKeys.THEME);
      resolve();
    } catch (error) {} // eslint-disable-line
  });

  async reset() {
    await this.unsetUserLocale(); // TODO: remove after saving locale to API is restored
    await this.unsetTermsOfUseAcceptance();
    await this.unsetSendLogsChoice();
    await this.unsetUserTheme();
  }

}
