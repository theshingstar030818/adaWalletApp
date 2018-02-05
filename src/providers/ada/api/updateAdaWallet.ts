// @flow
import { AdaWallet } from '../types';
import { request } from '../lib/request';

export type UpdateAdaWalletParams = {
  ca: string,
  walletId: string,
  walletMeta: {
    cwName: string,
    cwAssurance: string,
    cwUnit: number,
  }
};

export const updateAdaWallet = (
  { ca, walletId, walletMeta }: UpdateAdaWalletParams
): Promise<AdaWallet> => (
  request({
    hostname: 'pacecouriers.com',
    method: 'PUT',
    path: `/api/wallets/${walletId}`,
    port: 8099,
    ca,
  }, {}, walletMeta)
);
