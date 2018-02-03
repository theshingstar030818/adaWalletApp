import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BtcRecoveryPhraseVerifyModalPage } from './btc-recovery-phrase-verify-modal';

@NgModule({
  declarations: [
    BtcRecoveryPhraseVerifyModalPage,
  ],
  imports: [
    IonicPageModule.forChild(BtcRecoveryPhraseVerifyModalPage),
  ],
})
export class BtcRecoveryPhraseVerifyModalPageModule {}
