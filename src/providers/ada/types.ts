export type AdaAssurance = 'CWANormal' | 'CWAStrict';
export type AdaTransactionCondition = 'CPtxApplying' | 'CPtxInBlocks' | 'CPtxWontApply' | 'CPtxNotTracked';
export type AdaWalletRecoveryPhraseResponse = Array<string>;
import BigNumber from 'bignumber.js';

export type UpdateAdaWalletParams = {
  walletId: string,
  walletMeta: {
    cwName: string,
    cwAssurance: string,
    cwUnit: number,
  }
};

export type AdaWalletInitData = {
  cwInitMeta: {
    cwName: string,
    cwAssurance: AdaAssurance,
    cwUnit: number,
  },
  cwBackupPhrase: {
    bpToList: [string],
  }
};

export type TransactionFeeRequest = {
  sender: string,
  receiver: string,
  amount: string,
};
export type TransactionFeeResponse = BigNumber;

export type AdaSyncProgressResponse = {
  _spLocalCD: {
    getChainDifficulty: {
      getBlockCount: number,
    }
  },
  _spNetworkCD: {
    getChainDifficulty: {
      getBlockCount: number,
    }
  },
  _spPeers: number,
};

export type AdaAmount = {
  getCCoin: number,
};

export type AdaTransactionTag = 'CTIn' | 'CTOut';

export type AdaAddress = {
  cadAmount: AdaAmount,
  cadId: string,
  cadIsUsed: boolean,
};

export type AdaAddresses = Array<AdaAddress>;

export type AdaAccount = {
  caAddresses: AdaAddresses,
  caAmount: AdaAmount,
  caId: string,
  caMeta: {
    caName: string,
  },
};

export type AdaAccounts = Array<AdaAccount>;

export type AdaTransaction = {
  ctAmount: AdaAmount,
  ctConfirmations: number,
  ctId: string,
  ctInputs: AdaTransactionInputOutput,
  ctIsOutgoing: boolean,
  ctMeta: {
    ctmDate: Date,
    ctmDescription: string,
    ctmTitle: string,
  },
  ctOutputs: AdaTransactionInputOutput,
  ctCondition: AdaTransactionCondition,
};

export type CreateTransactionRequest = {
  sender: string,
  receiver: string,
  amount: string,
  password?: string,
};

export type AdaTransactions = [
  Array<AdaTransaction>,
  number
];

export type AdaTransactionInputOutput = [
  [string, AdaAmount]
];

export type AdaTransactionFee = AdaAmount;

export type AdaWallet = {
  cwAccountsNumber: number,
  cwAmount: AdaAmount,
  cwHasPassphrase: boolean,
  cwId: string,
  cwMeta: {
    cwAssurance: AdaAssurance,
    cwName: string,
    csUnit: number,
  },
  cwPassphraseLU: Date,
};

export type AdaWallets = Array<AdaWallet>;
export type AdaLocalTimeDifference = number;

export type RestoreAdaWalletParams = {
  walletPassword: string,
  walletInitData: AdaWalletInitData
};