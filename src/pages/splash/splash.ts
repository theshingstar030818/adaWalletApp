import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController } from 'ionic-angular';
import { AdaPage } from '../ada/ada'; 
import { LoginPage } from '../login/login';
import { User } from '../../providers/user';
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

  constructor(
    public viewCtrl: ViewController, 
    public navCtrl: NavController,
    user: User
  ) {

    user.isAuthenticated().then(() => {
      console.log('you are authenticated!');
      setTimeout( () => {
        
        this.navCtrl.setRoot(AdaPage);

      }, 5000);
    }).catch(() => {
      console.log('you are not authenticated..');
      setTimeout( () => {
        
        this.navCtrl.setRoot(LoginPage);

      }, 5000);
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashPage');
  }



}
