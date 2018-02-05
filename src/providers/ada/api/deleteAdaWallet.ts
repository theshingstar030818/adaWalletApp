// @flow
import { request } from '../lib/request';

export type DeleteAdaWalletParams = {
  ca: string,
  walletId: string,
};

export const deleteAdaWallet = (
  { ca, walletId }: DeleteAdaWalletParams
): Promise<[any]> => (
  request({
    hostname: 'pacecouriers.com',
    method: 'DELETE',
    path: `/api/wallets/${walletId}`,
    port: 8099,
    ca,
  })
);
