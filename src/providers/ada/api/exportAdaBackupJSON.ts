// @flow
import { request } from '../lib/request';

export type ExportAdaBackupJSONParams = {
  ca: string,
  walletId: string,
  filePath: string,
};

export const exportAdaBackupJSON = (
  { ca, walletId, filePath }: ExportAdaBackupJSONParams,
): Promise<[any]> => (
  request({
    hostname: 'pacecouriers.com',
    method: 'POST',
    path: `/api/backup/export/${walletId}`,
    port: 8099,
    ca,
  }, {}, filePath)
);
