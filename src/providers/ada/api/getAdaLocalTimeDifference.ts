// @flow
import { AdaLocalTimeDifference } from '../types';
import { request } from '../lib/request';

export type GetAdaLocalTimeDifferenceParams = {
  ca: string,
};

export const getAdaLocalTimeDifference = (
  { ca }: GetAdaLocalTimeDifferenceParams
): Promise<AdaLocalTimeDifference> => (
  request({
    hostname: 'pacecouriers.com',
    method: 'GET',
    path: '/api/settings/time/difference',
    port: 8099,
    ca,
  })
);
