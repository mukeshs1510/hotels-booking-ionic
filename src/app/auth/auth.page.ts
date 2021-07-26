import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './service/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLoading: boolean = false
  isLogin: boolean = true

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
    ) { }

  ngOnInit() {
  }

  authenticate(email:string, password: string) {
    this.isLoading = true
    this.loadingCtrl.create({
      keyboardClose: true, 
      message: 'Logging in...'
    }).then(l => {
      l.present()
      let authObs: Observable<AuthResponseData>
      if (this.isLogin) {
        authObs = this.authService.signIn(email, password)
      } else {
        authObs = this.authService.signUp(email, password)
      }
      authObs.subscribe(res => {
        console.log(res);
        this.isLoading = false;
        l.dismiss()
        this.router.navigateByUrl('place/tabs/discover')
        
      }, err => {
        l.dismiss()
        const error = err.error.error.message
        let message = 'Could not sign you up, Please try again'
        if(error === 'EMAIL_EXISTS') {
          message = 'This email already being used!'
        } else if(error === 'EMAIL_NOT_FOUND') {
          message = 'Email is not found!'
        } else if(error === 'INVALID_PASSWORD') {
          message = 'Password is not correct!'
        } else if(error === 'USER_DISABLED') {
          message = 'This user is blocked!'
        }
        this.isLoading = false
        this.showAlert(message)
      })
    })
  }

  onSubmit(form: NgForm) {
    // console.log(form);
    if (!form.valid) {
        return;
    } 
    const email = form.value.email
    const password = form.value.password

    this.authenticate(email, password)
    
  }

  onSwitchAuthMode(){
    this.isLogin = !this.isLogin
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authentication Failed!',
      message: message,
      buttons: ['Try again']
    }).then(el => {
      el.present()
    })
  }

}
