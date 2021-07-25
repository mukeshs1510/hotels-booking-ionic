import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isUserAuthenticated = true
  private _userId = 'abc'

  get isUserAuth() {
    return this._isUserAuthenticated
  }

  constructor() { }

  get userId() {
    return this._userId
  }

  login() {
    this._isUserAuthenticated = true
  }

  logOut() {
    this._isUserAuthenticated = false
  }
}
