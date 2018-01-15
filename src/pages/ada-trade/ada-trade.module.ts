import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdaTradePage } from './ada-trade';

@NgModule({
  declarations: [
    AdaTradePage,
  ],
  imports: [
    IonicPageModule.forChild(AdaTradePage),
  ],
})
export class AdaTradePageModule {}
