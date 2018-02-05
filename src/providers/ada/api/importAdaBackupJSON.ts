// @flow
import { AdaWallet } from '../types';
import { request } from '../lib/request';

export type ImportAdaBackupJSONParams = {
  ca: string,
  filePath: string,
};

export const importAdaBackupJSON = (
  { ca, filePath }: ImportAdaBackupJSONParams,
): Promise<AdaWallet> => (
  request({
    hostname: 'pacecouriers.com',
    method: 'POST',
    path: '/api/backup/import',
    port: 8099,
    ca,
  }, {}, filePath)
);
