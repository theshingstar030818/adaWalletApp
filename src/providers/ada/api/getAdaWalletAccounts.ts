// @flow
import { AdaAccounts } from '../types';
import { request } from '../lib/request';


export type GetAdaWalletAccountsParams = {
  ca: string,
  walletId: string,
};

export const getAdaWalletAccounts = (
  { ca, walletId }: GetAdaWalletAccountsParams
): Promise<AdaAccounts> => (
  request({
    hostname: 'pacecouriers.com',
    method: 'GET',
    path: '/api/accounts',
    port: 8099,
    ca,
  }, { accountId: walletId })
);
