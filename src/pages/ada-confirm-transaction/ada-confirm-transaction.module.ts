import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdaConfirmTransactionPage } from './ada-confirm-transaction';

@NgModule({
  declarations: [
    AdaConfirmTransactionPage,
  ],
  imports: [
    IonicPageModule.forChild(AdaConfirmTransactionPage),
  ],
})
export class AdaConfirmTransactionPageModule {}
