// @flow
import { AdaWallet, AdaWalletInitData } from '../types';
import { request } from '../lib/request';

export type NewAdaWalletParams = {
  ca: string,
  password?: string,
  walletInitData: AdaWalletInitData
};

export const newAdaWallet = (
  { ca, password, walletInitData }: NewAdaWalletParams
  ): Promise<AdaWallet> => (
  request({
    hostname: 'pacecouriers.com',
    method: 'POST',
    path: '/api/wallets/new',
    port: 8099,
    ca,
  }, { passphrase: password }, walletInitData)
);
