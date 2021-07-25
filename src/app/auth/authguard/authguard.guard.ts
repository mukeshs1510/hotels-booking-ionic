import { Injectable } from '@angular/core';
import { CanLoad, Route,  Router,  UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardGuard implements CanLoad {

  constructor(private authService: AuthService,
    private router: Router) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(!this.authService.isUserAuth) {
      this.router.navigateByUrl('/auth')
    }
    return this.authService.isUserAuth
  }
}
