import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, LoadingController } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { LoginPage } from '../login/login';
import { ConfirmPage } from '../confirm/confirm';

import { ToastController } from 'ionic-angular';

export class UserDetails {
  username: string;
  email: string;
  password: string;
}

@Component({
  selector: 'page-user',
  templateUrl: 'signup.html'
})
export class SignupPage {

  public userDetails: UserDetails;
  error: any;
  submitted = false;

  constructor(
    public navCtrl: NavController,
    public userData: UserData,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
      this.userDetails = new UserDetails();
  }

  onSignup(form: NgForm) {
    
    this.submitted = true;

    if (form.valid) {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      let details = this.userDetails;
      this.error = null;
      console.log('register');
      this.userData.register(details.username, details.password, {'email': details.email}).then((user) => {
        console.log(user);
        loading.dismiss();
        this.navCtrl.push(ConfirmPage, { username: details.username });
      }).catch((err) => {
        loading.dismiss();
        this.error = err;
        this.presentToast(err);
      });
    }
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000
    });
    toast.present();
  }

  login() {
    this.navCtrl.push(LoginPage);
  }
}
