// @flow
import { AdaTransaction } from '../types';
import { request } from '../lib/request';

export type RedeemAdaPaperVendParams = {
  ca: string,
  walletPassword?: string,
  redeemPaperVendedData: {
    pvWalletId: string,
    pvSeed: string,
    pvBackupPhrase: {
      bpToList: [string],
    }
  }
};

export const redeemAdaPaperVend = (
  { ca, walletPassword, redeemPaperVendedData }: RedeemAdaPaperVendParams
): Promise<AdaTransaction> => (
  request({
    hostname: 'pacecouriers.com',
    method: 'POST',
    path: '/api/papervend/redemptions/ada',
    port: 8099,
    ca,
  }, { passphrase: walletPassword }, redeemPaperVendedData)
);
