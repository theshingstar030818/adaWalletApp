import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { BtcTradePage } from './btc-trade';
import { BtcProvider } from '../../providers/btc/btc';


@NgModule({
  declarations: [
    BtcTradePage,
  ],
  imports: [
    IonicPageModule.forChild(BtcTradePage),
  ],
  providers: [
    BtcProvider
  ],
})
export class BtcTradePageModule {}
