import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdaCreateNewWalletPage } from './ada-create-new-wallet';

@NgModule({
  declarations: [
    AdaCreateNewWalletPage,
  ],
  imports: [
    IonicPageModule.forChild(AdaCreateNewWalletPage),
  ],
})
export class AdaCreateNewWalletPageModule {}
