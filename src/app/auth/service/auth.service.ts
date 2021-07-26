import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

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

  private _isUserAuthenticated = false
  private _userId = null

  get isUserAuth() {
    return this._isUserAuthenticated
  }

  constructor(
    private http: HttpClient
  ) { }

  get userId() {
    return this._userId
  }

  // login() {
  //   this._isUserAuthenticated = true
  // }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAuthApiKey}`,
    {
      email: email,
      password: password,
      returnSecureToken: true
    })
  }

  signIn(email: string, password: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAuthApiKey}`,
    {
      email: email,
      password: password
    })
  }


  logOut() {
    this._isUserAuthenticated = false
  }
}
