import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PortfolioPage } from './portfolio';

@NgModule({
  declarations: [
    PortfolioPage,
  ],
  imports: [
    IonicPageModule.forChild(PortfolioPage),
  ],
})
export class PortfolioPageModule {}
