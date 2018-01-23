// @flow
import { AdaWalletRecoveryPhraseResponse } from './types';
import { generateMnemonic } from './utils/crypto';

export const getAdaAccountRecoveryPhrase = (): AdaWalletRecoveryPhraseResponse => (
  generateMnemonic().split(' ')
);
