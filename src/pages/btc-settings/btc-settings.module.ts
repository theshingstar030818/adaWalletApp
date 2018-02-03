import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BtcSettingsPage } from './btc-settings';

@NgModule({
  declarations: [
    BtcSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(BtcSettingsPage),
  ],
})
export class BtcSettingsPageModule {}
