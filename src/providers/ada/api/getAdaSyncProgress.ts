// @flow
import { AdaSyncProgressResponse } from '../types';
import { request } from '../lib/request';

export type GetAdaSyncProgressParams = {
  ca: string,
};

export const getAdaSyncProgress = (
  { ca }: GetAdaSyncProgressParams
): Promise<AdaSyncProgressResponse> => (
  request({
    hostname: 'pacecouriers.com',
    method: 'GET',
    path: '/api/settings/sync/progress',
    port: 8099,
    ca,
  })
);
