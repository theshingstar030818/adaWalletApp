import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdaTransactionDetailPage } from './ada-transaction-detail';

@NgModule({
  declarations: [
    AdaTransactionDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(AdaTransactionDetailPage),
  ],
})
export class AdaTransactionDetailPageModule {}
