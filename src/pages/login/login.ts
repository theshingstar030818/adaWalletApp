import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController, LoadingController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';
import { UserOptions } from '../../interfaces/user-options';
import { AdaPage } from '../ada/ada';
import { SignupPage } from '../signup/signup';
import { ConfirmPage } from '../confirm/confirm';

@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  public loginDetails: UserOptions;
  submitted = false;

  constructor(
    public navCtrl: NavController,
    public userData: UserData,
    public loadingCtrl: LoadingController
  ){
    this.loginDetails = { username: '', password: '' };
  }

  onLogin(form: NgForm) {
    this.submitted = true;
    
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    let details = this.loginDetails;

    if (form.valid) {
      this.userData.login(details.username, details.password).then((result) => {
        console.log('result:', result);
        loading.dismiss();
        this.navCtrl.setRoot(AdaPage);
      }).catch((err) => { 
        if (err.message === "User is not confirmed.") {
          loading.dismiss();
          this.navCtrl.push(ConfirmPage, { 'username': details.username });
        }
        console.log('errrror', err);
        loading.dismiss();
      });
    }
  }

  onSignup() {
    this.navCtrl.push(SignupPage);
  }
}
