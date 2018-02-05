import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdaChangeWalletPassphraseModalPage } from './ada-change-wallet-passphrase-modal';

@NgModule({
  declarations: [
    AdaChangeWalletPassphraseModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AdaChangeWalletPassphraseModalPage),
  ],
})
export class AdaChangeWalletPassphraseModalPageModule {}
