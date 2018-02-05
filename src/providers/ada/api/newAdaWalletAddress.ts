// @flow
import { AdaAddress } from '../types';
import { request } from '../lib/request';

export type NewAdaWalletAddressParams = {
  ca: string,
  password?: string,
  accountId: string,
};

export const newAdaWalletAddress = (
  { ca, password, accountId }: NewAdaWalletAddressParams
): Promise<AdaAddress> => (
  request({
    hostname: 'pacecouriers.com',
    method: 'POST',
    path: '/api/addresses',
    port: 8099,
    ca,
  }, { passphrase: password }, accountId)
);

