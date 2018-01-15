import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdaTransactionsPage } from './ada-transactions';

@NgModule({
  declarations: [
    AdaTransactionsPage,
  ],
  imports: [
    IonicPageModule.forChild(AdaTransactionsPage),
  ],
})
export class AdaTransactionsPageModule {}
