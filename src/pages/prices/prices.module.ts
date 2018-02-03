import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PricesPage } from './prices';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    PricesPage,
  ],
  imports: [
    IonicPageModule.forChild(PricesPage),
    PipesModule
  ],
})
export class PricesPageModule {}
