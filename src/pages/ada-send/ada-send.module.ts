import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdaSendPage } from './ada-send';

@NgModule({
  declarations: [
    AdaSendPage,
  ],
  imports: [
    IonicPageModule.forChild(AdaSendPage),
  ],
})
export class AdaSendPageModule {}
