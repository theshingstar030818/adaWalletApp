import { Injectable } from '@angular/core';
import { Config } from 'ionic-angular';
import { Cognito } from './aws.cognito';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

declare var AWS: any;
declare const aws_cognito_region;
declare const aws_cognito_identity_pool_id;
declare const aws_user_pools_id;
declare const aws_user_pools_web_client_id;

@Injectable()
export class UserData {
  _favorites: string[] = [];
  private user: any;
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(
    public events: Events,
    public storage: Storage,
    public cognito: Cognito,
    public config: Config
  ) {
    this.user = null;
  }

  getUser() {
    return this.user;
  }

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName: string): void {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  // login(username: string): void {
  //   this.storage.set(this.HAS_LOGGED_IN, true);
  //   this.setUsername(username);
  //   this.events.publish('user:login');
  // };

  login(username, password) {
    return new Promise((resolve, reject) => {
      let user = this.cognito.makeUser(username);
      let authDetails = this.cognito.makeAuthDetails(username, password);

      user.authenticateUser(authDetails, {
        'onSuccess': (result:any) => {

          this.storage.set(this.HAS_LOGGED_IN, true);
          this.setUsername(username);
          this.events.publish('user:login');

          var logins = {};
          var loginKey = 'cognito-idp.' +
                          aws_cognito_region +
                          '.amazonaws.com/' +
                          aws_user_pools_id;
          logins[loginKey] = result.getIdToken().getJwtToken();

          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
           'IdentityPoolId': aws_cognito_identity_pool_id,
           'Logins': logins
          });

          AWS.config.credentials.get((err) => {
            if (err) {
              return reject(err);
            }

            this.isAuthenticated().then(() => {
              resolve();
            }).catch((err) => {
              console.log('auth session failed');
            });
          });
          
        },

        'onFailure': (err:any) => {

          console.log('authentication failed');
          reject(err);

        }
      });
    });
  }

  signup(username: string): void {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);
    this.events.publish('user:signup');
  };

  register(username, password, attr) {
    
    let me = this;
    let attributes = [];

    for (var x in attr) {
      attributes.push(this.cognito.makeAttribute(x, attr[x]));
    }

    return new Promise((resolve, reject) => {
      this.cognito.getUserPool().signUp(username, password, attributes, null, function(err, result) {
        if (err) {
          reject(err);
        } else {
          me.storage.set(me.HAS_LOGGED_IN, true);
          me.events.publish('user:signup');
          resolve(result.user);
        }
      });
    });
  }

  logout(): void {
    this.user = null;
    this.cognito.getUserPool().getCurrentUser().signOut();
    AWS.config.credentials.clearCachedId();
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');
    this.events.publish('user:logout');    
  };

  setUsername(username: string): void {
    this.storage.set('username', username);
  };

  getUsername(): Promise<string> {
    return this.storage.get('username').then((value) => {
      console.log(value);
      return this.getUser().getUsername();
      // return value;
    });
  };

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  };

  confirmRegistration(username, code) {
    return new Promise((resolve, reject) => {
      let user = this.cognito.makeUser(username);
      user.confirmRegistration(code, true, (err, result) => {
            if (err) {
              console.log('could not confirm user', err);
              reject(err);
            } else {
              resolve(result);
            }
        });
    });
  }

  resendRegistrationCode(username) {
    return new Promise((resolve, reject) => {
      let user = this.cognito.makeUser(username);
      user.resendConfirmationCode((err, result) => {
        if (err) {
          console.log('could not resend code..', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  isAuthenticated() {
    return new Promise((resolve, reject) => {
      let user = this.cognito.getCurrentUser();
      if (user != null) {
        user.getSession((err, session) => {
          if (err) {
            console.log('rejected session');
            reject()
          } else {
            console.log('accepted session');
            var logins = {};
            var loginKey = 'cognito-idp.' +
              aws_cognito_region +
              '.amazonaws.com/' +
              aws_user_pools_id;
            logins[loginKey] = session.getIdToken().getJwtToken();

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
              'IdentityPoolId': aws_cognito_identity_pool_id,
              'Logins': logins
            });

            this.user = user;
            resolve()
          }
        });
      } else {
        reject()
      }
    });
  }
}
