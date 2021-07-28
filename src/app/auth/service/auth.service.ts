import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../user.modal';
import { Plugins } from '@capacitor/core'

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private _isUserAuthenticated = false
  // private _userId = null
  private _user = new BehaviorSubject<User>(null)

  get isUserAuth() {
    // return this._isUserAuthenticated
    return this._user.asObservable().pipe(
      map(user => {
        if(user) {
          return !!user.token
        } else {
          return false
        }
      }));
  }

  constructor(
    private http: HttpClient
  ) { }

  get userId() {
    // return this._userId
    return this._user.asObservable().pipe(
      map(user => {
        if(user) {
          return user.id
        } else {
          return null
        }
      }));
  }

  // login() {
  //   this._isUserAuthenticated = true
  // }


// need to be uncommented...

  // autoLogin() {
  //   return from(Plugins.Storage.get({
  //     key: 'authData'
  //   })).pipe(map(storedData => {
  //     if (!storedData || !storedData.value) {
  //       return null;
  //     } else {
  //       const parseData = JSON.parse(storedData.value) as 
  //       {
  //         userId: string,
  //         token: string, 
  //         tokenExpDate: string,
  //         email: string
  //       }
  //       const expTime = new Date(parseData.tokenExpDate)
  //       if(expTime <= new Date()) {
  //           return null;
  //       } 
  //       const user = new User(
  //         parseData.userId,
  //         parseData.email,
  //         parseData.token,
  //         expTime
  //       )
  //       return user
  //     }
  //   }), tap(user => {
  //     if(user){
  //       this._user.next(user)
  //     }
  //   }), map(usr => {
  //     return !!usr
  //   }))
  // }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAuthApiKey}`,
    {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(tap(this.setUserData.bind(this)))
  }

  private setUserData(userData: AuthResponseData) {
      const expTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
      this._user.next(new User(
        userData.localId,
        userData.email,
        userData.idToken,
        expTime
        ));
        this.storeAuthData(
          userData.localId,
          userData.idToken,
          expTime.toISOString(),
          userData.email
          )
  }

  signIn(email: string, password: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAuthApiKey}`,
    {
      email: email,
      password: password
    }).pipe(tap(this.setUserData.bind(this)))
  }


  logOut() {
    // this._isUserAuthenticated = false
    this._user.next(null)
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpDate: string,
    email: string
    ) {
      const data = JSON.stringify({ userId: userId, token: token, tokenExpDate: tokenExpDate, email: email})
      Plugins.Storage.set({
        key: 'authData',
        value: data,
      })
  };

}
