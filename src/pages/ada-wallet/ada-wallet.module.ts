import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdaWalletPage } from './ada-wallet';

@NgModule({
  declarations: [
    AdaWalletPage,
  ],
  imports: [
    IonicPageModule.forChild(AdaWalletPage),
  ],
})
export class AdaWalletPageModule {}
