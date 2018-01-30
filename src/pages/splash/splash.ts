import { Component } from '@angular/core';
<<<<<<< HEAD
import { IonicPage, ViewController } from 'ionic-angular';
//import { SplashScreen } from '@ionic-native/splash-screen';
=======
import { IonicPage, NavController, NavParams } from 'ionic-angular';
>>>>>>> e391c59b71b8f1638d22c44437c140a0a7f966fb

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

<<<<<<< HEAD
  constructor(public viewCtrl: ViewController, ) {
  }

  ionViewDidEnter() {
  
    
 
=======
  constructor(public navCtrl: NavController, public navParams: NavParams) {
>>>>>>> e391c59b71b8f1638d22c44437c140a0a7f966fb
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashPage');
  }

}
