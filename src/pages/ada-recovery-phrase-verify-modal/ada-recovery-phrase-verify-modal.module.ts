import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdaRecoveryPhraseVerifyModalPage } from './ada-recovery-phrase-verify-modal';

@NgModule({
  declarations: [
    AdaRecoveryPhraseVerifyModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AdaRecoveryPhraseVerifyModalPage),
  ],
})
export class AdaRecoveryPhraseVerifyModalPageModule {}
