import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
//import { SplashScreen } from '@ionic-native/splash-screen';

/**
 * Generated class for the SplashPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {

  constructor(public viewCtrl: ViewController, ) {
  }

  ionViewDidEnter() {
  
    
 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashPage');
  }

}
