// @flow
import { AdaWallet } from '../types';
import { request } from '../lib/request';
import { encryptPassphrase } from '../lib/encryptPassphrase';

export type ChangeAdaWalletPassphraseParams = {
  ca: string,
  walletId: string,
  oldPassword?: string,
  newPassword?: string,
};

export const changeAdaWalletPassphrase = (
  { ca, walletId, oldPassword, newPassword }: ChangeAdaWalletPassphraseParams
): Promise<AdaWallet> => {
  const encryptedOldPassphrase = oldPassword ? encryptPassphrase(oldPassword) : null;
  const encryptedNewPassphrase = newPassword ? encryptPassphrase(newPassword) : null;
  return request({
    hostname: 'pacecouriers.com',
    method: 'POST',
    path: `/api/wallets/password/${walletId}`,
    port: 8099,
    ca,
  }, { old: encryptedOldPassphrase, new: encryptedNewPassphrase });
};
