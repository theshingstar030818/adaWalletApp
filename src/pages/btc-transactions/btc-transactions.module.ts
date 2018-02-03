import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BtcTransactionsPage } from './btc-transactions';

@NgModule({
  declarations: [
    BtcTransactionsPage,
  ],
  imports: [
    IonicPageModule.forChild(BtcTransactionsPage),
  ],
})
export class BtcTransactionsPageModule {}
