import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Platform, ActionSheetController } from 'ionic-angular';
import { AdaProvider } from '../../providers/ada/ada';
/**
 * Generated class for the AdaSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ada-settings',
  templateUrl: 'ada-settings.html',
})
export class AdaSettingsPage {

  tabComponent: string = 'AdaPage';
  transactionAssuranceSecurityLevel: string = "normal";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public ada: AdaProvider,
    public app: App,
    public platform: Platform,
    public actionsheetCtrl: ActionSheetController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdaSettingsPage');
  }

  appPin(event){
    
    console.log('add Pin '+event);
    

  }

  openShareMenu() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Share',
      buttons: [
        {
          text: 'Facebook',
          icon: 'logo-facebook',
          handler: () => {
            console.log('Facebook clicked');
          }
        },
        {
          text: 'Google Plus',
          icon: 'logo-googleplus',
          handler: () => {
            console.log('Google+ clicked');
          }
        },
        {
          text: 'LinkedIn',
          icon: 'logo-linkedin',
          handler: () => {
            console.log('LinkedIn clicked');
          }
        },
        {
          text: 'Twitter',
          icon: 'logo-twitter',
          handler: () => {
            console.log('Twitter clicked');
          }
        },
        {
          text: 'Whatsapp',
          icon: 'logo-whatsapp',
          handler: () => {
            console.log('whatsapp clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

}
