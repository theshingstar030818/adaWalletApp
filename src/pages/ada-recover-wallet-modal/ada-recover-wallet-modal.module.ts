import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdaRecoverWalletModalPage } from './ada-recover-wallet-modal';

@NgModule({
  declarations: [
    AdaRecoverWalletModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AdaRecoverWalletModalPage),
  ],
})
export class AdaRecoverWalletModalPageModule {}
