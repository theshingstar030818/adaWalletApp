import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdaSettingsPage } from './ada-settings';

@NgModule({
  declarations: [
    AdaSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(AdaSettingsPage),
  ],
})
export class AdaSettingsPageModule {}
