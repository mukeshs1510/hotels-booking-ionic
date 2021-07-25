import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLoading: boolean = false
  isLogin: boolean = true

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  onLogin() {
    this.isLoading = true
    this.authService.login()
    setTimeout(() => {
      this.isLoading = false
      this.router.navigateByUrl('/place/tabs/discover')
    }, 2000)
  }

  onSubmit(form: NgForm) {
    // console.log(form);
    if (!form.valid) {
        return;
    } 
    const email = form.value.email
    const password = form.value.password

    console.log(email, password);
    

    if (this.isLogin) {
      console.log("login -- ");
      this.onLogin()
      //login
    } else {
      console.log("register - !");
      
      // register
    }
    
  }

  onSwitchAuthMode(){
    this.isLogin = !this.isLogin
  }

}
