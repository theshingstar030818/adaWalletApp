import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdaSendReceivePage } from './ada-send-receive';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    AdaSendReceivePage,
  ],
  imports: [
    IonicPageModule.forChild(AdaSendReceivePage),
    PipesModule
  ],
})
export class AdaSendReceivePageModule {}
